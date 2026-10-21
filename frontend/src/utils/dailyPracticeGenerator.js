/**
 * frontend/src/utils/dailyPracticeGenerator.js
 * 
 * SignVerse Spaced Repetition Content Generation Engine
 * 
 * - Generates an 8-item session:
 *   - 4 new items
 *   - 3 review items (weakest accuracy or oldest lastPracticed date)
 *   - 1 challenge item (compound numbers, multi-sign phrases, or complex motion)
 * - Assigns 4 exercise types:
 *   1. watch_and_copy (Camera matching with GestureAnimation)
 *   2. pick_correct_sign (1 prompt label -> 4 sign animation cards)
 *   3. which_word (1 sign animation -> 4 word text options)
 *   4. order_sequence (Order digits for compound numbers or words for phrases)
 * - Deterministic daily featured signs generator (at least 6 cards) with daily rotation seed
 * - Safe localStorage persistence inside try/catch for streaks, XP, item stats, and daily completions
 */

import { ALL_LESSONS } from "../data/lessons.js";
import { getCompletedLessonIds, markLessonCompleted } from "../data/quizCatalog.js";
import { recordAdaptiveAttempt, calculateUrgencyScore } from "./adaptiveLearningEngine.js";

export const STORAGE_KEYS = {
  PROGRESS: "signverse_practice_progress",
  ITEM_STATS: "signverse_practice_item_stats",
  DAILY_PREFIX: "signverse_daily_completed_",
  COMPLETED_LESSONS: "signverse_completed_lessons",
};

/**
 * Returns today's local date string formatted as YYYY-MM-DD
 */
export function getLocalDateString(d = new Date()) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Returns yesterday's local date string formatted as YYYY-MM-DD
 */
export function getYesterdayDateString() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return getLocalDateString(d);
}

/**
 * Safe localStorage reader with fallback
 */
export function safeGetStorage(key, fallback = null) {
  try {
    if (typeof window === "undefined" || !window.localStorage) return fallback;
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.debug(`[dailyPractice] Failed to read ${key} from localStorage:`, err);
    return fallback;
  }
}

/**
 * Safe localStorage writer
 */
export function safeSetStorage(key, value) {
  try {
    if (typeof window === "undefined" || !window.localStorage) return false;
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.debug(`[dailyPractice] Failed to write ${key} to localStorage:`, err);
    return false;
  }
}

/**
 * Get current user progress (streak, XP, unlocked levels, sessions completed)
 */
export function getPracticeProgress() {
  const fallback = {
    xp: 0,
    streak: 1,
    lastPracticeDate: getLocalDateString(),
    sessionsCompleted: 0,
    completedItemIds: [],
    unlockedLevels: ["beginner"],
  };

  const stored = safeGetStorage(STORAGE_KEYS.PROGRESS, fallback);
  return { ...fallback, ...stored };
}

/**
 * Save updated user progress to localStorage
 */
export function savePracticeProgress(updater) {
  const current = getPracticeProgress();
  const updated = typeof updater === "function" ? updater(current) : { ...current, ...updater };
  safeSetStorage(STORAGE_KEYS.PROGRESS, updated);
  return updated;
}

/**
 * Get spaced repetition statistics for all items
 * Structure: { [lessonId]: { timesPracticed: number, timesCorrect: number, lastPracticedDate: string, score: number } }
 */
export function getItemStats() {
  return safeGetStorage(STORAGE_KEYS.ITEM_STATS, {}) || {};
}

/**
 * Update spaced repetition stats after completing an item in session
 */
export function recordItemPractice(lessonId, isCorrect) {
  try {
    const stats = getItemStats();
    const today = getLocalDateString();
    const prev = stats[lessonId] || {
      timesPracticed: 0,
      timesCorrect: 0,
      lastPracticedDate: today,
      score: 1.0,
    };

    const timesPracticed = prev.timesPracticed + 1;
    const timesCorrect = prev.timesCorrect + (isCorrect ? 1 : 0);
    const score = Math.round((timesCorrect / timesPracticed) * 100) / 100;

    stats[lessonId] = {
      timesPracticed,
      timesCorrect,
      lastPracticedDate: today,
      score,
    };

    safeSetStorage(STORAGE_KEYS.ITEM_STATS, stats);
    // Sync with adaptive learning engine
    recordAdaptiveAttempt(lessonId, isCorrect);

    if (isCorrect) {
      markLessonCompleted(lessonId);
      recordDailyCompletedItem(lessonId, today);
    }
    return stats[lessonId];
  } catch (err) {
    console.debug("[dailyPractice] Failed to record item practice:", err);
    return null;
  }
}

/**
 * Get set of lesson IDs completed today
 */
export function getDailyCompletedIds(dateStr = getLocalDateString()) {
  const key = `${STORAGE_KEYS.DAILY_PREFIX}${dateStr}`;
  const raw = safeGetStorage(key, []);
  return new Set(Array.isArray(raw) ? raw : []);
}

/**
 * Mark a lesson ID as completed today
 */
export function recordDailyCompletedItem(lessonId, dateStr = getLocalDateString()) {
  try {
    const key = `${STORAGE_KEYS.DAILY_PREFIX}${dateStr}`;
    const set = getDailyCompletedIds(dateStr);
    set.add(lessonId);
    safeSetStorage(key, Array.from(set));
  } catch (err) {
    console.debug("[dailyPractice] Failed to record daily completion:", err);
  }
}

/**
 * Simple deterministic pseudo-random number generator from string seed
 */
function seededRandom(seedStr) {
  let h = 0x811c9dc5;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

/**
 * Generates "Today's Featured Signs" (at least 6 cards)
 * Rotates deterministically each day based on the calendar date.
 */
export function getDailyFeaturedSigns(lessons = ALL_LESSONS, count = 6, dateStr = getLocalDateString()) {
  const rng = seededRandom(`signverse-featured-${dateStr}`);
  
  // Categorize pool to guarantee variety (alphabet, numbers, words/greetings/phrases)
  const alphabet = lessons.filter((l) => l.category === "alphabet");
  const numbers = lessons.filter((l) => l.category === "numbers");
  const greetings = lessons.filter((l) => l.category === "greetings");

  const pickRandom = (arr, n) => {
    const copy = [...arr];
    const picked = [];
    for (let i = 0; i < n && copy.length > 0; i++) {
      const idx = Math.floor(rng() * copy.length);
      picked.push(copy.splice(idx, 1)[0]);
    }
    return picked;
  };

  // 2 alphabet, 2 numbers, 2 greetings/phrases
  const selected = [
    ...pickRandom(alphabet, 2),
    ...pickRandom(numbers, 2),
    ...pickRandom(greetings, count - 4),
  ];

  // Fill up if any category was empty
  if (selected.length < count) {
    const remaining = lessons.filter((l) => !selected.some((s) => s.id === l.id));
    selected.push(...pickRandom(remaining, count - selected.length));
  }

  // Shuffle selected items deterministically
  return selected.sort(() => rng() - 0.5);
}

/**
 * Unlock rules definition
 */
export function getUnlockStatus(progress) {
  const xp = progress?.xp || 0;
  const sessions = progress?.sessionsCompleted || 0;
  const unlocked = new Set(progress?.unlockedLevels || ["beginner"]);

  const isIntermediateUnlocked = unlocked.has("intermediate") || sessions >= 1 || xp >= 100;
  const isAdvancedUnlocked = unlocked.has("advanced") || sessions >= 2 || xp >= 250;

  return {
    beginner: {
      unlocked: true,
      title: "Beginner",
      subtitle: "Letters A–Z, Numbers 0–10, Essential Greetings",
      rule: "Unlocked for all learners",
      statusText: "Ready to practice",
    },
    intermediate: {
      unlocked: isIntermediateUnlocked,
      title: "Intermediate",
      subtitle: "Numbers 11–100, 25+ Everyday Words, Family & Food",
      rule: "Complete 1 Beginner session or reach 100 XP to unlock",
      statusText: isIntermediateUnlocked ? "Unlocked" : `Locked (${sessions}/1 session, ${xp}/100 XP)`,
    },
    advanced: {
      unlocked: isAdvancedUnlocked,
      title: "Advanced",
      subtitle: "Multi-sign phrases, full sentences, & numbers 100–1000",
      rule: "Complete 1 Intermediate session or reach 250 XP to unlock",
      statusText: isAdvancedUnlocked ? "Unlocked" : `Locked (${sessions}/2 sessions, ${xp}/250 XP)`,
    },
  };
}

/**
 * Helper to pick N random distractors from candidate lessons
 */
function pickDistractors(targetLesson, pool, count = 3) {
  const candidates = pool.filter(
    (item) => item.id !== targetLesson.id && item.label !== targetLesson.label
  );
  const shuffled = [...candidates].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Extracts sequence tokens for an item (for "order_sequence" exercise)
 */
function getSequenceTokensForItem(lesson) {
  // If item already defines tokens, use them
  if (lesson.tokens && lesson.tokens.length > 1) {
    return lesson.tokens.map((t, idx) => ({
      id: `tok-${idx}-${t.id || t.label}`,
      label: t.label,
      signKey: t.signKey || t.label,
    }));
  }

  // If compound number (e.g., Number 42, 55, 64, 100)
  const numMatch = lesson.label.match(/number\s+(\d+)/i);
  if (numMatch) {
    const digits = numMatch[1].split("");
    if (digits.length > 1) {
      return digits.map((d, idx) => ({
        id: `digit-${idx}-${d}`,
        label: d,
        signKey: `num-${d}`,
      }));
    }
  }

  // If multi-word phrase or greeting (e.g., "Thank you", "Good morning", "Where Is My Mom?")
  const words = lesson.label
    .replace(/[?!.,]/g, "")
    .trim()
    .split(/\s+/);

  if (words.length > 1) {
    return words.map((w, idx) => ({
      id: `word-${idx}-${w}`,
      label: w,
      signKey: w.toLowerCase(),
    }));
  }

  // Fallback: character spelling of short sign or two digits
  return lesson.label.split("").slice(0, 4).map((char, idx) => ({
    id: `char-${idx}-${char}`,
    label: char.toUpperCase(),
    signKey: char.toLowerCase(),
  }));
}

/**
 * Spaced Repetition Session Generator
 * 
 * Selects 8 items:
 * - 4 New items (never completed or unpracticed)
 * - 3 Review items (weakest accuracy first, then oldest practiced date)
 * - 1 Challenge item (compound numbers, multi-sign phrases, or advanced)
 * 
 * Maps them into 4 distinct exercise types:
 * 1. watch_and_copy (2 items)
 * 2. pick_correct_sign (2 items)
 * 3. which_word (2 items)
 * 4. order_sequence (2 items)
 */
export function generateSpacedRepetitionSession(level = "beginner", pool = ALL_LESSONS) {
  const itemStats = getItemStats();
  const completedIds = getCompletedLessonIds();
  const progress = getPracticeProgress();
  (progress.completedItemIds || []).forEach((id) => completedIds.add(id));

  // Filter pool by chosen level
  let eligibleLessons = pool;
  if (level === "beginner") {
    eligibleLessons = pool.filter((l) => l.level === "beginner");
  } else if (level === "intermediate") {
    // Intermediate includes intermediate signs plus essential beginner signs for review
    eligibleLessons = pool.filter((l) => l.level === "intermediate" || l.level === "beginner");
  } else if (level === "advanced") {
    // Advanced includes advanced phrases plus intermediate/beginner
    eligibleLessons = pool;
  }

  if (eligibleLessons.length === 0) {
    eligibleLessons = pool;
  }

  // Partition pool into New vs Review vs Challenge candidates
  const newPool = [];
  const reviewPool = [];
  const challengePool = [];

  eligibleLessons.forEach((lesson) => {
    const isCompleted = completedIds.has(lesson.id);
    const stat = itemStats[lesson.id];
    const isMultiToken = (lesson.tokens && lesson.tokens.length > 1) || (lesson.category === "numbers" && /\d{2,}/.test(lesson.label));
    const isAdvancedLevel = lesson.level === "advanced";

    // Potential challenge items: compound signs, phrases, or advanced tier
    if (isMultiToken || isAdvancedLevel) {
      challengePool.push(lesson);
    }

    if (!isCompleted && !stat) {
      newPool.push(lesson);
    } else {
      const urgency = calculateUrgencyScore(lesson, stat);
      reviewPool.push({
        lesson,
        stat: stat || { score: 1.0, timesPracticed: 1, lastPracticedDate: "2020-01-01" },
        urgency,
      });
    }
  });

  // Sort review pool: highest urgency score first (favoring weak and overdue signs)
  reviewPool.sort((a, b) => b.urgency - a.urgency);

  // 1. Pick 1 Challenge item
  let challengeItem = null;
  const challengeCandidates = challengePool.length > 0 ? challengePool : eligibleLessons;
  const shuffledChallenge = [...challengeCandidates].sort(() => Math.random() - 0.5);
  challengeItem = shuffledChallenge[0] || eligibleLessons[0];

  // 2. Pick 4 New items
  const shuffledNew = [...newPool.filter((l) => l.id !== challengeItem.id)].sort(() => Math.random() - 0.5);
  const pickedNew = shuffledNew.slice(0, 4);

  // If not enough new items, backfill from review pool
  const remainingForNew = 4 - pickedNew.length;
  if (remainingForNew > 0) {
    const backfillCandidates = reviewPool
      .map((r) => r.lesson)
      .filter((l) => l.id !== challengeItem.id && !pickedNew.some((p) => p.id === l.id));
    pickedNew.push(...backfillCandidates.slice(0, remainingForNew));
  }

  // 3. Pick 3 Review items
  const pickedReview = [];
  const excludedIds = new Set([challengeItem.id, ...pickedNew.map((p) => p.id)]);
  for (const item of reviewPool) {
    if (pickedReview.length >= 3) break;
    if (!excludedIds.has(item.lesson.id)) {
      pickedReview.push(item.lesson);
      excludedIds.add(item.lesson.id);
    }
  }

  // If review pool had fewer than 3, backfill from remaining newPool or general pool
  if (pickedReview.length < 3) {
    const remainingEligible = eligibleLessons.filter((l) => !excludedIds.has(l.id));
    const extra = [...remainingEligible].sort(() => Math.random() - 0.5).slice(0, 3 - pickedReview.length);
    pickedReview.push(...extra);
    extra.forEach((e) => excludedIds.add(e.id));
  }

  // Guarantee total 8 items: 4 new, 3 review, 1 challenge
  const final8Lessons = [
    ...pickedNew.map((l) => ({ lesson: l, categoryTag: "new" })),
    ...pickedReview.map((l) => ({ lesson: l, categoryTag: "review" })),
    { lesson: challengeItem, categoryTag: "challenge" },
  ];

  // If somehow still under 8, pad with random eligible
  while (final8Lessons.length < 8) {
    const unused = eligibleLessons.filter((l) => !final8Lessons.some((f) => f.lesson.id === l.id));
    const pick = unused.length > 0 ? unused[0] : eligibleLessons[0];
    final8Lessons.push({ lesson: pick, categoryTag: "review" });
  }

  // Distribute the 4 exercise types across the 8 items:
  // - 2x "watch_and_copy" (Camera)
  // - 2x "pick_correct_sign" (Word prompt -> 4 sign animation cards)
  // - 2x "which_word" (1 sign animation -> 4 word text options)
  // - 2x "order_sequence" (Order digits or words)
  const exerciseTypeOrder = [
    "watch_and_copy",
    "which_word",
    "pick_correct_sign",
    "order_sequence",
    "watch_and_copy",
    "pick_correct_sign",
    "which_word",
    "order_sequence", // Challenge item placed here at the climax!
  ];

  return final8Lessons.slice(0, 8).map((entry, idx) => {
    const { lesson, categoryTag } = entry;
    const type = exerciseTypeOrder[idx];

    // Build distractors for multiple choice exercises
    const distractors = pickDistractors(lesson, eligibleLessons, 3);

    if (type === "watch_and_copy") {
      return {
        id: `session-ex-${idx}-${lesson.id}`,
        type: "watch_and_copy",
        categoryTag,
        lesson,
        title: `Copy the sign for "${lesson.label}"`,
        subtitle: "Position your hand in front of the camera and match the reference gesture guide.",
        xpReward: categoryTag === "challenge" ? 25 : 15,
      };
    }

    if (type === "pick_correct_sign") {
      // 4 sign animation choices (target + 3 distractors)
      const options = [lesson, ...distractors].sort(() => Math.random() - 0.5);
      return {
        id: `session-ex-${idx}-${lesson.id}`,
        type: "pick_correct_sign",
        categoryTag,
        lesson,
        title: `Which sign means "${lesson.label}"?`,
        subtitle: "Inspect the 4 animated gesture guides and select the correct sign.",
        options,
        correctLessonId: lesson.id,
        xpReward: categoryTag === "challenge" ? 20 : 12,
      };
    }

    if (type === "which_word") {
      // 1 central animation -> 4 word options
      const options = [lesson.label, ...distractors.map((d) => d.label)].sort(() => Math.random() - 0.5);
      return {
        id: `session-ex-${idx}-${lesson.id}`,
        type: "which_word",
        categoryTag,
        lesson,
        title: "Which word or number is this sign?",
        subtitle: "Watch the animation closely and pick the matching phrase or letter.",
        options,
        correctAnswer: lesson.label,
        xpReward: categoryTag === "challenge" ? 20 : 12,
      };
    }

    // "order_sequence" (for numbers and phrases)
    const expectedTokens = getSequenceTokensForItem(lesson);
    const scrambledTokens = [...expectedTokens].sort(() => Math.random() - 0.5);

    return {
      id: `session-ex-${idx}-${lesson.id}`,
      type: "order_sequence",
      categoryTag,
      lesson,
      title: `Order the signs: "${lesson.label}"`,
      subtitle: lesson.category === "numbers" 
        ? "Tap the digits in the correct left-to-right order." 
        : "Tap each sign in the correct conversational sequence.",
      expectedTokens,
      scrambledTokens,
      xpReward: categoryTag === "challenge" ? 30 : 18,
    };
  });
}
