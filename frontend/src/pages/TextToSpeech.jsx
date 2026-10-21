import { Square, Volume2 } from "lucide-react";
import { useState } from "react";

import { useTextToSpeech } from "../hooks/useTextToSpeech";

const QUICK_PHRASES = ["Hello, nice to meet you", "Thank you very much", "Can you help me?", "I am learning sign language", "Have a great day"];

export default function TextToSpeech() {
  const { speak, stop, isSpeaking, voices, isSupported } = useTextToSpeech();
  const [text, setText] = useState("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [voiceName, setVoiceName] = useState("");

  const handleSpeak = () => speak(text, { rate, pitch, voiceName: voiceName || null });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-signal-gradient text-void">
          <Volume2 size={22} />
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold text-ink">Text to Speech</h1>
        <p className="mt-1.5 max-w-xl text-ink-muted">Type anything and hear it spoken aloud instantly — free and fully offline.</p>
      </div>

      {!isSupported && (
        <div className="glass-card mb-6 p-4 text-sm text-warm">
          Your browser doesn't support speech synthesis. Try the latest Chrome, Edge, or Safari.
        </div>
      )}

      <div className="glass-card p-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          maxLength={500}
          className="input-field resize-none font-mono"
          placeholder="Type something to hear it out loud..."
        />
        <div className="mt-1.5 text-right text-xs text-ink-faint">{text.length}/500</div>

        <div className="mt-4 flex flex-wrap gap-2">
          {QUICK_PHRASES.map((phrase) => (
            <button key={phrase} onClick={() => setText(phrase)} className="badge hover:border-signal/40 hover:text-ink">
              {phrase}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 flex justify-between text-sm text-ink-muted">
              <span>Speed</span>
              <span className="font-mono">{rate.toFixed(1)}x</span>
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full accent-signal"
            />
          </div>
          <div>
            <label className="mb-1.5 flex justify-between text-sm text-ink-muted">
              <span>Pitch</span>
              <span className="font-mono">{pitch.toFixed(1)}</span>
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={pitch}
              onChange={(e) => setPitch(Number(e.target.value))}
              className="w-full accent-signal"
            />
          </div>
        </div>

        {voices.length > 0 && (
          <div className="mt-5">
            <label className="mb-1.5 block text-sm text-ink-muted">Voice</label>
            <select value={voiceName} onChange={(e) => setVoiceName(e.target.value)} className="input-field">
              <option value="">Default</option>
              {voices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button onClick={handleSpeak} disabled={!text.trim() || isSpeaking || !isSupported} className="btn-primary flex-1">
            <Volume2 size={18} />
            {isSpeaking ? "Speaking..." : "Speak"}
          </button>
          <button onClick={stop} disabled={!isSpeaking} className="btn-secondary">
            <Square size={16} />
            Stop
          </button>
        </div>
      </div>
    </div>
  );
}
