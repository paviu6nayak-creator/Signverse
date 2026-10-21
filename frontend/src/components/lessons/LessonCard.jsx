import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ChevronDown, ChevronUp, Layers, PlayCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import GestureAnimation from "./GestureAnimation";
import { findLesson } from "../../data/lessons";

const DIFFICULTY_LABEL = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export default function LessonCard({ lesson, onPractice }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Clean display title (never raw snake_case id)
  const rawTitle = lesson.label || lesson.title || "Sign Lesson";
  const displayTitle = rawTitle.includes("_")
    ? rawTitle.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : rawTitle;

  const xpAmount = lesson.xp_reward || lesson.xp || 10;
  const steps = lesson.steps || [];
  const tokens = lesson.tokens || [];
  const prerequisites = lesson.prerequisites || [];
  const prereqLabels = prerequisites.map((id) => {
    const found = findLesson(id);
    return found ? found.label : id.replace(/^word-/, "").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  });

  return (
    <div className="glass-card glass-card-hover group flex flex-col p-4 transition-all duration-300 hover:-translate-y-1">
      {/* Top Demonstration Image / Animated Gesture Guide */}
      <div className="relative mb-3.5 flex h-48 items-center justify-center overflow-hidden rounded-xl bg-ink/5 shadow-inner">
        <GestureAnimation
          spec={lesson.animationSpec}
          tokens={lesson.tokens}
          steps={steps}
          label={displayTitle}
          motionTag={lesson.motionTag}
          compact={!isExpanded}
          className="h-full w-full border-0 rounded-none bg-transparent"
        />

        {lesson.completed && (
          <span className="absolute right-2.5 bottom-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-signal text-void shadow-md shadow-signal/30 z-10" title="Completed">
            <CheckCircle2 size={16} strokeWidth={2.5} />
          </span>
        )}

        {lesson.needsReview && (
          <span className="absolute left-2.5 bottom-2.5 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 backdrop-blur-md border border-amber-500/30 z-10">
            Review Note
          </span>
        )}
      </div>

      {/* Header & Badges */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display font-semibold text-ink text-base">{displayTitle}</h3>
        <span className="badge !py-0.5 text-[11px] shrink-0 font-medium">
          {DIFFICULTY_LABEL[lesson.difficulty || lesson.level] || "Standard"}
        </span>
      </div>

      {/* Prerequisites Indicator (for Advanced Sentences) */}
      {prereqLabels.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5 rounded-lg bg-signal/10 px-2 py-1 text-[11px] font-medium text-signal-light border border-signal/20">
          <span className="font-bold text-signal">Uses:</span>
          <span>{prereqLabels.join(", ")}</span>
        </div>
      )}

      {/* Sequential Tokens Indicator (for Compound Numbers & Phrases) */}
      {tokens.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-signal">
            <Layers size={11} /> Sequence:
          </span>
          {tokens.map((token, idx) => (
            <span
              key={token.id || idx}
              className="rounded-md bg-signal/15 px-1.5 py-0.5 text-[10px] font-semibold text-signal-light border border-signal/20"
            >
              {token.label}
            </span>
          ))}
        </div>
      )}

      {/* Description or Summary */}
      <p className="mt-1.5 text-xs text-ink-muted leading-relaxed">
        {lesson.description || steps[0] || "Practice handshape and movement orientation."}
      </p>

      {/* Expandable "How to Sign" Full Steps Section (Never Truncated with "...") */}
      {steps.length > 0 && (
        <div className="mt-3 border-t border-ink/10 pt-2.5">
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="flex w-full items-center justify-between text-[11px] font-semibold text-signal hover:text-signal-light transition-colors"
            aria-expanded={isExpanded}
          >
            <span>How to sign ({steps.length} steps)</span>
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 space-y-1.5 rounded-lg bg-ink/5 p-2.5 text-[11px] text-ink-muted"
              >
                {steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-signal/20 text-[9px] font-bold text-signal">
                      {idx + 1}
                    </span>
                    <span className="leading-snug text-ink-muted">{step}</span>
                  </div>
                ))}
                {lesson.tip && (
                  <p className="mt-1.5 border-t border-ink/10 pt-1 text-[10.5px] text-ink-faint">
                    💡 <span className="font-medium text-ink-muted">Tip:</span> {lesson.tip}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Stats Footer */}
      <div className="mt-auto pt-3 flex items-center justify-between text-xs text-ink-faint">
        <span className="flex items-center gap-1 font-medium">
          <Sparkles size={12} className="text-warm" />
          {xpAmount} XP
        </span>
        {lesson.accuracy != null && (
          <span className="font-mono text-[11px] text-signal font-semibold">
            Best: {Math.round(lesson.accuracy * 100)}%
          </span>
        )}
      </div>

      {/* Action Button */}
      <button
        onClick={() => onPractice(lesson)}
        className="btn-secondary mt-3.5 w-full !py-2 text-xs font-semibold"
      >
        <PlayCircle size={15} />
        {lesson.completed ? "Practice again" : "Start practicing"}
      </button>
    </div>
  );
}
