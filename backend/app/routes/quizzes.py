"""
Quiz endpoints.

Quizzes mix multiple_choice questions and sign_recognition questions
(where the "answer" is a sign performed in front of the webcam and
scored via the AI prediction confidence). Correct answers/labels are
stripped out of the response the client fetches to take the quiz, and
only checked server-side on submission.
"""
from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.deps import get_current_user
from app.database import get_db
from app.models.common import mongo_doc_to_dict
from app.schemas.quiz import (
    QuizDetailResponse,
    QuizQuestionResponse,
    QuizResponse,
    QuizResultResponse,
    QuizSubmission,
)
from app.utils.gamification import award_xp, unlock_achievement, update_streak

router = APIRouter(prefix="/quizzes", tags=["Quizzes"])


def _to_summary(quiz: dict) -> QuizResponse:
    doc = mongo_doc_to_dict(quiz)
    return QuizResponse(
        **{k: v for k, v in doc.items() if k != "questions"},
        total_questions=len(quiz.get("questions", [])),
        total_points=sum(q.get("points", 0) for q in quiz.get("questions", [])),
    )


@router.get("", response_model=list[QuizResponse])
async def list_quizzes(
    category: str | None = Query(None),
    db: AsyncIOMotorDatabase = Depends(get_db),
    _: dict = Depends(get_current_user),
):
    query = {"is_published": True}
    if category:
        query["category"] = category
    quizzes = [doc async for doc in db.quizzes.find(query).sort("created_at", -1)]
    return [_to_summary(q) for q in quizzes]


@router.get("/{quiz_id}", response_model=QuizDetailResponse)
async def get_quiz(
    quiz_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    _: dict = Depends(get_current_user),
):
    """Fetch a quiz for taking — correct answers are stripped from the payload."""
    if not ObjectId.is_valid(quiz_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid quiz id")
    quiz = await db.quizzes.find_one({"_id": ObjectId(quiz_id)})
    if not quiz:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quiz not found")

    sanitized_questions = [
        QuizQuestionResponse(
            id=str(q["_id"]),
            question_type=q["question_type"],
            prompt=q["prompt"],
            image_url=q.get("image_url"),
            options=[opt["text"] for opt in q.get("options", [])],
            points=q.get("points", 10),
        )
        for q in quiz.get("questions", [])
    ]

    summary = _to_summary(quiz)
    return QuizDetailResponse(**summary.model_dump(), questions=sanitized_questions)


@router.post("/submit", response_model=QuizResultResponse, status_code=status.HTTP_201_CREATED)
async def submit_quiz(
    payload: QuizSubmission,
    user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Score a quiz submission server-side against the stored correct answers."""
    if not ObjectId.is_valid(payload.quiz_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid quiz id")
    quiz = await db.quizzes.find_one({"_id": ObjectId(payload.quiz_id)})
    if not quiz:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quiz not found")

    questions_by_id = {str(q["_id"]): q for q in quiz.get("questions", [])}
    score, correct_count = 0, 0

    for answer in payload.answers:
        question = questions_by_id.get(answer.question_id)
        if not question:
            continue

        is_correct = False
        if question["question_type"] == "multiple_choice" and answer.selected_option_index is not None:
            options = question.get("options", [])
            if 0 <= answer.selected_option_index < len(options):
                is_correct = options[answer.selected_option_index].get("is_correct", False)
        elif question["question_type"] == "sign_recognition" and answer.predicted_sign_label:
            is_correct = answer.predicted_sign_label.strip().lower() == question.get("correct_sign_label", "").strip().lower()

        if is_correct:
            score += question.get("points", 0)
            correct_count += 1

    total_points = sum(q.get("points", 0) for q in quiz.get("questions", []))
    percentage = round((score / total_points) * 100, 1) if total_points else 0.0
    now = datetime.now(timezone.utc)

    result_doc = {
        "user_id": user["_id"],
        "quiz_id": quiz["_id"],
        "quiz_title": quiz["title"],
        "score": score,
        "total_points": total_points,
        "percentage": percentage,
        "correct_answers": correct_count,
        "total_questions": len(quiz.get("questions", [])),
        "time_taken_seconds": payload.time_taken_seconds,
        "created_at": now,
    }
    insert_result = await db.quiz_attempts.insert_one(result_doc)
    result_doc["_id"] = insert_result.inserted_id

    await award_xp(db, user["_id"], score // 2)
    await update_streak(db, user["_id"])
    if percentage == 100.0:
        await unlock_achievement(db, user["_id"], "quiz_perfect")

    return QuizResultResponse(**mongo_doc_to_dict(result_doc))


@router.get("/history/me", response_model=list[QuizResultResponse])
async def my_quiz_history(
    limit: int = Query(20, ge=1, le=100),
    user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    attempts = [
        doc async for doc in db.quiz_attempts.find({"user_id": user["_id"]}).sort("created_at", -1).limit(limit)
    ]
    return [QuizResultResponse(**mongo_doc_to_dict(a)) for a in attempts]
