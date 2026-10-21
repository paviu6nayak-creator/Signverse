"""
Pydantic schemas for user registration, login, profile, and API responses.
These define exactly what the API accepts and returns — never the raw
MongoDB document — so internal fields like password_hash never leak out.
"""
from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field, field_validator


class UserRegister(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=80)
    username: str = Field(..., min_length=3, max_length=30)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)

    @field_validator("username")
    @classmethod
    def clean_username(cls, value: str) -> str:
        cleaned = value.strip().lstrip("@")
        import re
        if not re.match(r"^[a-zA-Z0-9_.]+$", cleaned):
            raise ValueError("Username may only contain letters, numbers, underscores, and dots")
        if len(cleaned) < 3 or len(cleaned) > 30:
            raise ValueError("Username must be between 3 and 30 characters")
        return cleaned.lower()

    @field_validator("email")
    @classmethod
    def clean_email(cls, value: str) -> str:
        return value.strip().lower()

    @field_validator("password")
    @classmethod
    def password_strength(cls, value: str) -> str:
        if not any(c.isdigit() for c in value):
            raise ValueError("Password must contain at least one number")
        if not any(c.isalpha() for c in value):
            raise ValueError("Password must contain at least one letter")
        return value


class UserLogin(BaseModel):
    email: EmailStr
    password: str

    @field_validator("email")
    @classmethod
    def clean_email(cls, value: str) -> str:
        return value.strip().lower()


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8, max_length=128)


class UserUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=80)
    bio: Optional[str] = Field(None, max_length=300)
    avatar_url: Optional[str] = None
    preferred_language: Optional[str] = None
    daily_goal_minutes: Optional[int] = Field(None, ge=5, le=180)


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8, max_length=128)


class UserResponse(BaseModel):
    id: str
    full_name: str
    username: str
    email: EmailStr
    role: Literal["user", "admin"] = "user"
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    preferred_language: str = "ASL"
    daily_goal_minutes: int = 15
    current_streak: int = 0
    longest_streak: int = 0
    total_xp: int = 0
    level: int = 1
    created_at: datetime
    last_active_at: Optional[datetime] = None


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse


class RefreshTokenRequest(BaseModel):
    refresh_token: str
