"""
End-to-end real-time sign language detection pipeline, run locally against
a webcam. This mirrors exactly what the web app's Live Camera Translation
page does in the browser (MediaPipe Hands + the trained model), but as a
standalone desktop script — useful for demoing the AI model without the
full web stack, and for validating a freshly trained model.

Pipeline:
    Webcam frame
        -> MediaPipe Face Detection (confirms a person is present/attentive)
        -> MediaPipe Hands (21 landmarks)
        -> normalize landmarks (utils.preprocess_for_model)
        -> Keras model prediction + confidence
        -> stability buffer -> sentence formation
        -> on-screen overlay + optional text-to-speech

Usage:
    python realtime_detection.py
    python realtime_detection.py --confidence 0.8 --camera 0

Controls:
    SPACE   - speak the current sentence aloud
    C       - clear the current sentence
    Q / ESC - quit
"""
from __future__ import annotations

import argparse
import json
import time
from collections import Counter, deque
from pathlib import Path

import cv2
import mediapipe as mp
import numpy as np
import tensorflow as tf

from text_to_speech import speak
from utils import preprocess_for_model

MODELS_DIR = Path(__file__).parent / "models"

mp_hands = mp.solutions.hands
mp_face = mp.solutions.face_detection
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles

# How many recent predictions to look at when deciding a sign has "settled"
STABILITY_WINDOW = 15
# Fraction of the window that must agree before we commit a letter/word
STABILITY_AGREEMENT_RATIO = 0.7
# Minimum seconds between committing two signs, so held poses don't repeat-fire
MIN_SECONDS_BETWEEN_COMMITS = 1.0


class SentenceBuilder:
    """
    Turns a noisy stream of per-frame predictions into a clean sentence:
    only commits a sign once it has been the top prediction for most of a
    recent sliding window, and enforces a cooldown so a held pose doesn't
    spam the same letter repeatedly.
    """

    def __init__(self) -> None:
        self.recent_predictions: deque[str] = deque(maxlen=STABILITY_WINDOW)
        self.committed_tokens: list[str] = []
        self.last_commit_time = 0.0
        self.last_committed_token: str | None = None

    def push(self, label: str, confidence: float, threshold: float) -> str | None:
        if confidence < threshold:
            self.recent_predictions.clear()
            return None

        self.recent_predictions.append(label)
        if len(self.recent_predictions) < STABILITY_WINDOW:
            return None

        most_common_label, count = Counter(self.recent_predictions).most_common(1)[0]
        is_stable = (count / STABILITY_WINDOW) >= STABILITY_AGREEMENT_RATIO
        cooldown_elapsed = (time.time() - self.last_commit_time) >= MIN_SECONDS_BETWEEN_COMMITS
        is_repeat = most_common_label == self.last_committed_token

        if is_stable and cooldown_elapsed and not is_repeat:
            self.committed_tokens.append(most_common_label)
            self.last_commit_time = time.time()
            self.last_committed_token = most_common_label
            self.recent_predictions.clear()
            return most_common_label
        return None

    def sentence(self) -> str:
        """
        Join tokens into a readable string: single letters run together into
        words (A, B, C -> "ABC"), while multi-character tokens (whole-word
        signs like "hello") get spaces around them.
        """
        parts: list[str] = []
        for token in self.committed_tokens:
            if len(token) == 1 and token.isalnum():
                if parts and parts[-1].isalnum() and len(parts[-1]) >= 1 and not parts[-1].endswith(" "):
                    parts[-1] += token
                else:
                    parts.append(token)
            else:
                parts.append(f" {token} ")
        return "".join(parts).strip()

    def clear(self) -> None:
        self.committed_tokens.clear()
        self.recent_predictions.clear()
        self.last_committed_token = None


def load_model_and_labels():
    model_path = MODELS_DIR / "signverse_model.h5"
    labels_path = MODELS_DIR / "labels.json"
    if not model_path.exists() or not labels_path.exists():
        raise FileNotFoundError("No trained model found. Run train_model.py first (after collecting data).")
    model = tf.keras.models.load_model(model_path)
    labels = json.loads(labels_path.read_text())
    return model, labels


def main() -> None:
    parser = argparse.ArgumentParser(description="Run the real-time sign detection pipeline against a webcam.")
    parser.add_argument("--confidence", type=float, default=0.75, help="Minimum confidence to accept a prediction")
    parser.add_argument("--camera", type=int, default=0)
    args = parser.parse_args()

    model, labels = load_model_and_labels()
    sentence_builder = SentenceBuilder()

    cap = cv2.VideoCapture(args.camera)
    if not cap.isOpened():
        raise RuntimeError("Could not open webcam.")

    with mp_hands.Hands(
        model_complexity=1, min_detection_confidence=0.7, min_tracking_confidence=0.6, max_num_hands=1
    ) as hands, mp_face.FaceDetection(min_detection_confidence=0.6) as face_detector:
        while cap.isOpened():
            success, frame = cap.read()
            if not success:
                continue

            frame = cv2.flip(frame, 1)
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

            face_results = face_detector.process(rgb_frame)
            if face_results.detections:
                for detection in face_results.detections:
                    mp_drawing.draw_detection(frame, detection)

            hand_results = hands.process(rgb_frame)
            predicted_label, confidence = None, 0.0

            if hand_results.multi_hand_landmarks:
                hand_landmarks = hand_results.multi_hand_landmarks[0]
                mp_drawing.draw_landmarks(
                    frame,
                    hand_landmarks,
                    mp_hands.HAND_CONNECTIONS,
                    mp_drawing_styles.get_default_hand_landmarks_style(),
                    mp_drawing_styles.get_default_hand_connections_style(),
                )

                features = np.array(preprocess_for_model(hand_landmarks), dtype=np.float32).reshape(1, -1)
                probabilities = model.predict(features, verbose=0)[0]
                top_index = int(np.argmax(probabilities))
                predicted_label = labels[top_index]
                confidence = float(probabilities[top_index])

                committed = sentence_builder.push(predicted_label, confidence, args.confidence)
                if committed:
                    print(f"Committed: {committed}")

            # --- overlay UI -------------------------------------------------
            overlay_bg = frame.copy()
            cv2.rectangle(overlay_bg, (0, frame.shape[0] - 110), (frame.shape[1], frame.shape[0]), (20, 20, 20), -1)
            frame = cv2.addWeighted(overlay_bg, 0.6, frame, 0.4, 0)

            if predicted_label:
                label_text = f"{predicted_label}  ({confidence:.0%})"
                color = (100, 220, 120) if confidence >= args.confidence else (100, 160, 240)
                cv2.putText(frame, label_text, (16, 32), cv2.FONT_HERSHEY_SIMPLEX, 0.9, color, 2)

            cv2.putText(
                frame,
                f"Sentence: {sentence_builder.sentence()}",
                (16, frame.shape[0] - 70),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.75,
                (255, 255, 255),
                2,
            )
            cv2.putText(
                frame,
                "SPACE = speak | C = clear | Q = quit",
                (16, frame.shape[0] - 30),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.55,
                (170, 170, 170),
                1,
            )

            cv2.imshow("SignVerse - Real-Time Translation", frame)

            key = cv2.waitKey(1) & 0xFF
            if key in (ord("q"), 27):
                break
            elif key == ord("c"):
                sentence_builder.clear()
            elif key == ord(" "):
                speak(sentence_builder.sentence())

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
