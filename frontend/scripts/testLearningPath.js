/**
 * frontend/scripts/testLearningPath.js
 * 
 * Unit Tests for SignVerse Winding Vertical Learning Path Engine
 * Tests unlock logic (60% threshold rule), progress calculations, state transitions,
 * accessibility announcements, and total curriculum coverage.
 */

import assert from "node:assert/strict";
import { ALL_LESSONS } from "../src/data/lessons.js";
import {
  UNLOCK_THRESHOLD,
  UNIT_CONFIGS,
  getUnitLessons,
  calculateProgress,
  computeLearningPathUnits,
} from "../src/utils/learningPathEngine.js";

console.log("🧪 Running SignVerse Winding Learning Path Unit Tests...\n");

let passedTests = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ ${name}`);
    console.error(err);
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// Suite 1: Curriculum Coverage and Unit Ordering
// ---------------------------------------------------------------------------
console.log("📋 Suite 1: Curriculum Coverage & Unit Ordering");

test("Defines exactly 7 units in the required canonical sequence", () => {
  const expectedOrder = [
    "Alphabet",
    "Numbers",
    "Greetings",
    "Family",
    "Everyday Words",
    "Phrases",
    "Advanced Sentences",
  ];
  assert.equal(UNIT_CONFIGS.length, 7);
  UNIT_CONFIGS.forEach((config, idx) => {
    assert.equal(config.title, expectedOrder[idx]);
    assert.equal(config.order, idx + 1);
  });
});

test("Partitions all 222 lessons with zero leaks and zero duplicates", () => {
  const lessonIdsSeen = new Set();
  let totalLessonsAcrossUnits = 0;

  UNIT_CONFIGS.forEach((config) => {
    const lessons = getUnitLessons(config, ALL_LESSONS);
    assert.ok(lessons.length > 0, `Unit ${config.title} has zero lessons`);
    totalLessonsAcrossUnits += lessons.length;
    lessons.forEach((l) => {
      assert.ok(!lessonIdsSeen.has(l.id), `Lesson ${l.id} duplicated in ${config.title}`);
      lessonIdsSeen.add(l.id);
    });
  });

  assert.equal(totalLessonsAcrossUnits, ALL_LESSONS.length);
  assert.equal(totalLessonsAcrossUnits, 222);
  assert.equal(lessonIdsSeen.size, 222);
});

// ---------------------------------------------------------------------------
// Suite 2: Progress Calculation Function
// ---------------------------------------------------------------------------
console.log("\n📋 Suite 2: Progress Calculation Accuracy");

test("Calculates 0% progress when no lessons are completed", () => {
  const mockLessons = [{ id: "l1" }, { id: "l2" }, { id: "l3" }];
  const res = calculateProgress(mockLessons, new Set());
  assert.equal(res.total, 3);
  assert.equal(res.completed, 0);
  assert.equal(res.percent, 0);
  assert.equal(res.isCompleted, false);
});

test("Calculates accurate percentage and rounds properly", () => {
  const mockLessons = Array.from({ length: 26 }, (_, i) => ({ id: `l${i}` }));
  // 15 out of 26 = 57.69% -> rounds to 58%
  const completedIds = new Set(Array.from({ length: 15 }, (_, i) => `l${i}`));
  const res = calculateProgress(mockLessons, completedIds);
  assert.equal(res.total, 26);
  assert.equal(res.completed, 15);
  assert.equal(res.percent, 58);
  assert.equal(res.isCompleted, false);

  // 16 out of 26 = 61.53% -> rounds to 62%
  completedIds.add("l15");
  const res2 = calculateProgress(mockLessons, completedIds);
  assert.equal(res2.completed, 16);
  assert.equal(res2.percent, 62);
});

test("Flags isCompleted true only when all lessons in unit are done", () => {
  const mockLessons = [{ id: "l1" }, { id: "l2" }];
  const partial = calculateProgress(mockLessons, new Set(["l1"]));
  assert.equal(partial.isCompleted, false);

  const full = calculateProgress(mockLessons, new Set(["l1", "l2"]));
  assert.equal(full.isCompleted, true);
  assert.equal(full.percent, 100);
});

// ---------------------------------------------------------------------------
// Suite 3: 60% Unlock Rule Logic
// ---------------------------------------------------------------------------
console.log("\n📋 Suite 3: 60% Unlock Rule & State Progression");

test("Unit 1 (Alphabet) is always unlocked even with 0 completed lessons", () => {
  const units = computeLearningPathUnits(ALL_LESSONS, new Set());
  assert.equal(units[0].title, "Alphabet");
  assert.equal(units[0].isUnlocked, true);
  assert.equal(units[0].state, "current");
  assert.equal(units[0].isCurrent, true);
});

test("Unit 2 (Numbers) stays locked when Unit 1 (Alphabet) is at 58% (< 60%)", () => {
  const alphabetLessons = getUnitLessons(UNIT_CONFIGS[0], ALL_LESSONS);
  // Complete 15 / 26 letters = 58% (< 60%)
  const completedIds = new Set(alphabetLessons.slice(0, 15).map((l) => l.id));
  const units = computeLearningPathUnits(ALL_LESSONS, completedIds);

  assert.equal(units[0].progressPercent, 58);
  assert.equal(units[1].title, "Numbers");
  assert.equal(units[1].isUnlocked, false);
  assert.equal(units[1].state, "locked");
  assert.match(units[1].unlockRuleText, /Unlocks when Alphabet reaches 60%/);
});

test("Unit 2 (Numbers) unlocks when Unit 1 (Alphabet) reaches 62% (>= 60%)", () => {
  const alphabetLessons = getUnitLessons(UNIT_CONFIGS[0], ALL_LESSONS);
  // Complete 16 / 26 letters = 62% (>= 60%)
  const completedIds = new Set(alphabetLessons.slice(0, 16).map((l) => l.id));
  const units = computeLearningPathUnits(ALL_LESSONS, completedIds);

  assert.equal(units[0].progressPercent, 62);
  assert.equal(units[1].title, "Numbers");
  assert.equal(units[1].isUnlocked, true);
  // Unit 0 is incomplete, so Unit 0 is still current
  assert.equal(units[0].state, "current");
  assert.equal(units[1].state, "unlocked");
});

test("Completing 100% of Unit 1 marks it 'completed' and advances current to Unit 2", () => {
  const alphabetLessons = getUnitLessons(UNIT_CONFIGS[0], ALL_LESSONS);
  const completedIds = new Set(alphabetLessons.map((l) => l.id));
  const units = computeLearningPathUnits(ALL_LESSONS, completedIds);

  assert.equal(units[0].state, "completed");
  assert.equal(units[0].isCompleted, true);
  assert.equal(units[1].title, "Numbers");
  assert.equal(units[1].isUnlocked, true);
  assert.equal(units[1].state, "current");
  assert.equal(units[1].isCurrent, true);
});

test("Cascade: Each unit unlocks sequentially as previous reaches 60%", () => {
  let completedIds = new Set();

  for (let i = 0; i < UNIT_CONFIGS.length - 1; i++) {
    const currentLessons = getUnitLessons(UNIT_CONFIGS[i], ALL_LESSONS);
    // Complete 60% of this unit
    const numToComplete = Math.ceil(currentLessons.length * UNLOCK_THRESHOLD);
    currentLessons.slice(0, numToComplete).forEach((l) => completedIds.add(l.id));

    const units = computeLearningPathUnits(ALL_LESSONS, completedIds);

    // Next unit must now be unlocked
    assert.equal(
      units[i + 1].isUnlocked,
      true,
      `Unit ${units[i + 1].title} failed to unlock after 60% of ${units[i].title}`
    );

    // Subsequent units further down must still be locked
    for (let j = i + 2; j < UNIT_CONFIGS.length; j++) {
      assert.equal(
        units[j].isUnlocked,
        false,
        `Unit ${units[j].title} should remain locked`
      );
    }
  }
});

// ---------------------------------------------------------------------------
// Suite 4: Accessibility and Edge Cases
// ---------------------------------------------------------------------------
console.log("\n📋 Suite 4: Screen Reader Text & Edge Cases");

test("Generates accessible screen reader text for locked units with unlock instructions", () => {
  const units = computeLearningPathUnits(ALL_LESSONS, new Set());
  assert.match(units[1].srText, /Unit 2: Numbers/);
  assert.match(units[1].srText, /Status: Locked/);
  assert.match(units[1].srText, /Unlocks when Alphabet reaches 60%/);
});

test("Generates accessible screen reader text for current and completed units", () => {
  const alphabetLessons = getUnitLessons(UNIT_CONFIGS[0], ALL_LESSONS);
  const completedIds = new Set(alphabetLessons.map((l) => l.id));
  const units = computeLearningPathUnits(ALL_LESSONS, completedIds);

  assert.match(units[0].srText, /Status: Completed/);
  assert.match(units[1].srText, /Status: Current unit. You are here/);
});

test("Handles all units 100% completed gracefully", () => {
  const allIds = new Set(ALL_LESSONS.map((l) => l.id));
  const units = computeLearningPathUnits(ALL_LESSONS, allIds);

  units.forEach((u) => {
    assert.equal(u.isCompleted, true);
    assert.equal(u.isUnlocked, true);
    assert.equal(u.state, "completed");
  });
  // Last unit is marked as current if all completed
  assert.equal(units[6].isCurrent, true);
});

console.log(`\n🎉 All ${passedTests}/${passedTests} learning path unit tests passed successfully!\n`);
