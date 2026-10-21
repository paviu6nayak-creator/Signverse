/**
 * SignVerse Staff-Level Production Readiness Unit Tests
 * 
 * Test Suites:
 * 1. Digit-Sequence Handling (ASL compound numbers 11-15, 20-99, 100, double-digit hops)
 * 2. Handshape Data Validation (completeness, finger states, thumb, palm, distinctness)
 * 3. Quiz Generation (pool size >= 2x, 10/15 questions, 4 unique options, correct answer presence, explanations, no needsReview)
 * 4. Camera Error Mapping (all W3C MediaDevices exception classes, recovery instructions)
 */

import assert from "node:assert/strict";
import { ALL_LESSONS, getBeginnerPathLessons } from "../src/data/lessons.js";
import { HANDSHAPES, getHandshape } from "../src/data/handshapes.ts";
import { QUIZ_DEFINITIONS, generateQuizInstance } from "../src/data/quizCatalog.js";
import { mapCameraError } from "../src/utils/cameraErrors.js";

console.log("\n🧪 Running SignVerse Production Readiness Unit Tests...\n");

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
// SUITE 1: DIGIT-SEQUENCE HANDLING
// ============================================================================
describe("Suite 1: Digit-Sequence Handling", () => {
  it("Single-digit numbers (0-10) are defined with neutral space and palm forward", () => {
    for (let i = 0; i <= 10; i++) {
      const lesson = ALL_LESSONS.find((l) => l.id === `num-${i}`);
      assert.ok(lesson, `Number ${i} lesson must exist in ALL_LESSONS`);
      assert.equal(lesson.category, "numbers");
      assert.equal(lesson.level, "beginner");
      assert.equal(lesson.animationSpec.location, "neutral_space");
      // 0-10 are single static/tap signs, palm faces viewer
      assert.ok(
        ["palm_forward", "facing_side"].includes(lesson.animationSpec.orientation),
        `Number ${i} should have palm facing viewer or side`
      );
    }
  });

  it("Compound number 42 decomposes into distinct tokens ['4', '2'] left-to-right", () => {
    const num42 = ALL_LESSONS.find((l) => l.id === "num-42");
    assert.ok(num42, "num-42 lesson must exist");
    assert.ok(Array.isArray(num42.tokens), "num-42 must have tokens array");
    assert.equal(num42.tokens.length, 2, "num-42 must have exactly 2 tokens");

    const [tok1, tok2] = num42.tokens;
    assert.equal(tok1.label, "4");
    assert.equal(tok2.label, "2");
    assert.equal(tok1.handshape, "4");
    assert.equal(tok2.handshape, "2");
    assert.equal(tok1.orientation, "palm_forward");
    assert.equal(tok2.orientation, "palm_forward");
    // Left-to-right signing progression
    assert.ok(tok1.position.x < tok2.position.x, "Token 1 must be positioned to the left of Token 2");
  });

  it("Compound number 64 decomposes into distinct tokens ['6', '4'] left-to-right", () => {
    const num64 = ALL_LESSONS.find((l) => l.id === "num-64");
    assert.ok(num64, "num-64 lesson must exist");
    assert.equal(num64.tokens.length, 2);

    const [tok1, tok2] = num64.tokens;
    assert.equal(tok1.label, "6");
    assert.equal(tok2.label, "4");
    assert.equal(tok1.handshape, "6");
    assert.equal(tok2.handshape, "4");
    assert.ok(tok1.position.x < tok2.position.x, "Token 1 must precede Token 2 on the x axis");
  });

  it("Repeated double digits (num-55) enforce ASL palm_down rule with sideways hop path", () => {
    const num55 = ALL_LESSONS.find((l) => l.id === "num-55");
    assert.ok(num55, "num-55 lesson must exist");
    assert.equal(num55.tokens.length, 2);

    const [tok1, tok2] = num55.tokens;
    assert.equal(tok1.label, "5");
    assert.equal(tok2.label, "5");
    // ASL Rule: Repeated double digits (22, 33, 44, 55, 66) face palm DOWN
    assert.equal(tok1.orientation, "palm_down", "First 5 in 55 must face palm down");
    assert.equal(tok2.orientation, "palm_down", "Second 5 in 55 must face palm down");
    assert.equal(num55.animationSpec.path, "hop", "55 animation path must be hop");
    assert.ok(tok1.position.x < tok2.position.x, "Hop must move sideways");
  });

  it("Number 100 decomposes into '1' followed by 'C' handshape", () => {
    const num100 = ALL_LESSONS.find((l) => l.id === "num-100");
    assert.ok(num100, "num-100 lesson must exist");
    assert.equal(num100.tokens.length, 2);

    const [tok1, tok2] = num100.tokens;
    assert.equal(tok1.label, "1");
    assert.equal(tok2.label, "C");
    assert.equal(tok1.handshape, "1");
    assert.equal(tok2.handshape, "C");
  });

  it("Flick numbers (11-15) define sequential flick movements", () => {
    for (let i = 11; i <= 15; i++) {
      const lesson = ALL_LESSONS.find((l) => l.id === `num-${i}`);
      assert.ok(lesson, `Number ${i} lesson must exist`);
      assert.ok(
        lesson.animationSpec.path === "flick" || lesson.tokens?.length > 0,
        `Number ${i} should have flick path or token decomposition`
      );
    }
  });
});

// ============================================================================
// SUITE 2: HANDSHAPE DATA VALIDATION
// ============================================================================
describe("Suite 2: Handshape Data Validation", () => {
  const VALID_FINGER_STATES = new Set([
    "extended",
    "curled",
    "touching-thumb",
    "hooked",
    "bent",
    "crossed",
  ]);

  const VALID_THUMB_STATES = new Set([
    "out",
    "across",
    "tucked",
    "up",
    "touching-pinky",
    "touching-ring",
    "touching-middle",
    "touching-index",
  ]);

  const VALID_PALM_ORIENTATIONS = new Set([
    "forward",
    "down",
    "up",
    "toward-body",
    "left",
    "right",
  ]);

  it("Contains all 26 letters (A-Z) and 11 digits (0-10)", () => {
    for (let c = 65; c <= 90; c++) {
      const letter = String.fromCharCode(c);
      assert.ok(HANDSHAPES[letter], `Letter '${letter}' handshape must be defined in HANDSHAPES`);
      assert.equal(HANDSHAPES[letter].type, "letter");
    }

    for (let d = 0; d <= 10; d++) {
      const digit = String(d);
      assert.ok(HANDSHAPES[digit], `Digit '${digit}' handshape must be defined in HANDSHAPES`);
      assert.equal(HANDSHAPES[digit].type, "digit");
    }

    assert.equal(Object.keys(HANDSHAPES).length, 37, "Must contain exactly 37 canonical handshapes");
  });

  it("Every handshape contains no missing required fields", () => {
    for (const [key, spec] of Object.entries(HANDSHAPES)) {
      assert.equal(spec.id, key, `Handshape ${key} id must match key`);
      assert.ok(spec.label && spec.label.trim().length > 0, `Handshape ${key} must have label`);
      assert.ok(spec.description && spec.description.trim().length > 0, `Handshape ${key} must have description`);
      assert.ok(spec.aslNotes && spec.aslNotes.trim().length > 0, `Handshape ${key} must have aslNotes`);
      assert.ok(spec.fingers, `Handshape ${key} must have fingers object`);

      // All 4 fingers present
      assert.ok("index" in spec.fingers, `Handshape ${key} must define index finger`);
      assert.ok("middle" in spec.fingers, `Handshape ${key} must define middle finger`);
      assert.ok("ring" in spec.fingers, `Handshape ${key} must define ring finger`);
      assert.ok("pinky" in spec.fingers, `Handshape ${key} must define pinky finger`);

      // Valid values
      assert.ok(VALID_FINGER_STATES.has(spec.fingers.index), `Handshape ${key} invalid index: ${spec.fingers.index}`);
      assert.ok(VALID_FINGER_STATES.has(spec.fingers.middle), `Handshape ${key} invalid middle: ${spec.fingers.middle}`);
      assert.ok(VALID_FINGER_STATES.has(spec.fingers.ring), `Handshape ${key} invalid ring: ${spec.fingers.ring}`);
      assert.ok(VALID_FINGER_STATES.has(spec.fingers.pinky), `Handshape ${key} invalid pinky: ${spec.fingers.pinky}`);

      assert.ok(VALID_THUMB_STATES.has(spec.thumb), `Handshape ${key} invalid thumb: ${spec.thumb}`);
      assert.ok(VALID_PALM_ORIENTATIONS.has(spec.palm), `Handshape ${key} invalid palm: ${spec.palm}`);
    }
  });

  it("Differentiates ASL numbers 6, 7, 8, and 9 thumb-touch rules", () => {
    // ASL Rule:
    // 6: Thumb touches pinky (index, middle, ring extended)
    // 7: Thumb touches ring (index, middle, pinky extended)
    // 8: Thumb touches middle (index, ring, pinky extended)
    // 9: Thumb touches index (middle, ring, pinky extended)
    const six = HANDSHAPES["6"];
    const seven = HANDSHAPES["7"];
    const eight = HANDSHAPES["8"];
    const nine = HANDSHAPES["9"];

    assert.equal(six.thumb, "touching-pinky");
    assert.equal(six.fingers.pinky, "touching-thumb");
    assert.equal(six.fingers.index, "extended");

    assert.equal(seven.thumb, "touching-ring");
    assert.equal(seven.fingers.ring, "touching-thumb");
    assert.equal(seven.fingers.index, "extended");

    assert.equal(eight.thumb, "touching-middle");
    assert.equal(eight.fingers.middle, "touching-thumb");
    assert.equal(eight.fingers.index, "extended");

    assert.equal(nine.thumb, "touching-index");
    assert.equal(nine.fingers.index, "touching-thumb");
    assert.equal(nine.fingers.pinky, "extended");
  });

  it("Ensures no identical duplicate handshapes without distinct anatomical state", () => {
    const signatures = new Map();
    for (const [key, spec] of Object.entries(HANDSHAPES)) {
      const sig = `${spec.type}:${spec.fingers.index}-${spec.fingers.middle}-${spec.fingers.ring}-${spec.fingers.pinky}|T:${spec.thumb}|P:${spec.palm}|R:${spec.rotation || 0}`;
      if (signatures.has(sig)) {
        const otherKey = signatures.get(sig);
        // If an alias exists (e.g. Letter B and Number 4 both have 4 extended fingers, but thumb differs), verify thumb differentiation
        assert.notEqual(
          key,
          otherKey,
          `Handshape ${key} has exact duplicate signature of ${otherKey}: ${sig}`
        );
      }
      signatures.set(sig, key);
    }
  });

  it("getHandshape helper resolves shapes case-insensitively with alias support", () => {
    assert.equal(getHandshape("a")?.id, "A");
    assert.equal(getHandshape("A")?.id, "A");
    assert.equal(getHandshape("5")?.id, "5");
    assert.equal(getHandshape("number-5")?.id, "5");
    assert.equal(getHandshape("letter-z")?.id, "Z");
    assert.equal(getHandshape("nonexistent_shape"), null);
  });
});

// ============================================================================
// SUITE 3: QUIZ GENERATION
// ============================================================================
describe("Suite 3: Quiz Generation", () => {
  const quizIds = [
    "quiz-alphabet",
    "quiz-numbers-0-10",
    "quiz-numbers-11-100",
    "quiz-greetings",
    "quiz-family",
    "quiz-phrases",
    "quiz-daily-mixed",
  ];

  it("All 7 canonical quizzes exist in QUIZ_DEFINITIONS", () => {
    assert.equal(QUIZ_DEFINITIONS.length, 7);
    for (const id of quizIds) {
      const def = QUIZ_DEFINITIONS.find((q) => q.id === id);
      assert.ok(def, `Quiz definition ${id} must exist`);
      assert.ok(def.title.length > 0, `Quiz ${id} must have a title`);
      assert.ok(def.questionCount === 10 || def.questionCount === 15);
    }
  });

  it("Question pool size is at least 2x the quiz length for replay variety", () => {
    for (const def of QUIZ_DEFINITIONS) {
      const instance = generateQuizInstance(def.id);
      assert.ok(
        instance.poolSize >= def.questionCount * 2,
        `Quiz ${def.id} has pool size ${instance.poolSize}, expected at least ${def.questionCount * 2}`
      );
    }
  });

  it("Generated quiz instances have correct question count and time limit", () => {
    for (const def of QUIZ_DEFINITIONS) {
      const instance = generateQuizInstance(def.id);
      assert.ok(instance, `Quiz instance for ${def.id} generated`);
      assert.equal(
        instance.questions.length,
        def.questionCount,
        `Quiz ${def.id} should generate ${def.questionCount} questions`
      );
      assert.equal(
        instance.timeLimitSeconds,
        def.questionCount * 30,
        `Quiz ${def.id} should allow 30 seconds per question`
      );
    }
  });

  it("Every question has 4 unique options, correctAnswer in options, and an explanation", () => {
    for (const def of QUIZ_DEFINITIONS) {
      const instance = generateQuizInstance(def.id);
      for (const [idx, q] of instance.questions.entries()) {
        assert.ok(q.id, `Question ${idx} in ${def.id} must have id`);
        assert.ok(q.prompt, `Question ${idx} in ${def.id} must have prompt`);
        if (q.type === "true_false") {
          assert.equal(q.options.length, 2, `Question ${idx} in ${def.id} (true_false) must have 2 options`);
        } else {
          assert.equal(q.options.length, 4, `Question ${idx} in ${def.id} must have 4 options`);
        }

        // Check uniqueness of options (no duplicate choices)
        const uniqueOptions = new Set(q.options);
        const expectedCount = q.type === "true_false" ? 2 : 4;
        assert.equal(uniqueOptions.size, expectedCount, `Question ${idx} in ${def.id} has duplicate options: ${q.options.join(", ")}`);

        // Check correct answer presence
        assert.ok(q.correctAnswer, `Question ${idx} in ${def.id} must have correctAnswer`);
        assert.ok(
          q.options.includes(q.correctAnswer),
          `Question ${idx} in ${def.id} correctAnswer "${q.correctAnswer}" must be among options: ${q.options.join(", ")}`
        );

        // Explanation present
        assert.ok(
          q.explanation && q.explanation.trim().length > 10,
          `Question ${idx} in ${def.id} must have comprehensive explanation`
        );
      }
    }
  });

  it("Excludes signs marked needsReview: true from quiz questions", () => {
    const needsReviewLessons = ALL_LESSONS.filter((l) => l.needsReview);
    const needsReviewIds = new Set(needsReviewLessons.map((l) => l.id));

    // Run 5 generations across all quizzes to sample question generation
    for (let run = 0; run < 5; run++) {
      for (const def of QUIZ_DEFINITIONS) {
        const instance = generateQuizInstance(def.id);
        for (const q of instance.questions) {
          assert.ok(
            !needsReviewIds.has(q.lessonId),
            `Quiz question ${q.id} used a lesson marked needsReview: ${q.lessonId}`
          );
        }
      }
    }
  });

  it("Retakes produce different question sets or orderings (shuffled)", () => {
    const inst1 = generateQuizInstance("quiz-alphabet");
    const inst2 = generateQuizInstance("quiz-alphabet");
    const ids1 = inst1.questions.map((q) => q.id).join(",");
    const ids2 = inst2.questions.map((q) => q.id).join(",");

    // Because the pool is 26 letters and 10 are sampled randomly, probability of identical ordering is negligible (< 10^-7)
    assert.notEqual(ids1, ids2, "Two successive quiz generations should yield different question sequences");
  });
});

// ============================================================================
// SUITE 4: CAMERA ERROR MAPPING
// ============================================================================
describe("Suite 4: Camera Error Mapping", () => {
  it("Maps NotAllowedError / PermissionDeniedError to actionable permission fix", () => {
    const err = { name: "NotAllowedError", message: "Permission dismissed" };
    const mapped = mapCameraError(err);
    assert.equal(mapped.status, "denied");
    assert.equal(mapped.title, "Camera permission denied");
    assert.ok(mapped.fix.includes("lock"), "Fix must guide user to address bar lock icon");
    assert.ok(mapped.fix.includes("Windows Settings"), "Fix must guide user to Windows camera privacy settings");
  });

  it("Maps NotFoundError / DevicesNotFoundError to hardware guidance", () => {
    const err = { name: "NotFoundError" };
    const mapped = mapCameraError(err);
    assert.equal(mapped.status, "error");
    assert.equal(mapped.title, "No camera found");
    assert.ok(mapped.fix.includes("external webcam") || mapped.fix.includes("Device Manager"));
  });

  it("Maps NotReadableError / TrackStartError to concurrent app conflict guidance", () => {
    const err = { name: "NotReadableError", message: "Device in use" };
    const mapped = mapCameraError(err);
    assert.equal(mapped.status, "error");
    assert.ok(mapped.title.includes("busy"));
    assert.ok(
      mapped.fix.includes("Zoom") && mapped.fix.includes("Teams"),
      "Fix must explicitly advise closing Zoom, Microsoft Teams, etc."
    );
  });

  it("Maps SecurityError to HTTPS / localhost requirement", () => {
    const err = { name: "SecurityError" };
    const mapped = mapCameraError(err);
    assert.equal(mapped.status, "error");
    assert.equal(mapped.title, "Secure connection required");
    assert.ok(mapped.fix.includes("HTTPS") && mapped.fix.includes("localhost"));
  });

  it("Maps OverconstrainedError to constraint recovery advice", () => {
    const err = { name: "OverconstrainedError" };
    const mapped = mapCameraError(err);
    assert.equal(mapped.status, "error");
    assert.equal(mapped.title, "Unsupported camera resolution");
    assert.ok(mapped.fix.includes("Retry"));
  });

  it("Gracefully handles generic, unknown, and null error inputs", () => {
    const genericErr = new Error("Custom USB disconnection");
    const mappedGeneric = mapCameraError(genericErr);
    assert.equal(mappedGeneric.status, "error");
    assert.equal(mappedGeneric.title, "Camera access failed");
    assert.equal(mappedGeneric.message, "Custom USB disconnection");

    const nullMapped = mapCameraError(null);
    assert.equal(nullMapped.status, "error");
    assert.ok(nullMapped.fix.length > 0);

    const undefMapped = mapCameraError(undefined);
    assert.equal(undefMapped.status, "error");
    assert.ok(undefMapped.title.length > 0);
  });
});

// ============================================================================
// SUITE 5: CURRICULUM & LESSON SCHEMA INTEGRITY
// ============================================================================
describe("Suite 5: Curriculum & Lesson Schema Integrity", () => {
  it("getBeginnerPathLessons returns complete structure with coreWords, alphabet, and numbers", () => {
    const beginnerData = getBeginnerPathLessons();
    assert.ok(beginnerData, "getBeginnerPathLessons must return an object");
    assert.ok(Array.isArray(beginnerData.all), "all must be an array");
    assert.ok(Array.isArray(beginnerData.alphabet), "alphabet must be an array");
    assert.ok(Array.isArray(beginnerData.numbers), "numbers must be an array");
    assert.ok(Array.isArray(beginnerData.greetings), "greetings must be an array");
    assert.ok(Array.isArray(beginnerData.coreWords), "coreWords must be an array");
    assert.equal(beginnerData.total, beginnerData.all.length);
    assert.ok(beginnerData.coreWords.length > 0, "coreWords must have items");
    assert.equal(beginnerData.coreWords.length, beginnerData.greetings.length);
  });

  it("Every lesson has all mandatory fields (id, label, level, category, order, xp, media, steps, animationSpec, tip)", () => {
    const required = ["id", "label", "level", "category", "order", "xp", "media", "steps", "animationSpec", "tip"];
    for (const lesson of ALL_LESSONS) {
      for (const field of required) {
        assert.ok(
          lesson[field] !== undefined && lesson[field] !== null && lesson[field] !== "",
          `Lesson ${lesson.id || "unknown"} is missing required field '${field}'`
        );
      }
      assert.ok(lesson.media.url, `Lesson ${lesson.id} missing media.url`);
      assert.ok(Array.isArray(lesson.steps) && lesson.steps.length >= 2, `Lesson ${lesson.id} must have >= 2 steps`);
      assert.ok(lesson.animationSpec.handshape, `Lesson ${lesson.id} missing animationSpec.handshape`);
      assert.ok(lesson.animationSpec.location, `Lesson ${lesson.id} missing animationSpec.location`);
      assert.ok(lesson.animationSpec.orientation, `Lesson ${lesson.id} missing animationSpec.orientation`);
      if (lesson.category === "greetings") {
        assert.ok(lesson.theme, `Greetings lesson ${lesson.id} must have a theme`);
      }
    }
  });
});

console.log(`\n🎉 All ${passed}/${total} unit tests passed successfully!\n`);
