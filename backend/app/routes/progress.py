"""
Progress-tracking endpoints powering the Dashboard and Progress pages:
aggregate stats, per-category breakdown, practice history, and a
day-by-day activity feed for the streak calendar / activity chart.
"""
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, Query
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.deps import get_current_user
from app.database import get_db
from app.models.common import mongo_doc_to_dict
from app.schemas.progress import (
    AchievementResponse,
    CategoryProgress,
    DashboardStats,
    PracticeHistoryItem,
    WeeklyActivityPoint,
)

router = APIRouter(prefix="/progress", tags=["Progress"])

CATEGORIES = ["alphabet", "numbers", "greetings", "common_words", "daily_conversation"]


@router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard_stats(user: dict = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_db)):
    total_lessons = await db.lessons.count_documents({"is_published": True})
    completed_lessons = await db.progress.count_documents({"user_id": user["_id"], "completed": True})

    accuracy_cursor = db.progress.aggregate(
        [{"$match": {"user_id": user["_id"]}}, {"$group": {"_id": None, "avg_accuracy": {"$avg": "$best_accuracy"}}}]
    )
    accuracy_docs = [doc async for doc in accuracy_cursor]
    avg_val = accuracy_docs[0].get("avg_accuracy") if accuracy_docs else None
    average_accuracy = round(avg_val * 100, 1) if avg_val is not None else 0.0

    quiz_attempts = await db.quiz_attempts.find({"user_id": user["_id"]}).to_list(length=1000)
    quizzes_taken = len(quiz_attempts)
    average_quiz_score = round(sum(a["percentage"] for a in quiz_attempts) / quizzes_taken, 1) if quizzes_taken else 0.0

    category_breakdown = []
    for category in CATEGORIES:
        cat_total = await db.lessons.count_documents({"category": category, "is_published": True})
        if cat_total == 0:
            continue
        lesson_ids = [doc["_id"] async for doc in db.lessons.find({"category": category}, {"_id": 1})]
        cat_completed = await db.progress.count_documents(
            {"user_id": user["_id"], "lesson_id": {"$in": lesson_ids}, "completed": True}
        )
        category_breakdown.append(
            CategoryProgress(
                category=category,
                total_lessons=cat_total,
                completed_lessons=cat_completed,
                percentage=round((cat_completed / cat_total) * 100, 1),
            )
        )

    achievements = [
        doc async for doc in db.achievements.find({"user_id": user["_id"]}).sort("earned_at", -1).limit(5)
    ]

    return DashboardStats(
        total_lessons=total_lessons,
        lessons_completed=completed_lessons,
        overall_progress_percentage=round((completed_lessons / total_lessons) * 100, 1) if total_lessons else 0.0,
        average_accuracy=average_accuracy,
        quizzes_taken=quizzes_taken,
        average_quiz_score=average_quiz_score,
        current_streak=user.get("current_streak", 0),
        longest_streak=user.get("longest_streak", 0),
        total_xp=user.get("total_xp", 0),
        level=user.get("level", 1),
        category_breakdown=category_breakdown,
        recent_achievements=[AchievementResponse(**mongo_doc_to_dict(a)) for a in achievements],
    )


@router.get("/history", response_model=list[PracticeHistoryItem])
async def get_practice_history(
    limit: int = Query(50, ge=1, le=200),
    user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    pipeline = [
        {"$match": {"user_id": user["_id"]}},
        {"$sort": {"created_at": -1}},
        {"$limit": limit},
        {"$lookup": {"from": "lessons", "localField": "lesson_id", "foreignField": "_id", "as": "lesson"}},
        {"$unwind": "$lesson"},
    ]
    results = []
    async for doc in db.practice_sessions.aggregate(pipeline):
        results.append(
            PracticeHistoryItem(
                id=str(doc["_id"]),
                lesson_title=doc["lesson"]["title"],
                category=doc["lesson"]["category"],
                predicted_label=doc["predicted_label"],
                is_correct=doc["is_correct"],
                confidence=doc["confidence"],
                created_at=doc["created_at"],
            )
        )
    return results


@router.get("/achievements", response_model=list[AchievementResponse])
async def get_achievements(user: dict = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_db)):
    achievements = [doc async for doc in db.achievements.find({"user_id": user["_id"]}).sort("earned_at", -1)]
    return [AchievementResponse(**mongo_doc_to_dict(a)) for a in achievements]


@router.get("/weekly-activity", response_model=list[WeeklyActivityPoint])
async def get_weekly_activity(user: dict = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_db)):
    """Last 7 days of activity (practice minutes + lessons completed) for the dashboard chart."""
    since = datetime.now(timezone.utc) - timedelta(days=7)
    pipeline = [
        {"$match": {"user_id": user["_id"], "created_at": {"$gte": since}}},
        {
            "$group": {
                "_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$created_at"}},
                "minutes_practiced": {"$sum": {"$divide": ["$duration_seconds", 60]}},
                "lessons_completed": {"$sum": {"$cond": ["$is_correct", 1, 0]}},
            }
        },
        {"$sort": {"_id": 1}},
    ]
    points = []
    async for doc in db.practice_sessions.aggregate(pipeline):
        points.append(
            WeeklyActivityPoint(
                date=doc["_id"],
                minutes_practiced=round(doc["minutes_practiced"]),
                lessons_completed=doc["lessons_completed"],
            )
        )
    return points
