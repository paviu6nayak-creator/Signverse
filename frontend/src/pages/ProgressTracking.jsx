import {
  AlertTriangle,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  GraduationCap,
  History,
  RotateCcw,
  Search,
  Sparkles,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { Card, EmptyState } from "../components/common/Card";
import DashboardLayout from "../components/layout/DashboardLayout";
import { InlineLoader } from "../components/common/PageLoader";
import PracticeModal from "../components/lessons/PracticeModal";
import api, { getErrorMessage } from "../utils/api";
import { ALL_LESSONS } from "../data/lessons";
import {
  getMasteryBreakdown,
  getStreakCalendarHistory,
  getWeakestSigns,
} from "../utils/adaptiveLearningEngine";

const CATEGORY_LABELS = {
  all: "All Categories",
  alphabet: "Alphabet",
  numbers: "Numbers",
  greetings: "Greetings & Words",
  family: "Family & Relations",
  food: "Food & Drinks",
  common_words: "Common Words",
  daily_conversation: "Daily Conversation",
  phrases: "Conversational Phrases",
};

function timeAgo(dateString) {
  if (!dateString) return "Never";
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function ProgressTracking() {
  const [history, setHistory] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Adaptive learning engine states
  const [masteryData, setMasteryData] = useState(() => getMasteryBreakdown(ALL_LESSONS));
  const [calendarData, setCalendarData] = useState(() => getStreakCalendarHistory(35));
  const [weakestSigns, setWeakestSigns] = useState(() => getWeakestSigns(ALL_LESSONS, 5));

  // Filters & search
  const [masteryFilter, setMasteryFilter] = useState("all"); // 'all' | 'mastered' | 'learning' | 'new'
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Practice modal trigger
  const [activePracticeLesson, setActivePracticeLesson] = useState(null);

  const refreshAdaptiveData = useCallback(() => {
    setMasteryData(getMasteryBreakdown(ALL_LESSONS));
    setCalendarData(getStreakCalendarHistory(35));
    setWeakestSigns(getWeakestSigns(ALL_LESSONS, 5));
  }, []);

  useEffect(() => {
    Promise.all([api.get("/progress/history"), api.get("/progress/achievements")])
      .then(([historyRes, achievementsRes]) => {
        setHistory(historyRes.data);
        setAchievements(achievementsRes.data);
      })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => {
        setIsLoading(false);
        refreshAdaptiveData();
      });
  }, [refreshAdaptiveData]);

  // Filtered signs list for the mastery catalog
  const filteredSigns = useMemo(() => {
    return masteryData.items.filter((item) => {
      // Mastery status filter
      if (masteryFilter !== "all" && item.masteryLevel !== masteryFilter) {
        return false;
      }
      // Category filter
      if (categoryFilter !== "all" && item.lesson.category !== categoryFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const label = (item.lesson.label || item.lesson.title || "").toLowerCase();
        const id = item.lesson.id.toLowerCase();
        return label.includes(q) || id.includes(q);
      }
      return true;
    });
  }, [masteryData, masteryFilter, categoryFilter, searchQuery]);

  if (isLoading) {
    return (
      <DashboardLayout title="Adaptive Progress">
        <InlineLoader label="Loading your adaptive learning dashboard..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Adaptive Learning Progress"
      subtitle="Track your spaced repetition intervals, sign mastery, and practice consistency."
    >
      {/* 1. TOP METRICS ROW */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Metric 1: Current Streak */}
        <div className="glass-card flex items-center gap-3.5 p-4 sm:p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
            <Flame size={22} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-2xl font-bold text-ink sm:text-3xl">
                {calendarData.currentStreak}
              </span>
              <span className="text-xs font-semibold text-ink-muted">days</span>
            </div>
            <p className="text-[11px] font-medium text-ink-muted">Current Streak</p>
          </div>
        </div>

        {/* Metric 2: Mastered Signs */}
        <div className="glass-card flex items-center gap-3.5 p-4 sm:p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
            <GraduationCap size={22} />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-2xl font-bold text-ink sm:text-3xl">
                {masteryData.masteredCount}
              </span>
              <span className="text-xs font-semibold text-ink-muted">
                ({masteryData.masteredPercent}%)
              </span>
            </div>
            <p className="text-[11px] font-medium text-ink-muted">Mastered Signs</p>
          </div>
        </div>

        {/* Metric 3: In Progress Learning */}
        <div className="glass-card flex items-center gap-3.5 p-4 sm:p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400">
            <Sparkles size={22} />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-2xl font-bold text-ink sm:text-3xl">
                {masteryData.learningCount}
              </span>
              <span className="text-xs font-semibold text-ink-muted">
                ({masteryData.learningPercent}%)
              </span>
            </div>
            <p className="text-[11px] font-medium text-ink-muted">Learning in Progress</p>
          </div>
        </div>

        {/* Metric 4: New Signs Left to Learn */}
        <div className="glass-card flex items-center gap-3.5 p-4 sm:p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink/10 text-ink-muted">
            <TrendingUp size={22} />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-2xl font-bold text-ink sm:text-3xl">
                {masteryData.newCount}
              </span>
              <span className="text-xs font-semibold text-ink-muted">
                /{masteryData.total}
              </span>
            </div>
            <p className="text-[11px] font-medium text-ink-muted">New Signs to Discover</p>
          </div>
        </div>
      </div>

      {/* 2. MAIN GRID: STREAK CALENDAR & WEAKEST SIGNS */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Streak Calendar (2 cols on lg) */}
        <Card className="lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-ink/10 pb-3">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-signal" />
              <div>
                <h3 className="font-display text-base font-bold text-ink">Streak Calendar</h3>
                <p className="text-xs text-ink-muted">Your daily practice activity over the last 35 days</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-signal/10 px-2.5 py-0.5 text-xs font-semibold text-signal">
                {calendarData.totalPracticedDays} active days
              </span>
            </div>
          </div>

          {/* 35-Day Grid Layout (5 weeks x 7 days) */}
          <div className="overflow-x-auto pb-1">
            <div className="min-w-[420px]">
              {/* Day of week headers */}
              <div className="mb-2 grid grid-cols-7 gap-2 text-center text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7 gap-2">
                {calendarData.days.map((day) => {
                  let bgStyle = "bg-ink/[0.04] border-ink/10 text-ink-muted";
                  if (day.intensity === 1) {
                    bgStyle = "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-bold";
                  } else if (day.intensity === 2) {
                    bgStyle = "bg-emerald-500/40 border-emerald-500/60 text-emerald-200 font-bold";
                  } else if (day.intensity === 3) {
                    bgStyle =
                      "bg-emerald-500 border-emerald-400 text-white font-bold shadow-[0_0_10px_rgba(16,185,129,0.35)]";
                  }

                  return (
                    <div
                      key={day.date}
                      className={`group relative flex aspect-square flex-col items-center justify-center rounded-xl border p-1 transition hover:scale-105 ${bgStyle}`}
                      title={`${day.date}: ${day.count} sign(s) practiced`}
                    >
                      <span className="text-xs">{day.dayOfMonth}</span>
                      {day.count > 0 && (
                        <span className="text-[9px] opacity-80">{day.count}×</span>
                      )}

                      {/* Tooltip on hover */}
                      <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1.5 hidden -translate-x-1/2 rounded-md bg-void/95 px-2 py-1 text-[10px] text-white shadow-lg group-hover:block whitespace-nowrap border border-ink/10">
                        {day.date}: {day.count} practiced
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Activity Level Legend */}
              <div className="mt-4 flex items-center justify-between text-[11px] text-ink-muted">
                <span>Consistency builds muscle memory</span>
                <div className="flex items-center gap-1.5">
                  <span>Less</span>
                  <div className="h-3 w-3 rounded-sm border border-ink/10 bg-ink/[0.04]" />
                  <div className="h-3 w-3 rounded-sm border border-emerald-500/40 bg-emerald-500/20" />
                  <div className="h-3 w-3 rounded-sm border border-emerald-500/60 bg-emerald-500/40" />
                  <div className="h-3 w-3 rounded-sm border border-emerald-400 bg-emerald-500" />
                  <span>More</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* "Weakest 5 Signs" Card (1 col on lg) */}
        <Card className="flex flex-col">
          <div className="mb-4 flex items-center justify-between border-b border-ink/10 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-400" />
              <div>
                <h3 className="font-display text-base font-bold text-ink">Weakest Signs</h3>
                <p className="text-xs text-ink-muted">Signs requiring priority reinforcement</p>
              </div>
            </div>
            <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-bold text-amber-400">
              Needs Practice
            </span>
          </div>

          <div className="flex-1 space-y-3">
            {weakestSigns.length === 0 ? (
              <EmptyState
                icon={Sparkles}
                title="No weak signs detected"
                description="Keep practicing daily sessions to unlock personalized spaced-repetition feedback."
              />
            ) : (
              weakestSigns.map((item) => (
                <div
                  key={item.lesson.id}
                  className="flex flex-col rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-3 transition hover:border-amber-500/40 hover:bg-amber-500/[0.07]"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-ink">{item.lesson.label}</h4>
                      <p className="text-[11px] text-ink-muted">
                        {CATEGORY_LABELS[item.lesson.category] || item.lesson.category} · {item.mistakes} mistake{item.mistakes === 1 ? "" : "s"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActivePracticeLesson(item.lesson)}
                      className="flex items-center gap-1 rounded-lg bg-signal/15 px-2.5 py-1 text-xs font-semibold text-signal transition hover:bg-signal/25"
                    >
                      <RotateCcw size={12} />
                      Practice
                    </button>
                  </div>

                  {/* Accuracy Bar */}
                  <div className="mt-2.5 space-y-1">
                    <div className="flex justify-between text-[10px] font-medium text-ink-muted">
                      <span>Accuracy</span>
                      <span className="font-mono font-bold text-amber-400">
                        {Math.round(item.accuracy * 100)}% ({item.timesPracticed} attempts)
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
                      <div
                        className={`h-full ${
                          item.accuracy >= 0.7
                            ? "bg-amber-400"
                            : "bg-rose-500"
                        }`}
                        style={{ width: `${Math.round(item.accuracy * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* 3. MASTERY LEVEL PER SIGN (CATALOG & FILTERS) */}
      <div className="mt-6">
        <Card>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <GraduationCap size={20} className="text-signal" />
                <h3 className="font-display text-lg font-bold text-ink">Mastery Level per Sign</h3>
              </div>
              <p className="text-xs text-ink-muted">
                Classified based on attempts, accuracy, and Leitner box interval
              </p>
            </div>

            {/* Overall Distribution Bar */}
            <div className="flex w-full max-w-xs flex-col gap-1">
              <div className="flex justify-between text-[11px] font-medium text-ink-muted">
                <span className="text-emerald-400 font-semibold">{masteryData.masteredCount} Mastered</span>
                <span className="text-sky-300 font-semibold">{masteryData.learningCount} Learning</span>
                <span>{masteryData.newCount} New</span>
              </div>
              <div className="flex h-2 w-full overflow-hidden rounded-full bg-ink/10">
                <div
                  className="bg-emerald-500 transition-all"
                  style={{ width: `${masteryData.masteredPercent}%` }}
                  title={`Mastered: ${masteryData.masteredPercent}%`}
                />
                <div
                  className="bg-sky-400 transition-all"
                  style={{ width: `${masteryData.learningPercent}%` }}
                  title={`Learning: ${masteryData.learningPercent}%`}
                />
                <div
                  className="bg-ink/30 transition-all"
                  style={{ width: `${masteryData.newPercent}%` }}
                  title={`New: ${masteryData.newPercent}%`}
                />
              </div>
            </div>
          </div>

          {/* Filter Bar & Search */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            {/* Status Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: "all", label: `All (${masteryData.total})` },
                { id: "mastered", label: `Mastered (${masteryData.masteredCount})` },
                { id: "learning", label: `Learning (${masteryData.learningCount})` },
                { id: "new", label: `New (${masteryData.newCount})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setMasteryFilter(tab.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    masteryFilter === tab.id
                      ? "bg-signal text-void shadow-sm"
                      : "bg-ink/5 text-ink-muted hover:bg-ink/10 hover:text-ink"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Category Dropdown & Search Input */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-lg border border-ink/10 bg-ink/5 px-2.5 py-1.5 text-xs font-medium text-ink outline-none focus:border-signal"
              >
                <option value="all">All Categories</option>
                <option value="alphabet">Alphabet</option>
                <option value="numbers">Numbers</option>
                <option value="greetings">Greetings</option>
                <option value="family">Family</option>
                <option value="food">Food</option>
                <option value="phrases">Phrases</option>
              </select>

              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-muted" />
                <input
                  type="text"
                  placeholder="Search sign..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-36 rounded-lg border border-ink/10 bg-ink/5 pl-8 pr-2.5 py-1.5 text-xs text-ink placeholder-ink-muted outline-none focus:border-signal sm:w-48"
                />
              </div>
            </div>
          </div>

          {/* Signs Grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 max-h-[580px] overflow-y-auto pr-1">
            {filteredSigns.length === 0 ? (
              <div className="col-span-full py-8">
                <EmptyState
                  icon={Search}
                  title="No signs match filters"
                  description="Try selecting a different mastery tab or clearing your search term."
                />
              </div>
            ) : (
              filteredSigns.map((item) => {
                const { lesson, stat, masteryLevel } = item;
                const isMastered = masteryLevel === "mastered";
                const isLearning = masteryLevel === "learning";

                return (
                  <div
                    key={lesson.id}
                    className="flex flex-col justify-between rounded-xl border border-ink/10 bg-ink/[0.03] p-3.5 transition hover:border-signal/40 hover:bg-ink/[0.06]"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                          {CATEGORY_LABELS[lesson.category] || lesson.category}
                        </span>

                        {/* Mastery status badge */}
                        {isMastered && (
                          <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                            <CheckCircle2 size={11} /> Mastered
                          </span>
                        )}
                        {isLearning && (
                          <span className="flex items-center gap-1 rounded-full bg-sky-500/15 border border-sky-500/30 px-2 py-0.5 text-[10px] font-bold text-sky-300">
                            <Sparkles size={11} /> Learning
                          </span>
                        )}
                        {!isMastered && !isLearning && (
                          <span className="rounded-full bg-ink/10 border border-ink/10 px-2 py-0.5 text-[10px] font-medium text-ink-muted">
                            New
                          </span>
                        )}
                      </div>

                      <h4 className="font-display text-sm font-bold text-ink">{lesson.label}</h4>

                      {/* Stats & Spacing */}
                      <div className="mt-2 text-[11px] text-ink-muted space-y-0.5">
                        <div className="flex justify-between">
                          <span>Accuracy:</span>
                          <span className="font-mono font-medium text-ink">
                            {stat.timesPracticed > 0 ? `${Math.round(stat.accuracy * 100)}%` : "—"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Attempts:</span>
                          <span className="font-mono font-medium text-ink">{stat.timesPracticed}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Leitner Box:</span>
                          <span className="font-mono font-medium text-signal">
                            Box {stat.box || 1} ({stat.intervalDays || 1}d)
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActivePracticeLesson(lesson)}
                      className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-ink/5 py-1.5 text-xs font-semibold text-ink transition hover:bg-signal/15 hover:text-signal"
                    >
                      <RotateCcw size={12} />
                      Practice Sign
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>

      {/* 4. PRACTICE HISTORY & ACHIEVEMENTS */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between border-b border-ink/10 pb-3">
            <div className="flex items-center gap-2">
              <History size={18} className="text-signal" />
              <h3 className="font-display font-semibold text-ink">Recent Practice Log</h3>
            </div>
            <span className="text-xs text-ink-muted">{history.length} logged attempts</span>
          </div>

          {history.length === 0 ? (
            <EmptyState
              icon={History}
              title="No practice sessions logged"
              description="Start practicing to record your live verification attempts here."
            />
          ) : (
            <div className="max-h-[360px] space-y-2 overflow-y-auto pr-1">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl bg-ink/5 px-4 py-2.5 transition hover:bg-ink/[0.08]"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                        item.is_correct ? "bg-signal/10 text-signal" : "bg-danger/10 text-danger"
                      }`}
                    >
                      {item.is_correct ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-ink">{item.lesson_title}</p>
                      <p className="text-[11px] text-ink-muted">
                        {CATEGORY_LABELS[item.category] || item.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xs font-semibold text-ink">
                      {Math.round(item.confidence * 100)}%
                    </p>
                    <p className="text-[10px] text-ink-faint flex items-center gap-1 justify-end">
                      <Clock size={10} />
                      {timeAgo(item.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <div className="mb-4 flex items-center gap-2 border-b border-ink/10 pb-3">
            <Award size={18} className="text-amber-400" />
            <h3 className="font-display font-semibold text-ink">
              Achievements ({achievements.length})
            </h3>
          </div>

          {achievements.length === 0 ? (
            <EmptyState
              icon={Award}
              title="No badges earned yet"
              description="Maintain streaks and complete sessions to earn milestone badges."
            />
          ) : (
            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-3 rounded-xl bg-amber-500/5 border border-amber-500/10 p-3"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400">
                    <Award size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-ink">{achievement.title}</p>
                    <p className="text-xs text-ink-muted">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Practice Modal if user clicks "Practice Sign" */}
      {activePracticeLesson && (
        <PracticeModal
          lesson={activePracticeLesson}
          onClose={() => setActivePracticeLesson(null)}
          onSuccess={() => {
            refreshAdaptiveData();
            toast.success(`Progress saved for ${activePracticeLesson.label}!`);
          }}
        />
      )}
    </DashboardLayout>
  );
}
