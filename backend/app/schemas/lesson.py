"""
Pydantic schemas for lessons (alphabet, numbers, common words, daily
conversation phrases) and the practice sessions built on top of them.
"""
from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field

LessonCategory = Literal["alphabet", "numbers", "greetings", "common_words", "daily_conversation"]
DifficultyLevel = Literal["beginner", "intermediate", "advanced"]


class LessonCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=120)
    category: LessonCategory
    difficulty: DifficultyLevel = "beginner"
    description: str = Field("", max_length=500)
    sign_label: str  # e.g. "A", "5", "Thank You" — the label the AI model predicts
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    order: int = 0
    xp_reward: int = 10


class LessonUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    order: Optional[int] = None
    xp_reward: Optional[int] = None
    is_published: Optional[bool] = None


class LessonResponse(BaseModel):
    id: str
    title: str
    category: LessonCategory
    difficulty: DifficultyLevel
    description: str
    sign_label: str
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    order: int
    xp_reward: int
    is_published: bool = True
    created_at: datetime


class LessonWithProgress(LessonResponse):
    completed: bool = False
    accuracy: Optional[float] = None
    attempts: int = 0


class PracticeAttemptCreate(BaseModel):
    lesson_id: str
    predicted_label: str
    confidence: float = Field(..., ge=0, le=1)
    is_correct: bool
    duration_seconds: float = Field(..., ge=0)


class PracticeSessionResponse(BaseModel):
    id: str
    lesson_id: str
    predicted_label: str
    confidence: float
    is_correct: bool
    duration_seconds: float
    created_at: datetime
