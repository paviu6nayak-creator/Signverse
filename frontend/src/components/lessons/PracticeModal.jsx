import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  Hand as HandIcon,
  RotateCcw,
  Sparkles,
  Volume2,
  X,
  Clock,
  ThumbsUp,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

import { useHandDetection } from "../../hooks/useHandDetection";
import { useTextToSpeech } from "../../hooks/useTextToSpeech";
import { useCamera } from "../../hooks/useCamera";
import api, { getErrorMessage } from "../../utils/api";
import { Spinner } from "../common/PageLoader";
import GestureAnimation from "./GestureAnimation";
import Hand from "../common/Hand";
import {
  measureHandPosture,
  compareHandPosture,
  resolveTargetHandshape,
} from "../../utils/handPostureComparator";
import { SIGN_GUIDES } from "../../data/signGuides";
import { findPracticeItem } from "../../data/practiceContent";
import { findLesson } from "../../data/lessons";
import { recordAdaptiveAttempt } from "../../utils/adaptiveLearningEngine";

const REQUIRED_CONFIDENCE = 80; // Minimum 80% confidence required to qualify
const HOLD_DURATION_MS = 1000; // Hold match for 1.0s to pass
const SMOOTHING_BUFFER_SIZE = 6; // Moving window of recent frames

export default function PracticeModal({ lesson, onClose, onSuccess }) {
  const { videoRef, status, errorMessage, start, isVideoMetadataLoaded } = useCamera();
  const { handDetected, handLandmarks } = useHandDetection(videoRef, {
    enabled: status === "active" && isVideoMetadataLoaded,
  });
  const { speak } = useTextToSpeech();

  const [isCorrect, setIsCorrect] = useState(false);
  const [hasLogged, setHasLogged] = useState(false);
  const [matchScore, setMatchScore] = useState(0); // 0 to 100
  const [feedbackMessage, setFeedbackMessage] = useState("Show your hand to the camera");
  const [fingerStatus, setFingerStatus] = useState({
    thumb: "neutral",
    index: "neutral",
    middle: "neutral",
    ring: "neutral",
    pinky: "neutral",
  });
  const [holdProgress, setHoldProgress] = useState(0); // 0.0 to 1.0
  const [isHolding, setIsHolding] = useState(false);

  const sessionStart = useRef(Date.now());
  const holdStartRef = useRef(null);
  const frameBufferRef = useRef([]);

  const normalizedKey = (lesson.sign_label || lesson.title || "").toLowerCase().replace(/\s+/g, "_");
  const guide = SIGN_GUIDES[normalizedKey];

  // Canonical ASL target handshape specification
  const targetHandshape = useMemo(() => resolveTargetHandshape(lesson), [lesson]);

  // Real-time anatomical landmark comparison with frame smoothing and 1.0s hold timer
  useEffect(() => {
    if (status !== "active" || isCorrect) return;

    // When no hand is detected in camera frame
    if (!handDetected || !handLandmarks || handLandmarks.length < 21) {
      frameBufferRef.current = [];
      holdStartRef.current = null;
      setHoldProgress(0);
      setIsHolding(false);
      setMatchScore(0);
      setFeedbackMessage("Show your hand clearly to the webcam");
      setFingerStatus({
        thumb: "neutral",
        index: "neutral",
        middle: "neutral",
        ring: "neutral",
        pinky: "neutral",
      });
      return;
    }

    // 1. Measure 3D joint angles, finger states, and palm normal
    const measured = measureHandPosture(handLandmarks);
    const comparison = compareHandPosture(measured, targetHandshape);

    // 2. Push to recent frames buffer for temporal smoothing
    const buffer = frameBufferRef.current;
    buffer.push(comparison);
    if (buffer.length > SMOOTHING_BUFFER_SIZE) {
      buffer.shift();
    }

    // 3. Compute smoothed confidence score (moving average of recent frames)
    const avgScore = Math.round(
      buffer.reduce((acc, item) => acc + item.overallScore, 0) / buffer.length
    );
    setMatchScore(avgScore);

    // 4. Compute smoothed per-finger correctness by majority vote
    const fingers = ["thumb", "index", "middle", "ring", "pinky"];
    const smoothedFingers = {};
    for (const f of fingers) {
      let correctVotes = 0;
      for (const item of buffer) {
        if (item.fingerStatus?.[f] === "correct") correctVotes++;
      }
      smoothedFingers[f] =
        correctVotes >= Math.ceil(buffer.length / 2) ? "correct" : "incorrect";
    }
    setFingerStatus(smoothedFingers);

    // 5. Evaluate pass threshold (>= 80% confidence or matching canonical shape)
    const isQualifyingMatch = avgScore >= REQUIRED_CONFIDENCE || comparison.isMatch;

    if (isQualifyingMatch) {
      const now = Date.now();
      if (!holdStartRef.current) {
        holdStartRef.current = now;
      }
      const elapsed = now - holdStartRef.current;
      const progress = Math.min(1.0, elapsed / HOLD_DURATION_MS);
      setHoldProgress(progress);
      setIsHolding(true);

      const remainingSec = Math.max(0, (HOLD_DURATION_MS - elapsed) / 1000).toFixed(1);
      if (elapsed >= HOLD_DURATION_MS) {
        setFeedbackMessage(`Perfect match! Held for 1.0s (${avgScore}%)!`);
        setIsCorrect(true);
        setHoldProgress(1.0);
      } else {
        setFeedbackMessage(`Great posture! Hold steady for ${remainingSec}s...`);
      }
    } else {
      // Reset hold timer if hand falls below threshold
      holdStartRef.current = null;
      setHoldProgress(0);
      setIsHolding(false);
      setFeedbackMessage(comparison.primaryFeedback);
    }
  }, [status, isCorrect, handDetected, handLandmarks, targetHandshape, lesson]);

  // Log successful attempt to backend database and adaptive learning engine
  useEffect(() => {
    if (!isCorrect || hasLogged) return;
    setHasLogged(true);
    const durationSeconds = Math.max(1, Math.round((Date.now() - sessionStart.current) / 1000));

    // Update adaptive learning engine in localStorage
    recordAdaptiveAttempt(lesson.id, true);

    api
      .post("/lessons/practice/attempt", {
        lesson_id: lesson.id,
        predicted_label: targetHandshape?.label || lesson.sign_label || lesson.title,
        confidence: matchScore / 100 || 0.95,
        is_correct: true,
        duration_seconds: durationSeconds,
      })
      .then(() => {
        toast.success(`Verified! You signed "${lesson.title}" correctly.`);
        onSuccess?.();
      })
      .catch((err) => toast.error(getErrorMessage(err)));
  }, [isCorrect, hasLogged, lesson, targetHandshape, matchScore, onSuccess]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] flex items-center justify-center bg-void/85 p-3 backdrop-blur-md sm:p-5"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="glass-card flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden p-5 sm:p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="mb-4 flex items-center justify-between border-b border-ink/10 pb-3">
            <div className="flex items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-xl font-bold text-ink">Practice: {lesson.title}</h3>
                  <span className="rounded-full bg-signal/15 px-2.5 py-0.5 text-xs font-semibold text-signal">
                    Target: {targetHandshape?.label || lesson.title}
                  </span>
                </div>
                <p className="text-xs text-ink-muted">
                  Form the gesture and hold the match for 1.0 second. Red fingers need adjustment; green fingers are correct.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => speak(lesson.title)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink/5 text-ink-muted transition hover:bg-ink/10 hover:text-ink"
                title="Pronounce sign name"
              >
                <Volume2 size={18} />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink/5 text-ink-muted transition hover:bg-ink/10 hover:text-ink"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Side-by-Side Content Grid */}
          <div className="grid flex-1 grid-cols-1 gap-5 overflow-y-auto pr-1 md:grid-cols-2">
            {/* Left Column: Reference Gesture Demonstration */}
            <div className="flex flex-col rounded-2xl border border-ink/10 bg-ink/[0.03] p-4">
              <div className="mb-2.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-signal">
                  <Sparkles size={14} />
                  Reference Gesture Guide
                </span>
                <span className="rounded-full bg-ink/10 px-2 py-0.5 text-[11px] font-medium text-ink-muted">
                  {targetHandshape?.label || guide?.handshape || "Target Handshape"}
                </span>
              </div>

              {/* Reference Animated Gesture Guide */}
              {(() => {
                const unifiedItem =
                  findLesson(lesson.id || lesson.sign_label || lesson.title || lesson.label) ||
                  findPracticeItem(lesson.sign_label || lesson.title);
                const stepsToDisplay = lesson.steps || unifiedItem?.steps || guide?.steps || [
                  "Handshape: Form the target ASL posture carefully.",
                  "Orientation: Hold hand steady facing toward your webcam.",
                  "Location: Maintain clear visibility in frame until verified.",
                ];
                const tipToDisplay =
                  lesson.tip ||
                  unifiedItem?.tip ||
                  "Ensure good lighting and keep your entire hand clearly visible inside the camera frame.";
                const displayTitle = lesson.label || lesson.title || unifiedItem?.label || "Sign";
                const specToUse = lesson.animationSpec || unifiedItem?.animationSpec;
                const motionTagToUse = lesson.motionTag || unifiedItem?.motionTag;

                return (
                  <div className="flex flex-col gap-3">
                    <GestureAnimation
                      spec={specToUse}
                      tokens={lesson.tokens || unifiedItem?.tokens}
                      steps={stepsToDisplay}
                      label={displayTitle}
                      motionTag={motionTagToUse}
                      compact={false}
                      className="w-full"
                    />

                    <div className="text-[11px] text-ink-faint">
                      💡 <span className="font-medium text-ink-muted">Tip:</span> {tipToDisplay}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Right Column: Live Camera, Hand Overlay, Feedback & Confidence */}
            <div className="flex flex-col">
              <div className="mb-2.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      status === "active" ? "bg-signal animate-pulse" : "bg-ink-faint"
                    }`}
                  />
                  Live Camera Feed
                </span>
                <span className="font-mono text-xs text-ink-muted">
                  Pass: ≥ 80% · 1.0s Hold
                </span>
              </div>

              {/* Video Container with Overlaid Dynamic Hand Model */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-black shadow-lg">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="h-full w-full -scale-x-100 object-cover"
                />

                {/* Idle state before user click */}
                {status === "idle" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-void/80 p-6 text-center">
                    <p className="max-w-xs text-xs text-ink-muted">Click to enable camera for practice.</p>
                    <button onClick={start} className="btn-primary !py-2 text-xs">
                      Start Camera
                    </button>
                  </div>
                )}

                {/* Connecting Spinner */}
                {status === "requesting" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-void/70 text-center">
                    <Spinner size={32} className="text-ink" />
                    <p className="text-xs text-ink-muted">Connecting to webcam...</p>
                  </div>
                )}

                {/* Camera Error / Permission Fallback */}
                {(status === "denied" || status === "error") && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-void/90 p-6 text-center">
                    <AlertCircle className="text-danger" size={32} />
                    <p className="max-w-xs text-xs font-medium text-ink">{errorMessage}</p>
                    <p className="max-w-xs text-[11px] text-ink-muted">
                      Click the lock icon in the address bar and set Camera to Allow.
                    </p>
                    <button onClick={start} className="btn-secondary !py-2 text-xs">
                      <RotateCcw size={14} />
                      Retry Camera Access
                    </button>
                  </div>
                )}

                {/* Real-time Hand Tracking Tag */}
                {status === "active" && !isCorrect && (
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-void/80 px-3 py-1 text-xs backdrop-blur-md">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        handDetected ? "bg-signal" : "bg-amber-400 animate-pulse"
                      }`}
                    />
                    <span className="font-medium text-ink">
                      {handDetected ? "Hand Tracked" : "No Hand in Frame"}
                    </span>
                  </div>
                )}

                {/* Target Hand Overlay with Live Red/Green Correctness Highlights */}
                {status === "active" && !isCorrect && (
                  <div className="absolute top-3 right-3 flex flex-col items-center rounded-xl bg-void/85 p-2 backdrop-blur-md border border-white/10 shadow-lg pointer-events-none">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-sky-300 mb-1">
                      Target Overlay
                    </div>
                    <div className="relative">
                      <Hand
                        spec={targetHandshape}
                        size={88}
                        fingerStatus={fingerStatus}
                      />
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-[9px] text-ink-muted">
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Right
                      </span>
                      <span className="flex items-center gap-1 text-rose-400 font-semibold">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-rose-400" />
                        Wrong
                      </span>
                    </div>
                  </div>
                )}

                {/* Hold Timer Ring / Progress on Camera View */}
                {status === "active" && isHolding && !isCorrect && (
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl bg-void/90 px-3 py-2 text-xs backdrop-blur-md border border-signal/40">
                    <div className="flex items-center gap-2 text-signal-light font-medium">
                      <Clock size={15} className="animate-spin text-signal" />
                      <span>Holding: {(holdProgress * 1.0).toFixed(1)}s / 1.0s</span>
                    </div>
                    <div className="h-2 w-32 overflow-hidden rounded-full bg-ink/20">
                      <div
                        className="h-full bg-signal transition-all duration-100 shadow-[0_0_8px_#10b981]"
                        style={{ width: `${Math.round(holdProgress * 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Success Verification Overlay */}
                {isCorrect && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 bg-signal/25 backdrop-blur-md text-center p-4"
                  >
                    <CheckCircle2 size={54} className="text-signal drop-shadow-md" />
                    <p className="font-display text-2xl font-bold text-ink">Correct!</p>
                    <p className="text-xs font-semibold text-signal-light">
                      Gesture match verified: {matchScore}% confidence (Held for 1.0s)
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Status, Feedback Banner, and Confidence Bar */}
              <div className="mt-3.5 space-y-2.5">
                {/* Specific Actionable Feedback Banner */}
                {!isCorrect && (
                  <div
                    className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-medium transition-colors ${
                      !handDetected
                        ? "bg-amber-500/15 border border-amber-500/30 text-amber-300"
                        : matchScore >= REQUIRED_CONFIDENCE
                        ? "bg-signal/20 border border-signal/40 text-signal-light shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                        : "bg-sky-500/15 border border-sky-500/30 text-sky-200"
                    }`}
                  >
                    {!handDetected ? (
                      <HandIcon size={16} className="shrink-0 text-amber-400" />
                    ) : matchScore >= REQUIRED_CONFIDENCE ? (
                      <ThumbsUp size={16} className="shrink-0 text-signal animate-bounce" />
                    ) : (
                      <Sparkles size={16} className="shrink-0 text-sky-400" />
                    )}
                    <span className="flex-1 font-medium">{feedbackMessage}</span>
                    {handDetected && (
                      <span className="font-mono text-[11px] text-ink-muted">
                        {matchScore}% match
                      </span>
                    )}
                  </div>
                )}

                {/* Real-time Confidence Bar with 80% Threshold Marker */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-ink-muted">Gesture Match Confidence</span>
                    <span
                      className={`font-mono font-bold ${
                        matchScore >= REQUIRED_CONFIDENCE
                          ? "text-signal"
                          : matchScore >= 40
                          ? "text-sky-400"
                          : "text-ink-faint"
                      }`}
                    >
                      {matchScore}% / 80% needed
                    </span>
                  </div>

                  <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-ink/10">
                    {/* 80% Pass Threshold Line */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-white/40 z-10"
                      style={{ left: "80%" }}
                      title="80% required to pass"
                    />

                    {/* Live Progress Bar */}
                    <div
                      className={`h-full transition-all duration-200 ${
                        matchScore >= REQUIRED_CONFIDENCE
                          ? "bg-signal shadow-[0_0_12px_#10b981]"
                          : matchScore >= 40
                          ? "bg-amber-400"
                          : "bg-rose-500/70"
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, matchScore))}%` }}
                    />
                  </div>
                </div>

                {/* 1-Second Hold Timer Bar */}
                {!isCorrect && handDetected && (
                  <div className="space-y-1 pt-0.5">
                    <div className="flex justify-between text-[11px] font-medium text-ink-muted">
                      <span>1-Second Hold Verification</span>
                      <span className="font-mono">
                        {isHolding ? `${(holdProgress * 1.0).toFixed(1)}s / 1.0s` : "0.0s / 1.0s"}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
                      <div
                        className="h-full bg-signal transition-all duration-100"
                        style={{ width: `${Math.round(holdProgress * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="mt-4 flex items-center justify-end gap-3 border-t border-ink/10 pt-3">
            <button type="button" onClick={onClose} className="btn-secondary !py-2.5 text-sm">
              {isCorrect ? "Close" : "Cancel"}
            </button>
            {isCorrect && (
              <button type="button" onClick={onClose} className="btn-primary !py-2.5 text-sm">
                Continue to Next Lesson
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
