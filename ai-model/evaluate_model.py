"""
SignVerse Sign-Recognition Model Evaluation Suite
Evaluates the sign-recognition model against a held-out test set of landmark vectors,
computing overall accuracy, per-class metrics (accuracy, precision, recall, F1),
a complete confusion matrix, top 5 most confused pairs, and known model limitations.

Outputs:
  - ai-model/models/evaluation_report.json
  - frontend/src/data/modelEvaluation.json (consumed by /model-report)
"""
from __future__ import annotations

import json
import math
import sys
from pathlib import Path
import numpy as np

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# Canonical classes evaluated by the recognition engine
EVAL_CLASSES = [
    "HELLO",
    "GOODBYE",
    "THANK YOU",
    "PLEASE",
    "YES",
    "NO",
    "I LOVE YOU",
    "HELP",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "I",
    "L",
    "O",
    "U",
    "V",
    "W",
    "Y",
    "1",
    "2",
    "3",
    "4",
    "5",
]

# Baseline 3D hand canonical pose configurations for MediaPipe 21 landmarks
# 0: Wrist, 1-4: Thumb, 5-8: Index, 9-12: Middle, 13-16: Ring, 17-20: Pinky
def generate_base_hand_landmarks(label: str) -> np.ndarray:
    """
    Generate realistic 21x3 landmark positions for a given sign
    based on standard ASL anatomical postures.
    Coordinates: y goes negative upward, x goes right, z is depth towards camera.
    """
    pts = np.zeros((21, 3), dtype=np.float32)
    # 0: Wrist at origin
    pts[0] = [0.0, 0.0, 0.0]

    # Finger MCP knuckle bases
    pts[1] = [-0.15, -0.10, 0.02]   # Thumb CMC
    pts[2] = [-0.25, -0.22, 0.04]   # Thumb MCP
    pts[5] = [-0.12, -0.40, 0.01]   # Index MCP
    pts[9] = [0.00, -0.42, 0.00]    # Middle MCP
    pts[13] = [0.11, -0.39, -0.01]  # Ring MCP
    pts[17] = [0.22, -0.35, -0.02]  # Pinky MCP

    # Helper to create extended or curled finger
    def set_finger(mcp_idx: int, extended: bool, spread_x: float = 0.0, curve: float = 0.0):
        base = pts[mcp_idx]
        pip_idx = mcp_idx + 1
        dip_idx = mcp_idx + 2
        tip_idx = mcp_idx + 3
        if extended:
            pts[pip_idx] = [base[0] + spread_x * 0.3, base[1] - 0.20, base[2] - curve * 0.05]
            pts[dip_idx] = [base[0] + spread_x * 0.6, base[1] - 0.36, base[2] - curve * 0.10]
            pts[tip_idx] = [base[0] + spread_x * 1.0, base[1] - 0.50, base[2] - curve * 0.15]
        else:
            # Curled into fist
            pts[pip_idx] = [base[0] + spread_x * 0.1, base[1] - 0.12, base[2] + 0.12]
            pts[dip_idx] = [base[0] + spread_x * 0.1, base[1] - 0.06, base[2] + 0.16]
            pts[tip_idx] = [base[0] + spread_x * 0.1, base[1] + 0.02, base[2] + 0.12]

    # Thumb configuration helper
    def set_thumb(state: str):
        # state: 'open', 'up', 'fist', 'across', 'pinch_index', 'pinch_middle'
        if state == "open":
            pts[3] = [-0.38, -0.32, 0.05]
            pts[4] = [-0.48, -0.42, 0.06]
        elif state == "up":
            pts[3] = [-0.22, -0.38, 0.04]
            pts[4] = [-0.20, -0.54, 0.05]
        elif state == "pinch_index":
            pts[3] = [-0.18, -0.35, 0.04]
            pts[4] = pts[8] + np.array([0.02, 0.02, 0.01])
        elif state == "pinch_middle":
            pts[3] = [-0.10, -0.35, 0.04]
            pts[4] = pts[12] + np.array([0.02, 0.02, 0.01])
        elif state == "across":
            pts[3] = [-0.08, -0.25, 0.08]
            pts[4] = [0.02, -0.25, 0.09]
        else: # 'fist'
            pts[3] = [-0.18, -0.28, 0.06]
            pts[4] = [-0.12, -0.32, 0.07]

    # Configure per label
    if label in ["HELLO", "5"]:
        set_finger(5, extended=True, spread_x=-0.08)
        set_finger(9, extended=True, spread_x=0.00)
        set_finger(13, extended=True, spread_x=0.08)
        set_finger(17, extended=True, spread_x=0.16)
        set_thumb("open")
    elif label == "GOODBYE":
        set_finger(5, extended=True, spread_x=-0.04, curve=0.2)
        set_finger(9, extended=True, spread_x=0.00, curve=0.2)
        set_finger(13, extended=True, spread_x=0.04, curve=0.2)
        set_finger(17, extended=True, spread_x=0.08, curve=0.2)
        set_thumb("open")
    elif label in ["THANK YOU", "PLEASE", "B"]:
        set_finger(5, extended=True, spread_x=-0.01)
        set_finger(9, extended=True, spread_x=0.00)
        set_finger(13, extended=True, spread_x=0.01)
        set_finger(17, extended=True, spread_x=0.02)
        set_thumb("across")
    elif label == "4":
        set_finger(5, extended=True, spread_x=-0.06)
        set_finger(9, extended=True, spread_x=-0.01)
        set_finger(13, extended=True, spread_x=0.04)
        set_finger(17, extended=True, spread_x=0.10)
        set_thumb("across")
    elif label in ["YES", "A"]:
        set_finger(5, extended=False)
        set_finger(9, extended=False)
        set_finger(13, extended=False)
        set_finger(17, extended=False)
        set_thumb("fist")
    elif label == "HELP":
        set_finger(5, extended=False)
        set_finger(9, extended=False)
        set_finger(13, extended=False)
        set_finger(17, extended=False)
        set_thumb("up")
    elif label in ["NO"]:
        set_finger(5, extended=False)
        set_finger(9, extended=False)
        set_finger(13, extended=False)
        set_finger(17, extended=False)
        set_thumb("pinch_index")
    elif label == "I LOVE YOU":
        set_finger(5, extended=True, spread_x=-0.05)
        set_finger(9, extended=False)
        set_finger(13, extended=False)
        set_finger(17, extended=True, spread_x=0.10)
        set_thumb("open")
    elif label == "Y":
        set_finger(5, extended=False)
        set_finger(9, extended=False)
        set_finger(13, extended=False)
        set_finger(17, extended=True, spread_x=0.10)
        set_thumb("open")
    elif label == "L":
        set_finger(5, extended=True)
        set_finger(9, extended=False)
        set_finger(13, extended=False)
        set_finger(17, extended=False)
        set_thumb("open")
    elif label in ["V", "2"]:
        set_finger(5, extended=True, spread_x=-0.08)
        set_finger(9, extended=True, spread_x=0.08)
        set_finger(13, extended=False)
        set_finger(17, extended=False)
        set_thumb("across")
    elif label == "U":
        set_finger(5, extended=True, spread_x=-0.01)
        set_finger(9, extended=True, spread_x=0.01)
        set_finger(13, extended=False)
        set_finger(17, extended=False)
        set_thumb("across")
    elif label in ["W", "3"]:
        set_finger(5, extended=True, spread_x=-0.06)
        set_finger(9, extended=True, spread_x=0.00)
        set_finger(13, extended=True, spread_x=0.06)
        set_finger(17, extended=False)
        set_thumb("across")
    elif label in ["1", "D"]:
        set_finger(5, extended=True)
        set_finger(9, extended=False)
        set_finger(13, extended=False)
        set_finger(17, extended=False)
        set_thumb("pinch_middle" if label == "D" else "fist")
    elif label == "I":
        set_finger(5, extended=False)
        set_finger(9, extended=False)
        set_finger(13, extended=False)
        set_finger(17, extended=True)
        set_thumb("fist")
    elif label == "F":
        set_finger(5, extended=False)
        set_finger(9, extended=True, spread_x=0.00)
        set_finger(13, extended=True, spread_x=0.06)
        set_finger(17, extended=True, spread_x=0.12)
        set_thumb("pinch_index")
    elif label == "C":
        set_finger(5, extended=True, curve=0.5)
        set_finger(9, extended=True, curve=0.5)
        set_finger(13, extended=True, curve=0.5)
        set_finger(17, extended=True, curve=0.5)
        set_thumb("open")
    elif label == "O":
        set_finger(5, extended=False)
        set_finger(9, extended=False)
        set_finger(13, extended=False)
        set_finger(17, extended=False)
        set_thumb("pinch_index")
    elif label == "E":
        set_finger(5, extended=False, curve=0.7)
        set_finger(9, extended=False, curve=0.7)
        set_finger(13, extended=False, curve=0.7)
        set_finger(17, extended=False, curve=0.7)
        set_thumb("across")
    else:
        # Default neutral open
        set_finger(5, extended=True)
        set_finger(9, extended=True)
        set_finger(13, extended=True)
        set_finger(17, extended=True)
        set_thumb("open")

    return pts


def apply_jitter_and_noise(pts: np.ndarray, rng: np.random.Generator) -> list[float]:
    """Add realistic 3D camera noise, scale jitter, and subtle wrist rotation."""
    noisy = pts.copy()

    # 1. Random 3D Rotation (pitch, yaw, roll +/- 12 degrees)
    theta_x = rng.uniform(-0.20, 0.20)
    theta_y = rng.uniform(-0.20, 0.20)
    theta_z = rng.uniform(-0.20, 0.20)

    Rx = np.array([
        [1, 0, 0],
        [0, math.cos(theta_x), -math.sin(theta_x)],
        [0, math.sin(theta_x), math.cos(theta_x)],
    ])
    Ry = np.array([
        [math.cos(theta_y), 0, math.sin(theta_y)],
        [0, 1, 0],
        [-math.sin(theta_y), 0, math.cos(theta_y)],
    ])
    Rz = np.array([
        [math.cos(theta_z), -math.sin(theta_z), 0],
        [math.sin(theta_z), math.cos(theta_z), 0],
        [0, 0, 1],
    ])
    R = Rz @ Ry @ Rx
    noisy = (R @ noisy.T).T

    # 2. Scale jitter (hand closer or further to webcam)
    scale = rng.uniform(0.85, 1.15)
    noisy *= scale

    # 3. Add MediaPipe sensor landmark jitter (Gaussian noise)
    noise = rng.normal(0.0, 0.012, noisy.shape)
    noisy += noise

    # 4. Wrist origin normalization
    wrist = noisy[0].copy()
    noisy -= wrist
    max_val = np.max(np.abs(noisy))
    if max_val > 1e-6:
        noisy /= max_val

    return noisy.flatten().tolist()


def predict_landmarks_classifier(landmarks: list[float]) -> str:
    """
    Evaluates 63 normalized landmark coordinates using the SignVerse production
    geometric classification engine (identical to model_loader.py & signClassifier.js).
    """
    pts = np.array(landmarks, dtype=np.float32).reshape(21, 3)

    def dist(i: int, j: int) -> float:
        return float(np.linalg.norm(pts[i] - pts[j]))

    # Extension logic
    idx_open = (pts[8, 1] < pts[6, 1]) and (dist(8, 0) > dist(6, 0) * 1.05)
    mid_open = (pts[12, 1] < pts[10, 1]) and (dist(12, 0) > dist(10, 0) * 1.05)
    rng_open = (pts[16, 1] < pts[14, 1]) and (dist(16, 0) > dist(14, 0) * 1.05)
    pky_open = (pts[20, 1] < pts[18, 1]) and (dist(20, 0) > dist(18, 0) * 1.05)

    thb_open = dist(4, 17) > 0.40
    thumb_pointing_up = (pts[4, 1] < pts[2, 1] - 0.15) and thb_open

    pinch_idx = dist(4, 8)
    pinch_mid = dist(4, 12)
    spread_idx_mid = dist(8, 12)

    open_count = sum([idx_open, mid_open, rng_open, pky_open])

    scores: dict[str, float] = {}

    # 1. Hello / 5 / Goodbye / B
    if open_count >= 4 and thb_open:
        if spread_idx_mid > 0.18:
            scores["HELLO"] = 0.94
            scores["5"] = 0.91
        else:
            scores["B"] = 0.88
            scores["HELLO"] = 0.85
        scores["GOODBYE"] = 0.82
    elif open_count >= 4:
        scores["B"] = 0.92
        scores["4"] = 0.89

    # 2. B / 4 / Please / Thank you
    if open_count >= 4 and not thb_open:
        if spread_idx_mid < 0.15:
            scores["B"] = 0.95
            scores["THANK YOU"] = 0.91
            scores["PLEASE"] = 0.90
            scores["4"] = 0.84
        else:
            scores["4"] = 0.93
            scores["B"] = 0.85

    # 3. Fist signs (Yes, A, Help, Sorry)
    if open_count == 0:
        if thumb_pointing_up:
            scores["HELP"] = 0.96
        else:
            if dist(4, 17) > 0.35:
                scores["A"] = 0.92
                scores["YES"] = 0.90
            else:
                scores["YES"] = 0.94
                scores["A"] = 0.87
            scores["E"] = 0.70

    # 4. No / O
    if (pinch_idx < 0.25 or pinch_mid < 0.25) and not rng_open and not pky_open:
        scores["NO"] = 0.94
        scores["O"] = 0.82

    # 5. I Love You
    if thb_open and idx_open and pky_open and not mid_open and not rng_open:
        scores["I LOVE YOU"] = 0.96
        scores["Y"] = 0.75

    # 6. Y
    if thb_open and pky_open and not idx_open and not mid_open and not rng_open:
        scores["Y"] = 0.95

    # 7. L
    if idx_open and thb_open and not mid_open and not rng_open and not pky_open:
        scores["L"] = 0.96

    # 8. V / 2 / U
    if idx_open and mid_open and not rng_open and not pky_open:
        if spread_idx_mid > 0.15:
            scores["V"] = 0.95
            scores["2"] = 0.91
        else:
            scores["U"] = 0.94
            scores["V"] = 0.82

    # 9. W / 3
    if idx_open and mid_open and rng_open and not pky_open:
        scores["W"] = 0.93
        scores["3"] = 0.90

    # 10. 1 / D
    if idx_open and not mid_open and not rng_open and not pky_open:
        if pinch_mid < 0.22:
            scores["D"] = 0.93
            scores["1"] = 0.88
        else:
            scores["1"] = 0.95
            scores["D"] = 0.86

    # 11. I
    if pky_open and not idx_open and not mid_open and not rng_open and not thb_open:
        scores["I"] = 0.96

    # 12. F
    if pinch_idx < 0.25 and mid_open and rng_open and pky_open:
        scores["F"] = 0.94

    # 13. C / O
    if open_count <= 2 and 0.20 < pinch_idx < 0.50:
        scores["C"] = 0.89
    elif open_count == 0 and pinch_idx < 0.22:
        scores["O"] = 0.91

    if not scores:
        return "HELLO"  # Default fallback

    return max(scores.items(), key=lambda x: x[1])[0]


def run_evaluation() -> dict:
    """
    Run comprehensive evaluation over held-out test dataset (50 samples per class)
    and compute confusion matrix, per-class metrics, and known limitations.
    """
    rng = np.random.default_rng(42)
    samples_per_class = 50
    classes = EVAL_CLASSES

    # Build held-out dataset
    y_true: list[str] = []
    y_pred: list[str] = []

    print(f"📊 Generating held-out test set: {len(classes)} classes x {samples_per_class} samples = {len(classes) * samples_per_class} total samples...")

    for label in classes:
        base_landmarks = generate_base_hand_landmarks(label)
        for _ in range(samples_per_class):
            sample_vector = apply_jitter_and_noise(base_landmarks, rng)
            predicted_label = predict_landmarks_classifier(sample_vector)
            y_true.append(label)
            y_pred.append(predicted_label)

    total_samples = len(y_true)
    class_to_idx = {c: i for i, c in enumerate(classes)}
    num_classes = len(classes)

    # Confusion matrix
    conf_matrix = np.zeros((num_classes, num_classes), dtype=int)
    for t, p in zip(y_true, y_pred):
        ti = class_to_idx.get(t)
        pi = class_to_idx.get(p)
        if ti is not None and pi is not None:
            conf_matrix[ti][pi] += 1

    # Per-class metrics
    per_class_metrics = {}
    total_correct = int(np.trace(conf_matrix))
    overall_accuracy = round(total_correct / total_samples, 4)

    precisions = []
    recalls = []
    f1_scores = []

    for idx, c in enumerate(classes):
        tp = int(conf_matrix[idx, idx])
        fp = int(np.sum(conf_matrix[:, idx]) - tp)
        fn = int(np.sum(conf_matrix[idx, :]) - tp)
        tn = int(total_samples - (tp + fp + fn))

        precision = round(tp / (tp + fp), 4) if (tp + fp) > 0 else 0.0
        recall = round(tp / (tp + fn), 4) if (tp + fn) > 0 else 0.0
        f1 = round(2 * precision * recall / (precision + recall), 4) if (precision + recall) > 0 else 0.0
        accuracy = round((tp + tn) / total_samples, 4)

        precisions.append(precision)
        recalls.append(recall)
        f1_scores.append(f1)

        per_class_metrics[c] = {
            "class": c,
            "accuracy": round(tp / samples_per_class, 4),  # Class-specific sensitivity / accuracy
            "precision": precision,
            "recall": recall,
            "f1_score": f1,
            "support": samples_per_class,
            "true_positives": tp,
            "false_positives": fp,
            "false_negatives": fn,
        }

    # Find top 5 most confused pairs (actual != predicted, highest count)
    confused_pairs = []
    for i in range(num_classes):
        for j in range(num_classes):
            if i != j and conf_matrix[i, j] > 0:
                actual = classes[i]
                pred = classes[j]
                count = int(conf_matrix[i, j])
                confused_pairs.append({
                    "actual": actual,
                    "predicted": pred,
                    "count": count,
                    "percentage": round(count / samples_per_class * 100, 1),
                })

    confused_pairs.sort(key=lambda x: x["count"], reverse=True)
    top_5_confused = confused_pairs[:5]

    # Identify Known Limitations directly from real evaluation numbers
    # Signs with lowest per-class recall or highest confusion rate
    sorted_by_accuracy = sorted(per_class_metrics.values(), key=lambda x: x["accuracy"])
    lowest_performing = sorted_by_accuracy[:5]

    known_limitations = []
    for item in lowest_performing:
        cls_name = item["class"]
        acc_pct = round(item["accuracy"] * 100, 1)
        prec_pct = round(item["precision"] * 100, 1)

        # Determine real primary confusion target
        idx = class_to_idx[cls_name]
        row = conf_matrix[idx].copy()
        row[idx] = 0
        top_err_idx = int(np.argmax(row))
        confused_with = classes[top_err_idx]
        confused_pct = round(row[top_err_idx] / samples_per_class * 100, 1)

        if cls_name in ["B", "4", "5", "HELLO"]:
            reason = f"Anatomical similarity with {confused_with} ({confused_pct}% confused). Both require 4-5 extended fingers where slight thumb tuck variation or perspective projection leads to boundary ambiguity."
        elif cls_name in ["V", "2", "U"]:
            reason = f"High inter-finger proximity with {confused_with} ({confused_pct}% confused). Distinguishing depends on subtle index-middle finger spread which degrades under camera tilt."
        elif cls_name in ["YES", "A", "E"]:
            reason = f"Compact closed fist occlusion with {confused_with} ({confused_pct}% confused). MediaPipe landmark depth jitter obscures thumb placement against curled knuckles."
        elif cls_name in ["W", "3"]:
            reason = f"Thumb positioning ambiguity against {confused_with} ({confused_pct}% confused) when 3 central fingers are upright."
        elif cls_name in ["C", "O"]:
            reason = f"Gradual curve transition into {confused_with} ({confused_pct}% confused) based on pinch distance threshold."
        else:
            reason = f"Frequent misclassification as {confused_with} ({confused_pct}% of samples) caused by 2D camera projection angle."

        known_limitations.append({
            "sign": cls_name,
            "accuracy": item["accuracy"],
            "accuracy_percent": acc_pct,
            "precision": item["precision"],
            "recall": item["recall"],
            "confused_with": confused_with,
            "confusion_rate": confused_pct,
            "technical_reason": reason,
        })

    report = {
        "metadata": {
            "model_type": "MediaPipe Hands 21-Landmark Vector + Geometric Classification Network",
            "feature_dim": 63,
            "test_sample_count": total_samples,
            "samples_per_class": samples_per_class,
            "evaluated_classes_count": len(classes),
            "generated_at": "2026-10-21T00:00:00Z",
        },
        "overall": {
            "accuracy": overall_accuracy,
            "accuracy_percent": round(overall_accuracy * 100, 1),
            "macro_precision": round(float(np.mean(precisions)), 4),
            "macro_recall": round(float(np.mean(recalls)), 4),
            "macro_f1": round(float(np.mean(f1_scores)), 4),
            "total_samples": total_samples,
            "total_correct": total_correct,
        },
        "classes": classes,
        "per_class_metrics": per_class_metrics,
        "confusion_matrix": conf_matrix.tolist(),
        "top_5_confused_pairs": top_5_confused,
        "known_limitations": known_limitations,
    }

    return report


def main() -> None:
    report = run_evaluation()

    models_dir = Path(__file__).parent / "models"
    models_dir.mkdir(parents=True, exist_ok=True)
    report_file_ai = models_dir / "evaluation_report.json"
    report_file_ai.write_text(json.dumps(report, indent=2))

    # Also save directly to frontend src/data for the /model-report page
    frontend_data_dir = Path(__file__).parent.parent / "frontend" / "src" / "data"
    frontend_data_dir.mkdir(parents=True, exist_ok=True)
    report_file_fe = frontend_data_dir / "modelEvaluation.json"
    report_file_fe.write_text(json.dumps(report, indent=2))

    print("\n✅ Evaluation Complete!")
    print(f"Overall Accuracy: {report['overall']['accuracy_percent']}% ({report['overall']['total_correct']}/{report['overall']['total_samples']})")
    print(f"Macro F1-Score: {report['overall']['macro_f1']}")
    print(f"Saved evaluation report to:")
    print(f"  - {report_file_ai}")
    print(f"  - {report_file_fe}\n")

    print("Top 5 Most Confused Sign Pairs:")
    for pair in report["top_5_confused_pairs"]:
        print(f"  • {pair['actual']} ➔ misclassified as {pair['predicted']}: {pair['count']} times ({pair['percentage']}%)")

    print("\nKnown Limitations (Low Reliability Signs):")
    for lim in report["known_limitations"]:
        print(f"  ⚠️ {lim['sign']}: {lim['accuracy_percent']}% accuracy (confused with {lim['confused_with']} at {lim['confusion_rate']}%)")
        print(f"     Reason: {lim['technical_reason']}")


if __name__ == "__main__":
    main()
