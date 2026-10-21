/**
 * frontend/src/data/quizCatalog.js
 * 
 * SignVerse Quiz Engine & Catalog
 * 
 * Generates quizzes from unified lesson data:
 * 1. Alphabet (Beginner, 10 questions)
 * 2. Numbers 0-10 (Beginner, 10 questions)
 * 3. Numbers 11-100 (Intermediate, 10 questions)
 * 4. Greetings (Beginner, 10 questions)
 * 5. Family (Beginner, 10 questions)
 * 6. Phrases (Advanced, 15 questions)
 * 7. Daily Mixed Quiz (All Levels, 10 questions)
 * 
 * Requirements:
 * - Each has 10 questions (15 for Advanced) from a pool at least 2x-10x larger.
 * - Shuffled options and questions on each attempt.
 * - Plausible distractors from the same category/theme.
 * - Explanations after each answer.
 * - MotionGuide animations in questions.
 * - Cards show level, question count, time (30 sec per question), and best score.
 * - Skips needsReview signs.
 * - Safe localStorage persistence in try/catch.
 */

import { ALL_LESSONS } from "./lessons.js";

export const QUIZ_STORAGE_KEY = "signverse_quiz_history";
export const COMPLETED_LESSONS_STORAGE_KEY = "signverse_completed_lessons";

/**
 * Safe local storage reader for completed lessons
 */
export function getCompletedLessonIds() {
  try {
    if (typeof window === "undefined" || !window.localStorage) return new Set();
    const raw = window.localStorage.getItem(COMPLETED_LESSONS_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch (err) {
    console.debug("Failed reading completed lessons from localStorage:", err);
    return new Set();
  }
}

/**
 * Record a lesson as completed in localStorage
 */
export function markLessonCompleted(lessonId) {
  try {
    if (typeof window === "undefined" || !window.localStorage) return;
    const ids = getCompletedLessonIds();
    ids.add(lessonId);
    window.localStorage.setItem(COMPLETED_LESSONS_STORAGE_KEY, JSON.stringify(Array.from(ids)));
  } catch (err) {
    console.debug("Failed saving completed lesson to localStorage:", err);
  }
}

/**
 * Safe local storage reader for quiz history
 */
export function getQuizHistory() {
  try {
    if (typeof window === "undefined" || !window.localStorage) return {};
    const raw = window.localStorage.getItem(QUIZ_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (err) {
    console.debug("Failed reading quiz history from localStorage:", err);
    return {};
  }
}

/**
 * Save quiz completion results
 */
export function saveQuizResult({ quizId, score, totalQuestions, xpEarned, timeTakenSeconds, missedQuestionIds = [] }) {
  try {
    if (typeof window === "undefined" || !window.localStorage) return null;
    const history = getQuizHistory();
    const percentage = Math.round((score / Math.max(1, totalQuestions)) * 100);
    const existing = history[quizId] || { bestScore: 0, attempts: 0, badge: null };

    const newAttempts = (existing.attempts || 0) + 1;
    const newBest = Math.max(existing.bestScore || 0, percentage);

    // Calculate medal tier
    let badge = null;
    if (newBest >= 90) badge = "gold";
    else if (newBest >= 80) badge = "silver";
    else if (newBest >= 70) badge = "bronze";

    history[quizId] = {
      ...existing,
      bestScore: newBest,
      lastScore: percentage,
      attempts: newAttempts,
      badge,
      lastAttemptAt: new Date().toISOString(),
      lastTimeSeconds: Math.round(timeTakenSeconds || 0),
      lastMissedQuestionIds: missedQuestionIds,
      totalXpEarned: (existing.totalXpEarned || 0) + (xpEarned || 0),
    };

    window.localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(history));
    return history[quizId];
  } catch (err) {
    console.debug("Failed saving quiz result to localStorage:", err);
    return null;
  }
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Pick plausible distractors from the same theme or level
 */
function getPlausibleDistractors(correctLesson, candidatePool, count = 3) {
  // Try same theme first
  let candidates = candidatePool.filter(
    (l) => l.id !== correctLesson.id && l.theme && l.theme === correctLesson.theme && !l.needsReview
  );

  // If not enough in same theme, try same level and category
  if (candidates.length < count) {
    const sameLevelCat = candidatePool.filter(
      (l) => l.id !== correctLesson.id && l.level === correctLesson.level && l.category === correctLesson.category && !l.needsReview
    );
    candidates = Array.from(new Set([...candidates, ...sameLevelCat]));
  }

  // Fallback to any in same level
  if (candidates.length < count) {
    const sameLevel = candidatePool.filter(
      (l) => l.id !== correctLesson.id && l.level === correctLesson.level && !l.needsReview
    );
    candidates = Array.from(new Set([...candidates, ...sameLevel]));
  }

  // Fallback to any in candidatePool
  if (candidates.length < count) {
    candidates = candidatePool.filter((l) => l.id !== correctLesson.id && !l.needsReview);
  }

  return shuffle(candidates).slice(0, count);
}

/**
 * Generate full question pool for a given set of lessons
 * Skips signs where needsReview is true.
 */
export function generateQuestionPoolForLessons(lessons) {
  // Strictly skip needsReview signs as required
  const validLessons = lessons.filter((l) => !l.needsReview);
  const questions = [];

  validLessons.forEach((lesson, index) => {
    const distractors = getPlausibleDistractors(lesson, validLessons, 3);
    const distractorLabels = distractors.map((d) => d.label);
    const allLabels = shuffle([lesson.label, ...distractorLabels]);

    // Type A: "Which sign is this?" (MotionGuide animation displayed, pick 4 text options)
    if (lesson.animationSpec) {
      questions.push({
        id: `q-sign-${lesson.id}`,
        type: "sign_to_word",
        prompt: `Which sign is demonstrated in the animation?`,
        lessonId: lesson.id,
        lessonLabel: lesson.label,
        animationSpec: lesson.animationSpec,
        motionTag: lesson.motionTag,
        options: allLabels,
        correctAnswer: lesson.label,
        explanation: `This is the sign for "${lesson.label}". Handshape: ${lesson.animationSpec.handshape.replace(/_/g, " ")}, formed at the ${lesson.animationSpec.location.replace(/_/g, " ")} with ${lesson.animationSpec.orientation.replace(/_/g, " ")}.`,
        relatedLessonId: lesson.id,
      });
    }

    // Type B: "Which animation matches this sign?" (Word given, pick out of 4 animations)
    if (lesson.animationSpec && distractors.length >= 3) {
      const distractorSpecs = distractors.filter((d) => d.animationSpec);
      if (distractorSpecs.length >= 3) {
        const optionLessons = shuffle([lesson, ...distractorSpecs.slice(0, 3)]);
        questions.push({
          id: `q-word-${lesson.id}`,
          type: "word_to_sign",
          prompt: `Which animation shows the correct sign for "${lesson.label}"?`,
          lessonId: lesson.id,
          lessonLabel: lesson.label,
          options: optionLessons.map((l) => l.label),
          optionLessons: optionLessons.map((l) => ({
            id: l.id,
            label: l.label,
            spec: l.animationSpec,
            motionTag: l.motionTag,
          })),
          correctAnswer: lesson.label,
          explanation: `The correct gesture for "${lesson.label}" uses a ${lesson.animationSpec.handshape.replace(/_/g, " ")} at the ${lesson.animationSpec.location.replace(/_/g, " ")}.`,
          relatedLessonId: lesson.id,
        });
      }
    }

    // Type C: True or False on anatomical location / handshape
    if (lesson.animationSpec && lesson.animationSpec.location) {
      const loc = lesson.animationSpec.location.replace(/_/g, " ");
      const isTrue = index % 2 === 0;
      let claimedLocation = loc;
      if (!isTrue) {
        const wrongLocations = ["forehead", "chin", "chest", "neutral space", "wrist"].filter(
          (x) => x !== loc
        );
        claimedLocation = wrongLocations[Math.floor(Math.random() * wrongLocations.length)];
      }

      questions.push({
        id: `q-tf-${lesson.id}`,
        type: "true_false",
        prompt: `True or False: The sign for "${lesson.label}" is formed primarily at the ${claimedLocation}.`,
        lessonId: lesson.id,
        lessonLabel: lesson.label,
        animationSpec: lesson.animationSpec,
        options: ["True", "False"],
        correctAnswer: isTrue ? "True" : "False",
        explanation: isTrue
          ? `Correct! "${lesson.label}" is signed at the ${loc}.`
          : `False. "${lesson.label}" is actually signed at the ${loc}, not the ${claimedLocation}.`,
        relatedLessonId: lesson.id,
      });
    }

    // Type D: "Order the steps" (for motion lessons with >= 3 steps)
    if (lesson.steps && lesson.steps.length >= 3 && lesson.motionTag === "motion") {
      const originalSteps = lesson.steps.slice(0, 3);
      const scrambledIndices = shuffle([0, 1, 2]);
      if (scrambledIndices[0] === 0 && scrambledIndices[1] === 1 && scrambledIndices[2] === 2) {
        scrambledIndices[0] = 1;
        scrambledIndices[1] = 0;
      }
      const scrambledSteps = scrambledIndices.map((i) => originalSteps[i]);

      const stepOptions = new Set();
      const correctSeq = originalSteps.join(" → ");
      stepOptions.add(correctSeq);
      stepOptions.add([originalSteps[1], originalSteps[0], originalSteps[2]].join(" → "));
      stepOptions.add([originalSteps[2], originalSteps[1], originalSteps[0]].join(" → "));
      stepOptions.add([originalSteps[0], originalSteps[2], originalSteps[1]].join(" → "));

      let stepFallback = 1;
      while (stepOptions.size < 4) {
        stepOptions.add(`${originalSteps[1]} → ${originalSteps[2]} → ${originalSteps[0]} (${stepFallback++})`);
      }

      questions.push({
        id: `q-steps-${lesson.id}`,
        type: "order_steps",
        prompt: `Put the steps for signing "${lesson.label}" in the correct order:`,
        lessonId: lesson.id,
        lessonLabel: lesson.label,
        scrambledSteps,
        correctStepOrder: originalSteps,
        options: shuffle(Array.from(stepOptions).slice(0, 4)),
        correctAnswer: correctSeq,
        explanation: `The proper execution for "${lesson.label}" is:\n1. ${originalSteps[0]}\n2. ${originalSteps[1]}\n3. ${originalSteps[2]}`,
        relatedLessonId: lesson.id,
      });
    }

    // Type E: "Build the sentence" (Advanced phrases with tokens)
    if (lesson.level === "advanced" && lesson.tokens && lesson.tokens.length >= 2) {
      const correctSequence = lesson.tokens.map((t) => t.label).join(" ");
      const tokenLabels = lesson.tokens.map((t) => t.label);

      const otherLessonTokens = validLessons
        .filter((l) => l.id !== lesson.id && l.tokens)
        .flatMap((l) => l.tokens.map((t) => t.label));

      const seqOptions = new Set([correctSequence]);

      // Distractor 1: Reversed order
      const reversed = [...tokenLabels].reverse().join(" ");
      if (reversed !== correctSequence) seqOptions.add(reversed);

      // Distractor 2: Swapped intermediate tokens
      if (tokenLabels.length >= 3) {
        seqOptions.add([tokenLabels[0], tokenLabels[2], tokenLabels[1]].join(" "));
      }

      // Distractor 3 & 4: Substituted tokens
      for (const otherToken of shuffle(otherLessonTokens)) {
        if (!tokenLabels.includes(otherToken)) {
          const replaced = [...tokenLabels];
          replaced[replaced.length - 1] = otherToken;
          seqOptions.add(replaced.join(" "));
          if (seqOptions.size >= 4) break;
        }
      }

      for (const otherToken of shuffle(otherLessonTokens)) {
        if (!tokenLabels.includes(otherToken)) {
          const replaced = [...tokenLabels];
          replaced[0] = otherToken;
          seqOptions.add(replaced.join(" "));
          if (seqOptions.size >= 4) break;
        }
      }

      // Safe fallback ensuring 4 unique options
      const commonASLTokens = ["PLEASE", "AGAIN", "THANK-YOU", "SLOW", "WHERE", "WANT"];
      for (const filler of commonASLTokens) {
        if (seqOptions.size >= 4) break;
        if (!tokenLabels.includes(filler)) {
          seqOptions.add([...tokenLabels.slice(0, -1), filler].join(" "));
        }
      }

      questions.push({
        id: `q-sentence-${lesson.id}`,
        type: "build_sentence",
        prompt: `Which sequence correctly builds the phrase: "${lesson.label}"?`,
        lessonId: lesson.id,
        lessonLabel: lesson.label,
        options: shuffle(Array.from(seqOptions).slice(0, 4)),
        correctAnswer: correctSequence,
        explanation: `In ASL conversational structure, "${lesson.label}" is expressed in the sign order: ${lesson.tokens.map((t) => t.label).join(" → ")}.`,
        relatedLessonId: lesson.id,
      });
    }
  });

  return shuffle(questions);
}

/**
 * Quiz Catalog Definitions Generated Dynamically from Lessons
 * 
 * Exact 7 quizzes requested:
 * 1. Alphabet (10 questions, beginner)
 * 2. Numbers 0-10 (10 questions, beginner)
 * 3. Numbers 11-100 (10 questions, intermediate)
 * 4. Greetings (10 questions, beginner)
 * 5. Family (10 questions, beginner)
 * 6. Phrases (15 questions, advanced)
 * 7. Daily Mixed Quiz (10 questions, all levels)
 */
export const QUIZ_DEFINITIONS = [
  // 1. Alphabet
  {
    id: "quiz-alphabet",
    aliases: ["quiz-alphabet-beginner"],
    title: "Alphabet Basics Quiz",
    description: "Test fingerspelling mastery, letter handshapes, and manual alphabet recognition from A to Z.",
    category: "alphabet",
    level: "beginner",
    questionCount: 10,
    sourceLessons: () => ALL_LESSONS.filter((l) => l.category === "alphabet" && !l.needsReview),
    unlockRequirement: "Unlocked for all learners",
  },

  // 2. Numbers 0-10
  {
    id: "quiz-numbers-0-10",
    aliases: [],
    title: "Numbers 0–10 Quiz",
    description: "Validate single-digit ASL counting handshapes, inward palm orientations, and finger extensions.",
    category: "numbers",
    level: "beginner",
    questionCount: 10,
    sourceLessons: () => ALL_LESSONS.filter((l) => l.category === "numbers" && l.level === "beginner" && !l.needsReview),
    unlockRequirement: "Unlocked for all learners",
  },

  // 3. Numbers 11-100
  {
    id: "quiz-numbers-11-100",
    aliases: [],
    title: "Numbers 11–100 & Compound Digits",
    description: "Test teenage flicking numbers (11–19), multiples of ten, and multi-digit compound transitions.",
    category: "numbers",
    level: "intermediate",
    questionCount: 10,
    sourceLessons: () => ALL_LESSONS.filter((l) => l.category === "numbers" && l.level !== "beginner" && !l.needsReview),
    unlockRequirement: "Unlocked · Recommended: complete Numbers 0–10 first",
  },

  // 4. Greetings
  {
    id: "quiz-greetings",
    aliases: ["quiz-greetings-beginner"],
    title: "Greetings & Polite Basics Quiz",
    description: "Everyday courtesies: Hello, Goodbye, Good Morning, Please, Sorry, and welcoming greetings.",
    category: "greetings",
    level: "beginner",
    questionCount: 10,
    sourceLessons: () =>
      ALL_LESSONS.filter((l) => l.category === "greetings" && (l.theme === "Greetings and basics" || l.theme === "Essentials" || l.theme === "Courtesy and communication") && !l.needsReview),
    unlockRequirement: "Unlocked for all learners",
  },

  // 5. Family
  {
    id: "quiz-family",
    aliases: ["quiz-family-beginner"],
    title: "Family & Relations Quiz",
    description: "Recognize family signs and master the ASL anatomical gender rule (forehead male / chin female).",
    category: "greetings",
    level: "beginner",
    questionCount: 10,
    sourceLessons: () =>
      ALL_LESSONS.filter((l) => l.category === "greetings" && (l.theme === "Family" || l.theme === "Extended family" || l.theme === "Family and social") && !l.needsReview),
    unlockRequirement: "Unlocked for all learners",
  },

  // 6. Phrases
  {
    id: "quiz-phrases",
    aliases: ["quiz-advanced-phrases"],
    title: "Conversational Phrases & Sentences",
    description: "Put vocabulary into action with complex grammar, sentence structures, and multi-sign phrases.",
    category: "greetings",
    level: "advanced",
    questionCount: 15,
    sourceLessons: () =>
      ALL_LESSONS.filter((l) => l.category === "greetings" && l.level === "advanced" && !l.needsReview),
    unlockRequirement: "Unlocked · Recommended: practice core vocabulary first",
  },

  // 7. Daily Mixed Quiz
  {
    id: "quiz-daily-mixed",
    aliases: [],
    title: "Daily Mixed Quiz",
    description: "A fast, randomized 10-question mixed challenge drawn across all topics to keep your streak alive.",
    category: "all",
    level: "all",
    questionCount: 10,
    sourceLessons: () => ALL_LESSONS.filter((l) => !l.needsReview),
    unlockRequirement: "Unlocked for daily practice! Any completed lesson unlocks this quiz.",
  },
];

/**
 * Check if a quiz is unlocked
 * Quizzes are unlocked so learners can always test and practice, with clear milestone recommendations.
 */
export function getQuizUnlockStatus(quizDef, completedLessonIds = new Set()) {
  const sourceLessons = typeof quizDef.sourceLessons === "function" ? quizDef.sourceLessons() : [];
  const completedCount = sourceLessons.filter((l) => completedLessonIds.has(l.id)).length;
  const totalLessons = sourceLessons.length;
  const completionPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 100;

  return {
    isLocked: false,
    completionPercent,
    completedCount,
    requiredCount: Math.ceil(totalLessons * 0.5),
    totalLessons,
    unlockRequirement: quizDef.unlockRequirement,
  };
}

/**
 * Generate a fresh, non-repeating instance of a quiz for a student attempt
 */
export function generateQuizInstance(quizId) {
  const quizDef =
    QUIZ_DEFINITIONS.find((q) => q.id === quizId || (q.aliases && q.aliases.includes(quizId))) ||
    QUIZ_DEFINITIONS[0];

  const sourceLessons = typeof quizDef.sourceLessons === "function" ? quizDef.sourceLessons() : ALL_LESSONS;
  const pool = generateQuestionPoolForLessons(sourceLessons);

  const targetCount = quizDef.questionCount || 10;
  
  // Pick targetCount distinct questions from shuffled pool
  const shuffledPool = shuffle(pool);
  const selectedQuestions = shuffledPool.slice(0, targetCount).map((q, idx) => ({
    ...q,
    questionNumber: idx + 1,
    // Shuffle options for each attempt
    options: q.options ? shuffle(q.options) : [],
  }));

  // Exactly 30 seconds per question as requested
  const timeSeconds = selectedQuestions.length * 30;
  const estimatedMinutes = Math.max(1, Math.round((timeSeconds / 60) * 10) / 10);

  return {
    id: quizDef.id,
    title: quizDef.title,
    description: quizDef.description,
    level: quizDef.level,
    category: quizDef.category,
    questions: selectedQuestions,
    totalQuestions: selectedQuestions.length,
    estimatedMinutes,
    timeLimitSeconds: timeSeconds,
    poolSize: pool.length,
  };
}
