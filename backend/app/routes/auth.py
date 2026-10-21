"""
Authentication endpoints.

Handles registration (with bcrypt password hashing), login (issues JWT
access + refresh tokens), token refresh, and the forgot/reset password
flow. All passwords are hashed before storage — plaintext is never
persisted or logged.
"""
import logging
from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.deps import get_current_user
from app.core.security import (
    create_access_token,
    create_password_reset_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.database import get_db
from app.models.common import mongo_doc_to_dict
from app.schemas.user import (
    ForgotPasswordRequest,
    RefreshTokenRequest,
    ResetPasswordRequest,
    TokenResponse,
    UserLogin,
    UserRegister,
    UserResponse,
)
from app.utils.email import send_password_reset_email

logger = logging.getLogger("signverse.auth")
router = APIRouter(prefix="/auth", tags=["Authentication"])


def _issue_tokens(user: dict) -> TokenResponse:
    user_id = str(user["_id"])
    access_token = create_access_token(user_id, role=user.get("role", "user"))
    refresh_token = create_refresh_token(user_id)
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=UserResponse(**mongo_doc_to_dict(user)),
    )


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: UserRegister, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Create a new user account and return auth tokens (auto-login after signup)."""
    email_clean = payload.email.lower().strip()
    username_clean = payload.username.lower().strip().lstrip("@")

    existing_email = await db.users.find_one({"email": email_clean})
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email address already exists. Please log in instead.",
        )

    existing_username = await db.users.find_one({"username": username_clean})
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"The username '{username_clean}' is already taken. Please choose another username.",
        )

    now = datetime.now(timezone.utc)
    user_doc = {
        "full_name": payload.full_name.strip(),
        "username": username_clean,
        "email": email_clean,
        "password_hash": hash_password(payload.password),
        "role": "user",
        "avatar_url": None,
        "bio": None,
        "preferred_language": "ASL",
        "daily_goal_minutes": 15,
        "current_streak": 0,
        "longest_streak": 0,
        "total_xp": 0,
        "level": 1,
        "is_active": True,
        "created_at": now,
        "last_active_at": now,
    }
    result = await db.users.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id

    logger.info("New user registered: %s (%s)", username_clean, email_clean)
    return _issue_tokens(user_doc)


@router.post("/login", response_model=TokenResponse)
async def login(payload: UserLogin, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Authenticate with email + password and receive access/refresh tokens."""
    email_clean = payload.email.lower().strip()
    user = await db.users.find_one({"email": email_clean})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No account found with this email. Please check your email or create a new account.",
        )
    if not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password. Please verify your credentials and try again.",
        )
    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account has been deactivated. Please contact support.",
        )

    await db.users.update_one({"_id": user["_id"]}, {"$set": {"last_active_at": datetime.now(timezone.utc)}})
    return _issue_tokens(user)


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(payload: RefreshTokenRequest, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Exchange a valid refresh token for a new access + refresh token pair."""
    decoded = decode_token(payload.refresh_token)
    if not decoded or decoded.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired refresh token")

    user_id = decoded.get("sub")
    if not user_id or not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User no longer exists")

    return _issue_tokens(user)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(user: dict = Depends(get_current_user)):
    """
    Stateless JWT logout: the client discards its tokens. Kept as an explicit
    endpoint so the frontend has a clear action to call and so a future
    token-blocklist can be added here without changing the client.
    """
    return None


@router.post("/forgot-password", status_code=status.HTTP_200_OK)
async def forgot_password(payload: ForgotPasswordRequest, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Send a password reset link if the email is registered. Always returns 200 to avoid leaking which emails exist."""
    user = await db.users.find_one({"email": payload.email})
    if user:
        reset_token = create_password_reset_token(str(user["_id"]))
        await send_password_reset_email(to_email=user["email"], full_name=user["full_name"], reset_token=reset_token)
    return {"message": "If that email is registered, a password reset link has been sent."}


@router.post("/reset-password", status_code=status.HTTP_200_OK)
async def reset_password(payload: ResetPasswordRequest, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Consume a password reset token and set a new password."""
    decoded = decode_token(payload.token)
    if not decoded or decoded.get("purpose") != "password_reset":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired reset link")

    user_id = decoded.get("sub")
    if not user_id or not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid reset link")

    result = await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"password_hash": hash_password(payload.new_password)}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid reset link")

    return {"message": "Password has been reset successfully. You can now log in."}


@router.get("/me", response_model=UserResponse)
async def get_me(user: dict = Depends(get_current_user)):
    """Return the currently authenticated user's profile."""
    return UserResponse(**mongo_doc_to_dict(user))
