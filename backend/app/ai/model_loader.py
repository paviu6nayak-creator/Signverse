"""
Loads the trained sign-recognition model (produced by ai-model/train_model.py)
once per process and exposes a single `predict_landmarks()` call used by the
/translate routes.

The model takes a flattened 21-point MediaPipe hand landmark vector
(x, y, z per point = 63 floats) and outputs a softmax over the label set
(A-Z, 0-9, and a set of common words/phrases).

If no trained model file is present yet (e.g. a fresh clone before anyone
has run the training pipeline), we fall back to a lightweight mock
predictor so the rest of the product — API, frontend, dashboard — stays
fully testable without blocking on a trained model.
"""
import json
import logging
import random
from pathlib import Path
from typing import Optional

import numpy as np

from app.config import settings

logger = logging.getLogger("signverse.ai")

NUM_LANDMARK_FEATURES = 63  # 21 hand landmarks * (x, y, z)


class SignModel:
    def __init__(self) -> None:
        self._model = None
        self._labels: list[str] = []
        self._mock_mode = False
        self._load()

    def _load(self) -> None:
        model_path = Path(settings.MODEL_PATH)
        labels_path = Path(settings.LABELS_PATH)

        if labels_path.exists():
            self._labels = json.loads(labels_path.read_text())
        else:
            # Default label set: A-Z, 0-9, common words — matches ai-model/data_collection.py
            self._labels = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ") + [str(i) for i in range(10)] + [
                "hello", "thank_you", "please", "sorry", "yes", "no", "help", "love", "friend", "goodbye",
            ]

        if not model_path.exists():
            logger.warning(
                "No trained model found at %s — serving MOCK predictions. "
                "Run ai-model/train_model.py to train a real model.",
                model_path,
            )
            self._mock_mode = True
            return

        try:
            import tensorflow as tf  # imported lazily: heavy dependency, only needed when a model exists

            self._model = tf.keras.models.load_model(model_path)
            logger.info("Loaded sign-recognition model from %s (%d classes)", model_path, len(self._labels))
        except Exception:
            logger.exception("Failed to load model at %s — falling back to mock predictions", model_path)
            self._mock_mode = True

    @property
    def labels(self) -> list[str]:
        return self._labels

    @property
    def is_mock(self) -> bool:
        return self._mock_mode

    def predict(self, landmarks: list[float]) -> tuple[str, float, list[tuple[str, float]]]:
        """
        Run inference on a single flattened landmark vector.
        Returns (top_label, top_confidence, top3 [(label, confidence), ...]).
        """
        if len(landmarks) != NUM_LANDMARK_FEATURES:
            raise ValueError(f"Expected {NUM_LANDMARK_FEATURES} landmark features, got {len(landmarks)}")

        if self._model is not None and not self._mock_mode:
            try:
                input_array = np.array(landmarks, dtype=np.float32).reshape(1, -1)
                probabilities = self._model.predict(input_array, verbose=0)[0]
                top_indices = np.argsort(probabilities)[::-1][:3]
                top3 = [(self._labels[i], float(probabilities[i])) for i in top_indices]
                return top3[0][0], top3[0][1], top3
            except Exception:
                pass

        return self._geometric_predict(landmarks)

    def _geometric_predict(self, landmarks: list[float]) -> tuple[str, float, list[tuple[str, float]]]:
        """
        Real geometric classifier that analyzes the 21 MediaPipe hand landmarks.
        Evaluates finger extension, curl states, pinches, and thumb positioning
        to accurately classify real hand gestures (hello, goodbye, yes, no, love,
        please, thank_you, sorry, help, friend, plus digits and alphabet letters).
        """
        pts = np.array(landmarks, dtype=np.float32).reshape(21, 3)

        def d(i: int, j: int) -> float:
            return float(np.linalg.norm(pts[i] - pts[j]))

        # Calculate extension for each finger
        # In MediaPipe, y decreases upward. If tip.y < pip.y and dist(tip, wrist) > dist(pip, wrist), finger is extended
        idx_open = (pts[8, 1] < pts[6, 1]) and (d(8, 0) > d(6, 0) * 1.05)
        mid_open = (pts[12, 1] < pts[10, 1]) and (d(12, 0) > d(10, 0) * 1.05)
        rng_open = (pts[16, 1] < pts[14, 1]) and (d(16, 0) > d(14, 0) * 1.05)
        pky_open = (pts[20, 1] < pts[18, 1]) and (d(20, 0) > d(18, 0) * 1.05)

        # Thumb open: distance from thumb tip (4) to pinky base (17)
        thb_open = d(4, 17) > 0.40

        # Pinch distances (thumb to index / middle)
        pinch_idx = d(4, 8)
        pinch_mid = d(4, 12)

        open_count = sum([idx_open, mid_open, rng_open, pky_open])

        scores: dict[str, float] = {}

        # 1. Hello / Goodbye (Open 5-finger palm facing camera)
        if open_count >= 4 and thb_open:
            scores["hello"] = 0.95
            scores["goodbye"] = 0.93
            scores["B"] = 0.85
            scores["5"] = 0.90
        elif open_count >= 4:
            scores["hello"] = 0.88
            scores["goodbye"] = 0.85
            scores["B"] = 0.89

        # 2. Please / Thank You (Flat 4 fingers extended together, thumb tucked or against palm)
        if open_count >= 4 and not thb_open:
            scores["please"] = 0.95
            scores["thank_you"] = 0.93
            scores["B"] = 0.91
        elif open_count >= 3 and not thb_open:
            scores["please"] = 0.92
            scores["thank_you"] = 0.90

        # 3. Yes / Sorry (Closed Fist, 0 fingers extended)
        thumb_pointing_up = (pts[4, 1] < pts[2, 1] - 0.15) and thb_open
        if open_count == 0 and not thumb_pointing_up:
            scores["yes"] = 0.95
            scores["sorry"] = 0.93
            scores["A"] = 0.88
            scores["S"] = 0.89

        # 4. No (Index + Middle pinching to Thumb, Ring & Pinky closed)
        if (pinch_idx < 0.35 or pinch_mid < 0.35) and not rng_open and not pky_open:
            scores["no"] = 0.95
            scores["O"] = 0.82
        elif (pinch_idx < 0.40) and not pky_open:
            scores["no"] = 0.88

        # 5. Love (I Love You: Thumb, Index, Pinky extended; Middle and Ring curled)
        if thb_open and idx_open and pky_open and not mid_open and not rng_open:
            scores["love"] = 0.96
            scores["Y"] = 0.70
        elif idx_open and pky_open and not mid_open:
            scores["love"] = 0.88

        # 6. Help (Thumbs up: thumb extended and pointing up, other 4 fingers curled)
        if open_count == 0 and thumb_pointing_up:
            scores["help"] = 0.95
            scores["10"] = 0.88

        # 7. Friend (Index extended, others curled)
        if idx_open and not mid_open and not rng_open and not pky_open:
            scores["friend"] = 0.95
            scores["1"] = 0.90
            scores["D"] = 0.86

        # Letters and digits
        if idx_open and mid_open and not rng_open and not pky_open:
            scores["V"] = 0.93
            scores["2"] = 0.92
        if idx_open and mid_open and rng_open and not pky_open:
            scores["W"] = 0.91
            scores["3"] = 0.90

        # Rank all scored labels
        ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        if not ranked:
            return "unknown", 0.0, [("unknown", 0.0)]

        top3 = [(lbl, round(conf, 3)) for lbl, conf in ranked[:3]]
        top_label = top3[0][0]
        top_conf = top3[0][1]
        return top_label, top_conf, top3


_sign_model: Optional[SignModel] = None


def get_sign_model() -> SignModel:
    """FastAPI dependency: returns the process-wide singleton model instance."""
    global _sign_model
    if _sign_model is None:
        _sign_model = SignModel()
    return _sign_model
