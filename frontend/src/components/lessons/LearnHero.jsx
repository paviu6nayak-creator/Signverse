/* eslint-disable react-refresh/only-export-components */
import { useEffect, useId, useState } from "react";
import { Link } from "react-router-dom";
import tokens from "../../styles/tokens";

/**
 * Hook to detect prefers-reduced-motion media query
 */
export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (event) => setPrefersReducedMotion(event.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return prefersReducedMotion;
}

/**
 * Smooth ease-out count-up animation hook
 */
export function useCountUp(endVal, duration = 1100, disabled = false) {
  const [val, setVal] = useState(disabled ? endVal : 0);

  useEffect(() => {
    if (disabled || !endVal || endVal <= 0) {
      setVal(endVal || 0);
      return;
    }

    let startTimestamp = null;
    let animationFrameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      // Exponential ease-out: 1 - 2^(-10 * progress)
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setVal(Math.round(ease * endVal));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setVal(endVal);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [endVal, duration, disabled]);

  return val;
}

/**
 * Inline SVG Icons (Strictly No Emojis)
 */
function FlameIcon({ className = "h-5 w-5" }) {
  const id = useId();
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-flame`} x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#EA580C" />
          <stop offset="55%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#FDE047" />
        </linearGradient>
      </defs>
      <path
        d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
        fill={`url(#${id}-flame)`}
      />
      <path
        d="M12 18.5a2.5 2.5 0 0 0 2.5-2.5c0-.8-.4-1.3-.8-1.7-.4.8-1.2 1.2-1.7 1.2s-1.3-.4-1.7-1.2c-.4.4-.8.9-.8 1.7a2.5 2.5 0 0 0 2.5 2.5z"
        fill="#FFFBEB"
      />
    </svg>
  );
}

function SparklesIcon({ className = "h-5 w-5" }) {
  const id = useId();
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-spark`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#2DD4BF" />
        </linearGradient>
      </defs>
      <path
        d="M12 2L14.2 8.2L20.4 10.4L14.2 12.6L12 18.8L9.8 12.6L3.6 10.4L9.8 8.2L12 2Z"
        fill={`url(#${id}-spark)`}
      />
      <path
        d="M19 16L20.1 19.1L23.2 20.2L20.1 21.3L19 24.4L17.9 21.3L14.8 20.2L17.9 19.1L19 16Z"
        fill="#2DD4BF"
        opacity="0.85"
      />
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

function CheckmarkIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CompassIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

/**
 * Animated SVG Progress Ring Component
 */
function ProgressRing({ percent = 0, size = 110, strokeWidth = 8, disabled = false }) {
  const ringId = useId();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const countUpPercent = useCountUp(percent, 1200, disabled);

  // Animate ring stroke draw-in
  const [ringProgress, setRingProgress] = useState(disabled ? percent : 0);

  useEffect(() => {
    if (disabled) {
      setRingProgress(percent);
      return;
    }
    const timer = setTimeout(() => {
      setRingProgress(percent);
    }, 50);
    return () => clearTimeout(timer);
  }, [percent, disabled]);

  const strokeDashoffset = circumference - (ringProgress / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label={`Curriculum completion progress: ${percent} percent`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`${ringId}-ring`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2DD4BF" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>

        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(234, 240, 251, 0.08)"
          strokeWidth={strokeWidth}
        />

        {/* Animated Fill circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${ringId}-ring)`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: disabled ? "none" : "stroke-dashoffset 1.3s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </svg>

      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none select-none">
        <span className="font-mono text-2xl font-bold tracking-tight text-ink">
          {countUpPercent}%
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
          Done
        </span>
      </div>
    </div>
  );
}

/**
 * Main Learn Hero Redesign
 */
export default function LearnHero({
  progressPercent = 0,
  completedCount = 0,
  totalLessons = 0,
  streakCount = 0,
  xpCount = 0,
  beginnerStages = [],
}) {
  const reducedMotion = usePrefersReducedMotion();

  // Animated counters for streak and XP
  const animatedStreak = useCountUp(streakCount, 1000, reducedMotion);
  const animatedXp = useCountUp(xpCount, 1200, reducedMotion);
  const animatedCompleted = useCountUp(completedCount, 900, reducedMotion);

  return (
    <section
      aria-labelledby="learn-hero-heading"
      className="relative mb-10 overflow-hidden rounded-3xl border border-ink/[0.08] bg-surface/65 p-6 backdrop-blur-xl sm:p-8"
      style={{
        background: tokens.gradients.heroGlow,
        boxShadow: tokens.shadows.glass,
      }}
    >
      {/* Background Subtle Grid Accents */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(#EAF0FB 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />

      {/* Top Banner Row: Headline & Live Progress Meters */}
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Headline & Promise */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-signal/25 bg-signal/10 px-3 py-1 text-xs font-semibold text-signal-bright backdrop-blur-md">
            <CompassIcon className="h-3.5 w-3.5 text-signal" />
            <span>Interactive ASL Curriculum</span>
          </div>

          <h1
            id="learn-hero-heading"
            className="mt-3.5 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl"
          >
            Learn Sign Language
          </h1>

          <p className="mt-2.5 max-w-xl font-body text-sm leading-relaxed text-ink-muted sm:text-base">
            Interactive camera-guided lessons, real-time posture feedback, and step-by-step progress from letters to fluent phrases.
          </p>
        </div>

        {/* Right: Progress Ring + Stat Badges */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          {/* Progress Ring Card */}
          <div className="flex items-center gap-4 rounded-2xl border border-ink/[0.08] bg-void/60 p-3.5 backdrop-blur-md shadow-inner">
            <ProgressRing
              percent={progressPercent}
              size={96}
              strokeWidth={8}
              disabled={reducedMotion}
            />
            <div className="pr-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-signal-bright">
                Curriculum
              </p>
              <p className="font-display text-base font-bold text-ink">
                Beginner Track
              </p>
              <p className="mt-0.5 font-mono text-xs text-ink-muted">
                {animatedCompleted} / {totalLessons} signs
              </p>
            </div>
          </div>

          {/* Quick Metrics (Streak Flame & XP Counter) */}
          <div className="flex flex-col gap-2.5">
            {/* Streak Flame Pill */}
            <div
              className="flex items-center gap-2.5 rounded-xl border border-amber-500/25 bg-amber-500/10 px-3.5 py-2 backdrop-blur-md transition-transform duration-200 hover:scale-[1.02]"
              title={`Active learning streak: ${streakCount} days`}
              aria-label={`Current streak: ${streakCount} days`}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 shadow-sm">
                <FlameIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                  Daily Streak
                </p>
                <p className="font-mono text-sm font-bold text-ink">
                  {animatedStreak} {animatedStreak === 1 ? "Day" : "Days"}
                </p>
              </div>
            </div>

            {/* XP Counter Pill */}
            <div
              className="flex items-center gap-2.5 rounded-xl border border-pulse/25 bg-pulse/10 px-3.5 py-2 backdrop-blur-md transition-transform duration-200 hover:scale-[1.02]"
              title={`Total experience earned: ${xpCount} XP`}
              aria-label={`Total experience: ${xpCount} XP`}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pulse/20 text-pulse-bright shadow-sm">
                <SparklesIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-pulse-bright">
                  Mastery XP
                </p>
                <p className="font-mono text-sm font-bold text-ink">
                  {animatedXp} <span className="text-xs font-normal text-ink-muted">XP</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Beginner Path Stage Links */}
      <div className="relative mt-8 border-t border-ink/[0.08] pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-signal text-[10px] font-bold text-void">
              <CheckmarkIcon className="h-3 w-3" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-signal-bright">
              Structured Path:
            </span>
            <span className="text-xs text-ink-muted">
              Alphabet → Numbers → Core Words
            </span>
          </div>

          <span className="rounded-full bg-signal/15 px-2.5 py-0.5 font-mono text-[11px] font-bold text-signal-bright">
            {animatedCompleted} / {totalLessons} completed ({progressPercent}%)
          </span>
        </div>

        {/* 3 Interactive Stage Pillars */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {beginnerStages.map((stage) => {
            const isFinished = stage.completedCount >= stage.totalCount && stage.totalCount > 0;
            return (
              <Link
                key={stage.to}
                to={stage.to}
                className="group relative flex items-center justify-between overflow-hidden rounded-2xl border border-ink/[0.08] bg-void/50 p-4 transition-all duration-200 hover:border-signal/40 hover:bg-signal/5 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none"
                aria-label={`${stage.title}: ${stage.subtitle}. Go to ${stage.title} lessons.`}
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-bold ${
                      isFinished
                        ? "bg-signal text-void shadow-sm"
                        : "bg-surface-3 text-signal border border-signal/20"
                    }`}
                  >
                    {isFinished ? <CheckmarkIcon className="h-4 w-4" /> : stage.stepNumber}
                  </span>
                  <div>
                    <h2 className="text-sm font-bold text-ink group-hover:text-signal transition-colors">
                      {stage.title}
                    </h2>
                    <p className="text-[11px] text-ink-muted">
                      {stage.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {stage.countBadge && (
                    <span className="hidden font-mono text-[10px] text-ink-faint sm:inline-block">
                      {stage.countBadge}
                    </span>
                  )}
                  <ArrowRightIcon className="h-4 w-4 text-ink-faint transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-signal" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
