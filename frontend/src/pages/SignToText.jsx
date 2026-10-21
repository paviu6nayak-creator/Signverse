import { AlertCircle, Copy, Delete, Plus, RotateCcw, Space, Type, Video, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Spinner } from "../components/common/PageLoader";
import { useHandDetection } from "../hooks/useHandDetection";
import { useTextToSpeech } from "../hooks/useTextToSpeech";
import { useCamera } from "../hooks/useCamera";
import api from "../utils/api";

const CAPTURE_INTERVAL_MS = 250;

export default function SignToText() {
  const { videoRef, status, errorMessage, start } = useCamera();
  const { handDetected, normalizedVector } = useHandDetection(videoRef, { enabled: status === "active" });
  const { speak } = useTextToSpeech();

  const [liveLabel, setLiveLabel] = useState(null);
  const [liveConfidence, setLiveConfidence] = useState(0);
  const [text, setText] = useState("");

  useEffect(() => {
    if (status !== "active") return;
    const interval = setInterval(async () => {
      if (!normalizedVector) {
        setLiveLabel(null);
        return;
      }
      try {
        const { data } = await api.post("/translate/predict", { landmarks: normalizedVector, face_detected: false });
        setLiveLabel(data.label);
        setLiveConfidence(data.confidence);
      } catch {
        // skip tick
      }
    }, CAPTURE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [status, normalizedVector]);

  const addLetter = () => {
    if (!liveLabel) return;
    setText((prev) => prev + (liveLabel.length > 1 ? ` ${liveLabel} ` : liveLabel));
  };
  const addSpace = () => setText((prev) => `${prev} `);
  const backspace = () => setText((prev) => prev.slice(0, -1));
  const clear = () => setText("");

  const handleCopy = async () => {
    if (!text.trim()) return;
    await navigator.clipboard.writeText(text.trim());
    toast.success("Copied to clipboard");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-signal-gradient text-void">
          <Type size={22} />
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold text-ink">Sign to Text</h1>
        <p className="mt-1.5 max-w-xl text-ink-muted">
          Hold a sign, then tap "Add" to spell out a message one sign at a time — ideal for precise typing.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="glass-card overflow-hidden p-2">
          <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
            <video ref={videoRef} autoPlay muted playsInline className="h-full w-full -scale-x-100 object-cover" />

            {status === "idle" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-void/85 p-6 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-signal/10 text-signal">
                  <Video size={24} />
                </span>
                <p className="max-w-xs text-sm text-ink-muted">
                  Click to start your camera for Sign to Text.
                </p>
                <button onClick={start} className="btn-primary text-sm">
                  Start Camera
                </button>
              </div>
            )}

            {status === "requesting" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-void/60 text-center">
                <Spinner size={28} className="text-ink" />
                <p className="text-xs text-ink-muted">Connecting to camera...</p>
              </div>
            )}
            {(status === "denied" || status === "error") && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-void/85 p-6 text-center">
                <AlertCircle className="text-danger" size={28} />
                <p className="text-sm font-medium text-ink">{errorMessage}</p>
                <p className="max-w-xs text-xs text-ink-muted">
                  Click the lock icon in the address bar and set Camera to Allow.
                </p>
                <button onClick={start} className="btn-secondary text-sm">
                  <RotateCcw size={15} />
                  Retry Camera Access
                </button>
              </div>
            )}
            {status === "active" && (
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl bg-void/70 px-4 py-2.5 backdrop-blur-md">
                <span className="flex items-center gap-1.5 text-xs font-medium text-ink">
                  <span className={`h-1.5 w-1.5 rounded-full ${handDetected ? "bg-signal" : "bg-ink-faint"}`} />
                  {handDetected ? "Hand detected" : "Show your hand"}
                </span>
                {liveLabel && (
                  <span className="font-mono text-sm text-signal">
                    {liveLabel} · {Math.round(liveConfidence * 100)}%
                  </span>
                )}
              </div>
            )}
          </div>

          <button onClick={addLetter} disabled={!liveLabel} className="btn-primary mt-3 w-full">
            <Plus size={16} />
            Add "{liveLabel || "..."}" to text
          </button>
        </div>

        <div className="glass-card flex flex-col p-6">
          <h3 className="font-display font-semibold text-ink">Your message</h3>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            className="input-field mt-3 flex-1 resize-none font-mono"
            placeholder="Add signs, or type directly here..."
          />
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <button onClick={addSpace} className="btn-secondary !py-2.5 text-sm">
              <Space size={15} />
              Space
            </button>
            <button onClick={backspace} className="btn-secondary !py-2.5 text-sm">
              <Delete size={15} />
              Delete
            </button>
            <button onClick={() => speak(text)} disabled={!text.trim()} className="btn-secondary !py-2.5 text-sm">
              <Volume2 size={15} />
              Speak
            </button>
            <button onClick={handleCopy} disabled={!text.trim()} className="btn-secondary !py-2.5 text-sm">
              <Copy size={15} />
              Copy
            </button>
          </div>
          <button onClick={clear} className="btn-ghost mt-2 text-sm">
            Clear message
          </button>
        </div>
      </div>
    </div>
  );
}
