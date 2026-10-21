import { motion } from "framer-motion";
import { Award, BookOpen, CheckCircle2, Clock, RotateCcw, Sparkles, Trophy, XCircle } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * QuizResultsView Component
 * Renders score percentage, medal badges, XP earned, time taken,
 * and a list of missed questions with correct answers and explanations,
 * with actions for "Retry missed questions" and "Review lessons".
 */
export default function QuizResultsView({
  quiz,
  score,
  totalQuestions,
  timeTakenSeconds,
  xpEarned,
  missedQuestions = [],
  onRetryFull,
  onRetryMissed,
  onBackToList,
}) {
  const percentage = Math.round((score / Math.max(1, totalQuestions)) * 100);
  const isPassed = percentage >= 70;

  let medalName = "Needs Practice";
  let medalColor = "text-ink-muted bg-ink/10";
  if (percentage >= 90) {
    medalName = "Gold Mastery Badge";
    medalColor = "text-amber-300 bg-amber-500/20 border-amber-500/40";
  } else if (percentage >= 80) {
    medalName = "Silver Proficiency Badge";
    medalColor = "text-slate-200 bg-slate-400/20 border-slate-400/40";
  } else if (percentage >= 70) {
    medalName = "Bronze Achiever Badge";
    medalColor = "text-amber-600 bg-amber-700/20 border-amber-700/40";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-2xl space-y-8"
    >
      {/* Top Banner Card */}
      <div className="glass-card p-8 text-center">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-signal-gradient text-void shadow-lg shadow-signal/30">
          <Trophy size={36} />
        </span>

        <span className={`mt-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${medalColor}`}>
          <Sparkles size={13} /> {medalName}
        </span>

        <h2 className="mt-3 font-display text-4xl font-extrabold text-ink">
          {percentage}%
        </h2>

        <p className="mt-2 text-sm text-ink-muted">
          {score} of {totalQuestions} questions answered correctly on{" "}
          <strong className="text-ink">"{quiz.title}"</strong>
        </p>

        {isPassed ? (
          <p className="mt-1 text-xs font-semibold text-emerald-400">
            ✓ Quiz Passed! You met the 70% passing threshold.
          </p>
        ) : (
          <p className="mt-1 text-xs font-semibold text-amber-400">
            Passing mark is 70%. Review the missed questions below and try again!
          </p>
        )}

        {/* Stats Row */}
        <div className="mt-6 grid grid-cols-3 gap-3 border-t border-ink/10 pt-6">
          <div className="rounded-xl border border-ink/10 bg-ink/5 p-3">
            <span className="flex items-center justify-center gap-1 text-[11px] text-ink-muted">
              <Sparkles size={12} className="text-warm" /> XP Earned
            </span>
            <p className="mt-1 font-mono text-xl font-bold text-signal">+{xpEarned}</p>
          </div>
          <div className="rounded-xl border border-ink/10 bg-ink/5 p-3">
            <span className="flex items-center justify-center gap-1 text-[11px] text-ink-muted">
              <Clock size={12} /> Time Taken
            </span>
            <p className="mt-1 font-mono text-xl font-bold text-ink">
              {Math.floor(timeTakenSeconds / 60)}m {Math.round(timeTakenSeconds % 60)}s
            </p>
          </div>
          <div className="rounded-xl border border-ink/10 bg-ink/5 p-3">
            <span className="flex items-center justify-center gap-1 text-[11px] text-ink-muted">
              <Award size={12} /> Pass Standard
            </span>
            <p className="mt-1 font-mono text-xl font-bold text-ink">70%</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button onClick={onBackToList} className="btn-secondary flex-1">
            Back to Quiz Catalog
          </button>
          {missedQuestions.length > 0 && onRetryMissed && (
            <button onClick={onRetryMissed} className="btn-secondary flex-1 text-amber-300 hover:border-amber-400/50">
              <RotateCcw size={16} /> Retry Missed ({missedQuestions.length})
            </button>
          )}
          <button onClick={onRetryFull} className="btn-primary flex-1">
            <RotateCcw size={16} /> Retake Quiz
          </button>
        </div>
      </div>

      {/* Breakdown of Missed Questions */}
      {missedQuestions.length > 0 && (
        <div className="glass-card p-6">
          <div className="mb-4 flex items-center justify-between border-b border-ink/10 pb-3">
            <h3 className="font-display text-base font-bold text-ink">
              Review Missed Questions ({missedQuestions.length})
            </h3>
            <span className="text-xs text-ink-muted">
              Correct answers and explanations
            </span>
          </div>

          <div className="space-y-4">
            {missedQuestions.map((q, idx) => (
              <div key={q.id || idx} className="rounded-xl border border-rose-500/20 bg-rose-500/[0.04] p-4 text-xs">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-ink text-sm">
                    {idx + 1}. {q.prompt}
                  </p>
                  {q.relatedLessonId && (
                    <Link
                      to={`/learn/common-words`}
                      className="flex items-center gap-1 shrink-0 text-signal hover:underline text-[11px] font-medium"
                    >
                      <BookOpen size={12} /> Review Lesson
                    </Link>
                  )}
                </div>

                <div className="mt-2.5 space-y-1.5 border-t border-ink/10 pt-2">
                  <div className="flex items-center gap-2 text-rose-300">
                    <XCircle size={14} className="shrink-0" />
                    <span>Your answer: <strong className="font-medium text-rose-200">{q.userSelectedAnswer || "None"}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 size={14} className="shrink-0" />
                    <span>Correct answer: <strong className="font-medium text-emerald-200">{q.correctAnswer}</strong></span>
                  </div>
                  <p className="mt-2 text-ink-muted leading-relaxed">
                    💡 <span className="font-semibold text-ink">Explanation:</span> {q.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
