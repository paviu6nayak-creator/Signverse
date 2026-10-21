"""
Sign-to-text translation endpoints.

The frontend runs MediaPipe Hands in the browser (client-side, via
@mediapipe/tasks-vision) so raw video never leaves the user's device —
only the 21-point hand landmark vector is sent here for classification.
This keeps latency low and is far cheaper to scale than streaming video.
"""
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import BaseModel, Field

from app.ai.model_loader import NUM_LANDMARK_FEATURES, SignModel, get_sign_model
from app.config import settings
from app.core.deps import get_current_user
from app.database import get_db

router = APIRouter(prefix="/translate", tags=["Translation"])


class LandmarkPredictionRequest(BaseModel):
    landmarks: list[float] = Field(..., description="Flattened 21-point hand landmarks: [x0,y0,z0, x1,y1,z1, ...]")
    face_detected: bool = False


class PredictionOption(BaseModel):
    label: str
    confidence: float


class LandmarkPredictionResponse(BaseModel):
    label: str
    confidence: float
    is_confident: bool
    top_predictions: list[PredictionOption]
    is_mock_model: bool


class SentenceLogRequest(BaseModel):
    sentence: str = Field(..., min_length=1, max_length=500)
    signs_used: list[str] = []
    duration_seconds: float = Field(0, ge=0)


@router.get("/labels")
async def get_supported_labels(model: SignModel = Depends(get_sign_model)):
    """Return the full set of signs the model can currently recognize."""
    return {"labels": model.labels, "count": len(model.labels), "is_mock_model": model.is_mock}


@router.post("/predict", response_model=LandmarkPredictionResponse)
async def predict_sign(
    payload: LandmarkPredictionRequest,
    model: SignModel = Depends(get_sign_model),
):
    """Classify a single frame's hand landmarks into a letter/number/word."""
    if len(payload.landmarks) != NUM_LANDMARK_FEATURES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Expected {NUM_LANDMARK_FEATURES} landmark values (21 points x,y,z), got {len(payload.landmarks)}",
        )

    label, confidence, top3 = model.predict(payload.landmarks)

    return LandmarkPredictionResponse(
        label=label,
        confidence=confidence,
        is_confident=confidence >= settings.PREDICTION_CONFIDENCE_THRESHOLD,
        top_predictions=[PredictionOption(label=l, confidence=c) for l, c in top3],
        is_mock_model=model.is_mock,
    )


@router.post("/log-sentence", status_code=status.HTTP_201_CREATED)
async def log_translated_sentence(
    payload: SentenceLogRequest,
    user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Save a completed sign-to-text sentence to the user's translation history."""
    doc = {
        "user_id": user["_id"],
        "sentence": payload.sentence,
        "signs_used": payload.signs_used,
        "duration_seconds": payload.duration_seconds,
        "created_at": datetime.now(timezone.utc),
    }
    await db.translation_history.insert_one(doc)
    return {"message": "Sentence saved to translation history"}


@router.get("/history")
async def get_translation_history(
    user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    cursor = db.translation_history.find({"user_id": user["_id"]}).sort("created_at", -1).limit(50)
    history = []
    async for doc in cursor:
        history.append(
            {
                "id": str(doc["_id"]),
                "sentence": doc["sentence"],
                "signs_used": doc.get("signs_used", []),
                "created_at": doc["created_at"],
            }
        )
    return history
