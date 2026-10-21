"""
Text-to-speech wrapper for the local/offline AI pipeline (realtime_detection.py).

Uses pyttsx3, which runs fully offline (no API key, no network call) and
wraps the OS's native TTS engine (SAPI5 on Windows, NSSpeechSynthesizer on
macOS, espeak on Linux).

Note: the web app itself uses the browser's built-in Web Speech API for
text-to-speech (see frontend/src/hooks/useTextToSpeech.js) so no server
round-trip is needed there. This module is for the standalone desktop/AI
pipeline and dataset-testing tools only.
"""
from __future__ import annotations

import pyttsx3

_engine: pyttsx3.Engine | None = None


def _get_engine() -> pyttsx3.Engine:
    global _engine
    if _engine is None:
        _engine = pyttsx3.init()
        _engine.setProperty("rate", 165)
        _engine.setProperty("volume", 1.0)
    return _engine


def speak(text: str) -> None:
    """Speak the given text synchronously (blocks until finished)."""
    if not text.strip():
        return
    engine = _get_engine()
    engine.say(text)
    engine.runAndWait()


def list_voices() -> list[str]:
    """Return the display names of TTS voices available on this machine."""
    engine = _get_engine()
    return [voice.name for voice in engine.getProperty("voices")]


def set_voice(name_substring: str) -> bool:
    """Select a voice whose name contains `name_substring` (case-insensitive). Returns True if found."""
    engine = _get_engine()
    for voice in engine.getProperty("voices"):
        if name_substring.lower() in voice.name.lower():
            engine.setProperty("voice", voice.id)
            return True
    return False


if __name__ == "__main__":
    print("Available voices:", list_voices())
    speak("Hello! This is SignVerse speaking.")
