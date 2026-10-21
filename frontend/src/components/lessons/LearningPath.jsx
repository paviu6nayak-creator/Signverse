import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useId, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import tokens from "../../styles/tokens";
import { computeLearningPathUnits } from "../../utils/learningPathEngine";
import { usePrefersReducedMotion } from "./LearnHero";

/**
 * Inline SVG Icons (Strictly No Emojis)
 */
function LockIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function CheckIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ArrowRightIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function SparklesIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" />
    </svg>
  );
}

function MapPinIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function FlagIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  );
}

/**
 * Individual Node on the Winding Learning Path
 */
function LearningPathNode({
  unit,
  index,
  isLeft,
  reducedMotion,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const isCurrent = unit.state === "current";
  const isCompleted = unit.state === "completed";
  const isLocked = unit.state === "locked";

  return (
    <motion.li
      role="listitem"
      aria-current={isCurrent ? "step" : undefined}
      initial={reducedMotion ? false : { opacity: 0, y: 28, scale: 0.96 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: reducedMotion ? 0 : index * 0.08 }}
      className={`relative flex w-full flex-col md:flex-row items-center my-6 md:my-10 ${
        isLeft ? "md:justify-start" : "md:justify-end"
      }`}
    >
      {/* Screen reader only announcement */}
      <span className="sr-only">{unit.srText}</span>

      {/* Node Card Container */}
      <div
        className={`group relative w-full md:w-[420px] transition-all duration-300 ${
          isLocked
            ? "opacity-70 grayscale-[30%]"
            : "hover:-translate-y-1"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
      >
        {/* "You are here" Floating Badge for Current Active Unit */}
        {isCurrent && (
          <div
            className="absolute -top-3.5 left-6 z-20 inline-flex items-center gap-1.5 rounded-full border border-signal/40 bg-void px-3 py-0.5 text-[11px] font-bold text-signal-bright shadow-glow-signal animate-pulse"
            aria-hidden="true"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
            </span>
            <MapPinIcon className="h-3 w-3 text-signal" />
            <span>YOU ARE HERE</span>
          </div>
        )}

        {/* Completed Badge */}
        {isCompleted && (
          <div
            className="absolute -top-3 left-6 z-20 inline-flex items-center gap-1.5 rounded-full border border-signal/30 bg-void px-2.5 py-0.5 text-[11px] font-bold text-signal-bright"
            aria-hidden="true"
          >
            <CheckIcon className="h-3 w-3 text-signal" />
            <span>UNIT COMPLETED</span>
          </div>
        )}

        {/* Main Card Surface */}
        <div
          className={`relative overflow-hidden rounded-2xl border p-5 backdrop-blur-xl transition-all duration-300 ${
            isCurrent
              ? "border-signal/50 bg-surface/85 shadow-glow-signal ring-1 ring-signal/30"
              : isCompleted
              ? "border-signal/25 bg-surface/75 hover:border-signal/40"
              : isLocked
              ? "border-ink/[0.08] bg-void/50 cursor-not-allowed"
              : "border-ink/[0.12] bg-surface/70 hover:border-pulse/40 hover:shadow-glow-pulse"
          }`}
          style={{
            boxShadow: isCurrent ? tokens.shadows.glowTeal : tokens.shadows.glass,
          }}
        >
          {/* Header Row: Illustration, Unit Order & Metadata */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              {/* Unit Node Number / Status Avatar */}
              <div
                className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-mono text-base font-bold shadow-sm transition-transform duration-200 ${
                  isCompleted
                    ? "bg-signal text-void"
                    : isCurrent
                    ? "bg-signal-gradient text-void shadow-glow-signal scale-105"
                    : isLocked
                    ? "border border-ink/[0.1] bg-surface-2 text-ink-faint"
                    : "border border-pulse/30 bg-pulse/15 text-pulse-bright"
                }`}
                aria-hidden="true"
              >
                {isCompleted ? (
                  <CheckIcon className="h-6 w-6 stroke-[3]" />
                ) : isLocked ? (
                  <LockIcon className="h-5 w-5 text-ink-muted" />
                ) : (
                  <span>{unit.order}</span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                    Unit {unit.order}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.2 text-[10px] font-bold ${
                      isCompleted
                        ? "bg-signal/20 text-signal-bright"
                        : isCurrent
                        ? "bg-signal/20 text-signal-bright"
                        : isLocked
                        ? "bg-ink/10 text-ink-muted"
                        : "bg-pulse/20 text-pulse-bright"
                    }`}
                  >
                    {unit.badgeLabel}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-ink">
                  {unit.title}
                </h3>
              </div>
            </div>

            {/* Hand Illustration Preview */}
            {unit.illustration && (
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl p-1.5 transition-transform duration-300 ${
                  isLocked
                    ? "bg-ink/[0.03] opacity-40"
                    : "bg-ink/[0.05] group-hover:scale-105"
                }`}
                aria-hidden="true"
              >
                <img
                  src={unit.illustration}
                  alt={unit.illustrationAlt || unit.title}
                  className="h-full w-full object-contain filter drop-shadow-sm"
                  loading="lazy"
                />
              </div>
            )}
          </div>

          {/* Unit Description */}
          <p className="mt-3 text-xs leading-relaxed text-ink-muted">
            {unit.description}
          </p>

          {/* Progress Bar & Real Counts */}
          <div className="mt-4 border-t border-ink/[0.08] pt-3.5">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-ink-muted">
                {unit.completedCount} / {unit.totalLessons} signs completed
              </span>
              <span
                className={`font-mono font-bold ${
                  isCompleted
                    ? "text-signal-bright"
                    : isCurrent
                    ? "text-signal-bright"
                    : isLocked
                    ? "text-ink-muted"
                    : "text-pulse-bright"
                }`}
              >
                {unit.progressPercent}%
              </span>
            </div>

            {/* Progress Track */}
            <div
              className="h-2 w-full overflow-hidden rounded-full bg-void/80 border border-ink/[0.06]"
              role="progressbar"
              aria-valuenow={unit.progressPercent}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label={`${unit.title} progress: ${unit.progressPercent} percent`}
            >
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  isCompleted
                    ? "bg-signal"
                    : isCurrent
                    ? "bg-signal-gradient"
                    : "bg-pulse"
                }`}
                style={{
                  width: `${Math.min(Math.max(unit.progressPercent, 0), 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Action Footer: Start / Practice / Review / Locked status */}
          <div className="mt-4 flex items-center justify-between gap-3 pt-1">
            {isLocked ? (
              <div className="flex items-center gap-2 text-xs text-ink-muted">
                <LockIcon className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                <span className="truncate text-[11px] font-medium text-ink-muted">
                  Requires 60% in {unit.previousUnitTitle}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-ink-muted">
                {isCompleted ? (
                  <span className="text-[11px] text-signal-bright font-medium">Ready to review</span>
                ) : isCurrent ? (
                  <span className="text-[11px] text-signal-bright font-medium">Next recommended sign</span>
                ) : (
                  <span className="text-[11px] text-pulse-bright font-medium">Available to explore</span>
                )}
              </div>
            )}

            {isLocked ? (
              <button
                type="button"
                disabled
                className="inline-flex items-center gap-1.5 rounded-xl border border-ink/[0.08] bg-surface-2/60 px-3 py-1.5 text-xs font-semibold text-ink-muted cursor-not-allowed opacity-75"
                aria-disabled="true"
                aria-label={`Unit ${unit.order} locked. ${unit.unlockRuleText}`}
              >
                <LockIcon className="h-3.5 w-3.5" />
                <span>Locked</span>
              </button>
            ) : (
              <Link
                to={unit.to}
                className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
                  isCurrent
                    ? "bg-signal-gradient text-void shadow-glow-signal hover:opacity-95 hover:scale-[1.02]"
                    : isCompleted
                    ? "border border-signal/30 bg-signal/10 text-signal-bright hover:bg-signal/20"
                    : "border border-pulse/30 bg-pulse/15 text-pulse-bright hover:bg-pulse/25"
                }`}
                aria-label={`${isCurrent ? "Start" : isCompleted ? "Review" : "Practice"} ${unit.title} lessons`}
              >
                <span>{isCurrent ? "Start Unit" : isCompleted ? "Review" : "Practice"}</span>
                <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>

          {/* Unlock Rule Tooltip on Hover / Focus for Locked Cards */}
          {isLocked && isHovered && (
            <div
              role="tooltip"
              className="absolute inset-x-3 -bottom-2 translate-y-full z-30 rounded-xl border border-amber-500/30 bg-surface-3 p-3 text-xs shadow-glass backdrop-blur-xl animate-fade-up"
            >
              <div className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                  <LockIcon className="h-3 w-3" />
                </span>
                <div>
                  <p className="font-bold text-amber-300">Unlock Requirement</p>
                  <p className="mt-0.5 text-ink-secondary">
                    Complete at least <strong>60%</strong> of {unit.previousUnitTitle} (currently at{" "}
                    <strong>{unit.previousUnitPercent}%</strong>).
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.li>
  );
}

/**
 * Main Winding Vertical Learning Path Component
 */
export default function LearningPath({ allLessons, completedLessonIds }) {
  const containerRef = useRef(null);
  const pathId = useId();
  const reducedMotion = usePrefersReducedMotion();

  // Compute 7 units state with real progress and unlock cascade
  const units = useMemo(() => {
    return computeLearningPathUnits(allLessons, completedLessonIds);
  }, [allLessons, completedLessonIds]);

  // Overall milestone stats
  const completedUnitsCount = units.filter((u) => u.state === "completed").length;
  const currentUnit = units.find((u) => u.state === "current") || units[0];

  // Scroll driven animation for the SVG path connector
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 50%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 20,
    restDelta: 0.001,
  });

  const pathLength = useTransform(smoothProgress, [0, 1], [0.08, 1]);
  const mobileProgressHeight = useTransform(smoothProgress, [0, 1], ["8%", "100%"]);

  return (
    <section
      ref={containerRef}
      aria-labelledby="learning-path-heading"
      className="relative my-12"
    >
      {/* Section Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-pulse/30 bg-pulse/10 px-3 py-1 text-xs font-semibold text-pulse-bright backdrop-blur-md">
            <SparklesIcon className="h-3.5 w-3.5 text-pulse" />
            <span>Structured ASL Journey</span>
          </div>
          <h2
            id="learning-path-heading"
            className="mt-2.5 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl"
          >
            Your SignVerse Learning Path
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Follow the winding roadmap from basic static handshapes to advanced conversational ASL. Next units unlock at 60% completion.
          </p>
        </div>

        {/* Milestone Indicator */}
        <div className="flex items-center gap-3 rounded-2xl border border-ink/[0.08] bg-surface/60 px-4 py-2.5 backdrop-blur-md">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-signal/15 text-signal-bright">
            <FlagIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
              Current Focus: {currentUnit?.title}
            </p>
            <p className="font-mono text-sm font-bold text-ink">
              {completedUnitsCount} of 7 <span className="text-xs text-ink-muted font-normal">Units Mastered</span>
            </p>
          </div>
        </div>
      </div>

      {/* Path Canvas Container */}
      <div className="relative mx-auto max-w-4xl px-2 py-4">
        {/* Desktop Central Winding SVG Connector Line */}
        <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden="true">
          <svg
            className="h-full w-full"
            viewBox="0 0 100 700"
            preserveAspectRatio="none"
            fill="none"
          >
            <defs>
              <linearGradient id={`${pathId}-path-grad`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2DD4BF" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#2DD4BF" />
              </linearGradient>
            </defs>

            {/* Background Track Guide */}
            <path
              d="M 25,50 C 75,100 75,150 75,150 C 75,150 25,200 25,250 C 25,300 75,350 75,350 C 75,400 25,450 25,450 C 25,500 75,550 75,550 C 75,600 50,650 50,650"
              stroke="rgba(234, 240, 251, 0.08)"
              strokeWidth="4"
              strokeDasharray="6 6"
              fill="none"
            />

            {/* Animated Dynamic Connector */}
            <motion.path
              d="M 25,50 C 75,100 75,150 75,150 C 75,150 25,200 25,250 C 25,300 75,350 75,350 C 75,400 25,450 25,450 C 25,500 75,550 75,550 C 75,600 50,650 50,650"
              stroke={`url(#${pathId}-path-grad)`}
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              style={{
                pathLength: reducedMotion ? 1 : pathLength,
                opacity: 0.85,
              }}
            />
          </svg>
        </div>

        {/* Mobile Left-Hand Vertical Connector Line */}
        <div className="pointer-events-none absolute left-6 top-8 bottom-8 w-1 md:hidden" aria-hidden="true">
          <div className="h-full w-0.5 border-l-2 border-dashed border-ink/[0.12]" />
          <motion.div
            className="absolute top-0 left-0 w-0.5 bg-gradient-to-b from-signal via-pulse to-signal"
            style={{
              height: reducedMotion ? "100%" : mobileProgressHeight,
            }}
          />
        </div>

        {/* Units List */}
        <ol
          role="list"
          className="relative z-10 flex flex-col gap-6 md:gap-12"
          aria-label="7 units in SignVerse learning roadmap"
        >
          {units.map((unit, index) => {
            // Winding layout: Alternate Left / Right on desktop
            // index 0: Left, index 1: Right, index 2: Left, index 3: Right, etc.
            const isLeft = index % 2 === 0;

            return (
              <LearningPathNode
                key={unit.id}
                unit={unit}
                index={index}
                isLeft={isLeft}
                reducedMotion={reducedMotion}
              />
            );
          })}
        </ol>
      </div>
    </section>
  );
}
