import { motion } from "framer-motion";
import {
  Clock,
  PlayCircle,
  PuzzleIcon,
  Timer,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { EmptyState } from "../components/common/Card";
import { InlineLoader } from "../components/common/PageLoader";
import QuizQuestionCard from "../components/quiz/QuizQuestionCard";
import QuizResultsView from "../components/quiz/QuizResultsView";
import { useAuth } from "../context/AuthContext";
import { useLessons } from "../hooks/useLessons";
import {
  QUIZ_DEFINITIONS,
  generateQuizInstance,
  getQuizHistory,
  saveQuizResult,
} from "../data/quizCatalog";

const DIFFICULTY_LABELS = {
  all: "All Levels",
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

/**
 * QuizList Component
 * Displays quiz cards with level tags, 30s/question dynamic time, best score badges, and empty/loading states
 */
function QuizList({ onSelectQuiz, isLoading = false }) {
  const [levelFilter, setLevelFilter] = useState("all");
  const history = useMemo(() => getQuizHistory(), []);

  // Filter quizzes by selected level
  const filteredQuizzes = useMemo(() => {
    if (levelFilter === "all") return QUIZ_DEFINITIONS;
    return QUIZ_DEFINITIONS.filter(
      (q) => q.level === levelFilter || (q.level === "all" && levelFilter !== "all")
    );
  }, [levelFilter]);

  if (isLoading) {
    return <InlineLoader label="Loading quizzes and curriculum question pools..." />;
  }

  return (
    <div className="space-y-6">
      {/* Level Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 pb-4">
        <div className="flex flex-wrap gap-2">
          {["all", "beginner", "intermediate", "advanced"].map((lvl) => {
            const count =
              lvl === "all"
                ? QUIZ_DEFINITIONS.length
                : QUIZ_DEFINITIONS.filter((q) => q.level === lvl || q.level === "all").length;
            const isActive = levelFilter === lvl;

            return (
              <button
                key={lvl}
                type="button"
                onClick={() => setLevelFilter(lvl)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold capitalize transition-all ${
                  isActive
                    ? "bg-signal text-void shadow-md scale-105"
                    : "bg-ink/5 text-ink-muted hover:bg-ink/10 hover:text-ink"
                }`}
              >
                <span>{DIFFICULTY_LABELS[lvl]}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                    isActive ? "bg-void/25 text-void" : "bg-ink/10 text-ink-faint"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <span className="text-xs text-ink-muted">
          Showing <strong className="text-ink">{filteredQuizzes.length} quizzes</strong>
        </span>
      </div>

      {/* Empty State when filter yields 0 quizzes */}
      {filteredQuizzes.length === 0 ? (
        <EmptyState
          icon={PuzzleIcon}
          title="No quizzes match this filter"
          description="Try selecting a different level tab above to view available quizzes."
          action={
            <button onClick={() => setLevelFilter("all")} className="btn-primary">
              View All Quizzes
            </button>
          }
        />
      ) : (
        /* Grid of Quizzes */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredQuizzes.map((quizDef) => {
            const userHistory = history[quizDef.id] || history[quizDef.aliases?.[0]];
            
            // Strictly 30 seconds per question calculation
            const totalSeconds = quizDef.questionCount * 30;
            const estimatedMinutes = Math.round((totalSeconds / 60) * 10) / 10;

            let badgeColor = "text-ink-muted bg-ink/10";
            if (userHistory?.badge === "gold") badgeColor = "text-amber-300 bg-amber-500/20 border border-amber-500/40";
            else if (userHistory?.badge === "silver") badgeColor = "text-slate-200 bg-slate-400/20 border border-slate-400/40";
            else if (userHistory?.badge === "bronze") badgeColor = "text-amber-600 bg-amber-700/20 border border-amber-700/40";

            let levelClass = "bg-sky-500/15 text-sky-400 border border-sky-500/30";
            if (quizDef.level === "intermediate") levelClass = "bg-amber-500/15 text-amber-400 border border-amber-500/30";
            if (quizDef.level === "advanced") levelClass = "bg-purple-500/15 text-purple-400 border border-purple-500/30";
            if (quizDef.level === "all") levelClass = "bg-signal/15 text-signal border border-signal/30";

            return (
              <div
                key={quizDef.id}
                className="glass-card glass-card-hover group relative flex flex-col p-6 transition-all duration-300"
              >
                {/* Top Icons & Badges */}
                <div className="flex items-start justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-signal/15 text-signal shadow-sm">
                    <PuzzleIcon size={20} />
                  </span>

                  <div className="flex flex-col items-end gap-1">
                    <span className={`rounded-md px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider ${levelClass}`}>
                      {quizDef.level}
                    </span>
                    {userHistory?.bestScore != null ? (
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-bold ${badgeColor}`}>
                        🏆 Best: {userHistory.bestScore}%
                      </span>
                    ) : (
                      <span className="text-[10px] text-ink-faint font-medium">Not taken yet</span>
                    )}
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="mt-4 font-display text-lg font-bold text-ink group-hover:text-signal transition-colors">
                  {quizDef.title}
                </h3>
                <p className="mt-1.5 flex-1 text-xs text-ink-muted leading-relaxed">
                  {quizDef.description}
                </p>

                {/* Quiz Metadata: Question count & Time (30 sec/question) */}
                <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-3 text-xs text-ink-faint">
                  <span className="flex items-center gap-1 font-semibold text-ink-muted">
                    <Timer size={13} className="text-signal" />
                    {estimatedMinutes} min ({30}s/q)
                  </span>
                  <span className="font-mono text-ink-muted">{quizDef.questionCount} questions</span>
                  {userHistory?.attempts > 0 && (
                    <span className="text-[11px] text-signal font-semibold">
                      {userHistory.attempts} {userHistory.attempts === 1 ? "attempt" : "attempts"}
                    </span>
                  )}
                </div>

                {/* Action button */}
                <button
                  type="button"
                  onClick={() => onSelectQuiz(quizDef.id)}
                  className="btn-primary mt-5 w-full !py-2.5 text-xs font-semibold shadow-md shadow-signal/20 transition hover:scale-[1.02]"
                >
                  <PlayCircle size={15} />
                  {userHistory?.attempts > 0 ? "Retake Quiz" : "Start Quiz"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * Interactive Quiz Runner
 * Manages question progression, Check -> Continue feedback loop, timer, and keyboard shortcuts
 */
function InteractiveQuizRunner({ quizId, overrideQuestions = null, onFinish, onExit }) {
  const [quizInstance] = useState(() => {
    const full = generateQuizInstance(quizId);
    if (overrideQuestions && overrideQuestions.length > 0) {
      return {
        ...full,
        questions: overrideQuestions,
        totalQuestions: overrideQuestions.length,
      };
    }
    return full;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [missedQuestions, setMissedQuestions] = useState([]);
  const [startTime] = useState(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Timer loop
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const currentQuestion = quizInstance.questions[currentIndex];
  const isLastQuestion = currentIndex === quizInstance.questions.length - 1;
  const progressPercent = ((currentIndex + (isChecked ? 1 : 0)) / quizInstance.totalQuestions) * 100;
  const isCurrentCorrect = selectedAnswer === currentQuestion?.correctAnswer;

  // Handle "Check" validation
  const handleCheck = useCallback(() => {
    if (!selectedAnswer || isChecked) return;
    setIsChecked(true);

    if (isCurrentCorrect) {
      setScore((prev) => prev + 1);
    } else {
      setMissedQuestions((prev) => [
        ...prev,
        {
          ...currentQuestion,
          userSelectedAnswer: selectedAnswer,
        },
      ]);
    }
  }, [selectedAnswer, isChecked, isCurrentCorrect, currentQuestion]);

  // Handle "Continue" / next question
  const handleContinue = useCallback(() => {
    if (!isChecked) return;

    if (isLastQuestion) {
      const totalTime = Math.floor((Date.now() - startTime) / 1000);
      const xpEarned = Math.round((score / quizInstance.totalQuestions) * 50) + 10;

      saveQuizResult({
        quizId: quizInstance.id,
        score,
        totalQuestions: quizInstance.totalQuestions,
        xpEarned,
        timeTakenSeconds: totalTime,
        missedQuestionIds: missedQuestions.map((q) => q.id),
      });

      onFinish({
        quiz: quizInstance,
        score,
        totalQuestions: quizInstance.totalQuestions,
        timeTakenSeconds: totalTime,
        xpEarned,
        missedQuestions,
      });
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsChecked(false);
    }
  }, [isChecked, isLastQuestion, score, startTime, quizInstance, missedQuestions, onFinish]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        if (!isChecked && selectedAnswer) {
          handleCheck();
        } else if (isChecked) {
          handleContinue();
        }
      } else if (!isChecked && currentQuestion) {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= (currentQuestion.options?.length || 0)) {
          setSelectedAnswer(currentQuestion.options[num - 1]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isChecked, selectedAnswer, handleCheck, handleContinue, currentQuestion]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Top Header & Progress */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onExit}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink/5 text-ink-muted transition hover:bg-ink/10 hover:text-ink"
          aria-label="Exit quiz"
        >
          <X size={18} />
        </button>

        <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-ink/10">
          <motion.div
            className="h-full rounded-full bg-signal-gradient shadow-sm"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1 text-ink-muted">
            <Clock size={13} />
            {Math.floor(elapsedSeconds / 60)}:
            {String(elapsedSeconds % 60).padStart(2, "0")}
          </span>
          <span className="font-semibold text-signal">
            {currentIndex + 1} / {quizInstance.totalQuestions}
          </span>
        </div>
      </div>

      {/* Main Question Card with MotionGuide */}
      {currentQuestion && (
        <QuizQuestionCard
          question={currentQuestion}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={setSelectedAnswer}
          isChecked={isChecked}
          isCorrect={isCurrentCorrect}
        />
      )}

      {/* Bottom Sticky Action Bar */}
      <div className="flex items-center justify-between border-t border-ink/10 pt-4">
        <span className="text-[11px] text-ink-faint">
          {!isChecked
            ? "Press 1–4 to pick an option, Enter to check"
            : "Press Enter to continue"}
        </span>

        {!isChecked ? (
          <button
            type="button"
            disabled={!selectedAnswer}
            onClick={handleCheck}
            className={`btn-primary !px-8 !py-2.5 text-xs font-semibold ${
              !selectedAnswer ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Check Answer
          </button>
        ) : (
          <button
            type="button"
            onClick={handleContinue}
            className="btn-primary !px-8 !py-2.5 text-xs font-semibold shadow-lg shadow-signal/25"
          >
            {isLastQuestion ? "View Results" : "Continue"}
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Main QuizSection View
 */
export default function QuizSection() {
  const { isAuthenticated } = useAuth();
  const { isLoading } = useLessons();
  const [view, setView] = useState("list"); // list | runner | results
  const [activeQuizId, setActiveQuizId] = useState(null);
  const [overrideQuestions, setOverrideQuestions] = useState(null);
  const [resultData, setResultData] = useState(null);

  const handleStartQuiz = (quizId, questionsToUse = null) => {
    setActiveQuizId(quizId);
    setOverrideQuestions(questionsToUse);
    setView("runner");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Quiz Catalog Header */}
      {view === "list" && (
        <>
          <div className="mb-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-signal-gradient text-void shadow-md shadow-signal/20">
              <PuzzleIcon size={22} />
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold text-ink sm:text-4xl">
              ASL Mastery Quizzes
            </h1>
            <p className="mt-1.5 max-w-2xl text-ink-muted">
              Put your fingerspelling, core vocabulary, and conversational comprehension to the test with MotionGuide animations and immediate feedback.
            </p>
          </div>

          {!isAuthenticated && (
            <div className="glass-card mb-6 flex flex-wrap items-center justify-between gap-3 p-4">
              <p className="text-xs text-ink-muted">
                💡 <strong className="text-ink">Guest Mode:</strong> Your quiz scores, badges, and times are saved locally on this device. Sign in anytime to sync to the cloud.
              </p>
              <Link to="/login" className="btn-secondary !py-1.5 text-xs">
                Sign in
              </Link>
            </div>
          )}

          <QuizList
            isLoading={isLoading}
            onSelectQuiz={(quizId) => handleStartQuiz(quizId)}
          />
        </>
      )}

      {/* Interactive Quiz Runner */}
      {view === "runner" && (
        <InteractiveQuizRunner
          quizId={activeQuizId}
          overrideQuestions={overrideQuestions}
          onFinish={(result) => {
            setResultData(result);
            setView("results");
          }}
          onExit={() => setView("list")}
        />
      )}

      {/* Comprehensive Results Screen */}
      {view === "results" && resultData && (
        <QuizResultsView
          quiz={resultData.quiz}
          score={resultData.score}
          totalQuestions={resultData.totalQuestions}
          timeTakenSeconds={resultData.timeTakenSeconds}
          xpEarned={resultData.xpEarned}
          missedQuestions={resultData.missedQuestions}
          onRetryFull={() => handleStartQuiz(resultData.quiz.id)}
          onRetryMissed={() => handleStartQuiz(resultData.quiz.id, resultData.missedQuestions)}
          onBackToList={() => {
            setResultData(null);
            setView("list");
          }}
        />
      )}
    </div>
  );
}
