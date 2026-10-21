// frontend/src/pages/LiveCameraTranslation.jsx
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  AlertTriangle,
  Bug,
  Check,
  Delete,
  History,
  RotateCcw,
  Save,
  Space,
  Sparkles,
  Video,
  VideoOff,
  Volume2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import { Spinner } from "../components/common/PageLoader";
import { useAuth } from "../context/AuthContext";
import { useCamera } from "../hooks/useCamera";
import { useHandDetection } from "../hooks/useHandDetection";
import { useSentenceBuilder } from "../hooks/useSentenceBuilder";
import { useTextToSpeech } from "../hooks/useTextToSpeech";
import api from "../utils/api";
import { classifyHandGesture, SUPPORTED_VOCABULARY } from "../utils/signClassifier";

const CONFIDENCE_THRESHOLD = 0.70;
const TRANSLATION_STORAGE_KEY = "signverse_translation_history";

const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20],
  [0, 17],
];

function LandmarkOverlay({ videoRef, landmarks, isOutOfFrame }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!landmarks) return;

    const toCanvasCoords = (point) => [(1 - point.x) * canvas.width, point.y * canvas.height];

    // Hand bone connections
    ctx.strokeStyle = isOutOfFrame ? "#F59E0B" : "#2DD4BF";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";

    HAND_CONNECTIONS.forEach(([from, to]) => {
      const [x1, y1] = toCanvasCoords(landmarks[from]);
      const [x2, y2] = toCanvasCoords(landmarks[to]);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    });

    // Landmark joints
    landmarks.forEach((point, index) => {
      const [x, y] = toCanvasCoords(point);
      ctx.beginPath();
      ctx.arc(x, y, index === 0 ? 6 : 4, 0, 2 * Math.PI);
      ctx.fillStyle = index === 0 ? "#8B5CF6" : isOutOfFrame ? "#F59E0B" : "#2DD4BF";
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "#0A0F1E";
      ctx.stroke();
    });
  }, [landmarks, videoRef, isOutOfFrame]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />;
}

export default function LiveCameraTranslation() {
  const { isAuthenticated } = useAuth();
  const {
    videoRef,
    status,
    errorMessage,
    errorDetails,
    permissionState,
    isDarkOrCovered,
    start,
    stop,
  } = useCamera();

  const {
    handDetected,
    handLandmarks,
    normalizedVector,
    isOutOfFrame,
    fps,
  } = useHandDetection(videoRef, { enabled: status === "active" });

  const {
    sentence,
    tokens,
    suggestion,
    push,
    addSpace,
    backspace,
    clear,
    applySuggestion,
    slidingWindow,
  } = useSentenceBuilder();

  const { speak, isSpeaking } = useTextToSpeech();

  const [livePrediction, setLivePrediction] = useState(null);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [savedHistory, setSavedHistory] = useState(() => {
    try {
      const stored = localStorage.getItem(TRANSLATION_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const lastSpokenWordRef = useRef("");

  /**
   * Real-time classification loop
   * Evaluates hand landmarks with verified client-side classifier,
   * with server synchronization when online.
   */
  useEffect(() => {
    if (status !== "active" || !handDetected || !handLandmarks) {
      setLivePrediction(null);
      return;
    }

    // 1. Instant client-side classification
    const classification = classifyHandGesture(handLandmarks, CONFIDENCE_THRESHOLD);
    setLivePrediction(classification);

    // 2. Feed into stabilization window
    if (classification.isConfident && classification.label) {
      push(classification.label, classification.confidence, CONFIDENCE_THRESHOLD);
    } else {
      push(null, 0, CONFIDENCE_THRESHOLD);
    }

    // 3. Optional background server sync if vector exists and online
    if (normalizedVector) {
      api.post("/translate/predict", { landmarks: normalizedVector, face_detected: false }).catch(() => {
        // Safe silent fallback to client-side classifier
      });
    }
  }, [status, handDetected, handLandmarks, normalizedVector, push]);

  /**
   * Auto-speak newly completed sentences or words
   */
  useEffect(() => {
    if (autoSpeak && sentence && sentence !== lastSpokenWordRef.current) {
      lastSpokenWordRef.current = sentence;
      speak(sentence);
    }
  }, [sentence, autoSpeak, speak]);

  /**
   * Save translated sentence to history (both localStorage and API if authenticated)
   */
  const handleSave = async () => {
    if (!sentence.trim()) return;

    const historyEntry = {
      id: Date.now().toString(),
      sentence: sentence.trim(),
      tokens: [...tokens],
      timestamp: new Date().toISOString(),
    };

    setIsSaving(true);

    try {
      // 1. Always save locally so history is never lost
      const nextHistory = [historyEntry, ...savedHistory].slice(0, 30);
      setSavedHistory(nextHistory);
      try {
        localStorage.setItem(TRANSLATION_STORAGE_KEY, JSON.stringify(nextHistory));
      } catch (e) {
        console.debug("Failed saving translation to localStorage:", e);
      }

      // 2. If authenticated, sync with backend database
      if (isAuthenticated) {
        await api.post("/translate/log-sentence", {
          sentence: sentence.trim(),
          signs_used: tokens,
          duration_seconds: 0,
        });
      }

      toast.success("Saved to your translation history");
    } catch (err) {
      console.warn("Backend save failed, saved locally:", err);
      toast.success("Saved to local translation history");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-signal-gradient text-void shadow-md">
              <Video size={22} />
            </span>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">Live Camera Translation</h1>
              <p className="text-xs sm:text-sm text-ink-muted">
                Real-time sign recognition with continuous sentence building and stabilization.
              </p>
            </div>
          </div>
        </div>

        {/* Action badges */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowDebug((prev) => !prev)}
            className={`btn-secondary !py-1.5 !px-3 text-xs ${showDebug ? "border-signal text-signal" : ""}`}
            title="Toggle Developer Debug Panel"
          >
            <Bug size={14} />
            {showDebug ? "Hide Debug" : "Debug Mode"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* VIDEO FEED CONTAINER */}
        <div className="lg:col-span-2">
          <div className="glass-card overflow-hidden p-2 relative shadow-xl">
            <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="h-full w-full -scale-x-100 object-cover"
              />

              {/* Hand Landmark Canvas Overlay */}
              <div className="-scale-x-100 pointer-events-none">
                <LandmarkOverlay
                  videoRef={videoRef}
                  landmarks={handLandmarks}
                  isOutOfFrame={isOutOfFrame}
                />
              </div>

              {/* STATE: IDLE */}
              {status === "idle" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3.5 bg-void/90 p-6 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-signal/15 text-signal border border-signal/20 shadow-inner">
                    <Video size={28} />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-bold text-ink">Camera Ready</h3>
                    <p className="mt-1 max-w-xs text-xs text-ink-muted">
                      Click below to activate your webcam and start real-time ASL translation.
                    </p>
                  </div>
                  <button onClick={start} className="btn-primary text-sm px-6 py-2.5">
                    Start Camera
                  </button>
                  {permissionState === "denied" && (
                    <span className="text-[11px] text-rose-400">
                      Camera permission is currently blocked in your browser.
                    </span>
                  )}
                </div>
              )}

              {/* STATE: REQUESTING */}
              {status === "requesting" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 bg-void/80 text-center">
                  <Spinner size={36} className="text-signal" />
                  <p className="text-xs font-medium text-ink">Requesting camera access...</p>
                  <p className="text-[11px] text-ink-muted">Please accept the browser prompt if shown.</p>
                </div>
              )}

              {/* STATE: DENIED OR ERROR */}
              {(status === "denied" || status === "error") && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-void/95 p-6 text-center">
                  <AlertCircle className="text-danger" size={36} />
                  <div className="max-w-md space-y-1">
                    <p className="text-sm font-bold text-ink">
                      {errorDetails?.title || "Camera Access Error"}
                    </p>
                    <p className="text-xs text-ink-muted leading-relaxed">
                      {errorMessage || errorDetails?.message}
                    </p>
                    {errorDetails?.fix && (
                      <div className="mt-2 rounded-lg bg-ink/5 p-2.5 text-[11px] text-ink-muted text-left border border-ink/10">
                        <strong className="text-signal font-semibold">How to fix: </strong>
                        {errorDetails.fix}
                      </div>
                    )}
                  </div>
                  <button onClick={start} className="btn-secondary text-sm mt-1">
                    <RotateCcw size={15} />
                    Retry Camera Access
                  </button>
                </div>
              )}

              {/* STATE: ACTIVE STREAM */}
              {status === "active" && (
                <>
                  {/* Top Left: Tracking Pill */}
                  <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-void/75 px-3 py-1.5 text-xs font-medium text-ink backdrop-blur-md border border-ink/10 shadow-md">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        handDetected ? "animate-pulse-dot bg-signal" : "bg-ink-faint"
                      }`}
                    />
                    <span>{handDetected ? "Tracking Hand" : "Show your hand"}</span>
                  </div>

                  {/* Top Center Warnings: Low Light or Out of Frame */}
                  <div className="absolute left-1/2 top-3 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none">
                    {isDarkOrCovered && (
                      <span className="flex items-center gap-1.5 rounded-full bg-amber-500/90 px-3 py-1 text-[11px] font-semibold text-void backdrop-blur-md shadow-lg animate-bounce">
                        <AlertTriangle size={13} />
                        Camera looks covered or dark
                      </span>
                    )}
                    {isOutOfFrame && (
                      <span className="flex items-center gap-1.5 rounded-full bg-amber-500/80 px-3 py-1 text-[11px] font-semibold text-void backdrop-blur-md shadow-md">
                        <AlertTriangle size={13} />
                        Hand partially out of frame
                      </span>
                    )}
                  </div>

                  {/* Top Right: Stop Button */}
                  <button
                    onClick={stop}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-void/75 text-ink backdrop-blur-md hover:bg-danger/80 transition-colors border border-ink/10"
                    aria-label="Stop camera"
                    title="Stop camera"
                  >
                    <VideoOff size={16} />
                  </button>

                  {/* Bottom: Live Sign Detection Preview */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl bg-void/80 px-4 py-2.5 backdrop-blur-md border border-ink/10 shadow-lg">
                    <div className="flex items-center gap-3">
                      {livePrediction?.isConfident ? (
                        <>
                          <span className="font-mono text-xl font-bold text-signal">
                            {livePrediction.label}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-24 overflow-hidden rounded-full bg-ink/20">
                              <div
                                className="h-full bg-signal transition-all duration-150"
                                style={{ width: `${Math.round(livePrediction.confidence * 100)}%` }}
                              />
                            </div>
                            <span className="font-mono text-xs text-ink-muted">
                              {Math.round(livePrediction.confidence * 100)}%
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-ink-muted">
                          <span className="h-2 w-2 rounded-full bg-ink/30" />
                          <span>
                            {handDetected ? "Not sure, keep signing" : "Position hand clearly in frame"}
                          </span>
                          {livePrediction?.confidence > 0 && (
                            <span className="font-mono text-[11px] text-ink-faint">
                              ({Math.round(livePrediction.confidence * 100)}%)
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <span className="hidden sm:inline text-[11px] text-ink-faint font-mono">
                      Window: 12 frames
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* DEV DEBUG PANEL */}
          {showDebug && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 rounded-xl border border-signal/20 bg-void/80 p-4 text-xs font-mono backdrop-blur-md space-y-2.5 shadow-lg"
            >
              <div className="flex items-center justify-between border-b border-ink/10 pb-2">
                <span className="font-bold text-signal flex items-center gap-1.5">
                  <Bug size={14} /> Pipeline Diagnostics (Dev Mode)
                </span>
                <span className="text-[11px] text-ink-muted">FPS: {fps || 0}</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-ink-muted">
                <div>
                  <span className="text-ink-faint">Camera Status:</span>{" "}
                  <span className="text-ink font-semibold">{status}</span>
                </div>
                <div>
                  <span className="text-ink-faint">Permission State:</span>{" "}
                  <span className="text-ink font-semibold">{permissionState}</span>
                </div>
                <div>
                  <span className="text-ink-faint">Hand Detected:</span>{" "}
                  <span className={handDetected ? "text-emerald-400 font-bold" : "text-ink-faint"}>
                    {handDetected ? "YES" : "NO"}
                  </span>
                </div>
                <div>
                  <span className="text-ink-faint">Feed Luminance:</span>{" "}
                  <span className={isDarkOrCovered ? "text-rose-400 font-bold" : "text-emerald-400"}>
                    {isDarkOrCovered ? "DARK / COVERED" : "NORMAL"}
                  </span>
                </div>
                <div>
                  <span className="text-ink-faint">Raw Prediction:</span>{" "}
                  <span className="text-signal font-bold">{livePrediction?.label || "None"}</span>
                </div>
                <div>
                  <span className="text-ink-faint">Confidence:</span>{" "}
                  <span className="text-ink">
                    {livePrediction ? `${Math.round(livePrediction.confidence * 100)}%` : "0%"}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-ink-faint">Sliding Window Buffer:</span>{" "}
                  <span className="text-ink">
                    [{slidingWindow.join(", ") || "empty"}]
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-ink-faint">Verified Signs Count:</span>{" "}
                  <span className="text-ink">{SUPPORTED_VOCABULARY.length} classes verified</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* TRANSLATION & SENTENCE BUILDING CONTAINER */}
        <div className="glass-card flex flex-col p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-ink">Translated Text</h3>
            <span className="badge text-[11px] font-mono text-signal">Sentence Builder</span>
          </div>

          {/* Sentence Display Box */}
          <div className="mt-3 min-h-[140px] flex-1 rounded-xl bg-ink/5 p-4 font-mono text-lg text-ink border border-ink/5 relative flex flex-col justify-between">
            <div>
              {sentence ? (
                <span className="text-ink font-semibold tracking-wide leading-relaxed">
                  {sentence}
                </span>
              ) : (
                <span className="text-ink-faint text-sm select-none">
                  Signs will be recognized, stabilized, and assembled here automatically...
                </span>
              )}
            </div>

            {/* Token count indicator */}
            {tokens.length > 0 && (
              <div className="mt-4 flex items-center justify-between text-xs text-ink-muted border-t border-ink/5 pt-2">
                <span>{tokens.length} signs recognized</span>
                <span className="font-mono text-[11px]">Threshold: 70%</span>
              </div>
            )}
          </div>

          {/* Autocorrect Suggestion Banner */}
          <AnimatePresence>
            {suggestion && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mt-3 flex items-center justify-between rounded-xl border border-signal/30 bg-signal/10 px-3.5 py-2 text-xs text-signal"
              >
                <div className="flex items-center gap-1.5">
                  <Sparkles size={14} className="shrink-0" />
                  <span>
                    Suggested: <strong>"{suggestion}"</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={applySuggestion}
                  className="flex items-center gap-1 rounded-md bg-signal px-2 py-0.5 text-[11px] font-bold text-void hover:bg-signal/90 transition-colors"
                >
                  <Check size={12} />
                  Apply
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sentence Action Controls */}
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <button
              onClick={addSpace}
              disabled={!sentence}
              className="btn-secondary !py-2 text-xs flex items-center justify-center gap-1.5"
              title="Add word break"
            >
              <Space size={14} />
              Space
            </button>
            <button
              onClick={backspace}
              disabled={tokens.length === 0}
              className="btn-secondary !py-2 text-xs flex items-center justify-center gap-1.5"
              title="Undo last sign"
            >
              <Delete size={14} />
              Undo
            </button>
            <button
              onClick={clear}
              disabled={tokens.length === 0}
              className="btn-secondary !py-2 text-xs flex items-center justify-center gap-1.5"
              title="Clear text"
            >
              <RotateCcw size={14} />
              Clear
            </button>
            <button
              onClick={() => speak(sentence)}
              disabled={!sentence || isSpeaking}
              className="btn-secondary !py-2 text-xs flex items-center justify-center gap-1.5"
              title="Speak sentence"
            >
              <Volume2 size={14} />
              Speak
            </button>
          </div>

          {/* Auto-speak toggle */}
          <label className="mt-4 flex items-center justify-between rounded-xl bg-ink/5 px-4 py-2.5 text-xs text-ink-muted border border-ink/5 cursor-pointer hover:bg-ink/10 transition-colors">
            <span>Auto-speak completed text</span>
            <input
              type="checkbox"
              checked={autoSpeak}
              onChange={(e) => setAutoSpeak(e.target.checked)}
              className="h-4 w-4 accent-signal rounded cursor-pointer"
            />
          </label>

          {/* Save to history */}
          <button
            onClick={handleSave}
            disabled={!sentence || isSaving}
            className="btn-primary mt-4 flex items-center justify-center gap-2 !py-2.5 text-sm"
          >
            {isSaving ? <Spinner size={16} /> : <Save size={16} />}
            Save to History
          </button>

          {/* Saved History Drawer */}
          {savedHistory.length > 0 && (
            <div className="mt-5 border-t border-ink/10 pt-4">
              <div className="flex items-center justify-between text-xs font-semibold text-ink-muted mb-2">
                <span className="flex items-center gap-1.5">
                  <History size={13} /> Recent Translations
                </span>
                <span className="text-[11px] text-ink-faint">{savedHistory.length} saved</span>
              </div>
              <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                {savedHistory.slice(0, 5).map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between rounded-lg bg-ink/5 px-3 py-2 text-xs border border-ink/5"
                  >
                    <span className="font-mono text-ink truncate max-w-[180px]">
                      {entry.sentence}
                    </span>
                    <span className="text-[10px] text-ink-faint font-mono shrink-0">
                      {new Date(entry.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
