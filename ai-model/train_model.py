"""
Trains the sign-recognition model on the dataset collected by
data_collection.py (dataset/landmarks.csv), and exports:
    models/signverse_model.h5   - the trained Keras model
    models/labels.json          - the ordered list of class labels
    models/training_report.json - accuracy/loss history + confusion summary

Usage:
    python train_model.py
    python train_model.py --epochs 100 --batch-size 32
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from tensorflow.keras import layers, models, regularizers

from utils import NUM_FEATURES

DATASET_FILE = Path(__file__).parent / "dataset" / "landmarks.csv"
MODELS_DIR = Path(__file__).parent / "models"


def build_model(num_classes: int) -> tf.keras.Model:
    """
    A compact dense network is sufficient here: the input is already a
    highly-informative 63-value hand-landmark vector (not raw pixels),
    so we don't need convolutional layers — just enough capacity to
    separate the sign classes with dropout/regularization to avoid
    overfitting on a relatively small, self-collected dataset.
    """
    model = models.Sequential(
        [
            layers.Input(shape=(NUM_FEATURES,)),
            layers.Dense(128, activation="relu", kernel_regularizer=regularizers.l2(1e-4)),
            layers.BatchNormalization(),
            layers.Dropout(0.3),
            layers.Dense(64, activation="relu", kernel_regularizer=regularizers.l2(1e-4)),
            layers.BatchNormalization(),
            layers.Dropout(0.3),
            layers.Dense(32, activation="relu"),
            layers.Dense(num_classes, activation="softmax"),
        ]
    )
    model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3), loss="sparse_categorical_crossentropy", metrics=["accuracy"])
    return model


def main() -> None:
    parser = argparse.ArgumentParser(description="Train the SignVerse sign-recognition model.")
    parser.add_argument("--epochs", type=int, default=80)
    parser.add_argument("--batch-size", type=int, default=32)
    parser.add_argument("--test-size", type=float, default=0.15)
    args = parser.parse_args()

    if not DATASET_FILE.exists():
        raise FileNotFoundError(
            f"No dataset found at {DATASET_FILE}. Run data_collection.py for each sign label first."
        )

    df = pd.read_csv(DATASET_FILE)
    if df["label"].nunique() < 2:
        raise ValueError("Need at least 2 distinct labels in the dataset to train a classifier.")

    feature_columns = [c for c in df.columns if c != "label"]
    X = df[feature_columns].values.astype(np.float32)

    label_encoder = LabelEncoder()
    y = label_encoder.fit_transform(df["label"].values)
    labels_ordered = list(label_encoder.classes_)

    X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=args.test_size, stratify=y, random_state=42)

    print(f"Training samples: {len(X_train)} | Validation samples: {len(X_val)} | Classes: {len(labels_ordered)}")

    model = build_model(num_classes=len(labels_ordered))
    model.summary()

    callbacks = [
        tf.keras.callbacks.EarlyStopping(monitor="val_accuracy", patience=12, restore_best_weights=True),
        tf.keras.callbacks.ReduceLROnPlateau(monitor="val_loss", factor=0.5, patience=6, min_lr=1e-6),
    ]

    history = model.fit(
        X_train,
        y_train,
        validation_data=(X_val, y_val),
        epochs=args.epochs,
        batch_size=args.batch_size,
        callbacks=callbacks,
        verbose=2,
    )

    val_predictions = np.argmax(model.predict(X_val), axis=1)
    report = classification_report(y_val, val_predictions, target_names=labels_ordered, output_dict=True, zero_division=0)

    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    model.save(MODELS_DIR / "signverse_model.h5")
    (MODELS_DIR / "labels.json").write_text(json.dumps(labels_ordered, indent=2))
    (MODELS_DIR / "training_report.json").write_text(
        json.dumps(
            {
                "final_train_accuracy": float(history.history["accuracy"][-1]),
                "final_val_accuracy": float(history.history["val_accuracy"][-1]),
                "epochs_run": len(history.history["accuracy"]),
                "classification_report": report,
            },
            indent=2,
        )
    )

    print(f"\nSaved model -> {MODELS_DIR / 'signverse_model.h5'}")
    print(f"Saved labels -> {MODELS_DIR / 'labels.json'}")
    print(f"Final validation accuracy: {history.history['val_accuracy'][-1]:.3f}")


if __name__ == "__main__":
    main()
