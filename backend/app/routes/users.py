"""
User profile endpoints: view/update the logged-in user's profile,
change password, and upload a profile picture.
"""
import logging
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.config import settings
from app.core.deps import get_current_user
from app.core.security import hash_password, verify_password
from app.database import get_db
from app.models.common import mongo_doc_to_dict
from app.schemas.user import ChangePasswordRequest, UserResponse, UserUpdate

logger = logging.getLogger("signverse.users")
router = APIRouter(prefix="/users", tags=["Users"])

ALLOWED_AVATAR_TYPES = {"image/jpeg", "image/png", "image/webp"}


@router.get("/me", response_model=UserResponse)
async def get_profile(user: dict = Depends(get_current_user)):
    return UserResponse(**mongo_doc_to_dict(user))


@router.put("/me", response_model=UserResponse)
async def update_profile(
    payload: UserUpdate,
    user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Update editable profile fields. Only fields the client actually sent are changed."""
    updates = {k: v for k, v in payload.model_dump(exclude_unset=True).items() if v is not None}
    if updates:
        await db.users.update_one({"_id": user["_id"]}, {"$set": updates})
        user.update(updates)
    return UserResponse(**mongo_doc_to_dict(user))


@router.post("/me/change-password", status_code=status.HTTP_200_OK)
async def change_password(
    payload: ChangePasswordRequest,
    user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    if not verify_password(payload.current_password, user["password_hash"]):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect")

    await db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {"password_hash": hash_password(payload.new_password)}},
    )
    return {"message": "Password updated successfully"}


@router.post("/me/avatar", response_model=UserResponse)
async def upload_avatar(
    file: UploadFile = File(...),
    user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Upload and set a new profile picture. Stored locally under UPLOAD_DIR/avatars."""
    if file.content_type not in ALLOWED_AVATAR_TYPES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only JPEG, PNG, or WEBP images are allowed")

    contents = await file.read()
    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if len(contents) > max_bytes:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"File exceeds {settings.MAX_UPLOAD_SIZE_MB}MB limit")

    avatars_dir = Path(settings.UPLOAD_DIR) / "avatars"
    avatars_dir.mkdir(parents=True, exist_ok=True)

    extension = Path(file.filename or "avatar.jpg").suffix or ".jpg"
    filename = f"{user['_id']}_{uuid.uuid4().hex[:8]}{extension}"
    file_path = avatars_dir / filename
    file_path.write_bytes(contents)

    avatar_url = f"/{settings.UPLOAD_DIR}/avatars/{filename}"
    await db.users.update_one({"_id": user["_id"]}, {"$set": {"avatar_url": avatar_url}})
    user["avatar_url"] = avatar_url

    return UserResponse(**mongo_doc_to_dict(user))
