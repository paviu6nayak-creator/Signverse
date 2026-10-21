"""
Lesson & practice endpoints.

Lessons are grouped by category (alphabet, numbers, greetings, common_words,
daily_conversation). Listing a category joins in the current user's
progress so the frontend can render completion state and accuracy without
a second round-trip.
"""
from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.deps import get_current_user
from app.database import get_db
from app.models.common import mongo_doc_to_dict
from app.schemas.lesson import (
    LessonCategory,
    LessonResponse,
    LessonWithProgress,
    PracticeAttemptCreate,
    PracticeSessionResponse,
)
from app.utils.gamification import award_xp, update_streak

router = APIRouter(prefix="/lessons", tags=["Lessons"])


@router.get("", response_model=list[LessonWithProgress])
async def list_lessons(
    category: LessonCategory | None = Query(None),
    difficulty: str | None = Query(None),
    user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """List published lessons, optionally filtered, with this user's progress merged in."""
    query: dict = {"is_published": True}
    if category:
        query["category"] = category
    if difficulty:
        query["difficulty"] = difficulty

    lessons_cursor = db.lessons.find(query).sort("order", 1)
    lessons = [mongo_doc_to_dict(doc) async for doc in lessons_cursor]

    lesson_ids = [ObjectId(l["id"]) for l in lessons]
    progress_cursor = db.progress.find({"user_id": user["_id"], "lesson_id": {"$in": lesson_ids}})
    progress_by_lesson = {str(p["lesson_id"]): p async for p in progress_cursor}

    results = []
    for lesson in lessons:
        progress = progress_by_lesson.get(lesson["id"])
        results.append(
            LessonWithProgress(
                **lesson,
                completed=bool(progress and progress.get("completed")),
                accuracy=progress.get("best_accuracy") if progress else None,
                attempts=progress.get("attempts", 0) if progress else 0,
            )
        )
    return results


@router.get("/{lesson_id}", response_model=LessonWithProgress)
async def get_lesson(
    lesson_id: str,
    user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    if not ObjectId.is_valid(lesson_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid lesson id")

    lesson = await db.lessons.find_one({"_id": ObjectId(lesson_id)})
    if not lesson:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found")

    progress = await db.progress.find_one({"user_id": user["_id"], "lesson_id": lesson["_id"]})
    return LessonWithProgress(
        **mongo_doc_to_dict(lesson),
        completed=bool(progress and progress.get("completed")),
        accuracy=progress.get("best_accuracy") if progress else None,
        attempts=progress.get("attempts", 0) if progress else 0,
    )


@router.post("/practice/attempt", response_model=PracticeSessionResponse, status_code=status.HTTP_201_CREATED)
async def log_practice_attempt(
    payload: PracticeAttemptCreate,
    user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """
    Record one practice attempt (a single AI-recognized sign vs. the target
    label), update lesson progress, streak, and award XP on first completion.
    """
    if not ObjectId.is_valid(payload.lesson_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid lesson id")

    lesson_oid = ObjectId(payload.lesson_id)
    lesson = await db.lessons.find_one({"_id": lesson_oid})
    if not lesson:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found")

    now = datetime.now(timezone.utc)
    session_doc = {
        "user_id": user["_id"],
        "lesson_id": lesson_oid,
        "predicted_label": payload.predicted_label,
        "confidence": payload.confidence,
        "is_correct": payload.is_correct,
        "duration_seconds": payload.duration_seconds,
        "created_at": now,
    }
    result = await db.practice_sessions.insert_one(session_doc)
    session_doc["_id"] = result.inserted_id

    existing_progress = await db.progress.find_one({"user_id": user["_id"], "lesson_id": lesson_oid})
    was_already_completed = bool(existing_progress and existing_progress.get("completed"))
    best_accuracy = max(payload.confidence, (existing_progress or {}).get("best_accuracy", 0))

    await db.progress.update_one(
        {"user_id": user["_id"], "lesson_id": lesson_oid},
        {
            "$set": {"best_accuracy": best_accuracy, "completed": payload.is_correct or was_already_completed, "last_attempt_at": now},
            "$inc": {"attempts": 1},
            "$setOnInsert": {"user_id": user["_id"], "lesson_id": lesson_oid, "first_attempt_at": now},
        },
        upsert=True,
    )

    if payload.is_correct and not was_already_completed:
        await award_xp(db, user["_id"], lesson.get("xp_reward", 10))

    await update_streak(db, user["_id"])

    return PracticeSessionResponse(**mongo_doc_to_dict(session_doc))
