/**
 * frontend/src/utils/learningPathEngine.js
 * 
 * SignVerse Winding Vertical Learning Path Engine
 * 
 * Defines the 7 progressive learning units in exact pedagogical sequence:
 * 1. Alphabet (A-Z)
 * 2. Numbers (0-10 & compound)
 * 3. Greetings (Basics & essentials)
 * 4. Family (Core & extended family)
 * 5. Everyday Words (Themes: Colors, Days, Months, Food, Animals, Verbs, etc.)
 * 6. Phrases (Daily conversation, courtesy, essential needs)
 * 7. Advanced Sentences (Multi-sign sentences: school, work, family, social)
 * 
 * Unlock Rule:
 * - Unit 0 (Alphabet) is unlocked by default.
 * - Each subsequent unit unlocks when the previous unit reaches >= 60% completion.
 * - The active ("current") unit is the first unlocked unit that is not yet 100% completed.
 */

import { ALL_LESSONS } from "../data/lessons.js";

export const UNLOCK_THRESHOLD = 0.60; // 60% completion required to unlock next unit

export const UNIT_CONFIGS = [
  {
    id: "alphabet",
    order: 1,
    title: "Alphabet",
    subtitle: "A-Z Manual Handshapes",
    description: "Master the 26-letter manual fingerspelling alphabet to spell any name or word.",
    to: "/learn/alphabet",
    illustration: "/signs/asl/A.svg",
    illustrationAlt: "ASL sign for letter A",
    badgeLabel: "Foundation",
    accent: "signal",
    match: (l) => l.category === "alphabet",
  },
  {
    id: "numbers",
    order: 2,
    title: "Numbers",
    subtitle: "Digits 0-10 & Counting",
    description: "Sign 0 through 10, compound double digits, and multi-digit quantities.",
    to: "/learn/numbers",
    illustration: "/signs/asl/1.svg",
    illustrationAlt: "ASL sign for number 1",
    badgeLabel: "Counting",
    accent: "pulse",
    match: (l) => l.category === "numbers",
  },
  {
    id: "greetings",
    order: 3,
    title: "Greetings",
    subtitle: "Everyday Welcomes & Politeness",
    description: "Hello, please, thank you, sorry, welcome — polite daily interactions.",
    to: "/learn/common-words",
    illustration: "/signs/asl/hello.svg",
    illustrationAlt: "ASL sign for Hello",
    badgeLabel: "Essentials",
    accent: "warm",
    match: (l) =>
      l.category === "greetings" &&
      ["Greetings and basics", "Essentials"].includes(l.theme),
  },
  {
    id: "family",
    order: 4,
    title: "Family",
    subtitle: "Relations & Close Connections",
    description: "Mom, dad, brother, sister, grandparents, and close social circles.",
    to: "/learn/common-words",
    illustration: "/signs/asl/family.svg",
    illustrationAlt: "ASL sign for Family",
    badgeLabel: "Social",
    accent: "pulse",
    match: (l) =>
      l.category === "greetings" &&
      ["Family", "Extended family"].includes(l.theme),
  },
  {
    id: "everyday-words",
    order: 5,
    title: "Everyday Words",
    subtitle: "Core Vocabulary & Themes",
    description: "Colors, days of the week, months, animals, food, home, and common action verbs.",
    to: "/learn/common-words",
    illustration: "/signs/asl/food.svg",
    illustrationAlt: "ASL sign for Food",
    badgeLabel: "Vocabulary",
    accent: "signal",
    match: (l) =>
      l.category === "greetings" &&
      ![
        "Greetings and basics",
        "Essentials",
        "Family",
        "Extended family",
        "Feelings and daily conversation",
        "Courtesy and communication",
        "Needs and health",
        "Family and social",
        "School and work",
      ].includes(l.theme),
  },
  {
    id: "phrases",
    order: 6,
    title: "Phrases",
    subtitle: "Conversational Interactions",
    description: "How are you?, what is your name?, see you later, and essential daily expressions.",
    to: "/learn/common-words",
    illustration: "/signs/asl/thank_you.svg",
    illustrationAlt: "ASL sign for Thank You",
    badgeLabel: "Conversation",
    accent: "warm",
    match: (l) =>
      l.category === "greetings" &&
      [
        "Feelings and daily conversation",
        "Courtesy and communication",
        "Needs and health",
      ].includes(l.theme),
  },
  {
    id: "advanced-sentences",
    order: 7,
    title: "Advanced Sentences",
    subtitle: "Full Dynamic ASL Clauses",
    description: "Structured multi-sign sentences across school, work, healthcare, and storytelling.",
    to: "/learn/common-words",
    illustration: "/signs/asl/love.svg",
    illustrationAlt: "ASL sign for Love",
    badgeLabel: "Mastery",
    accent: "signal",
    match: (l) =>
      l.category === "greetings" &&
      ["Family and social", "School and work"].includes(l.theme),
  },
];

/**
 * Filter lessons belonging to a specific unit config
 */
export function getUnitLessons(unitConfig, allLessons = ALL_LESSONS) {
  if (!unitConfig || typeof unitConfig.match !== "function") return [];
  return allLessons.filter(unitConfig.match);
}

/**
 * Calculate progress for an array of lessons given completed IDs
 */
export function calculateProgress(lessons = [], completedIds = new Set()) {
  const completedSet = completedIds instanceof Set ? completedIds : new Set(completedIds || []);
  const total = lessons.length;
  if (total === 0) {
    return {
      total: 0,
      completed: 0,
      percent: 0,
      isCompleted: false,
    };
  }

  const completed = lessons.filter(
    (l) => l.completed || completedSet.has(l.id)
  ).length;

  const percent = Math.round((completed / total) * 100);
  const isCompleted = completed >= total && total > 0;

  return {
    total,
    completed,
    percent,
    isCompleted,
  };
}

/**
 * Compute the complete state for all 7 learning path units
 * 
 * @param {Array} allLessons - Full list of lessons (defaults to ALL_LESSONS)
 * @param {Set|Array} completedLessonIds - Set of completed lesson IDs
 * @returns {Array} Array of computed unit objects with state and unlock metadata
 */
export function computeLearningPathUnits(allLessons = ALL_LESSONS, completedLessonIds = new Set()) {
  const completedSet = completedLessonIds instanceof Set
    ? completedLessonIds
    : new Set(completedLessonIds || []);

  const computedUnits = [];

  for (let i = 0; i < UNIT_CONFIGS.length; i++) {
    const config = UNIT_CONFIGS[i];
    const lessons = getUnitLessons(config, allLessons);
    const progress = calculateProgress(lessons, completedSet);

    let isUnlocked = false;
    let unlockRuleText = "";
    let previousUnitTitle = null;
    let previousUnitPercent = 0;

    if (i === 0) {
      // Unit 1 (Alphabet) is always unlocked
      isUnlocked = true;
    } else {
      const prevComputed = computedUnits[i - 1];
      previousUnitTitle = prevComputed.title;
      previousUnitPercent = prevComputed.progressPercent;
      // Next unit unlocks at 60% completion of the previous one
      isUnlocked = prevComputed.progressPercent >= Math.round(UNLOCK_THRESHOLD * 100);

      if (!isUnlocked) {
        unlockRuleText = `Unlocks when ${previousUnitTitle} reaches 60% completion (currently ${previousUnitPercent}%)`;
      }
    }

    computedUnits.push({
      ...config,
      lessons,
      totalLessons: progress.total,
      completedCount: progress.completed,
      progressPercent: progress.percent,
      isCompleted: progress.isCompleted,
      isUnlocked,
      unlockRuleText,
      previousUnitTitle,
      previousUnitPercent,
      // Temporary flags, refined in step below
      isCurrent: false,
      state: "locked",
    });
  }

  // Determine which unit is the "current" unit:
  // The first unlocked unit that is not yet completed.
  // If all unlocked units are completed, the last unlocked unit is current.
  let currentUnitIndex = computedUnits.findIndex((u) => u.isUnlocked && !u.isCompleted);
  if (currentUnitIndex === -1) {
    // All unlocked units are complete, pick the latest unlocked unit
    currentUnitIndex = computedUnits.reduce((latest, u, idx) => (u.isUnlocked ? idx : latest), 0);
  }

  return computedUnits.map((unit, idx) => {
    const isCurrent = idx === currentUnitIndex && unit.isUnlocked;
    let state = "locked";

    if (unit.isCompleted) {
      state = "completed";
    } else if (isCurrent) {
      state = "current";
    } else if (unit.isUnlocked) {
      state = "unlocked";
    }

    // Accessible screen reader announcement
    let srText = `Unit ${unit.order}: ${unit.title}. ${unit.completedCount} of ${unit.totalLessons} lessons completed (${unit.progressPercent}%).`;
    if (state === "completed") {
      srText += " Status: Completed.";
    } else if (state === "current") {
      srText += " Status: Current unit. You are here.";
    } else if (state === "unlocked") {
      srText += " Status: Unlocked and ready to practice.";
    } else {
      srText += ` Status: Locked. ${unit.unlockRuleText}`;
    }

    return {
      ...unit,
      isCurrent,
      state,
      srText,
    };
  });
}
