/**
 * SignVerse Hand Posture & Anatomical Angle Comparator
 * 
 * Computes 3D joint flexion angles, finger extension/curl states, thumb positioning,
 * and 3D palm normal orientation from MediaPipe 21 hand landmarks, and compares
 * them against canonical ASL handshape specifications in handshapes.ts.
 */

import { getHandshape, HANDSHAPES } from "../data/handshapes.ts";

/**
 * 3D Euclidean distance between two landmarks
 */
export function euclideanDistance(p1, p2) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  const dz = (p1.z || 0) - (p2.z || 0);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Calculate 3D angle (in degrees) at joint B formed by points A-B-C
 */
export function calculateJointAngle(pA, pB, pC) {
  const v1 = {
    x: pA.x - pB.x,
    y: pA.y - pB.y,
    z: (pA.z || 0) - (pB.z || 0),
  };
  const v2 = {
    x: pC.x - pB.x,
    y: pC.y - pB.y,
    z: (pC.z || 0) - (pB.z || 0),
  };

  const dot = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
  const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y + v1.z * v1.z);
  const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y + v2.z * v2.z);

  if (mag1 * mag2 === 0) return 180;

  const cosTheta = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));
  return (Math.acos(cosTheta) * 180) / Math.PI;
}

/**
 * Extract physical palm scale (wrist to middle knuckle MCP)
 */
export function getPalmScale(landmarks) {
  if (!landmarks || landmarks.length < 21) return 1.0;
  return Math.max(0.04, euclideanDistance(landmarks[0], landmarks[9]));
}

/**
 * Analyze a single finger's state from its 4 landmarks (MCP, PIP, DIP, TIP)
 * @param {Array} landmarks 21 MediaPipe hand landmarks
 * @param {number} mcpIdx MCP base index (e.g. 5 for index)
 * @param {number} thumbTipIdx Index 4
 * @returns {'extended' | 'curled' | 'touching-thumb' | 'hooked' | 'bent'}
 */
export function analyzeFingerState(landmarks, mcpIdx, thumbTipIdx = 4) {
  const wrist = landmarks[0];
  const mcp = landmarks[mcpIdx];
  const pip = landmarks[mcpIdx + 1];
  const dip = landmarks[mcpIdx + 2];
  const tip = landmarks[mcpIdx + 3];
  const thumbTip = landmarks[thumbTipIdx];

  const palmScale = getPalmScale(landmarks);

  // 1. Joint angles
  const pipAngle = calculateJointAngle(mcp, pip, dip);
  const dipAngle = calculateJointAngle(pip, dip, tip);

  // 2. Relative distances to wrist
  const tipWristDist = euclideanDistance(tip, wrist);
  const pipWristDist = euclideanDistance(pip, wrist);
  const mcpWristDist = euclideanDistance(mcp, wrist);

  // 3. Pinch contact with thumb
  const tipThumbDist = euclideanDistance(tip, thumbTip) / palmScale;
  if (tipThumbDist < 0.28) {
    return "touching-thumb";
  }

  // 4. Extension check:
  // When extended, PIP angle is large (> 135 deg) and tip is farther from wrist than PIP
  const isFartherThanPip = tipWristDist > pipWristDist * 1.05;
  const isAngleStraight = pipAngle > 135 && dipAngle > 120;
  const isTipAbovePip = tip.y < pip.y + 0.05 * palmScale; // y decreases upward in MediaPipe

  if (isAngleStraight && isFartherThanPip && isTipAbovePip) {
    return "extended";
  }

  // 5. Curled check:
  // When curled, tip folds down closer to palm/wrist than PIP
  if (pipAngle < 110 || tipWristDist < mcpWristDist * 1.15 || tip.y > pip.y + 0.03 * palmScale) {
    return "curled";
  }

  // 6. Bent or Hooked
  if (pipAngle >= 110 && pipAngle <= 135) {
    return "bent";
  }

  return "curled";
}

/**
 * Analyze thumb posture
 * @param {Array} landmarks 21 MediaPipe landmarks
 * @returns {'out' | 'across' | 'tucked' | 'up' | 'touching-pinky' | 'touching-ring' | 'touching-middle' | 'touching-index'}
 */
export function analyzeThumbState(landmarks) {
  const thumbTip = landmarks[4];
  const thumbIp = landmarks[3];
  const thumbMcp = landmarks[2];
  const pinkyMcp = landmarks[17];
  const palmScale = getPalmScale(landmarks);

  // Distance from thumb tip to pinky base (abduction measure)
  const thumbPinkyDist = euclideanDistance(thumbTip, pinkyMcp) / palmScale;

  // Contact checks with other finger tips
  const indexDist = euclideanDistance(thumbTip, landmarks[8]) / palmScale;
  const middleDist = euclideanDistance(thumbTip, landmarks[12]) / palmScale;
  const ringDist = euclideanDistance(thumbTip, landmarks[16]) / palmScale;
  const pinkyDist = euclideanDistance(thumbTip, landmarks[20]) / palmScale;

  if (pinkyDist < 0.30) return "touching-pinky";
  if (ringDist < 0.30) return "touching-ring";
  if (middleDist < 0.30) return "touching-middle";
  if (indexDist < 0.30) return "touching-index";

  // Upright check (thumbs up: tip is significantly higher than MCP and IP)
  const isPointingUp = thumbTip.y < thumbMcp.y - 0.15 * palmScale && thumbTip.y < thumbIp.y;
  if (isPointingUp && thumbPinkyDist > 0.65) {
    return "up";
  }

  // Abducted thumb pointing outward
  if (thumbPinkyDist > 0.85) {
    return "out";
  }

  // Folded across the front of palm (Letter B, etc.)
  if (thumbTip.x > landmarks[5].x - 0.05 * palmScale && thumbPinkyDist <= 0.85 && thumbPinkyDist >= 0.45) {
    return "across";
  }

  return "tucked";
}

/**
 * Estimate 3D palm normal orientation
 * @param {Array} landmarks 21 MediaPipe landmarks
 * @returns {'forward' | 'down' | 'up' | 'toward-body' | 'left' | 'right'}
 */
export function analyzePalmOrientation(landmarks) {
  const p0 = landmarks[0];   // Wrist
  const p5 = landmarks[5];   // Index MCP
  const p17 = landmarks[17]; // Pinky MCP

  // Vectors spanning the palm plane
  const v1 = { x: p5.x - p0.x, y: p5.y - p0.y, z: (p5.z || 0) - (p0.z || 0) };
  const v2 = { x: p17.x - p0.x, y: p17.y - p0.y, z: (p17.z || 0) - (p0.z || 0) };

  // Cross product: v1 x v2 = normal vector
  const nx = v1.y * v2.z - v1.z * v2.y;
  const ny = v1.z * v2.x - v1.x * v2.z;
  const nz = v1.x * v2.y - v1.y * v2.x;

  const mag = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
  const norm = { x: nx / mag, y: ny / mag, z: nz / mag };

  // In standard MediaPipe coordinates:
  // z points toward camera (-z) or into screen (+z)
  if (norm.y > 0.45) return "down";
  if (norm.y < -0.45) return "up";
  if (norm.z < -0.30) return "forward";
  if (norm.z > 0.30) return "toward-body";
  if (norm.x < -0.40) return "left";
  if (norm.x > 0.40) return "right";

  return "forward";
}

/**
 * Measure full hand posture from 21 MediaPipe landmarks
 */
export function measureHandPosture(landmarks) {
  if (!landmarks || landmarks.length < 21) {
    return null;
  }

  const index = analyzeFingerState(landmarks, 5, 4);
  const middle = analyzeFingerState(landmarks, 9, 4);
  const ring = analyzeFingerState(landmarks, 13, 4);
  const pinky = analyzeFingerState(landmarks, 17, 4);
  const thumb = analyzeThumbState(landmarks);
  const palm = analyzePalmOrientation(landmarks);

  // Exact joint angles for debugging & analytics
  const angles = {
    indexPip: Math.round(calculateJointAngle(landmarks[5], landmarks[6], landmarks[7])),
    middlePip: Math.round(calculateJointAngle(landmarks[9], landmarks[10], landmarks[11])),
    ringPip: Math.round(calculateJointAngle(landmarks[13], landmarks[14], landmarks[15])),
    pinkyPip: Math.round(calculateJointAngle(landmarks[17], landmarks[18], landmarks[19])),
    thumbMcp: Math.round(calculateJointAngle(landmarks[1], landmarks[2], landmarks[3])),
  };

  return {
    fingers: { index, middle, ring, pinky },
    thumb,
    palm,
    angles,
  };
}

/**
 * Resolve target handshape from lesson id, label, or spec
 */
export function resolveTargetHandshape(lessonOrKey) {
  if (!lessonOrKey) return HANDSHAPES["B"];

  // Direct HandshapeSpec object
  if (typeof lessonOrKey === "object" && lessonOrKey.fingers) {
    return lessonOrKey;
  }

  // Lesson object
  if (typeof lessonOrKey === "object") {
    // Check animationSpec handshape
    const specHandshape = lessonOrKey.animationSpec?.handshape;
    if (specHandshape) {
      const found = getHandshape(specHandshape);
      if (found) return found;
    }

    const label = lessonOrKey.label || lessonOrKey.title || lessonOrKey.sign_label || "";
    const cleanLabel = label.replace(/^(letter|number)\s*/i, "").trim();
    const foundByLabel = getHandshape(cleanLabel);
    if (foundByLabel) return foundByLabel;

    const id = lessonOrKey.id || "";
    const cleanId = id.replace(/^(alpha|num|word)-/i, "").trim();
    const foundById = getHandshape(cleanId);
    if (foundById) return foundById;
  }

  // String lookup
  if (typeof lessonOrKey === "string") {
    const found = getHandshape(lessonOrKey);
    if (found) return found;
  }

  return HANDSHAPES["B"];
}

/**
 * Compare measured user hand posture against canonical target handshape
 * Returns specific actionable feedback and per-finger correctness.
 *
 * @param {Object} measured Measured posture from measureHandPosture()
 * @param {HandshapeSpec|Object|string} targetSpec Expected canonical handshape
 * @returns {Object} Comparison report
 */
export function compareHandPosture(measured, targetSpec) {
  const target = resolveTargetHandshape(targetSpec);

  if (!measured || !measured.fingers) {
    return {
      isMatch: false,
      overallScore: 0,
      feedbackList: ["Show your hand clearly to the webcam"],
      primaryFeedback: "Show your hand clearly to the webcam",
      fingerStatus: {
        thumb: "neutral",
        index: "neutral",
        middle: "neutral",
        ring: "neutral",
        pinky: "neutral",
      },
      target,
    };
  }

  const feedbackList = [];
  const fingerStatus = {};
  let matchingComponents = 0;
  const totalComponents = 5; // thumb, index, middle, ring, pinky

  // 1. Index Finger Comparison
  const targetIndex = target.fingers.index;
  const measuredIndex = measured.fingers.index;
  if (
    measuredIndex === targetIndex ||
    (targetIndex === "extended" && measuredIndex === "extended") ||
    (targetIndex === "curled" && (measuredIndex === "curled" || measuredIndex === "bent"))
  ) {
    fingerStatus.index = "correct";
    matchingComponents++;
  } else {
    fingerStatus.index = "incorrect";
    if (targetIndex === "extended") {
      feedbackList.push("Index finger should be extended straight up");
    } else if (targetIndex === "curled") {
      feedbackList.push("Index finger should be curled into your palm");
    } else if (targetIndex === "touching-thumb") {
      feedbackList.push("Touch index finger tip to your thumb");
    } else {
      feedbackList.push(`Index finger should be ${targetIndex.replace(/-/g, " ")}`);
    }
  }

  // 2. Middle Finger Comparison
  const targetMiddle = target.fingers.middle;
  const measuredMiddle = measured.fingers.middle;
  if (
    measuredMiddle === targetMiddle ||
    (targetMiddle === "extended" && measuredMiddle === "extended") ||
    (targetMiddle === "curled" && (measuredMiddle === "curled" || measuredMiddle === "bent"))
  ) {
    fingerStatus.middle = "correct";
    matchingComponents++;
  } else {
    fingerStatus.middle = "incorrect";
    if (targetMiddle === "extended") {
      feedbackList.push("Middle finger should be extended straight up");
    } else if (targetMiddle === "curled") {
      feedbackList.push("Middle finger should be curled into your palm");
    } else if (targetMiddle === "touching-thumb") {
      feedbackList.push("Touch middle finger tip to your thumb");
    } else {
      feedbackList.push(`Middle finger should be ${targetMiddle.replace(/-/g, " ")}`);
    }
  }

  // 3. Ring Finger Comparison
  const targetRing = target.fingers.ring;
  const measuredRing = measured.fingers.ring;
  if (
    measuredRing === targetRing ||
    (targetRing === "extended" && measuredRing === "extended") ||
    (targetRing === "curled" && (measuredRing === "curled" || measuredRing === "bent"))
  ) {
    fingerStatus.ring = "correct";
    matchingComponents++;
  } else {
    fingerStatus.ring = "incorrect";
    if (targetRing === "extended") {
      feedbackList.push("Ring finger should be extended straight up");
    } else if (targetRing === "curled") {
      feedbackList.push("Ring finger should be curled into your palm");
    } else if (targetRing === "touching-thumb") {
      feedbackList.push("Touch ring finger tip to your thumb");
    } else {
      feedbackList.push(`Ring finger should be ${targetRing.replace(/-/g, " ")}`);
    }
  }

  // 4. Pinky Finger Comparison
  const targetPinky = target.fingers.pinky;
  const measuredPinky = measured.fingers.pinky;
  if (
    measuredPinky === targetPinky ||
    (targetPinky === "extended" && measuredPinky === "extended") ||
    (targetPinky === "curled" && (measuredPinky === "curled" || measuredPinky === "bent"))
  ) {
    fingerStatus.pinky = "correct";
    matchingComponents++;
  } else {
    fingerStatus.pinky = "incorrect";
    if (targetPinky === "extended") {
      feedbackList.push("Pinky finger should be extended upright");
    } else if (targetPinky === "curled") {
      feedbackList.push("Pinky finger should be curled into your palm");
    } else if (targetPinky === "touching-thumb") {
      feedbackList.push("Touch pinky finger tip to your thumb");
    } else {
      feedbackList.push(`Pinky finger should be ${targetPinky.replace(/-/g, " ")}`);
    }
  }

  // 5. Thumb Comparison
  const targetThumb = target.thumb;
  const measuredThumb = measured.thumb;
  const isThumbCompatible =
    measuredThumb === targetThumb ||
    (targetThumb === "up" && measuredThumb === "up") ||
    (targetThumb === "out" && (measuredThumb === "out" || measuredThumb === "up")) ||
    ((targetThumb === "across" || targetThumb === "tucked") &&
      (measuredThumb === "across" || measuredThumb === "tucked"));

  if (isThumbCompatible) {
    fingerStatus.thumb = "correct";
    matchingComponents++;
  } else {
    fingerStatus.thumb = "incorrect";
    if (targetThumb === "up") {
      feedbackList.push("Thumb should point straight up");
    } else if (targetThumb === "out") {
      feedbackList.push("Extend thumb out to the side");
    } else if (targetThumb === "across") {
      feedbackList.push("Fold thumb flat across your palm");
    } else if (targetThumb.startsWith("touching-")) {
      const fingerName = targetThumb.replace("touching-", "");
      feedbackList.push(`Touch thumb to your ${fingerName} finger`);
    } else {
      feedbackList.push("Tuck your thumb against your fingers");
    }
  }

  // Palm Orientation Check (soft advisory)
  if (target.palm && measured.palm && target.palm !== measured.palm) {
    if (target.palm === "forward" && measured.palm !== "forward") {
      feedbackList.push("Turn your palm to face forward toward the camera");
    } else if (target.palm === "down" && measured.palm !== "down") {
      feedbackList.push("Turn your palm downward toward the ground");
    } else if (target.palm === "toward-body" && measured.palm !== "toward-body") {
      feedbackList.push("Turn the back of your hand toward the camera");
    }
  }

  const overallScore = Math.round((matchingComponents / totalComponents) * 100);
  const isMatch = matchingComponents >= 4; // At least 4 of 5 components correct

  const primaryFeedback =
    feedbackList.length === 0
      ? `Great job! Hand matches "${target.label || target.id}"!`
      : feedbackList[0];

  return {
    isMatch,
    overallScore, // 0 to 100
    matchingComponents,
    totalComponents,
    feedbackList,
    primaryFeedback,
    fingerStatus,
    target,
    measured,
  };
}
