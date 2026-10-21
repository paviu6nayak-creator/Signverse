"""
Pydantic schemas for quizzes: multiple-choice + sign-recognition questions,
submissions, and scored results.
"""
from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field

QuestionType = Literal["multiple_choice", "sign_recognition"]


class QuizOption(BaseModel):
    text: str
    is_correct: bool = False


class QuizQuestionCreate(BaseModel):
    question_type: QuestionType
    prompt: str
    image_url: Optional[str] = None
    options: list[QuizOption] = []          # used for multiple_choice
    correct_sign_label: Optional[str] = None  # used for sign_recognition
    points: int = 10


class QuizCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=120)
    category: str
    difficulty: Literal["beginner", "intermediate", "advanced"] = "beginner"
    description: str = ""
    time_limit_seconds: int = 300
    questions: list[QuizQuestionCreate] = Field(..., min_length=1)


class QuizQuestionResponse(BaseModel):
    id: str
    question_type: QuestionType
    prompt: str
    image_url: Optional[str] = None
    options: list[str] = []
    points: int


class QuizResponse(BaseModel):
    id: str
    title: str
    category: str
    difficulty: str
    description: str
    time_limit_seconds: int
    total_questions: int
    total_points: int
    created_at: datetime


class QuizDetailResponse(QuizResponse):
    questions: list[QuizQuestionResponse]


class QuizAnswer(BaseModel):
    question_id: str
    selected_option_index: Optional[int] = None      # multiple_choice
    predicted_sign_label: Optional[str] = None        # sign_recognition


class QuizSubmission(BaseModel):
    quiz_id: str
    answers: list[QuizAnswer]
    time_taken_seconds: float


class QuizResultResponse(BaseModel):
    id: str
    quiz_id: str
    quiz_title: str
    score: int
    total_points: int
    percentage: float
    correct_answers: int
    total_questions: int
    time_taken_seconds: float
    created_at: datetime
