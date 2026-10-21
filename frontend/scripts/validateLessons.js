import { ALL_LESSONS } from "../src/data/lessons.js";

console.log(`Starting validation of ${ALL_LESSONS.length} lessons...`);

let hasError = false;
const seenIds = new Set();

ALL_LESSONS.forEach((lesson, index) => {
  const prefix = `[Lesson #${index + 1} - ${lesson.id || 'NO_ID'}]`;

  // 1. Check ID
  if (!lesson.id || typeof lesson.id !== "string" || lesson.id.trim() === "") {
    console.error(`${prefix} Error: Missing or invalid 'id'.`);
    hasError = true;
  } else if (seenIds.has(lesson.id)) {
    console.error(`${prefix} Error: Duplicate id '${lesson.id}'.`);
    hasError = true;
  } else {
    seenIds.add(lesson.id);
  }

  // 2. Check label (Display title)
  if (!lesson.label || typeof lesson.label !== "string" || lesson.label.trim() === "") {
    console.error(`${prefix} Error: Missing 'label'.`);
    hasError = true;
  } else if (lesson.label.includes("_")) {
    console.error(`${prefix} Error: 'label' contains raw snake_case ('${lesson.label}'). Must be a display title.`);
    hasError = true;
  }

  // 3. Check level
  if (!["beginner", "intermediate", "advanced"].includes(lesson.level)) {
    console.error(`${prefix} Error: Invalid level '${lesson.level}'.`);
    hasError = true;
  }

  // 4. Check category
  if (!lesson.category || typeof lesson.category !== "string") {
    console.error(`${prefix} Error: Missing category.`);
    hasError = true;
  }

  // 5. Check order
  if (typeof lesson.order !== "number") {
    console.error(`${prefix} Error: 'order' must be a number.`);
    hasError = true;
  }

  // 6. Check XP
  if (typeof lesson.xp !== "number" || lesson.xp <= 0) {
    console.error(`${prefix} Error: Missing or invalid 'xp' (must be positive number, got ${lesson.xp}).`);
    hasError = true;
  } else if (lesson.category === "greetings") {
    const expectedXp = lesson.level === "beginner" ? 10 : lesson.level === "intermediate" ? 15 : 25;
    if (lesson.xp !== expectedXp) {
      console.error(`${prefix} Error: Expected ${expectedXp} XP for ${lesson.level} greeting lesson, got ${lesson.xp}.`);
      hasError = true;
    }
  }

  // 7. Check media
  if (!lesson.media || typeof lesson.media !== "object") {
    console.error(`${prefix} Error: Missing 'media' object.`);
    hasError = true;
  } else {
    if (!lesson.media.url || typeof lesson.media.url !== "string") {
      console.error(`${prefix} Error: Missing 'media.url'.`);
      hasError = true;
    }
    if (!lesson.media.alt || typeof lesson.media.alt !== "string") {
      console.error(`${prefix} Error: Missing 'media.alt'.`);
      hasError = true;
    }
  }

  // 8. Check steps
  if (!Array.isArray(lesson.steps) || lesson.steps.length < 2) {
    console.error(`${prefix} Error: 'steps' must be an array with at least 2 steps (got ${lesson.steps?.length || 0}).`);
    hasError = true;
  } else {
    lesson.steps.forEach((step, stepIdx) => {
      if (!step || typeof step !== "string" || step.trim() === "") {
        console.error(`${prefix} Error: Step ${stepIdx + 1} is empty or invalid.`);
        hasError = true;
      }
    });
  }

  // 9. Check motionTag
  if (lesson.motionTag && !["static", "motion"].includes(lesson.motionTag)) {
    console.error(`${prefix} Error: Invalid motionTag '${lesson.motionTag}'. Must be 'static' or 'motion'.`);
    hasError = true;
  }

  // 10. Check animationSpec (Strictly required for greetings and all lessons)
  if (!lesson.animationSpec) {
    console.error(`${prefix} Error: Missing required 'animationSpec'.`);
    hasError = true;
  } else {
    const spec = lesson.animationSpec;
    if (!spec.handshape || !spec.startPosition || !spec.endPosition || !spec.path) {
      console.error(`${prefix} Error: Incomplete animationSpec (requires handshape, startPosition, endPosition, path).`);
      hasError = true;
    }
  }

  // 11. Check prerequisites if present
  if (lesson.prerequisites) {
    if (!Array.isArray(lesson.prerequisites)) {
      console.error(`${prefix} Error: 'prerequisites' must be an array.`);
      hasError = true;
    } else {
      lesson.prerequisites.forEach((prereqId) => {
        const found = ALL_LESSONS.some((l) => l.id === prereqId);
        if (!found) {
          console.error(`${prefix} Error: Prerequisite '${prereqId}' does not exist in ALL_LESSONS.`);
          hasError = true;
        }
      });
    }
  }

  // 12. Check theme for greetings
  if (lesson.category === "greetings" && (!lesson.theme || typeof lesson.theme !== "string")) {
    console.error(`${prefix} Error: Missing 'theme' for greetings lesson.`);
    hasError = true;
  }

  // 13. Check tip
  if (!lesson.tip || typeof lesson.tip !== "string" || lesson.tip.trim() === "") {
    console.error(`${prefix} Error: Missing or empty 'tip'.`);
    hasError = true;
  }

  // 14. Check animationSpec location and orientation
  if (lesson.animationSpec) {
    if (!lesson.animationSpec.location || typeof lesson.animationSpec.location !== "string") {
      console.error(`${prefix} Error: Missing or invalid 'animationSpec.location'.`);
      hasError = true;
    }
    if (!lesson.animationSpec.orientation || typeof lesson.animationSpec.orientation !== "string") {
      console.error(`${prefix} Error: Missing or invalid 'animationSpec.orientation'.`);
      hasError = true;
    }
  }
});

if (hasError) {
  console.error("\n❌ Validation FAILED: One or more lessons have missing or invalid properties.");
  process.exit(1);
} else {
  console.log(`\n✅ Validation PASSED: All ${ALL_LESSONS.length} lessons have valid IDs, display labels, XP, media, and steps!`);
  process.exit(0);
}
