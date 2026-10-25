/**
 * frontend/src/utils/adaptiveLearningEngine.js
 * 
 * SignVerse Adaptive Learning & Spaced Repetition Engine
 * 
 * Implements a modified Leitner / SM-2 spaced repetition algorithm:
 * - Tracks per-sign attempts, accuracy, streaks, intervals, and timestamps in localStorage (with try/catch).
 * - Categorizes signs into mastery levels: 'new' | 'learning' | 'mastered'.
 * - Computes urgency scores favoring weak and overdue signs for daily sessions.
 * - Provides calendar history tracking for streak and consistency visualization.
 */

import { ALL_LESSONS } from "../data/lessons.js";
function getLocalDateString(d = new Date()) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function safeGetStorage(key, fallback = null) {
  try {
    if (typeof window === "undefined" || !window.localStorage) return fallback;
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    return fallback;
  }
}

function safeSetStorage(key, value) {
  try {
    if (typeof window === "undefined" || !window.localStorage) return false;
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    return false;
  }
}

export const ADAPTIVE_STORAGE_KEYS = {
  SIGN_STATS: "signverse_adaptive_sign_stats",
  CALENDAR_HISTORY: "signverse_streak_calendar_history",
  PRACTICE_PROGRESS: "signverse_practice_progress",
};

/**
 * Leitner Box intervals in days
 * Box 1: 1 day (daily review)
 * Box 2: 3 days
 * Box 3: 7 days (weekly)
 * Box 4: 14 days (bi-weekly)
 * Box 5: 30 days (monthly retention check)
 */
export const LEITNER_INTERVALS_DAYS = {
  1: 1,
  2: 3,
  3: 7,
  4: 14,
  5: 30,
};

/**
 * Mastery classification rules
 */
export function calculateMastery(stat) {
  if (!stat || !stat.timesPracticed || stat.timesPracticed === 0) {
    return "new";
  }
  // Mastered requires at least 3 attempts, >= 80% accuracy, and at least Box 3
  if (stat.timesPracticed >= 3 && stat.accuracy >= 0.80 && (stat.box || 1) >= 3) {
    return "mastered";
  }
  return "learning";
}

/**
 * Calculate updated Leitner / SM-2 schedule for a sign
 * 
 * @param {Object} previousStat Previous stat record or null
 * @param {boolean} isCorrect Whether current attempt was correct
 * @param {Date|number|string} now Current timestamp reference
 * @returns {Object} Updated statistics and schedule
 */
export function calculateLeitnerSchedule(previousStat, isCorrect, now = new Date()) {
  const prevBox = previousStat?.box || 1;
  const prevConsecutive = previousStat?.consecutiveCorrect || 0;
  const prevAttempts = previousStat?.timesPracticed || 0;
  const prevCorrect = previousStat?.timesCorrect || 0;

  const timesPracticed = prevAttempts + 1;
  const timesCorrect = prevCorrect + (isCorrect ? 1 : 0);
  const accuracy = Math.round((timesCorrect / timesPracticed) * 100) / 100;

  let box;
  let consecutiveCorrect;
  let intervalDays;

  if (isCorrect) {
    box = Math.min(5, prevBox + 1);
    consecutiveCorrect = prevConsecutive + 1;
    intervalDays = LEITNER_INTERVALS_DAYS[box] || 30;
  } else {
    // Drop back to Box 1 for immediate review reinforcement
    box = 1;
    consecutiveCorrect = 0;
    intervalDays = LEITNER_INTERVALS_DAYS[1];
  }

  const currentDate = new Date(now);
  const lastPracticedDate = getLocalDateString(currentDate);
  const lastPracticedTimestamp = currentDate.getTime();

  // Next due date = today + intervalDays
  const dueDate = new Date(currentDate);
  dueDate.setDate(dueDate.getDate() + intervalDays);
  const nextDueDate = getLocalDateString(dueDate);
  const nextDueTimestamp = dueDate.getTime();

  const tempStat = {
    timesPracticed,
    timesCorrect,
    accuracy,
    box,
  };
  const masteryLevel = calculateMastery(tempStat);

  return {
    timesPracticed,
    timesCorrect,
    accuracy,
    consecutiveCorrect,
    box,
    intervalDays,
    lastPracticedDate,
    lastPracticedTimestamp,
    nextDueDate,
    nextDueTimestamp,
    masteryLevel,
  };
}

/**
 * Safely retrieve all adaptive sign statistics from localStorage
 */
export function getAllAdaptiveSignStats() {
  try {
    return safeGetStorage(ADAPTIVE_STORAGE_KEYS.SIGN_STATS, {}) || {};
  } catch (err) {
    console.debug("[adaptiveEngine] Error reading sign stats:", err);
    return {};
  }
}

/**
 * Retrieve statistics for a single sign
 */
export function getSignStat(signId) {
  const all = getAllAdaptiveSignStats();
  return (
    all[signId] || {
      timesPracticed: 0,
      timesCorrect: 0,
      accuracy: 0,
      consecutiveCorrect: 0,
      box: 1,
      intervalDays: 1,
      lastPracticedDate: null,
      lastPracticedTimestamp: null,
      nextDueDate: null,
      nextDueTimestamp: null,
      masteryLevel: "new",
    }
  );
}

/**
 * Record a sign practice attempt and update Leitner schedule in localStorage
 */
export function recordAdaptiveAttempt(signId, isCorrect, options = {}) {
  try {
    const all = getAllAdaptiveSignStats();
    const prev = all[signId] || null;
    const now = options.now || new Date();

    const updated = calculateLeitnerSchedule(prev, isCorrect, now);
    all[signId] = updated;

    safeSetStorage(ADAPTIVE_STORAGE_KEYS.SIGN_STATS, all);

    // Also update calendar streak history
    recordCalendarActivity(getLocalDateString(now), 1);

    return updated;
  } catch (err) {
    console.debug("[adaptiveEngine] Error recording attempt:", err);
    return null;
  }
}

/**
 * Record activity for the streak calendar
 */
export function recordCalendarActivity(dateStr = getLocalDateString(), count = 1) {
  try {
    const history = safeGetStorage(ADAPTIVE_STORAGE_KEYS.CALENDAR_HISTORY, {}) || {};
    const existing = history[dateStr] || { count: 0, date: dateStr };
    history[dateStr] = {
      ...existing,
      count: existing.count + count,
      date: dateStr,
      lastUpdated: Date.now(),
    };
    safeSetStorage(ADAPTIVE_STORAGE_KEYS.CALENDAR_HISTORY, history);
    return history[dateStr];
  } catch (err) {
    console.debug("[adaptiveEngine] Error recording calendar activity:", err);
    return null;
  }
}

/**
 * Get calendar activity history for the last N days
 */
export function getStreakCalendarHistory(daysBack = 35, referenceDate = new Date()) {
  try {
    const history = safeGetStorage(ADAPTIVE_STORAGE_KEYS.CALENDAR_HISTORY, {}) || {};
    const days = [];

    for (let i = daysBack - 1; i >= 0; i--) {
      const d = new Date(referenceDate);
      d.setDate(d.getDate() - i);
      const dateStr = getLocalDateString(d);
      const activity = history[dateStr];

      days.push({
        date: dateStr,
        dayOfWeek: d.toLocaleDateString("en-US", { weekday: "narrow" }),
        dayOfMonth: d.getDate(),
        month: d.toLocaleDateString("en-US", { month: "short" }),
        count: activity?.count || 0,
        hasActivity: Boolean(activity && activity.count > 0),
        intensity: !activity || activity.count === 0 ? 0 : activity.count >= 6 ? 3 : activity.count >= 3 ? 2 : 1,
      });
    }

    // Compute consecutive streak ending today or yesterday
    let currentStreak = 0;
    const todayStr = getLocalDateString(referenceDate);
    const yestDate = new Date(referenceDate);
    yestDate.setDate(yestDate.getDate() - 1);
    const yesterdayStr = getLocalDateString(yestDate);

    let checkDate = new Date(referenceDate);
    // If today has no activity yet, start check from yesterday
    if (!history[todayStr] || history[todayStr].count === 0) {
      if (history[yesterdayStr] && history[yesterdayStr].count > 0) {
        checkDate = yestDate;
      }
    }

    for (let dayOffset = 0; dayOffset < 365; dayOffset++) {
      const dStr = getLocalDateString(checkDate);
      if (history[dStr] && history[dStr].count > 0) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return {
      days,
      currentStreak,
      totalPracticedDays: Object.keys(history).filter((k) => history[k]?.count > 0).length,
    };
  } catch (err) {
    console.debug("[adaptiveEngine] Error generating calendar history:", err);
    return { days: [], currentStreak: 0, totalPracticedDays: 0 };
  }
}

/**
 * Compute urgency score favoring weak and overdue signs
 * Higher score = higher priority to review today
 */
export function calculateUrgencyScore(lesson, stat, now = new Date()) {
  if (!stat || !stat.timesPracticed || stat.timesPracticed === 0) {
    return 10; // Baseline priority for new material
  }

  const currentMs = now.getTime();
  const dueMs = stat.nextDueTimestamp || new Date(stat.nextDueDate || stat.lastPracticedDate).getTime();
  const msOverdue = currentMs - dueMs;
  const daysOverdue = msOverdue / (1000 * 60 * 60 * 24);

  // Weakness factor: 0.0 (100% accurate) to 1.0 (0% accurate)
  const weakness = 1.0 - (stat.accuracy ?? 1.0);

  // Box penalty: Box 1 needs immediate daily reinforcement
  const boxPenalty = (6 - (stat.box || 1)) * 1.5;

  // Overdue boost: overdue signs escalate rapidly
  const overdueScore = daysOverdue >= 0 ? daysOverdue * 4.0 : daysOverdue * 0.5;
  const weaknessScore = weakness * 15.0;

  return overdueScore + weaknessScore + boxPenalty;
}

/**
 * Select adaptive daily session items favoring weak and overdue signs
 */
export function selectAdaptiveReviewItems(lessons = ALL_LESSONS, count = 3, now = new Date()) {
  const stats = getAllAdaptiveSignStats();

  // Partition lessons with stats
  const scored = lessons.map((lesson) => {
    const stat = stats[lesson.id] || null;
    const urgency = calculateUrgencyScore(lesson, stat, now);
    return {
      lesson,
      stat,
      urgency,
    };
  });

  // Filter for items that have been practiced before (eligible for review)
  const practicedOnly = scored.filter((s) => s.stat && s.stat.timesPracticed > 0);

  // Sort by urgency descending (weakest and most overdue first)
  practicedOnly.sort((a, b) => b.urgency - a.urgency);

  return practicedOnly.slice(0, count).map((item) => item.lesson);
}

/**
 * Returns the weakest N signs based on accuracy and total mistakes
 */
export function getWeakestSigns(lessons = ALL_LESSONS, count = 5) {
  try {
    const stats = getAllAdaptiveSignStats();
    const practiced = [];

    lessons.forEach((lesson) => {
      const s = stats[lesson.id];
      if (s && s.timesPracticed > 0) {
        const mistakes = s.timesPracticed - s.timesCorrect;
        practiced.push({
          lesson,
          stat: s,
          accuracy: s.accuracy,
          timesPracticed: s.timesPracticed,
          mistakes,
          lastPracticedDate: s.lastPracticedDate,
        });
      }
    });

    // Sort by lowest accuracy first, then highest number of mistakes
    practiced.sort((a, b) => {
      if (a.accuracy !== b.accuracy) {
        return a.accuracy - b.accuracy; // ascending: lowest accuracy first
      }
      return b.mistakes - a.mistakes; // descending: most mistakes first
    });

    return practiced.slice(0, count);
  } catch (err) {
    console.debug("[adaptiveEngine] Error computing weakest signs:", err);
    return [];
  }
}

/**
 * Returns overall mastery level breakdown across all signs
 */
export function getMasteryBreakdown(lessons = ALL_LESSONS) {
  try {
    const stats = getAllAdaptiveSignStats();
    let newCount = 0;
    let learningCount = 0;
    let masteredCount = 0;

    const items = lessons.map((lesson) => {
      const s = stats[lesson.id];
      const level = calculateMastery(s);

      if (level === "mastered") masteredCount++;
      else if (level === "learning") learningCount++;
      else newCount++;

      return {
        lesson,
        stat: s || {
          timesPracticed: 0,
          timesCorrect: 0,
          accuracy: 0,
          box: 1,
          masteryLevel: "new",
        },
        masteryLevel: level,
      };
    });

    const total = lessons.length;
    return {
      total,
      newCount,
      learningCount,
      masteredCount,
      masteredPercent: total > 0 ? Math.round((masteredCount / total) * 100) : 0,
      learningPercent: total > 0 ? Math.round((learningCount / total) * 100) : 0,
      newPercent: total > 0 ? Math.round((newCount / total) * 100) : 0,
      items,
    };
  } catch (err) {
    console.debug("[adaptiveEngine] Error computing mastery breakdown:", err);
    return {
      total: lessons.length,
      newCount: lessons.length,
      learningCount: 0,
      masteredCount: 0,
      masteredPercent: 0,
      learningPercent: 0,
      newPercent: 100,
      items: [],
    };
  }
}
