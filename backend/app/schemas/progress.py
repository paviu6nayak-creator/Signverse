"""
Pydantic schemas for progress tracking, dashboard summaries, and achievements.
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class CategoryProgress(BaseModel):
    category: str
    total_lessons: int
    completed_lessons: int
    percentage: float


class AchievementResponse(BaseModel):
    id: str
    code: str
    title: str
    description: str
    icon: str
    earned_at: datetime


class DashboardStats(BaseModel):
    total_lessons: int
    lessons_completed: int
    overall_progress_percentage: float
    average_accuracy: float
    quizzes_taken: int
    average_quiz_score: float
    current_streak: int
    longest_streak: int
    total_xp: int
    level: int
    category_breakdown: list[CategoryProgress]
    recent_achievements: list[AchievementResponse]


class PracticeHistoryItem(BaseModel):
    id: str
    lesson_title: str
    category: str
    predicted_label: str
    is_correct: bool
    confidence: float
    created_at: datetime


class WeeklyActivityPoint(BaseModel):
    date: str  # ISO date, e.g. "2026-07-06"
    minutes_practiced: int
    lessons_completed: int
