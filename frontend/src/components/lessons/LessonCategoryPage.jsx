import { motion } from "framer-motion";
import { AlertTriangle, BookOpen, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useLessons } from "../../hooks/useLessons";
import { EmptyState, ProgressBar } from "../common/Card";
import FamilyTreeVisual from "./FamilyTreeVisual";
import LessonCard from "./LessonCard";
import PracticeModal from "./PracticeModal";

export default function LessonCategoryPage({ category, title, description, icon: Icon = BookOpen }) {
  const { isAuthenticated } = useAuth();
  const { lessons, isLoading, error, refetch } = useLessons(category);
  const [activeLesson, setActiveLesson] = useState(null);
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  const isAlphabet = category === "alphabet";

  const countsByLevel = useMemo(() => {
    const counts = { all: lessons.length, beginner: 0, intermediate: 0, advanced: 0 };
    lessons.forEach((l) => {
      const lvl = l.level || l.difficulty;
      if (counts[lvl] !== undefined) counts[lvl]++;
    });
    return counts;
  }, [lessons]);

  const filteredLessons = useMemo(() => {
    if (isAlphabet || difficultyFilter === "all") {
      return [...lessons].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }
    return [...lessons]
      .filter((l) => (l.difficulty || l.level) === difficultyFilter)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [lessons, difficultyFilter, isAlphabet]);

  // Group filtered lessons into ordered theme sections
  const themedSections = useMemo(() => {
    const hasThemes = filteredLessons.some((l) => l.theme);
    if (!hasThemes) {
      return [
        {
          theme: null,
          items: filteredLessons,
          completedCount: filteredLessons.filter((l) => l.completed).length,
        },
      ];
    }

    const groups = new Map();
    filteredLessons.forEach((lesson) => {
      const themeName = lesson.theme || "Core Signs";
      if (!groups.has(themeName)) {
        groups.set(themeName, []);
      }
      groups.get(themeName).push(lesson);
    });

    return Array.from(groups.entries()).map(([theme, items]) => ({
      theme,
      items: items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
      completedCount: items.filter((l) => l.completed).length,
    }));
  }, [filteredLessons]);

  const completedCount = lessons.filter((l) => l.completed).length;
  const progressPercent = lessons.length ? (completedCount / lessons.length) * 100 : 0;

  const handlePracticeClick = (lesson) => {
    if (!isAuthenticated) {
      setActiveLesson({ ...lesson, __guestBlocked: true });
      return;
    }
    setActiveLesson(lesson);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-signal-gradient text-void shadow-md shadow-signal/20">
              <Icon size={24} />
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold text-ink">{title}</h1>
            <p className="mt-1.5 max-w-lg text-ink-muted">{description}</p>
          </div>

          {lessons.length > 0 && (
            <div className="w-full max-w-xs">
              <div className="mb-1.5 flex justify-between text-sm">
                <span className="text-ink-muted">Overall Progress</span>
                <span className="font-mono text-ink">
                  {completedCount}/{lessons.length}
                </span>
              </div>
              <ProgressBar value={progressPercent} />
            </div>
          )}
        </div>

        {/* Filter bar with lesson counts (hidden for Alphabet) */}
        {!isAlphabet && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 pb-4">
            <div className="flex flex-wrap gap-2">
              {["all", "beginner", "intermediate", "advanced"].map((level) => {
                const count = countsByLevel[level] ?? 0;
                const isActive = difficultyFilter === level;

                return (
                  <button
                    key={level}
                    onClick={() => setDifficultyFilter(level)}
                    className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-all ${
                      isActive
                        ? "bg-signal text-void shadow-md scale-105"
                        : "bg-ink/5 text-ink-muted hover:bg-ink/10 hover:text-ink"
                    }`}
                  >
                    <span>{level}</span>
                    <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${isActive ? "bg-void/25 text-void" : "bg-ink/10 text-ink-faint"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <span className="text-xs text-ink-muted">
              Showing <strong className="text-ink">{filteredLessons.length} lessons</strong>
            </span>
          </div>
        )}

        {/* Level Progression Indicator showing X / N completed per level (hidden for Alphabet) */}
        {!isAlphabet && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-signal/20 bg-signal/5 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-signal text-void text-[10px] font-bold">✓</span>
              <span className="text-xs font-semibold text-ink capitalize">
                {difficultyFilter === "all" ? "Curriculum Progress:" : `${difficultyFilter} Progress:`}
              </span>
              <span className="text-xs text-signal font-medium">
                {difficultyFilter === "beginner" && "Greetings & basics → Family → Essentials"}
                {difficultyFilter === "intermediate" && "Everyday vocabulary across 6 themes"}
                {difficultyFilter === "advanced" && "28 Conversational phrases with prerequisites"}
                {difficultyFilter === "all" && "Beginner → Intermediate → Advanced ladder"}
              </span>
            </div>
            <span className="rounded-full bg-signal/15 px-2.5 py-0.5 text-[11px] font-mono font-bold text-signal-light">
              {filteredLessons.filter((l) => l.completed).length} / {filteredLessons.length} completed
            </span>
          </div>
        )}
        {/* Offline / Server Unreachable notice if fallback cache is being used */}
        {error && filteredLessons.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-200">
            <span>Offline mode: Server unreachable. Using local curriculum with progress sync paused.</span>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/20 px-2.5 py-1 text-xs font-semibold text-amber-100 hover:bg-amber-500/30 transition-colors"
            >
              <RefreshCw size={12} />
              Retry Sync
            </button>
          </div>
        )}
      </motion.div>

      <div className="mt-8 space-y-12">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton-shimmer h-64" />
            ))}
          </div>
        ) : error && filteredLessons.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border border-danger/20 bg-danger/5 p-8 text-center my-8">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-danger/10 text-danger mb-4">
              <AlertTriangle size={24} />
            </span>
            <h3 className="font-display text-lg font-bold text-ink">Unable to load lessons</h3>
            <p className="mt-2 text-sm text-ink-muted">
              We couldn't connect to the server to load lessons for this category. Please check your connection or retry.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button onClick={() => refetch()} className="btn-primary inline-flex items-center gap-2">
                <RefreshCw size={16} />
                Retry
              </button>
            </div>
          </div>
        ) : filteredLessons.length === 0 ? (
          <EmptyState
            icon={Icon}
            title="No lessons yet in this category"
            description="Check back soon — new content is added regularly."
          />
        ) : (
          themedSections.map((section, sIdx) => (
            <div key={section.theme || sIdx} className="space-y-4">
              {section.theme && (
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-lg font-bold text-ink sm:text-xl">
                      {section.theme}
                    </h2>
                    <span className="rounded-full bg-ink/10 px-2.5 py-0.5 text-xs font-mono font-semibold text-ink-muted">
                      {section.items.length}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-signal">
                    {section.completedCount} / {section.items.length} completed
                  </span>
                </div>
              )}

              {/* Step 3: Family Tree Visual when rendering Family theme */}
              {section.theme === "Family" && (
                <FamilyTreeVisual
                  onSelectMember={(memberId) => {
                    const found = lessons.find((x) => x.id === memberId);
                    if (found) handlePracticeClick(found);
                  }}
                  completedIds={new Set(lessons.filter((l) => l.completed).map((l) => l.id))}
                />
              )}

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {section.items.map((lesson) => (
                  <LessonCard key={lesson.id} lesson={lesson} onPractice={handlePracticeClick} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {activeLesson?.__guestBlocked && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-void/80 p-4 backdrop-blur-sm" onClick={() => setActiveLesson(null)}>
          <div className="glass-card max-w-sm p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-lg font-semibold text-ink">Create a free account to practice</h3>
            <p className="mt-2 text-sm text-ink-muted">Sign up to use your webcam for live practice and save your progress.</p>
            <Link to="/register" className="btn-primary mt-5 w-full">
              Sign up free
            </Link>
          </div>
        </div>
      )}

      {activeLesson && !activeLesson.__guestBlocked && (
        <PracticeModal lesson={activeLesson} onClose={() => setActiveLesson(null)} onSuccess={refetch} />
      )}
    </div>
  );
}
