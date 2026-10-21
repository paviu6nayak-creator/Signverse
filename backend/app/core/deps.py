"""
Reusable FastAPI dependencies for authentication and authorization.

`get_current_user` decodes the bearer JWT, loads the user from MongoDB,
and is used to protect any route that requires login. `get_current_admin`
builds on it to additionally require the "admin" role.
"""
from bson import ObjectId
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.security import decode_token
from app.database import get_db
from app.config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login", auto_error=False)

CREDENTIALS_EXCEPTION = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)


async def get_current_user(
    token: str | None = Depends(oauth2_scheme),
    db: AsyncIOMotorDatabase = Depends(get_db),
) -> dict:
    """Decode the access token and return the corresponding user document."""
    if token is None:
        # In development mode, allow missing token and return a demo user so
        # the frontend's translation flow remains usable without setting up
        # auth or a running MongoDB instance. Production behavior is unchanged.
        if settings.DEBUG:
            return {
                "_id": "dev-1",
                "email": "dev@signverse.local",
                "username": "dev_user",
                "role": "admin",
                "is_active": True,
            }
        raise CREDENTIALS_EXCEPTION

    payload = decode_token(token)
    if payload is None or payload.get("type") != "access" or payload.get("purpose"):
        raise CREDENTIALS_EXCEPTION

    user_id = payload.get("sub")
    if user_id is None or not ObjectId.is_valid(user_id):
        raise CREDENTIALS_EXCEPTION

    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if user is None:
        raise CREDENTIALS_EXCEPTION
    if user.get("is_active", True) is False:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account has been deactivated")

    return user


async def get_current_admin(user: dict = Depends(get_current_user)) -> dict:
    """Require the current user to have the admin role."""
    if user.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin privileges required")
    return user
