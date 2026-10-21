import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Award,
  CheckCircle2,
  Flame,
  Heart,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Trophy,
  Video,
  Volume2,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Spinner } from "../common/PageLoader";
import GestureAnimation from "../lessons/GestureAnimation";
import Hand from "../common/Hand";
import {
  measureHandPosture,
  compareHandPosture,
  resolveTargetHandshape,
} from "../../utils/handPostureComparator";
import { useCamera } from "../../hooks/useCamera";
import { useHandDetection } from "../../hooks/useHandDetection";
import { useTextToSpeech } from "../../hooks/useTextToSpeech";
import {
  generateSpacedRepetitionSession,
  getLocalDateString,
  getPracticeProgress,
  getYesterdayDateString,
  recordDailyCompletedItem,
  recordItemPractice,
  savePracticeProgress,
} from "../../utils/dailyPracticeGenerator";

export default function PracticeSession({ level = "beginner", onExit, onCompleteSession }) {
  // Generate the 8-item session using spaced repetition
  const [exercises, setExercises] = useState(() => generateSpacedRepetitionSession(level));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [sessionXp, setSessionXp] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null); // { isCorrect: boolean, message: string }
  const [isCompleted, setIsCompleted] = useState(false);
  const [sessionResults, setSessionResults] = useState([]); // Array of { exercise, isCorrect }

  // Sequence ordering state (for "order_sequence" exercise)
  const [placedTokens, setPlacedTokens] = useState([]);
  const [availableTokens, setAvailableTokens] = useState([]);

  const [matchScore, setMatchScore] = useState(0);
  const [liveFeedbackMessage, setLiveFeedbackMessage] = useState("Show your hand clearly to the webcam");
  const [fingerStatus, setFingerStatus] = useState({
    thumb: "neutral",
    index: "neutral",
    middle: "neutral",
    ring: "neutral",
    pinky: "neutral",
  });
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);

  const holdStartRef = useRef(null);
  const frameBufferRef = useRef([]);

  // Shared single useCamera hook (no duplicated camera logic!)
  const {
    videoRef,
    status: cameraStatus,
    errorMessage: cameraError,
    errorDetails,
    start: startCamera,
    isVideoMetadataLoaded,
  } = useCamera();

  const { handDetected, handLandmarks } = useHandDetection(videoRef, {
    enabled: cameraStatus === "active" && isVideoMetadataLoaded,
  });

  const { speak } = useTextToSpeech();

  const currentExercise = exercises[currentIndex];
  const currentLesson = currentExercise?.lesson;
  const progressPercent = ((currentIndex) / Math.max(1, exercises.length)) * 100;

  // Canonical ASL target handshape specification
  const targetHandshape = useMemo(() => {
    return resolveTargetHandshape(currentLesson);
  }, [currentLesson]);

  // Initialize or reset exercise state when current index changes
  useEffect(() => {
    setSelectedOption(null);
    setFeedback(null);
    frameBufferRef.current = [];
    holdStartRef.current = null;
    setHoldProgress(0);
    setIsHolding(false);
    setMatchScore(0);
    setLiveFeedbackMessage("Show your hand clearly to the webcam");
    setFingerStatus({
      thumb: "neutral",
      index: "neutral",
      middle: "neutral",
      ring: "neutral",
      pinky: "neutral",
    });

    if (currentExercise?.type === "order_sequence") {
      setPlacedTokens([]);
      setAvailableTokens(currentExercise.scrambledTokens ? [...currentExercise.scrambledTokens] : []);
    }
  }, [currentIndex, currentExercise]);

  // Handle successful sign match (watch_and_copy)
  const handleSuccessTick = useCallback(() => {
    if (feedback) return;

    const gained = currentExercise.xpReward || 15;
    setSessionXp((prev) => prev + gained);
    recordItemPractice(currentLesson.id, true);
    setSessionResults((prev) => [...prev, { exercise: currentExercise, isCorrect: true }]);

    setFeedback({
      isCorrect: true,
      message: `Excellent! Sign matched with high accuracy! +${gained} XP`,
    });
  }, [feedback, currentExercise, currentLesson]);

  // Real-time camera hand posture comparison and 1.0s hold timer for "watch_and_copy"
  useEffect(() => {
    if (cameraStatus !== "active" || !currentLesson || feedback) return;
    if (currentExercise?.type !== "watch_and_copy") return;

    if (!handDetected || !handLandmarks || handLandmarks.length < 21) {
      frameBufferRef.current = [];
      holdStartRef.current = null;
      setHoldProgress(0);
      setIsHolding(false);
      setMatchScore(0);
      setLiveFeedbackMessage("Show your hand clearly to the webcam");
      setFingerStatus({
        thumb: "neutral",
        index: "neutral",
        middle: "neutral",
        ring: "neutral",
        pinky: "neutral",
      });
      return;
    }

    // 1. Measure joint angles, finger states, and palm orientation
    const measured = measureHandPosture(handLandmarks);
    const comparison = compareHandPosture(measured, targetHandshape);

    // 2. Sliding window of recent frames (smoothing)
    const buffer = frameBufferRef.current;
    buffer.push(comparison);
    if (buffer.length > 6) {
      buffer.shift();
    }

    // 3. Compute smoothed confidence score
    const avgScore = Math.round(
      buffer.reduce((acc, item) => acc + item.overallScore, 0) / buffer.length
    );
    setMatchScore(avgScore);

    // 4. Compute smoothed finger correctness
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

    // 5. Check if matching threshold (>= 80% confidence or matching canonical shape)
    const isQualifyingMatch = avgScore >= 80 || comparison.isMatch;

    if (isQualifyingMatch) {
      const now = Date.now();
      if (!holdStartRef.current) {
        holdStartRef.current = now;
      }
      const elapsed = now - holdStartRef.current;
      const progress = Math.min(1.0, elapsed / 1000);
      setHoldProgress(progress);
      setIsHolding(true);

      const remainingSec = Math.max(0, (1000 - elapsed) / 1000).toFixed(1);
      if (elapsed >= 1000) {
        setLiveFeedbackMessage(`Match verified! Held for 1.0s (${avgScore}%)!`);
        handleSuccessTick();
      } else {
        setLiveFeedbackMessage(`Great posture! Hold steady for ${remainingSec}s...`);
      }
    } else {
      holdStartRef.current = null;
      setHoldProgress(0);
      setIsHolding(false);
      setLiveFeedbackMessage(comparison.primaryFeedback);
    }
  }, [
    cameraStatus,
    handDetected,
    handLandmarks,
    currentLesson,
    currentExercise,
    feedback,
    targetHandshape,
    handleSuccessTick,
  ]);

  // Handle Multiple Choice selection (pick_correct_sign or which_word)
  const handleSelectOption = (option) => {
    if (feedback) return;
    setSelectedOption(option);

    let isCorrect = false;
    let correctDisplay = "";

    if (currentExercise.type === "pick_correct_sign") {
      // Option is a lesson object
      isCorrect = option.id === currentExercise.correctLessonId;
      correctDisplay = currentLesson.label;
    } else if (currentExercise.type === "which_word") {
      // Option is a label string
      isCorrect = option === currentExercise.correctAnswer;
      correctDisplay = currentExercise.correctAnswer;
    }

    if (isCorrect) {
      const gained = currentExercise.xpReward || 12;
      setSessionXp((prev) => prev + gained);
      recordItemPractice(currentLesson.id, true);
      setSessionResults((prev) => [...prev, { exercise: currentExercise, isCorrect: true }]);

      setFeedback({
        isCorrect: true,
        message: `Correct! You identified "${correctDisplay}". +${gained} XP`,
      });
    } else {
      setHearts((prev) => Math.max(0, prev - 1));
      recordItemPractice(currentLesson.id, false);
      setSessionResults((prev) => [...prev, { exercise: currentExercise, isCorrect: false }]);

      setFeedback({
        isCorrect: false,
        message: `Not quite. The correct answer was "${correctDisplay}".`,
      });
    }
  };

  // Handle placing a token chip into order sequence
  const handlePlaceToken = (token) => {
    if (feedback) return;
    setPlacedTokens((prev) => [...prev, token]);
    setAvailableTokens((prev) => prev.filter((t) => t.id !== token.id));
  };

  // Handle removing a placed token back to available pool
  const handleRemovePlacedToken = (token) => {
    if (feedback) return;
    setPlacedTokens((prev) => prev.filter((t) => t.id !== token.id));
    setAvailableTokens((prev) => [...prev, token]);
  };

  // Reset ordering sequence
  const handleResetTokens = () => {
    if (feedback) return;
    setPlacedTokens([]);
    setAvailableTokens(currentExercise.scrambledTokens ? [...currentExercise.scrambledTokens] : []);
  };

  // Validate the sequence in "order_sequence"
  const handleCheckOrder = () => {
    if (feedback) return;
    const expected = currentExercise.expectedTokens || [];
    const isCorrect =
      placedTokens.length === expected.length &&
      placedTokens.every((tok, idx) => tok.label.toLowerCase() === expected[idx].label.toLowerCase());

    if (isCorrect) {
      const gained = currentExercise.xpReward || 18;
      setSessionXp((prev) => prev + gained);
      recordItemPractice(currentLesson.id, true);
      setSessionResults((prev) => [...prev, { exercise: currentExercise, isCorrect: true }]);

      setFeedback({
        isCorrect: true,
        message: `Perfect sequence! You signed "${currentLesson.label}" accurately! +${gained} XP`,
      });
    } else {
      setHearts((prev) => Math.max(0, prev - 1));
      recordItemPractice(currentLesson.id, false);
      setSessionResults((prev) => [...prev, { exercise: currentExercise, isCorrect: false }]);

      const expectedLabels = expected.map((t) => t.label).join(" → ");
      setFeedback({
        isCorrect: false,
        message: `Incorrect sequence. Expected order: ${expectedLabels}`,
      });
    }
  };

  // Advance to next exercise
  const handleNext = () => {
    setFeedback(null);
    setSelectedOption(null);

    if (currentIndex + 1 < exercises.length && hearts > 0) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleFinishSession();
    }
  };

  // Persist session completion to localStorage
  const handleFinishSession = () => {
    setIsCompleted(true);

    const bonusCompletionXp = 25;
    const totalAwardedXp = sessionXp + bonusCompletionXp;

    savePracticeProgress((prev) => {
      const today = getLocalDateString();
      const yesterday = getYesterdayDateString();

      // Consecutive streak calculation
      let newStreak = prev.streak || 1;
      if (prev.lastPracticeDate === yesterday) {
        newStreak = (prev.streak || 0) + 1;
      } else if (prev.lastPracticeDate !== today) {
        newStreak = 1; // missed day
      }

      // Unlock progression rules
      const unlocked = new Set(prev.unlockedLevels || ["beginner"]);
      if (level === "beginner") unlocked.add("intermediate");
      if (level === "intermediate") unlocked.add("advanced");

      // Record completed items
      const itemIds = new Set(prev.completedItemIds || []);
      exercises.forEach((ex) => {
        itemIds.add(ex.lesson.id);
        recordDailyCompletedItem(ex.lesson.id, today);
      });

      return {
        ...prev,
        xp: (prev.xp || 0) + totalAwardedXp,
        streak: newStreak,
        lastPracticeDate: today,
        sessionsCompleted: (prev.sessionsCompleted || 0) + 1,
        completedItemIds: Array.from(itemIds),
        unlockedLevels: Array.from(unlocked),
      };
    });

    if (onCompleteSession) {
      onCompleteSession({ xp: totalAwardedXp, level });
    }
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && feedback) {
        handleNext();
      } else if (!feedback && currentExercise?.type === "which_word") {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= (currentExercise.options?.length || 0)) {
          handleSelectOption(currentExercise.options[num - 1]);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  // =========================================================================
  // SESSION SUMMARY SCREEN
  // =========================================================================
  if (isCompleted) {
    const correctCount = sessionResults.filter((r) => r.isCorrect).length;
    const accuracy = Math.round((correctCount / Math.max(1, exercises.length)) * 100);
    const progress = getPracticeProgress();

    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="glass-card overflow-hidden p-6 sm:p-8"
        >
          {/* Header Trophy */}
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-signal/15 text-signal shadow-lg shadow-signal/25">
              <Trophy size={42} strokeWidth={2.3} />
            </div>
            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-signal/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-signal">
              <Sparkles size={14} /> Session Complete
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-ink">Great Work!</h2>
            <p className="mt-1 text-sm text-ink-muted">
              You finished today's spaced repetition session in the{" "}
              <span className="font-semibold capitalize text-signal">{level}</span> tier.
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-ink/10 bg-ink/[0.03] p-4 text-center">
              <span className="flex items-center justify-center gap-1 text-[11px] font-bold uppercase text-ink-muted">
                <Zap size={14} className="text-signal" /> XP Gained
              </span>
              <p className="mt-1.5 font-display text-2xl font-bold text-signal">+{sessionXp + 25}</p>
            </div>

            <div className="rounded-2xl border border-ink/10 bg-ink/[0.03] p-4 text-center">
              <span className="flex items-center justify-center gap-1 text-[11px] font-bold uppercase text-ink-muted">
                <Award size={14} className="text-pulse" /> Accuracy
              </span>
              <p className="mt-1.5 font-display text-2xl font-bold text-ink">{accuracy}%</p>
            </div>

            <div className="rounded-2xl border border-ink/10 bg-ink/[0.03] p-4 text-center">
              <span className="flex items-center justify-center gap-1 text-[11px] font-bold uppercase text-ink-muted">
                <Flame size={14} className="text-warm" /> Daily Streak
              </span>
              <p className="mt-1.5 font-display text-2xl font-bold text-warm">{progress.streak} Days</p>
            </div>

            <div className="rounded-2xl border border-ink/10 bg-ink/[0.03] p-4 text-center">
              <span className="flex items-center justify-center gap-1 text-[11px] font-bold uppercase text-ink-muted">
                <Heart size={14} className="text-danger" /> Hearts
              </span>
              <p className="mt-1.5 font-display text-2xl font-bold text-ink">{hearts}/3</p>
            </div>
          </div>

          {/* Session Breakdown List */}
          <div className="mt-8 border-t border-ink/10 pt-6">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-ink-muted">
              Exercise Breakdown ({correctCount}/{exercises.length} Correct)
            </h3>
            <div className="mt-3 space-y-2">
              {exercises.map((ex, idx) => {
                const res = sessionResults.find((r) => r.exercise.id === ex.id);
                const passed = res ? res.isCorrect : true;

                let tagBg = "bg-sky-500/15 text-sky-400";
                if (ex.categoryTag === "review") tagBg = "bg-amber-500/15 text-amber-400";
                if (ex.categoryTag === "challenge") tagBg = "bg-purple-500/15 text-purple-400";

                return (
                  <div
                    key={ex.id}
                    className="flex items-center justify-between rounded-xl border border-ink/10 bg-ink/[0.02] px-3.5 py-2.5 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-ink/10 font-mono font-bold text-ink-muted">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-ink">{ex.lesson.label}</span>
                      <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${tagBg}`}>
                        {ex.categoryTag}
                      </span>
                      <span className="text-ink-muted hidden sm:inline">({ex.type.replace(/_/g, " ")})</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {passed ? (
                        <span className="flex items-center gap-1 font-bold text-emerald-400">
                          <CheckCircle2 size={16} /> Passed
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 font-bold text-rose-400">
                          <AlertCircle size={16} /> Review
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => {
                setExercises(generateSpacedRepetitionSession(level));
                setCurrentIndex(0);
                setHearts(3);
                setSessionXp(0);
                setSessionResults([]);
                setIsCompleted(false);
                setFeedback(null);
              }}
              className="btn-secondary flex-1"
            >
              <RotateCcw size={16} /> Practice Next Session
            </button>
            <button onClick={onExit} className="btn-primary flex-1">
              Done & View Featured <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Exercise category tag badge styles
  let tagClass = "bg-sky-500/15 text-sky-400 border border-sky-500/30";
  if (currentExercise.categoryTag === "review") {
    tagClass = "bg-amber-500/15 text-amber-400 border border-amber-500/30";
  } else if (currentExercise.categoryTag === "challenge") {
    tagClass = "bg-purple-500/15 text-purple-400 border border-purple-500/30";
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col px-4 py-6 sm:px-6">
      {/* Top Session Progress Bar Header */}
      <div className="flex items-center gap-4 border-b border-ink/10 pb-4">
        <button
          onClick={onExit}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink/5 text-ink-muted transition hover:bg-ink/10 hover:text-ink"
          aria-label="Exit session"
        >
          <X size={18} />
        </button>

        {/* Duolingo style progress bar */}
        <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-ink/10">
          <motion.div
            className="h-full rounded-full bg-signal-gradient shadow-sm"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Hearts and Streak counter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs font-bold text-danger">
            <Heart size={16} fill="currentColor" />
            <span>{hearts}</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-warm">
            <Flame size={16} fill="currentColor" />
            <span>{getPracticeProgress().streak}</span>
          </div>
        </div>
      </div>

      {/* Main Exercise Area */}
      <div className="mt-6 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="badge text-[11px] font-semibold uppercase tracking-wider text-signal">
              Exercise {currentIndex + 1} of {exercises.length}
            </span>
            <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${tagClass}`}>
              {currentExercise.categoryTag}
            </span>
          </div>

          <button
            type="button"
            onClick={() => speak(currentLesson.label)}
            className="flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink"
          >
            <Volume2 size={14} /> Listen
          </button>
        </div>

        <h2 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">{currentExercise.title}</h2>
        <p className="mt-1 text-xs text-ink-muted">{currentExercise.subtitle}</p>

        {/* ================================================================= */}
        {/* EXERCISE TYPE 1: WATCH & COPY (Camera gesture matching)           */}
        {/* ================================================================= */}
        {currentExercise.type === "watch_and_copy" && (
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Left: Animated Gesture Guide with location beacons & sequence */}
            <div className="flex flex-col rounded-2xl border border-ink/10 bg-ink/[0.03] p-4">
              <span className="mb-2 text-xs font-bold uppercase tracking-wider text-signal">
                Reference Gesture Guide
              </span>

              <GestureAnimation
                spec={currentLesson.animationSpec}
                steps={currentLesson.steps}
                label={currentLesson.label}
                tokens={currentLesson.tokens}
                motionTag={currentLesson.motionTag}
                compact={false}
                className="w-full"
              />

              {currentLesson.tip && (
                <p className="mt-3 text-[11px] text-ink-faint">
                  💡 <span className="font-medium text-ink-muted">Tip:</span> {currentLesson.tip}
                </p>
              )}
            </div>

            {/* Right: Camera Verification Feed */}
            <div className="flex flex-col rounded-2xl border border-ink/10 bg-ink/[0.03] p-4">
              <span className="mb-2 text-xs font-bold uppercase tracking-wider text-ink">
                Your Live Camera Match
              </span>

              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-black shadow-inner">
                <video ref={videoRef} autoPlay muted playsInline className="h-full w-full -scale-x-100 object-cover" />

                {cameraStatus === "idle" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-void/85 p-6 text-center">
                    <Video className="text-signal" size={32} />
                    <p className="text-xs text-ink-muted">Click below to start webcam verification.</p>
                    <button onClick={startCamera} className="btn-primary !py-2 text-xs">
                      Start Camera
                    </button>
                  </div>
                )}

                {cameraStatus === "requesting" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-void/70 text-center">
                    <Spinner size={28} className="text-ink" />
                    <p className="text-xs text-ink-muted">Connecting to webcam...</p>
                  </div>
                )}

                {(cameraStatus === "denied" || cameraStatus === "error") && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-void/90 p-4 text-center">
                    <AlertCircle className="text-danger" size={24} />
                    <p className="text-xs font-medium text-ink">{cameraError}</p>
                    {errorDetails?.fix && <p className="text-[11px] text-ink-muted">{errorDetails.fix}</p>}
                    <button onClick={startCamera} className="btn-secondary !py-1 text-xs">
                      <RotateCcw size={14} /> Retry Camera Access
                    </button>
                  </div>
                )}

                {cameraStatus === "active" && (
                  <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full bg-void/75 px-2.5 py-1 text-[11px] text-ink backdrop-blur-md">
                    <span className={`h-1.5 w-1.5 rounded-full ${handDetected ? "bg-signal" : "bg-amber-400 animate-pulse"}`} />
                    {handDetected ? "Hand Tracked · Ready" : "Show hand in frame"}
                  </div>
                )}

                {/* Target Hand Overlay with Live Red/Green Correctness Highlights */}
                {cameraStatus === "active" && !feedback && (
                  <div className="absolute top-2.5 right-2.5 flex flex-col items-center rounded-xl bg-void/85 p-2 backdrop-blur-md border border-white/10 shadow-lg pointer-events-none">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-sky-300 mb-0.5">
                      Target Overlay
                    </div>
                    <Hand
                      spec={targetHandshape}
                      size={80}
                      fingerStatus={fingerStatus}
                    />
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

                {/* Hold Timer Banner on Camera Feed */}
                {cameraStatus === "active" && isHolding && !feedback && (
                  <div className="absolute bottom-10 left-3 right-3 flex items-center justify-between rounded-xl bg-void/90 px-3 py-1.5 text-xs backdrop-blur-md border border-signal/40">
                    <span className="text-signal-light font-medium flex items-center gap-1.5">
                      <Sparkles size={13} className="text-signal" />
                      Holding: {(holdProgress * 1.0).toFixed(1)}s / 1.0s
                    </span>
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-ink/20">
                      <div
                        className="h-full bg-signal transition-all duration-100 shadow-[0_0_8px_#10b981]"
                        style={{ width: `${Math.round(holdProgress * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Specific Actionable Feedback Banner */}
              <div className="mt-3 space-y-2">
                {!feedback && (
                  <div
                    className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                      !handDetected
                        ? "bg-amber-500/15 border border-amber-500/30 text-amber-300"
                        : matchScore >= 80
                        ? "bg-signal/20 border border-signal/40 text-signal-light"
                        : "bg-sky-500/15 border border-sky-500/30 text-sky-200"
                    }`}
                  >
                    <Sparkles size={15} className="shrink-0 text-sky-400" />
                    <span className="flex-1">{liveFeedbackMessage}</span>
                    {handDetected && (
                      <span className="font-mono text-[11px] text-ink-muted">
                        {matchScore}%
                      </span>
                    )}
                  </div>
                )}

                {/* Real-time Confidence Bar with 80% Threshold Marker */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-ink-muted">Match Confidence</span>
                    <span
                      className={`font-mono font-bold ${
                        matchScore >= 80
                          ? "text-signal"
                          : matchScore >= 40
                          ? "text-sky-400"
                          : "text-ink-faint"
                      }`}
                    >
                      {matchScore}% / 80% needed
                    </span>
                  </div>

                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-ink/10">
                    {/* 80% Pass Threshold Line */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-white/40 z-10"
                      style={{ left: "80%" }}
                      title="80% required to pass"
                    />
                    <div
                      className={`h-full transition-all duration-200 ${
                        matchScore >= 80
                          ? "bg-signal shadow-[0_0_10px_#10b981]"
                          : matchScore >= 40
                          ? "bg-amber-400"
                          : "bg-rose-500/70"
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, matchScore))}%` }}
                    />
                  </div>
                </div>

                {/* 1-Second Hold Timer Bar */}
                {!feedback && handDetected && (
                  <div className="space-y-0.5">
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

              {/* Confirm / Simulate button */}
              <div className="mt-3 flex items-center justify-between border-t border-ink/10 pt-2.5">
                <span className="text-[11px] text-ink-faint">Hold sign steady to match</span>
                <button
                  type="button"
                  onClick={handleSuccessTick}
                  className="rounded-lg bg-ink/5 px-2.5 py-1 text-xs font-medium text-ink-muted transition hover:bg-signal/15 hover:text-signal"
                >
                  ✓ Confirm / Simulate Match
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* EXERCISE TYPE 2: PICK THE CORRECT SIGN (4 animation cards)        */}
        {/* ================================================================= */}
        {currentExercise.type === "pick_correct_sign" && (
          <div className="mt-6 flex flex-col gap-4">
            <p className="text-xs font-semibold text-ink-muted">
              Select the gesture animation that matches <span className="text-signal font-bold">"{currentLesson.label}"</span>:
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {currentExercise.options?.map((optLesson, idx) => {
                const isSelected = selectedOption?.id === optLesson.id;
                const isCorrect = feedback && optLesson.id === currentExercise.correctLessonId;
                const isWrong = feedback && isSelected && !isCorrect;

                let cardStyle = "border-ink/10 bg-ink/[0.03] hover:border-signal/40 hover:bg-ink/[0.06]";
                if (isSelected) cardStyle = "border-signal bg-signal/10 shadow-md";
                if (isCorrect) cardStyle = "border-emerald-500 bg-emerald-500/15 shadow-emerald-500/20";
                if (isWrong) cardStyle = "border-rose-500 bg-rose-500/15";

                return (
                  <button
                    key={optLesson.id}
                    disabled={Boolean(feedback)}
                    onClick={() => handleSelectOption(optLesson)}
                    className={`group relative flex flex-col items-center rounded-2xl border p-4 text-center transition-all ${cardStyle}`}
                  >
                    <div className="absolute left-3 top-3 flex h-6 w-6 items-center justify-center rounded-md bg-ink/10 text-xs font-mono font-bold text-ink-muted">
                      {idx + 1}
                    </div>

                    <div className="h-44 w-full">
                      <GestureAnimation
                        spec={optLesson.animationSpec}
                        steps={optLesson.steps}
                        label={optLesson.label}
                        tokens={optLesson.tokens}
                        motionTag={optLesson.motionTag}
                        compact={true}
                        className="h-full w-full"
                      />
                    </div>

                    <div className="mt-2 flex w-full items-center justify-between border-t border-ink/10 pt-2 text-xs">
                      <span className="font-medium text-ink-muted group-hover:text-ink">
                        Option {String.fromCharCode(65 + idx)}
                      </span>
                      {isCorrect && <CheckCircle2 size={16} className="text-emerald-400" />}
                      {isWrong && <AlertCircle size={16} className="text-rose-400" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* EXERCISE TYPE 3: WHICH WORD IS THIS SIGN (1 animation -> 4 words) */}
        {/* ================================================================= */}
        {currentExercise.type === "which_word" && (
          <div className="mt-6 flex flex-col gap-6">
            <div className="mx-auto max-w-sm w-full rounded-2xl border border-ink/10 bg-ink/[0.03] p-4">
              <span className="mb-2 block text-center text-xs font-bold uppercase tracking-wider text-signal">
                Reference Sign Animation
              </span>
              <GestureAnimation
                spec={currentLesson.animationSpec}
                steps={currentLesson.steps}
                label="?"
                tokens={currentLesson.tokens}
                motionTag={currentLesson.motionTag}
                compact={false}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {currentExercise.options?.map((optionLabel, idx) => {
                const isSelected = selectedOption === optionLabel;
                const isCorrect = feedback && optionLabel === currentExercise.correctAnswer;
                const isWrong = feedback && isSelected && !feedback.isCorrect;

                let btnStyle = "border-ink/10 bg-ink/[0.03] text-ink hover:bg-ink/10";
                if (isSelected) btnStyle = "border-signal bg-signal/10 text-signal";
                if (isCorrect) btnStyle = "border-emerald-500 bg-emerald-500/20 text-emerald-400 font-bold";
                if (isWrong) btnStyle = "border-rose-500 bg-rose-500/20 text-rose-400";

                return (
                  <button
                    key={optionLabel}
                    disabled={Boolean(feedback)}
                    onClick={() => handleSelectOption(optionLabel)}
                    className={`flex items-center justify-between rounded-xl border p-4 text-left font-display text-base transition-all ${btnStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-ink/10 text-xs font-mono font-bold text-ink-muted">
                        {idx + 1}
                      </span>
                      <span>{optionLabel}</span>
                    </div>
                    {isCorrect && <CheckCircle2 size={18} className="text-emerald-400" />}
                    {isWrong && <AlertCircle size={18} className="text-rose-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* EXERCISE TYPE 4: ORDER THE DIGITS OR WORDS (Sequencing)           */}
        {/* ================================================================= */}
        {currentExercise.type === "order_sequence" && (
          <div className="mt-6 flex flex-col gap-6">
            {/* Visual reference guide */}
            <div className="mx-auto max-w-sm w-full rounded-2xl border border-ink/10 bg-ink/[0.03] p-3 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-signal">
                Target: "{currentLesson.label}"
              </span>
              <div className="mt-2 h-36 w-full">
                <GestureAnimation
                  spec={currentLesson.animationSpec}
                  steps={currentLesson.steps}
                  label={currentLesson.label}
                  tokens={currentLesson.tokens}
                  motionTag={currentLesson.motionTag}
                  compact={true}
                  className="h-full w-full"
                />
              </div>
            </div>

            {/* Target Slots: Placed tokens */}
            <div className="rounded-2xl border-2 border-dashed border-ink/20 bg-ink/[0.02] p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Your Ordered Sequence:
                </span>
                {placedTokens.length > 0 && !feedback && (
                  <button
                    onClick={handleResetTokens}
                    className="flex items-center gap-1 text-xs text-ink-muted hover:text-ink"
                  >
                    <RefreshCw size={12} /> Clear all
                  </button>
                )}
              </div>

              <div className="mt-3 flex min-h-[58px] flex-wrap items-center gap-2.5">
                {placedTokens.length === 0 ? (
                  <p className="text-xs text-ink-faint">
                    Tap tokens from the bank below in the correct sequence...
                  </p>
                ) : (
                  placedTokens.map((token, idx) => (
                    <motion.button
                      layout
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      key={token.id}
                      disabled={Boolean(feedback)}
                      onClick={() => handleRemovePlacedToken(token)}
                      className="group flex items-center gap-2 rounded-xl border border-signal/40 bg-signal/15 px-3.5 py-2 font-display text-sm font-bold text-signal shadow-sm transition hover:bg-rose-500/20 hover:border-rose-500/40 hover:text-rose-400"
                      title="Tap to remove"
                    >
                      <span className="text-[10px] text-ink-muted group-hover:text-rose-300">{idx + 1}.</span>
                      <span>{token.label}</span>
                      <X size={13} className="opacity-0 group-hover:opacity-100 transition" />
                    </motion.button>
                  ))
                )}
              </div>
            </div>

            {/* Available Tokens Bank */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                Available Tokens (Tap to place):
              </span>
              <div className="mt-2.5 flex min-h-[48px] flex-wrap items-center gap-2.5">
                {availableTokens.map((token) => (
                  <button
                    key={token.id}
                    disabled={Boolean(feedback)}
                    onClick={() => handlePlaceToken(token)}
                    className="flex items-center gap-2 rounded-xl border border-ink/15 bg-ink/5 px-4 py-2 font-display text-sm font-bold text-ink transition hover:border-signal hover:bg-signal/10 hover:text-signal hover:scale-105 active:scale-95"
                  >
                    <span>{token.label}</span>
                  </button>
                ))}
                {availableTokens.length === 0 && (
                  <span className="text-xs text-emerald-400">All tokens placed! Check your order below.</span>
                )}
              </div>
            </div>

            {/* Check Order Button */}
            {!feedback && (
              <div className="flex justify-end pt-2">
                <button
                  disabled={placedTokens.length === 0}
                  onClick={handleCheckOrder}
                  className="btn-primary !px-7 font-bold shadow-md disabled:opacity-50"
                >
                  Check Sequence Order
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* BOTTOM DUOLINGO-STYLE FEEDBACK BANNER                               */}
      {/* =================================================================== */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className={`fixed bottom-0 left-0 right-0 z-50 border-t p-4 backdrop-blur-lg sm:p-6 ${
              feedback.isCorrect
                ? "border-emerald-500/30 bg-emerald-950/90 text-emerald-100"
                : "border-rose-500/30 bg-rose-950/90 text-rose-100"
            }`}
          >
            <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {feedback.isCorrect ? (
                  <CheckCircle2 size={32} className="text-emerald-400" />
                ) : (
                  <AlertCircle size={32} className="text-rose-400" />
                )}
                <div>
                  <h3 className="font-display text-lg font-bold">
                    {feedback.isCorrect ? "Nicely Done!" : "Keep Practicing!"}
                  </h3>
                  <p className="text-xs text-ink-muted">{feedback.message}</p>
                </div>
              </div>

              <button
                autoFocus
                onClick={handleNext}
                className={`btn-primary !px-6 ${
                  feedback.isCorrect ? "!bg-emerald-500 !text-slate-950" : "!bg-rose-500 !text-slate-950"
                }`}
              >
                Continue <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
