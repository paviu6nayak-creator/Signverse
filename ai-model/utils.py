"""
Shared helpers used across the AI pipeline (data_collection.py,
train_model.py, predict.py, realtime_detection.py).

Centralizing landmark extraction + normalization here guarantees the
exact same preprocessing is used at training time and at inference
time — a very common source of silent accuracy bugs when it's
duplicated per-script.
"""
from __future__ import annotations

import numpy as np

NUM_HAND_LANDMARKS = 21
NUM_FEATURES = NUM_HAND_LANDMARKS * 3  # x, y, z per landmark


def extract_landmark_vector(hand_landmarks) -> list[float]:
    """
    Flatten a MediaPipe `hand_landmarks` object into a list of 63 floats
    ([x0, y0, z0, x1, y1, z1, ...]) in raw (un-normalized) coordinates.
    """
    vector: list[float] = []
    for landmark in hand_landmarks.landmark:
        vector.extend([landmark.x, landmark.y, landmark.z])
    return vector


def normalize_landmarks(raw_vector: list[float]) -> list[float]:
    """
    Make the landmark vector translation- and scale-invariant so the
    model recognizes a sign regardless of where the hand is in frame or
    how close it is to the camera:
      1. Translate so landmark 0 (the wrist) is the origin.
      2. Scale so the largest absolute coordinate is 1.0.
    """
    points = np.array(raw_vector, dtype=np.float32).reshape(NUM_HAND_LANDMARKS, 3)

    wrist = points[0].copy()
    points -= wrist

    max_value = np.max(np.abs(points))
    if max_value > 1e-6:
        points /= max_value

    return points.flatten().tolist()


def preprocess_for_model(hand_landmarks) -> list[float]:
    """Convenience wrapper: raw MediaPipe landmarks -> normalized model input."""
    return normalize_landmarks(extract_landmark_vector(hand_landmarks))
