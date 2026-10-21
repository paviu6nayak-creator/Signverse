"""
Standalone single-shot prediction — useful for smoke-testing a freshly
trained model without running the full real-time loop.

Usage:
    python predict.py --image path/to/hand.jpg
    python predict.py --webcam-snapshot
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

import cv2
import mediapipe as mp
import numpy as np
import tensorflow as tf

from utils import preprocess_for_model

MODELS_DIR = Path(__file__).parent / "models"
mp_hands = mp.solutions.hands


def load_model_and_labels():
    model_path = MODELS_DIR / "signverse_model.h5"
    labels_path = MODELS_DIR / "labels.json"
    if not model_path.exists() or not labels_path.exists():
        raise FileNotFoundError("Trained model not found. Run train_model.py first.")

    model = tf.keras.models.load_model(model_path)
    labels = json.loads(labels_path.read_text())
    return model, labels


def predict_from_frame(frame: np.ndarray, model, labels: list[str]) -> tuple[str, float] | None:
    with mp_hands.Hands(static_image_mode=True, max_num_hands=1, min_detection_confidence=0.6) as hands:
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = hands.process(rgb_frame)
        if not results.multi_hand_landmarks:
            return None

        features = np.array(preprocess_for_model(results.multi_hand_landmarks[0]), dtype=np.float32).reshape(1, -1)
        probabilities = model.predict(features, verbose=0)[0]
        top_index = int(np.argmax(probabilities))
        return labels[top_index], float(probabilities[top_index])


def main() -> None:
    parser = argparse.ArgumentParser(description="Run a single prediction against an image or webcam snapshot.")
    parser.add_argument("--image", type=str, help="Path to a still image containing a hand sign")
    parser.add_argument("--webcam-snapshot", action="store_true", help="Capture one frame from the webcam and predict on it")
    args = parser.parse_args()

    model, labels = load_model_and_labels()

    if args.image:
        frame = cv2.imread(args.image)
        if frame is None:
            raise FileNotFoundError(f"Could not read image: {args.image}")
    elif args.webcam_snapshot:
        cap = cv2.VideoCapture(0)
        success, frame = cap.read()
        cap.release()
        if not success:
            raise RuntimeError("Could not capture a frame from the webcam.")
    else:
        parser.error("Provide either --image <path> or --webcam-snapshot")
        return

    result = predict_from_frame(frame, model, labels)
    if result is None:
        print("No hand detected in the image.")
        return

    label, confidence = result
    print(f"Predicted sign: '{label}'  (confidence: {confidence:.1%})")


if __name__ == "__main__":
    main()
