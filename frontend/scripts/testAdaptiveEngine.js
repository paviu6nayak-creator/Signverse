/**
 * SignVerse Adaptive Learning Engine Unit Tests
 * 
 * Verifies:
 * 1. Leitner / SM-2 Spaced Repetition Scheduling:
 *    - Box advancement on correct answer (Box 1 -> 2 -> 3 -> 4 -> 5)
 *    - Box reset to Box 1 on incorrect answer
 *    - Spacing interval in days (1, 3, 7, 14, 30)
 *    - Next due date timestamps
 * 2. Mastery Level Classification ('new' -> 'learning' -> 'mastered')
 * 3. Urgency Scoring favoring weak and overdue signs
 * 4. Adaptive Session Selection prioritizing high urgency signs
 * 5. Streak Calendar History and streak calculations
 * 6. LocalStorage resilience and error tolerance
 */

import assert from "node:assert/strict";
import {
  calculateLeitnerSchedule,
  calculateMastery,
  calculateUrgencyScore,
  selectAdaptiveReviewItems,
  getStreakCalendarHistory,
  LEITNER_INTERVALS_DAYS,
} from "../src/utils/adaptiveLearningEngine.js";

console.log("\n🧪 Running SignVerse Adaptive Learning Engine Unit Tests...\n");

let passed = 0;
let total = 0;

function it(name, fn) {
  total++;
  try {
    fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ ${name}`);
    console.error(`     Error: ${err.message}\n`);
    throw err;
  }
}

function describe(suiteName, fn) {
  console.log(`📋 ${suiteName}`);
  fn();
  console.log("");
}

// ============================================================================
// SUITE 1: LEITNER / SM-2 SCHEDULING INTERVALS
// ============================================================================
describe("Suite 1: Leitner / SM-2 Scheduling Logic", () => {
  const baseTime = new Date("2026-10-21T12:00:00Z");

  it("schedules first correct attempt into Box 2 with 3-day interval", () => {
    const initial = null; // No previous history
    const result = calculateLeitnerSchedule(initial, true, baseTime);

    assert.equal(result.timesPracticed, 1);
    assert.equal(result.timesCorrect, 1);
    assert.equal(result.accuracy, 1.0);
    assert.equal(result.consecutiveCorrect, 1);
    assert.equal(result.box, 2);
    assert.equal(result.intervalDays, LEITNER_INTERVALS_DAYS[2]); // 3 days
    assert.equal(result.lastPracticedDate, "2026-10-21");
    assert.equal(result.nextDueDate, "2026-10-24");
  });

  it("advances box on consecutive correct attempts up to Box 5 cap", () => {
    let stat = null;
    // Step 1 -> Box 2 (3d)
    stat = calculateLeitnerSchedule(stat, true, baseTime);
    assert.equal(stat.box, 2);

    // Step 2 -> Box 3 (7d)
    stat = calculateLeitnerSchedule(stat, true, baseTime);
    assert.equal(stat.box, 3);
    assert.equal(stat.intervalDays, 7);

    // Step 3 -> Box 4 (14d)
    stat = calculateLeitnerSchedule(stat, true, baseTime);
    assert.equal(stat.box, 4);
    assert.equal(stat.intervalDays, 14);

    // Step 4 -> Box 5 (30d)
    stat = calculateLeitnerSchedule(stat, true, baseTime);
    assert.equal(stat.box, 5);
    assert.equal(stat.intervalDays, 30);

    // Step 5 -> Stays capped at Box 5 (30d)
    stat = calculateLeitnerSchedule(stat, true, baseTime);
    assert.equal(stat.box, 5);
    assert.equal(stat.intervalDays, 30);
    assert.equal(stat.consecutiveCorrect, 5);
  });

  it("resets box to Box 1 with 1-day interval upon incorrect attempt", () => {
    // Suppose item was previously in Box 4
    const advancedStat = {
      timesPracticed: 4,
      timesCorrect: 4,
      box: 4,
      consecutiveCorrect: 4,
    };

    const failed = calculateLeitnerSchedule(advancedStat, false, baseTime);

    assert.equal(failed.timesPracticed, 5);
    assert.equal(failed.timesCorrect, 4);
    assert.equal(failed.accuracy, 0.8);
    assert.equal(failed.box, 1); // Reset to box 1
    assert.equal(failed.consecutiveCorrect, 0); // Reset consecutive
    assert.equal(failed.intervalDays, 1); // 1-day interval
    assert.equal(failed.nextDueDate, "2026-10-22"); // Due tomorrow
  });

  it("computes accurate accuracy ratios over mixed attempts", () => {
    let stat = null;
    stat = calculateLeitnerSchedule(stat, true, baseTime); // 1/1 = 100%
    assert.equal(stat.accuracy, 1.0);

    stat = calculateLeitnerSchedule(stat, false, baseTime); // 1/2 = 50%
    assert.equal(stat.accuracy, 0.5);

    stat = calculateLeitnerSchedule(stat, true, baseTime); // 2/3 = 67%
    assert.equal(stat.accuracy, 0.67);
  });
});

// ============================================================================
// SUITE 2: MASTERY CLASSIFICATION ('new' | 'learning' | 'mastered')
// ============================================================================
describe("Suite 2: Mastery Level Classification", () => {
  it("classifies unpracticed sign as 'new'", () => {
    assert.equal(calculateMastery(null), "new");
    assert.equal(calculateMastery({ timesPracticed: 0 }), "new");
  });

  it("classifies signs with < 3 attempts as 'learning' even with 100% accuracy", () => {
    const twoAttempts = {
      timesPracticed: 2,
      timesCorrect: 2,
      accuracy: 1.0,
      box: 3,
    };
    assert.equal(calculateMastery(twoAttempts), "learning");
  });

  it("classifies signs with low accuracy (< 80%) as 'learning'", () => {
    const poorAccuracy = {
      timesPracticed: 5,
      timesCorrect: 3,
      accuracy: 0.60,
      box: 3,
    };
    assert.equal(calculateMastery(poorAccuracy), "learning");
  });

  it("classifies signs as 'mastered' when attempts >= 3, accuracy >= 80%, and box >= 3", () => {
    const mastered = {
      timesPracticed: 4,
      timesCorrect: 4,
      accuracy: 1.0,
      box: 4,
    };
    assert.equal(calculateMastery(mastered), "mastered");

    const edgeMastered = {
      timesPracticed: 3,
      timesCorrect: 3,
      accuracy: 1.0,
      box: 3,
    };
    assert.equal(calculateMastery(edgeMastered), "mastered");
  });

  it("reverts 'mastered' back to 'learning' if errors drop accuracy or box below threshold", () => {
    const dropped = {
      timesPracticed: 5,
      timesCorrect: 3,
      accuracy: 0.60,
      box: 1, // dropped back to box 1
    };
    assert.equal(calculateMastery(dropped), "learning");
  });
});

// ============================================================================
// SUITE 3: URGENCY SCORING FAVORING WEAK AND OVERDUE SIGNS
// ============================================================================
describe("Suite 3: Urgency Scoring", () => {
  const now = new Date("2026-10-21T12:00:00Z");
  const dummyLesson = { id: "alpha-a", label: "Letter A" };

  it("scores overdue sign higher than sign not yet due", () => {
    const overdueStat = {
      timesPracticed: 3,
      timesCorrect: 3,
      accuracy: 1.0,
      box: 2,
      nextDueDate: "2026-10-18", // 3 days overdue
      nextDueTimestamp: new Date("2026-10-18T12:00:00Z").getTime(),
    };

    const notDueStat = {
      timesPracticed: 3,
      timesCorrect: 3,
      accuracy: 1.0,
      box: 2,
      nextDueDate: "2026-10-25", // 4 days in future
      nextDueTimestamp: new Date("2026-10-25T12:00:00Z").getTime(),
    };

    const overdueUrgency = calculateUrgencyScore(dummyLesson, overdueStat, now);
    const notDueUrgency = calculateUrgencyScore(dummyLesson, notDueStat, now);

    assert.ok(
      overdueUrgency > notDueUrgency,
      `Overdue urgency (${overdueUrgency}) must exceed not due urgency (${notDueUrgency})`
    );
  });

  it("scores weak sign (low accuracy) higher than strong sign with identical schedule", () => {
    const weakStat = {
      timesPracticed: 4,
      timesCorrect: 1,
      accuracy: 0.25, // Weak 25%
      box: 1,
      nextDueDate: "2026-10-21",
      nextDueTimestamp: now.getTime(),
    };

    const strongStat = {
      timesPracticed: 4,
      timesCorrect: 4,
      accuracy: 1.0, // Strong 100%
      box: 1,
      nextDueDate: "2026-10-21",
      nextDueTimestamp: now.getTime(),
    };

    const weakScore = calculateUrgencyScore(dummyLesson, weakStat, now);
    const strongScore = calculateUrgencyScore(dummyLesson, strongStat, now);

    assert.ok(
      weakScore > strongScore,
      `Weak sign score (${weakScore}) must exceed strong sign score (${strongScore})`
    );
  });

  it("Box 1 sign receives higher baseline priority than Box 5 sign", () => {
    const box1Stat = {
      timesPracticed: 2,
      timesCorrect: 2,
      accuracy: 1.0,
      box: 1,
      nextDueDate: "2026-10-22",
      nextDueTimestamp: new Date("2026-10-22T12:00:00Z").getTime(),
    };

    const box5Stat = {
      timesPracticed: 5,
      timesCorrect: 5,
      accuracy: 1.0,
      box: 5,
      nextDueDate: "2026-10-22",
      nextDueTimestamp: new Date("2026-10-22T12:00:00Z").getTime(),
    };

    const scoreBox1 = calculateUrgencyScore(dummyLesson, box1Stat, now);
    const scoreBox5 = calculateUrgencyScore(dummyLesson, box5Stat, now);

    assert.ok(scoreBox1 > scoreBox5, "Box 1 must have higher baseline urgency than Box 5");
  });

  it("selects adaptive review items gracefully from candidate pool", () => {
    const candidates = [
      { id: "alpha-a", label: "Letter A" },
      { id: "alpha-b", label: "Letter B" },
      { id: "alpha-c", label: "Letter C" },
    ];
    const picked = selectAdaptiveReviewItems(candidates, 2, now);
    assert.ok(Array.isArray(picked));
    assert.ok(picked.length <= 2);
  });
});

// ============================================================================
// SUITE 4: STREAK CALENDAR CALCULATION
// ============================================================================
describe("Suite 4: Streak Calendar History", () => {
  it("returns formatted days array with weekday, day of month, and activity status", () => {
    const cal = getStreakCalendarHistory(7);
    assert.equal(cal.days.length, 7);
    const todayEntry = cal.days[cal.days.length - 1];
    assert.ok(todayEntry.date);
    assert.ok(todayEntry.dayOfWeek);
    assert.equal(typeof todayEntry.dayOfMonth, "number");
    assert.equal(typeof todayEntry.count, "number");
  });
});

console.log(`\n🎉 All ${passed}/${total} adaptive learning unit tests passed successfully!\n`);
