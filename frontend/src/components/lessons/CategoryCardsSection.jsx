import { motion } from "framer-motion";
import {
  CalendarCheck,
  CheckCircle2,
  Hash,
  MessageCircle,
  Puzzle,
  Sparkles,
  Trophy,
  Type,
} from "lucide-react";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import tokens from "../../styles/tokens";
import { usePrefersReducedMotion } from "./LearnHero";

// Lazy-load the parametric Hand SVG component to reduce initial bundle chunk size
const LazyHand = React.lazy(() => import("../common/Hand"));

/**
 * High-performance 60fps mini hand animation loop
 * Cycles through 3-4 canonical handshapes with zero layout shifts
 */
function MiniHandLoop({ specs = ["A", "B", "C"], size = 56, reducedMotion = false }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion || specs.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % specs.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [specs, reducedMotion]);

  const currentSpec = specs[index] || specs[0];

  return (
    <div
      className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-ink/[0.08] bg-void/60 shadow-inner"
      style={{ width: size + 16, height: size + 16 }}
      aria-hidden="true"
    >
      <Suspense
        fallback={
          <div
            className="h-12 w-12 rounded-xl bg-ink/5 animate-pulse"
            style={{ width: size, height: size }}
          />
        }
      >
        <div
          className={`transition-transform duration-300 ${
            reducedMotion ? "" : "animate-[pulse-dot_3s_ease-in-out_infinite]"
          }`}
          style={{ willChange: "transform" }}
        >
          <LazyHand
            spec={currentSpec}
            size={size}
            color="#2DD4BF"
            accentColor="#5EEAD4"
            highlightColor="#CCFBF1"
          />
        </div>
      </Suspense>
    </div>
  );
}

/**
 * 100% Celebratory Particle Burst
 * Displays outward radiating particles and a golden trophy badge
 */
function CelebratoryBurst({ unitTitle, reducedMotion = false }) {
  const particles = useMemo(
    () => [
      { x: -16, y: -16, color: "bg-teal-400" },
      { x: 16, y: -18, color: "bg-amber-400" },
      { x: 22, y: 12, color: "bg-purple-400" },
      { x: -18, y: 14, color: "bg-teal-300" },
      { x: 0, y: -22, color: "bg-amber-300" },
      { x: 0, y: 20, color: "bg-emerald-400" },
    ],
    []
  );

  return (
    <div
      className="pointer-events-none absolute -top-3.5 right-4 z-20 flex items-center justify-center"
      aria-label={`${unitTitle} is 100% mastered!`}
    >
      {/* Radiating Spark Particles */}
      {!reducedMotion &&
        particles.map((p, i) => (
          <motion.span
            key={i}
            initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
            animate={{
              scale: [0, 1.4, 0],
              x: [0, p.x],
              y: [0, p.y],
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              repeatDelay: 2.2,
              delay: i * 0.12,
              ease: "easeOut",
            }}
            className={`absolute h-1.5 w-1.5 rounded-full ${p.color}`}
          />
        ))}

      {/* 100% Mastered Pill */}
      <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/50 bg-void px-2.5 py-0.5 text-[10px] font-bold text-amber-300 shadow-glow-flame">
        <Trophy className="h-3 w-3 text-amber-400" />
        <span>100% Mastered</span>
      </span>
    </div>
  );
}

/**
 * Category Card
 */
function CategoryCard({ category, reducedMotion = false }) {
  const is100 = category.percent >= 100;

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 16 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.4 }}
      className="h-full"
    >
      <Link
        to={category.to}
        className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border p-6 backdrop-blur-xl transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-void ${
          is100
            ? "border-teal-500/40 bg-surface/75 hover:border-teal-400 hover:shadow-glow-signal hover:-translate-y-1.5"
            : "border-ink/[0.08] bg-surface/65 hover:border-signal/40 hover:shadow-glow-signal hover:-translate-y-1.5"
        }`}
        style={{
          boxShadow: is100 ? tokens.shadows.glowTeal : tokens.shadows.glass,
        }}
        aria-label={`${category.title}. ${category.level} level. ${category.completedCount} of ${category.totalCount} completed (${category.percent}%). Click to open ${category.title}.`}
      >
        {/* Celebratory Burst when 100% complete */}
        {is100 && (
          <CelebratoryBurst
            unitTitle={category.title}
            reducedMotion={reducedMotion}
          />
        )}

        <div>
          {/* Top Row: Mini Hand Animation + Category Icon & Level Badge */}
          <div className="flex items-start justify-between gap-4">
            {/* Animated Looping Mini Hand */}
            <MiniHandLoop
              specs={category.handSpecs}
              size={48}
              reducedMotion={reducedMotion}
            />

            <div className="flex flex-col items-end gap-1.5">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                  category.accentBadge
                }`}
              >
                {category.level}
              </span>
              <span className="font-mono text-[11px] font-semibold text-ink-muted">
                {category.countLabel}
              </span>
            </div>
          </div>

          {/* Title & Description */}
          <div className="mt-4">
            <div className="flex items-center gap-2">
              <span className={`p-1 rounded-lg ${category.iconBg}`}>
                <category.icon className="h-4 w-4 text-ink" />
              </span>
              <h3 className="font-display text-lg font-bold text-ink transition-colors group-hover:text-signal">
                {category.title}
              </h3>
            </div>

            <p className="mt-2 text-xs leading-relaxed text-ink-muted">
              {category.description}
            </p>
          </div>
        </div>

        {/* Bottom Section: Progress Bar & Status Pill */}
        <div className="mt-6 border-t border-ink/[0.08] pt-4">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-medium text-ink-muted">
              {category.completedCount} / {category.totalCount} completed
            </span>
            <span
              className={`font-mono font-bold ${
                is100 ? "text-signal-bright" : "text-ink"
              }`}
            >
              {category.percent}%
            </span>
          </div>

          {/* Progress Bar with accessible role */}
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-void/80 border border-ink/[0.06]"
            role="progressbar"
            aria-valuenow={category.percent}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label={`${category.title} completion progress`}
          >
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                is100
                  ? "bg-signal shadow-glow-signal"
                  : "bg-signal-gradient"
              }`}
              style={{
                width: `${Math.min(Math.max(category.percent, 0), 100)}%`,
              }}
            />
          </div>

          {/* Action Footer */}
          <div className="mt-3 flex items-center justify-between text-xs">
            {is100 ? (
              <span className="flex items-center gap-1 font-semibold text-signal-bright">
                <CheckCircle2 className="h-3.5 w-3.5 text-signal" />
                <span>Unit Mastered</span>
              </span>
            ) : (
              <span className="font-medium text-ink-muted">
                {category.percent > 0 ? "Continue learning" : "Start track"}
              </span>
            )}
            <span className="font-semibold text-signal-bright opacity-0 transition-opacity duration-200 group-hover:opacity-100 flex items-center gap-1">
              <span>Open</span>
              <span>→</span>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/**
 * Category Cards Section on /learn:
 * Alphabet, Numbers, Common Words, Daily Practice, Quiz
 */
export default function CategoryCardsSection({
  alphabetLessons = [],
  numbersLessons = [],
  commonWordsLessons = [],
  completedLessonIds = new Set(),
  practiceProgress = {},
  quizHistory = {},
}) {
  const reducedMotion = usePrefersReducedMotion();

  // Progress Calculations for each of the 5 categories
  const categories = useMemo(() => {
    // 1. Alphabet
    const alphaTotal = alphabetLessons.length || 26;
    const alphaCompleted = alphabetLessons.filter(
      (l) => l.completed || completedLessonIds.has(l.id)
    ).length;
    const alphaPercent = Math.round((alphaCompleted / alphaTotal) * 100);

    // 2. Numbers
    const numTotal = numbersLessons.length || 46;
    const numCompleted = numbersLessons.filter(
      (l) => l.completed || completedLessonIds.has(l.id)
    ).length;
    const numPercent = Math.round((numCompleted / numTotal) * 100);

    // 3. Common Words
    const wordsTotal = commonWordsLessons.length || 150;
    const wordsCompleted = commonWordsLessons.filter(
      (l) => l.completed || completedLessonIds.has(l.id)
    ).length;
    const wordsPercent = Math.round((wordsCompleted / wordsTotal) * 100);

    // 4. Daily Practice
    const practiceStreak = practiceProgress?.streak || 0;
    const practiceSessions = practiceProgress?.sessionsCompleted || 0;
    // Practice milestone: 7-day streak or session completions
    const dailyTarget = 7;
    const dailyCompleted = Math.min(practiceStreak, dailyTarget);
    const dailyPercent = Math.min(
      Math.round((practiceStreak / dailyTarget) * 100),
      100
    );

    // 5. Quiz
    const totalQuizzes = 7;
    const completedQuizzes = Object.keys(quizHistory || {}).filter(
      (k) => (quizHistory[k]?.attempts || 0) > 0
    ).length;
    const quizPercent = Math.round((completedQuizzes / totalQuizzes) * 100);

    return [
      {
        id: "alphabet",
        title: "Alphabet",
        to: "/learn/alphabet",
        icon: Type,
        iconBg: "bg-teal-500/10 text-teal-300",
        handSpecs: ["A", "B", "C", "ily"],
        description: "26 letters (A–Z) manual fingerspelling to spell names and English words.",
        level: "Beginner",
        accentBadge: "bg-teal-500/20 text-teal-300",
        countLabel: `${alphaTotal} letters`,
        totalCount: alphaTotal,
        completedCount: alphaCompleted,
        percent: alphaPercent,
      },
      {
        id: "numbers",
        title: "Numbers",
        to: "/learn/numbers",
        icon: Hash,
        iconBg: "bg-purple-500/10 text-purple-300",
        handSpecs: ["1", "2", "3", "5"],
        description: "Sign 0 through 10, compound double digits, and multi-digit quantities.",
        level: "Beginner",
        accentBadge: "bg-purple-500/20 text-purple-300",
        countLabel: `${numTotal} signs`,
        totalCount: numTotal,
        completedCount: numCompleted,
        percent: numPercent,
      },
      {
        id: "common-words",
        title: "Common Words",
        to: "/learn/common-words",
        icon: MessageCircle,
        iconBg: "bg-amber-500/10 text-amber-300",
        handSpecs: ["B", "10", "ily"],
        description: "Core vocabulary, greetings, family, food, emotions, and common action verbs.",
        level: "All Levels",
        accentBadge: "bg-amber-500/20 text-amber-300",
        countLabel: `${wordsTotal} signs`,
        totalCount: wordsTotal,
        completedCount: wordsCompleted,
        percent: wordsPercent,
      },
      {
        id: "daily-practice",
        title: "Daily Practice",
        to: "/daily-practice",
        icon: CalendarCheck,
        iconBg: "bg-teal-500/10 text-teal-300",
        handSpecs: ["1", "A", "5"],
        description: "Rotating adaptive practice sets with camera feedback to keep your streak alive.",
        level: "Adaptive",
        accentBadge: "bg-teal-500/20 text-teal-300",
        countLabel: practiceStreak > 0 ? `${practiceStreak}d streak` : `${practiceSessions} sessions`,
        totalCount: dailyTarget,
        completedCount: dailyCompleted,
        percent: dailyPercent,
      },
      {
        id: "quiz",
        title: "Quiz",
        to: "/quiz",
        icon: Puzzle,
        iconBg: "bg-purple-500/10 text-purple-300",
        handSpecs: ["C", "2", "X"],
        description: "Timed multiple-choice tests, speed fingerspelling, and sign recognition.",
        level: "Interactive",
        accentBadge: "bg-purple-500/20 text-purple-300",
        countLabel: `${totalQuizzes} quizzes`,
        totalCount: totalQuizzes,
        completedCount: completedQuizzes,
        percent: quizPercent,
      },
    ];
  }, [
    alphabetLessons,
    numbersLessons,
    commonWordsLessons,
    completedLessonIds,
    practiceProgress,
    quizHistory,
  ]);

  return (
    <section
      aria-labelledby="category-tracks-heading"
      className="my-14"
    >
      {/* Section Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/25 bg-teal-500/10 px-3 py-0.5 text-xs font-semibold text-teal-300 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-teal-400" />
            <span>Interactive Tracks</span>
          </div>
          <h2
            id="category-tracks-heading"
            className="mt-2 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl"
          >
            Explore Learning Categories
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Jump into specialized tracks with live camera posture guidance, interactive quizzes, and daily challenges.
          </p>
        </div>
      </div>

      {/* Grid of 5 Category Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>
    </section>
  );
}
