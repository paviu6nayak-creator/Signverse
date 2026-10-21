"""
Admin-only endpoints. Every route here requires the "admin" role
(enforced by the get_current_admin dependency) and is intentionally kept
separate from the public routes so permissions are easy to audit.
"""
import logging
import uuid
from datetime import datetime, timedelta, timezone
from pathlib import Path

from bson import ObjectId
from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.config import settings
from app.core.deps import get_current_admin
from app.database import get_db
from app.models.common import mongo_doc_to_dict
from app.schemas.lesson import LessonCreate, LessonResponse, LessonUpdate
from app.schemas.quiz import QuizCreate, QuizResponse
from app.schemas.user import UserResponse

logger = logging.getLogger("signverse.admin")
router = APIRouter(prefix="/admin", tags=["Admin"], dependencies=[Depends(get_current_admin)])


# ---------------------------------------------------------------------------
# Users
# ---------------------------------------------------------------------------
@router.get("/users", response_model=list[UserResponse])
async def list_users(
    search: str | None = Query(None),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    query = {}
    if search:
        query["$or"] = [
            {"username": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}},
            {"full_name": {"$regex": search, "$options": "i"}},
        ]
    users = [doc async for doc in db.users.find(query).sort("created_at", -1).limit(limit)]
    return [UserResponse(**mongo_doc_to_dict(u)) for u in users]


@router.patch("/users/{user_id}/toggle-active", response_model=UserResponse)
async def toggle_user_active(user_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user id")
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    new_status = not user.get("is_active", True)
    await db.users.update_one({"_id": user["_id"]}, {"$set": {"is_active": new_status}})
    user["is_active"] = new_status
    return UserResponse(**mongo_doc_to_dict(user))


@router.patch("/users/{user_id}/role", response_model=UserResponse)
async def change_user_role(user_id: str, role: str = Query(..., pattern="^(user|admin)$"), db: AsyncIOMotorDatabase = Depends(get_db)):
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user id")
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    await db.users.update_one({"_id": user["_id"]}, {"$set": {"role": role}})
    user["role"] = role
    return UserResponse(**mongo_doc_to_dict(user))


# ---------------------------------------------------------------------------
# Lessons
# ---------------------------------------------------------------------------
@router.post("/lessons", response_model=LessonResponse, status_code=status.HTTP_201_CREATED)
async def create_lesson(payload: LessonCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    doc = payload.model_dump()
    doc["is_published"] = True
    doc["created_at"] = datetime.now(timezone.utc)
    result = await db.lessons.insert_one(doc)
    doc["_id"] = result.inserted_id
    return LessonResponse(**mongo_doc_to_dict(doc))


@router.put("/lessons/{lesson_id}", response_model=LessonResponse)
async def update_lesson(lesson_id: str, payload: LessonUpdate, db: AsyncIOMotorDatabase = Depends(get_db)):
    if not ObjectId.is_valid(lesson_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid lesson id")
    updates = {k: v for k, v in payload.model_dump(exclude_unset=True).items() if v is not None}
    if updates:
        result = await db.lessons.update_one({"_id": ObjectId(lesson_id)}, {"$set": updates})
        if result.matched_count == 0:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found")
    lesson = await db.lessons.find_one({"_id": ObjectId(lesson_id)})
    return LessonResponse(**mongo_doc_to_dict(lesson))


@router.delete("/lessons/{lesson_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_lesson(lesson_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    if not ObjectId.is_valid(lesson_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid lesson id")
    await db.lessons.delete_one({"_id": ObjectId(lesson_id)})
    return None


# ---------------------------------------------------------------------------
# Quizzes
# ---------------------------------------------------------------------------
@router.post("/quizzes", response_model=QuizResponse, status_code=status.HTTP_201_CREATED)
async def create_quiz(payload: QuizCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    doc = payload.model_dump()
    doc["questions"] = [{**q, "_id": ObjectId()} for q in doc["questions"]]
    doc["is_published"] = True
    doc["created_at"] = datetime.now(timezone.utc)
    result = await db.quizzes.insert_one(doc)
    doc["_id"] = result.inserted_id

    summary = mongo_doc_to_dict({k: v for k, v in doc.items() if k != "questions"})
    return QuizResponse(
        **summary,
        total_questions=len(doc["questions"]),
        total_points=sum(q.get("points", 0) for q in doc["questions"]),
    )


@router.delete("/quizzes/{quiz_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_quiz(quiz_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    if not ObjectId.is_valid(quiz_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid quiz id")
    await db.quizzes.delete_one({"_id": ObjectId(quiz_id)})
    return None


# ---------------------------------------------------------------------------
# Dataset uploads (for retraining the sign-recognition model)
# ---------------------------------------------------------------------------
@router.post("/datasets/upload")
async def upload_dataset(file: UploadFile = File(...)):
    """
    Accept a CSV of labeled hand-landmark rows (as produced by
    ai-model/data_collection.py) to extend the training dataset.
    """
    if not file.filename or not file.filename.endswith(".csv"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only .csv dataset files are accepted")

    contents = await file.read()
    datasets_dir = Path(settings.UPLOAD_DIR) / "datasets"
    datasets_dir.mkdir(parents=True, exist_ok=True)

    filename = f"{uuid.uuid4().hex[:8]}_{file.filename}"
    (datasets_dir / filename).write_bytes(contents)

    logger.info("Dataset uploaded by admin: %s (%d bytes)", filename, len(contents))
    return {"message": "Dataset uploaded successfully", "filename": filename, "size_bytes": len(contents)}


# ---------------------------------------------------------------------------
# Analytics
# ---------------------------------------------------------------------------
@router.get("/analytics/overview")
async def analytics_overview(db: AsyncIOMotorDatabase = Depends(get_db)):
    now = datetime.now(timezone.utc)
    thirty_days_ago = now - timedelta(days=30)

    total_users = await db.users.count_documents({})
    active_users_30d = await db.users.count_documents({"last_active_at": {"$gte": thirty_days_ago}})
    total_lessons = await db.lessons.count_documents({})
    total_quizzes = await db.quizzes.count_documents({})
    total_practice_sessions = await db.practice_sessions.count_documents({})
    total_quiz_attempts = await db.quiz_attempts.count_documents({})

    signups_pipeline = [
        {"$match": {"created_at": {"$gte": thirty_days_ago}}},
        {"$group": {"_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$created_at"}}, "count": {"$sum": 1}}},
        {"$sort": {"_id": 1}},
    ]
    signups_by_day = [{"date": doc["_id"], "count": doc["count"]} async for doc in db.users.aggregate(signups_pipeline)]

    popular_categories_pipeline = [
        {"$lookup": {"from": "lessons", "localField": "lesson_id", "foreignField": "_id", "as": "lesson"}},
        {"$unwind": "$lesson"},
        {"$group": {"_id": "$lesson.category", "attempts": {"$sum": 1}}},
        {"$sort": {"attempts": -1}},
    ]
    popular_categories = [
        {"category": doc["_id"], "attempts": doc["attempts"]} async for doc in db.practice_sessions.aggregate(popular_categories_pipeline)
    ]

    return {
        "total_users": total_users,
        "active_users_30d": active_users_30d,
        "total_lessons": total_lessons,
        "total_quizzes": total_quizzes,
        "total_practice_sessions": total_practice_sessions,
        "total_quiz_attempts": total_quiz_attempts,
        "signups_last_30_days": signups_by_day,
        "popular_categories": popular_categories,
    }
