import { motion } from "framer-motion";
import {
  Award,
  CalendarCheck,
  CheckCircle2,
  Flame,
  GraduationCap,
  Info,
  Lock,
  Play,
  RefreshCw,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import LessonCard from "../components/lessons/LessonCard";
import PracticeModal from "../components/lessons/PracticeModal";
import PracticeSession from "../components/practice/PracticeSession";
import { EmptyState } from "../components/common/Card";
import { InlineLoader } from "../components/common/PageLoader";
import { useAuth } from "../context/AuthContext";
import { useLessons } from "../hooks/useLessons";
import {
  getDailyCompletedIds,
  getDailyFeaturedSigns,
  getLocalDateString,
  getPracticeProgress,
  getUnlockStatus,
  recordDailyCompletedItem,
} from "../utils/dailyPracticeGenerator";
import { ALL_LESSONS } from "../data/lessons";

const FEATURED_SET_COUNT = 6;

export default function DailyPractice() {
  const { isAuthenticated, user } = useAuth();
  const { lessons, isLoading, refetch } = useLessons();
  const [activeLesson, setActiveLesson] = useState(null);
  const [dailySet, setDailySet] = useState([]);
  const [activeSessionLevel, setActiveSessionLevel] = useState(null);
  const [selectedTier, setSelectedTier] = useState("beginner");
  const [progress, setProgress] = useState(() => getPracticeProgress());
  const [dailyCompletedSet, setDailyCompletedSet] = useState(() => getDailyCompletedIds());

  // Load and rotate Today's Featured Signs (at least 6 cards)
  useEffect(() => {
    const poolToUse = lessons && lessons.length > 0 ? lessons : ALL_LESSONS;
    const featured = getDailyFeaturedSigns(poolToUse, FEATURED_SET_COUNT, getLocalDateString());
    setDailySet(featured);
  }, [lessons]);

  // Refresh stored progress and daily completions
  const refreshProgress = () => {
    setProgress(getPracticeProgress());
    setDailyCompletedSet(getDailyCompletedIds());
  };

  // Accurate "X/6 completed today" count
  const completedTodayCount = useMemo(() => {
    return dailySet.filter((l) => dailyCompletedSet.has(l.id) || l.completed).length;
  }, [dailySet, dailyCompletedSet]);

  const unlockInfo = useMemo(() => getUnlockStatus(progress), [progress]);

  const reshuffle = () => {
    const randomSeed = Math.random().toString(36).substring(2, 8);
    const poolToUse = lessons && lessons.length > 0 ? lessons : ALL_LESSONS;
    const featured = getDailyFeaturedSigns(poolToUse, FEATURED_SET_COUNT, randomSeed);
    setDailySet(featured);
  };

  // If user is inside an active interactive 8-exercise session
  if (activeSessionLevel) {
    return (
      <div className="mx-auto min-h-[85vh] max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <PracticeSession
          level={activeSessionLevel}
          onExit={() => {
            setActiveSessionLevel(null);
            refreshProgress();
            refetch();
          }}
          onCompleteSession={() => {
            refreshProgress();
            refetch();
          }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Top Header & Streak Stats */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-signal-gradient text-void shadow-lg shadow-signal/20">
              <CalendarCheck size={24} />
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold text-ink">Daily Practice</h1>
            <p className="mt-1.5 max-w-lg text-ink-muted">
              Master sign language with spaced repetition sessions, live camera feedback, and progressive tiers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="glass-card flex items-center gap-3 px-4 py-2.5">
              <Flame className="text-warm" size={22} />
              <div>
                <p className="stat-number text-lg text-ink">{progress?.streak ?? user?.current_streak ?? 1} days</p>
                <p className="text-[10px] uppercase font-bold tracking-wider text-ink-muted">Daily Streak</p>
              </div>
            </div>

            <div className="glass-card flex items-center gap-3 px-4 py-2.5">
              <Zap className="text-signal" size={22} />
              <div>
                <p className="stat-number text-lg text-ink">{progress?.xp ?? 0} XP</p>
                <p className="text-[10px] uppercase font-bold tracking-wider text-ink-muted">Experience</p>
              </div>
            </div>

            <div className="glass-card flex items-center gap-3 px-4 py-2.5">
              <Trophy className="text-pulse" size={22} />
              <div>
                <p className="stat-number text-lg text-ink">{progress?.sessionsCompleted ?? 0}</p>
                <p className="text-[10px] uppercase font-bold tracking-wider text-ink-muted">Sessions Done</p>
              </div>
            </div>
          </div>
        </div>

        {/* Duolingo-style Session Launcher Card */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-signal/20 bg-gradient-to-br from-signal/10 via-ink/[0.02] to-pulse/10 p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-signal/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-signal">
                <Sparkles size={14} /> Spaced Repetition Engine
              </span>
              <h2 className="mt-3 font-display text-2xl font-bold text-ink sm:text-3xl">
                Start Today's 8-Item Session
              </h2>
              <p className="mt-2 text-sm text-ink-muted">
                Picks 4 new items, 3 review items (weakest or oldest), and 1 challenge item across alphabet, numbers, words, family, and phrases.
              </p>

              {/* Tier Selection Tabs with clear unlock rules */}
              <div className="mt-5 flex flex-wrap gap-2.5">
                {/* Beginner Tab */}
                <button
                  onClick={() => setSelectedTier("beginner")}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                    selectedTier === "beginner"
                      ? "bg-signal text-void shadow-md scale-105"
                      : "bg-ink/5 text-ink hover:bg-ink/10"
                  }`}
                >
                  <GraduationCap size={16} />
                  <span>Beginner</span>
                </button>

                {/* Intermediate Tab */}
                <button
                  onClick={() => unlockInfo.intermediate.unlocked && setSelectedTier("intermediate")}
                  disabled={!unlockInfo.intermediate.unlocked}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                    selectedTier === "intermediate"
                      ? "bg-signal text-void shadow-md scale-105"
                      : unlockInfo.intermediate.unlocked
                      ? "bg-ink/5 text-ink hover:bg-ink/10"
                      : "cursor-not-allowed bg-ink/5 text-ink-faint opacity-60"
                  }`}
                  title={!unlockInfo.intermediate.unlocked ? unlockInfo.intermediate.rule : ""}
                >
                  {unlockInfo.intermediate.unlocked ? <Award size={16} /> : <Lock size={14} />}
                  <span>Intermediate</span>
                </button>

                {/* Advanced Tab */}
                <button
                  onClick={() => unlockInfo.advanced.unlocked && setSelectedTier("advanced")}
                  disabled={!unlockInfo.advanced.unlocked}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                    selectedTier === "advanced"
                      ? "bg-signal text-void shadow-md scale-105"
                      : unlockInfo.advanced.unlocked
                      ? "bg-ink/5 text-ink hover:bg-ink/10"
                      : "cursor-not-allowed bg-ink/5 text-ink-faint opacity-60"
                  }`}
                  title={!unlockInfo.advanced.unlocked ? unlockInfo.advanced.rule : ""}
                >
                  {unlockInfo.advanced.unlocked ? <Sparkles size={16} /> : <Lock size={14} />}
                  <span>Advanced</span>
                </button>
              </div>

              {/* Dynamic Unlock Rule Guidance */}
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-ink/5 px-3.5 py-2 text-xs text-ink-muted">
                <Info size={14} className="text-signal shrink-0" />
                <span>
                  <strong className="text-ink capitalize">{selectedTier}:</strong>{" "}
                  {unlockInfo[selectedTier]?.rule} ·{" "}
                  <span className={unlockInfo[selectedTier]?.unlocked ? "text-emerald-400 font-semibold" : "text-amber-400 font-semibold"}>
                    {unlockInfo[selectedTier]?.statusText}
                  </span>
                </span>
              </div>
            </div>

            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <button
                onClick={() => setActiveSessionLevel(selectedTier)}
                className="btn-primary !px-7 !py-3.5 text-base font-bold shadow-lg shadow-signal/25 transition-transform hover:scale-105"
              >
                <Play size={18} fill="currentColor" /> Start {selectedTier.toUpperCase()} (8 Signs)
              </button>
            </div>
          </div>
        </div>

        {/* Section Divider & Daily Set Header */}
        <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-ink/10 pt-6">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-xl font-bold text-ink">Today's Featured Signs</h3>
              <span className="rounded-full bg-signal/15 px-2.5 py-0.5 text-xs font-bold text-signal">
                {completedTodayCount}/{dailySet.length} completed today
              </span>
            </div>
            <p className="mt-1 text-xs text-ink-muted">
              Rotates daily at midnight · Click any card to inspect and practice reference handshapes
            </p>
          </div>

          {dailySet.length > 0 && (
            <button onClick={reshuffle} className="btn-ghost text-sm self-start sm:self-auto">
              <RefreshCw size={14} />
              Shuffle set
            </button>
          )}
        </div>
      </motion.div>

      {/* Daily Set Grid */}
      <div className="mt-6">
        {isLoading ? (
          <InlineLoader label="Building today's featured signs..." />
        ) : dailySet.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="No lessons available yet"
            description="Once lessons are published, your daily practice set will appear here."
            action={
              <Link to="/learn" className="btn-primary">
                Browse lessons
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dailySet.map((lesson) => {
              const isDoneToday = dailyCompletedSet.has(lesson.id) || lesson.completed;
              return (
                <div key={lesson.id} className="relative">
                  <LessonCard
                    lesson={{ ...lesson, completed: isDoneToday }}
                    onPractice={(l) =>
                      isAuthenticated
                        ? setActiveLesson(l)
                        : setActiveLesson({ ...l, __guestBlocked: true })
                    }
                  />
                  {isDoneToday && (
                    <div className="pointer-events-none absolute right-4 top-4 z-10 flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 size={13} /> Completed Today
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {activeLesson?.__guestBlocked && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-void/80 p-4 backdrop-blur-sm"
          onClick={() => setActiveLesson(null)}
        >
          <div className="glass-card max-w-sm p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-lg font-semibold text-ink">Create a free account to practice</h3>
            <p className="mt-2 text-sm text-ink-muted">Sign up to track your daily streak and save your progress.</p>
            <Link to="/register" className="btn-primary mt-5 w-full">
              Sign up free
            </Link>
          </div>
        </div>
      )}

      {activeLesson && !activeLesson.__guestBlocked && (
        <PracticeModal
          lesson={activeLesson}
          onClose={() => setActiveLesson(null)}
          onSuccess={() => {
            recordDailyCompletedItem(activeLesson.id);
            refreshProgress();
            refetch();
          }}
        />
      )}
    </div>
  );
}
