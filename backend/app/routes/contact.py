"""
Public contact form endpoint. No auth required — anyone visiting the
Contact page can reach the team. Submissions are stored so an admin can
review them (a full support-ticket workflow is out of scope here).
"""
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import BaseModel, EmailStr, Field

from app.database import get_db

router = APIRouter(prefix="/contact", tags=["Contact"])


class ContactMessageCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    subject: str = Field(..., min_length=1, max_length=150)
    message: str = Field(..., min_length=1, max_length=2000)


@router.post("", status_code=status.HTTP_201_CREATED)
async def submit_contact_message(payload: ContactMessageCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    await db.contact_messages.insert_one({**payload.model_dump(), "created_at": datetime.now(timezone.utc), "is_read": False})
    return {"message": "Thanks for reaching out! We'll get back to you soon."}
