"""
Dataset collection script for SignVerse.

Opens the webcam, runs MediaPipe Hands to detect a hand, and saves the
normalized 63-value landmark vector to a labeled CSV row every time you
press the SPACE bar. This is how the training dataset (dataset/landmarks.csv)
is built — one sign at a time.

Usage:
    python data_collection.py --label A
    python data_collection.py --label hello --samples 300

Controls:
    SPACE   - capture the current frame's landmarks (if a hand is detected)
    A       - toggle auto-capture (grabs a sample every few frames while a hand is visible)
    Q / ESC - quit
"""
from __future__ import annotations

import argparse
import csv
import time
from pathlib import Path

import cv2
import mediapipe as mp

from utils import NUM_FEATURES, preprocess_for_model

DATASET_DIR = Path(__file__).parent / "dataset"
DATASET_FILE = DATASET_DIR / "landmarks.csv"

mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles


def ensure_dataset_file() -> None:
    DATASET_DIR.mkdir(parents=True, exist_ok=True)
    if not DATASET_FILE.exists():
        with open(DATASET_FILE, "w", newline="") as f:
            writer = csv.writer(f)
            header = ["label"] + [f"f{i}" for i in range(NUM_FEATURES)]
            writer.writerow(header)


def append_sample(label: str, features: list[float]) -> None:
    with open(DATASET_FILE, "a", newline="") as f:
        writer = csv.writer(f)
        writer.writerow([label] + features)


def main() -> None:
    parser = argparse.ArgumentParser(description="Collect labeled hand-landmark samples for training.")
    parser.add_argument("--label", required=True, help="The sign label being recorded, e.g. A, 5, hello")
    parser.add_argument("--samples", type=int, default=200, help="Target number of samples to collect this session")
    parser.add_argument("--camera", type=int, default=0, help="Webcam device index")
    args = parser.parse_args()

    ensure_dataset_file()

    cap = cv2.VideoCapture(args.camera)
    if not cap.isOpened():
        raise RuntimeError("Could not open webcam. Check --camera index or device permissions.")

    collected = 0
    auto_capture = False
    last_auto_capture_time = 0.0
    AUTO_CAPTURE_INTERVAL_SECONDS = 0.15

    print(f"Collecting samples for label: '{args.label}'. Target: {args.samples}")
    print("SPACE = capture one sample | A = toggle auto-capture | Q/ESC = quit")

    with mp_hands.Hands(
        model_complexity=1,
        min_detection_confidence=0.7,
        min_tracking_confidence=0.6,
        max_num_hands=1,
    ) as hands:
        while cap.isOpened() and collected < args.samples:
            success, frame = cap.read()
            if not success:
                continue

            frame = cv2.flip(frame, 1)
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = hands.process(rgb_frame)

            hand_present = bool(results.multi_hand_landmarks)
            if hand_present:
                for hand_landmarks in results.multi_hand_landmarks:
                    mp_drawing.draw_landmarks(
                        frame,
                        hand_landmarks,
                        mp_hands.HAND_CONNECTIONS,
                        mp_drawing_styles.get_default_hand_landmarks_style(),
                        mp_drawing_styles.get_default_hand_connections_style(),
                    )

            status_color = (0, 200, 100) if hand_present else (0, 0, 220)
            cv2.putText(frame, f"Label: {args.label}", (16, 32), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
            cv2.putText(frame, f"Collected: {collected}/{args.samples}", (16, 64), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
            cv2.putText(frame, f"Auto-capture: {'ON' if auto_capture else 'OFF'}", (16, 96), cv2.FONT_HERSHEY_SIMPLEX, 0.7, status_color, 2)
            cv2.imshow("SignVerse - Dataset Collection", frame)

            key = cv2.waitKey(1) & 0xFF
            should_capture = key == ord(" ")

            if key == ord("a"):
                auto_capture = not auto_capture
            elif key in (ord("q"), 27):
                break

            if auto_capture and hand_present and (time.time() - last_auto_capture_time) > AUTO_CAPTURE_INTERVAL_SECONDS:
                should_capture = True
                last_auto_capture_time = time.time()

            if should_capture and hand_present:
                features = preprocess_for_model(results.multi_hand_landmarks[0])
                append_sample(args.label, features)
                collected += 1

    cap.release()
    cv2.destroyAllWindows()
    print(f"Done. Collected {collected} samples for '{args.label}' -> {DATASET_FILE}")


if __name__ == "__main__":
    main()
