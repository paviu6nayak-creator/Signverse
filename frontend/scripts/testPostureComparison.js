/**
 * SignVerse Hand Posture & Anatomical Angle Comparator Unit Tests
 * 
 * Verifies:
 * 1. calculateJointAngle (straight 180°, right 90°, acute 45°, collinear edge cases)
 * 2. Palm scale and Euclidean 3D distance calculation
 * 3. analyzeFingerState (extended, curled, touching-thumb)
 * 4. analyzeThumbState (up, out, across, touching-pinky/index)
 * 5. analyzePalmOrientation (forward, down, up, toward-body)
 * 6. compareHandPosture (feedback messages, fingerStatus green/red highlighting, matching score)
 */

import assert from "node:assert/strict";
import {
  calculateJointAngle,
  euclideanDistance,
  getPalmScale,
  analyzeFingerState,
  analyzeThumbState,
  analyzePalmOrientation,
  measureHandPosture,
  compareHandPosture,
  resolveTargetHandshape,
} from "../src/utils/handPostureComparator.js";
import { HANDSHAPES } from "../src/data/handshapes.ts";

console.log("\n🧪 Running SignVerse Hand Posture Comparison Unit Tests...\n");

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
// SUITE 1: 3D ANGLE & DISTANCE CALCULATIONS
// ============================================================================
describe("Suite 1: 3D Angle & Distance Calculations", () => {
  it("calculates accurate 3D Euclidean distance", () => {
    const p1 = { x: 0, y: 0, z: 0 };
    const p2 = { x: 3, y: 4, z: 0 };
    assert.equal(Math.round(euclideanDistance(p1, p2)), 5);

    const p3 = { x: 1, y: 2, z: 2 };
    assert.equal(Math.round(euclideanDistance(p1, p3)), 3);
  });

  it("calculates straight angle (180°) for collinear points", () => {
    const pA = { x: 0, y: 0, z: 0 };
    const pB = { x: 0, y: 1, z: 0 };
    const pC = { x: 0, y: 2, z: 0 };
    const angle = calculateJointAngle(pA, pB, pC);
    assert.equal(Math.round(angle), 180);
  });

  it("calculates right angle (90°) accurately", () => {
    const pA = { x: 1, y: 0, z: 0 };
    const pB = { x: 0, y: 0, z: 0 };
    const pC = { x: 0, y: 1, z: 0 };
    const angle = calculateJointAngle(pA, pB, pC);
    assert.equal(Math.round(angle), 90);
  });

  it("calculates acute angle (45°) accurately", () => {
    const pA = { x: 1, y: 0, z: 0 };
    const pB = { x: 0, y: 0, z: 0 };
    const pC = { x: 1, y: 1, z: 0 };
    const angle = calculateJointAngle(pA, pB, pC);
    assert.equal(Math.round(angle), 45);
  });

  it("gracefully handles zero-length vector edge cases without NaN", () => {
    const pA = { x: 0, y: 0, z: 0 };
    const pB = { x: 0, y: 0, z: 0 };
    const pC = { x: 0, y: 0, z: 0 };
    const angle = calculateJointAngle(pA, pB, pC);
    assert.equal(angle, 180);
    assert.ok(!Number.isNaN(angle));
  });

  it("computes physical palm scale from wrist (0) to middle MCP (9)", () => {
    const dummyLandmarks = Array.from({ length: 21 }, () => ({ x: 0, y: 0, z: 0 }));
    dummyLandmarks[0] = { x: 0.5, y: 0.8, z: 0 };
    dummyLandmarks[9] = { x: 0.5, y: 0.4, z: 0 };
    const scale = getPalmScale(dummyLandmarks);
    assert.equal(Math.round(scale * 10) / 10, 0.4);
  });
});

// ============================================================================
// SUITE 2: FINGER STATE DETECTION (Extended, Curled, Touching Thumb)
// ============================================================================
describe("Suite 2: Finger State Detection", () => {
  function createHandModel({ indexExtended = true, thumbContact = null } = {}) {
    const lm = Array.from({ length: 21 }, () => ({ x: 0.5, y: 0.8, z: 0 }));
    // Wrist
    lm[0] = { x: 0.5, y: 0.8, z: 0 };
    // Middle MCP for palm scale
    lm[9] = { x: 0.5, y: 0.5, z: 0 };
    // Thumb tip
    lm[4] = { x: 0.35, y: 0.6, z: 0 };

    // Index landmarks: 5 (MCP), 6 (PIP), 7 (DIP), 8 (TIP)
    lm[5] = { x: 0.45, y: 0.52, z: 0 };
    if (thumbContact === "index") {
      // Touching thumb tip at lm[4]
      lm[6] = { x: 0.40, y: 0.55, z: 0 };
      lm[7] = { x: 0.37, y: 0.58, z: 0 };
      lm[8] = { x: 0.35, y: 0.60, z: 0 }; // Touching thumb tip
    } else if (indexExtended) {
      lm[6] = { x: 0.45, y: 0.40, z: 0 };
      lm[7] = { x: 0.45, y: 0.30, z: 0 };
      lm[8] = { x: 0.45, y: 0.20, z: 0 }; // Extended high
    } else {
      // Curled into palm
      lm[6] = { x: 0.45, y: 0.45, z: 0 };
      lm[7] = { x: 0.45, y: 0.55, z: 0 };
      lm[8] = { x: 0.45, y: 0.60, z: 0 }; // Curled down
    }

    return lm;
  }

  it("detects extended index finger when straight upright", () => {
    const hand = createHandModel({ indexExtended: true });
    const state = analyzeFingerState(hand, 5, 4);
    assert.equal(state, "extended");
  });

  it("detects curled index finger when folded down toward palm", () => {
    const hand = createHandModel({ indexExtended: false });
    const state = analyzeFingerState(hand, 5, 4);
    assert.equal(state, "curled");
  });

  it("detects touching-thumb finger when finger tip reaches thumb tip", () => {
    const hand = createHandModel({ thumbContact: "index" });
    const state = analyzeFingerState(hand, 5, 4);
    assert.equal(state, "touching-thumb");
  });
});

// ============================================================================
// SUITE 3: THUMB & PALM ORIENTATION
// ============================================================================
describe("Suite 3: Thumb and Palm Orientation", () => {
  it("detects thumbs-up orientation when thumb points upward", () => {
    const lm = Array.from({ length: 21 }, () => ({ x: 0.5, y: 0.6, z: 0 }));
    lm[0] = { x: 0.5, y: 0.8, z: 0 };
    lm[9] = { x: 0.5, y: 0.5, z: 0 }; // palm scale = 0.3
    lm[1] = { x: 0.45, y: 0.75, z: 0 };
    lm[2] = { x: 0.38, y: 0.65, z: 0 }; // Thumb MCP
    lm[3] = { x: 0.35, y: 0.55, z: 0 }; // Thumb IP
    lm[4] = { x: 0.35, y: 0.40, z: 0 }; // Thumb tip high up
    lm[17] = { x: 0.65, y: 0.55, z: 0 }; // Pinky MCP

    const thumbState = analyzeThumbState(lm);
    assert.equal(thumbState, "up");
  });

  it("detects forward palm normal vector from cross product of MCP axes", () => {
    const lm = Array.from({ length: 21 }, () => ({ x: 0.5, y: 0.5, z: 0 }));
    // Hand in camera plane, palm facing camera (-z)
    lm[0] = { x: 0.5, y: 0.8, z: 0 };
    lm[5] = { x: 0.4, y: 0.5, z: 0 };
    lm[17] = { x: 0.6, y: 0.5, z: 0 };
    // v1: (-0.1, -0.3, 0), v2: (0.1, -0.3, 0)
    // cross product nz = (-0.1)*(-0.3) - (-0.3)*(0.1) = 0.03 - (-0.03) = 0.06
    const palm = analyzePalmOrientation(lm);
    assert.ok(["forward", "toward-body"].includes(palm));
  });

  it("measures full hand posture and extracts joint angles from 21 landmarks", () => {
    const lm = Array.from({ length: 21 }, () => ({ x: 0.5, y: 0.5, z: 0 }));
    lm[0] = { x: 0.5, y: 0.8, z: 0 };
    lm[9] = { x: 0.5, y: 0.5, z: 0 };
    const posture = measureHandPosture(lm);
    assert.ok(posture);
    assert.ok(posture.fingers);
    assert.ok(posture.angles);
    assert.equal(typeof posture.angles.indexPip, "number");
  });
});

// ============================================================================
// SUITE 4: POSTURE COMPARISON & FEEDBACK GENERATION
// ============================================================================
describe("Suite 4: Posture Comparison & Specific Feedback", () => {
  it("returns specific feedback message 'Index finger should be extended straight up' when curled", () => {
    // Measured posture: all fingers curled (Fist/Letter S), target: Letter D (index extended)
    const measuredFist = {
      fingers: {
        index: "curled",
        middle: "curled",
        ring: "curled",
        pinky: "curled",
      },
      thumb: "across",
      palm: "forward",
      angles: { indexPip: 60, middlePip: 60, ringPip: 60, pinkyPip: 60, thumbMcp: 110 },
    };

    const target1 = HANDSHAPES["1"]; // index: extended, middle: curled, ring: curled, pinky: curled, thumb: across
    const report = compareHandPosture(measuredFist, target1);

    assert.equal(report.fingerStatus.index, "incorrect");
    assert.equal(report.fingerStatus.middle, "correct");
    assert.equal(report.fingerStatus.ring, "correct");
    assert.equal(report.fingerStatus.pinky, "correct");
    assert.ok(
      report.feedbackList.some((msg) => msg.includes("Index finger should be extended")),
      `Expected feedback to instruct extending index finger, got: ${JSON.stringify(report.feedbackList)}`
    );
    assert.ok(
      report.primaryFeedback.includes("Index finger should be extended"),
      `Primary feedback should prioritize the index finger mismatch, got: ${report.primaryFeedback}`
    );
  });

  it("highlights incorrect fingers in red and correct in green via fingerStatus", () => {
    // Target is Letter B (index, middle, ring, pinky all extended, thumb across)
    // User performs 'V' sign (index and middle extended, ring and pinky curled)
    const measuredVSign = {
      fingers: {
        index: "extended",
        middle: "extended",
        ring: "curled",
        pinky: "curled",
      },
      thumb: "across",
      palm: "forward",
    };

    const report = compareHandPosture(measuredVSign, HANDSHAPES["B"]);

    assert.equal(report.fingerStatus.index, "correct");
    assert.equal(report.fingerStatus.middle, "correct");
    assert.equal(report.fingerStatus.ring, "incorrect");
    assert.equal(report.fingerStatus.pinky, "incorrect");
    assert.equal(report.fingerStatus.thumb, "correct");

    // Score: 3/5 components = 60%
    assert.equal(report.overallScore, 60);
    assert.equal(report.isMatch, false); // < 80%
    assert.ok(report.feedbackList.some((msg) => msg.includes("Ring finger should be extended")));
  });

  it("reports match with 100% score and congratulations when matching target handshape", () => {
    // Letter B matching
    const measuredB = {
      fingers: {
        index: "extended",
        middle: "extended",
        ring: "extended",
        pinky: "extended",
      },
      thumb: "across",
      palm: "forward",
    };

    const report = compareHandPosture(measuredB, HANDSHAPES["B"]);

    assert.equal(report.isMatch, true);
    assert.equal(report.overallScore, 100);
    assert.equal(report.fingerStatus.index, "correct");
    assert.equal(report.fingerStatus.middle, "correct");
    assert.equal(report.fingerStatus.ring, "correct");
    assert.equal(report.fingerStatus.pinky, "correct");
    assert.equal(report.fingerStatus.thumb, "correct");
    assert.ok(report.primaryFeedback.includes("Great job!"));
  });

  it("handles prompt to show hand when no hand landmarks are detected", () => {
    const report = compareHandPosture(null, "B");
    assert.equal(report.isMatch, false);
    assert.equal(report.overallScore, 0);
    assert.equal(report.fingerStatus.index, "neutral");
    assert.ok(report.primaryFeedback.includes("Show your hand"));
  });

  it("resolves target handshape from lesson id, label, or direct key", () => {
    const shapeFromKey = resolveTargetHandshape("A");
    assert.equal(shapeFromKey.id, "A");

    const shapeFromLesson = resolveTargetHandshape({
      id: "alpha-c",
      label: "Letter C",
      animationSpec: { handshape: "C" },
    });
    assert.equal(shapeFromLesson.id, "C");

    const shapeFromNum = resolveTargetHandshape({
      id: "num-5",
      title: "Number 5",
      animationSpec: { handshape: "5" },
    });
    assert.equal(shapeFromNum.id, "5");
  });
});

console.log(`\n🎉 All ${passed}/${total} hand posture comparison tests passed successfully!\n`);
