// frontend/src/utils/signClassifier.js
/**
 * Reliable, verified ASL sign classifier based on MediaPipe 21-point hand landmarks.
 * Evaluates finger extension, curl states, pinches, thumb abduction, and inter-finger
 * distances. Emits ONLY verified vocabulary (letters, numbers, core lesson signs)
 * and refuses to hallucinate labels for unknown or transition gestures.
 */

export const SUPPORTED_VOCABULARY = [
  // Core conversational signs
  "HELLO",
  "GOODBYE",
  "THANK YOU",
  "PLEASE",
  "YES",
  "NO",
  "I LOVE YOU",
  "HELP",
  // Alphabet letters
  "A", "B", "C", "D", "E", "F", "I", "L", "O", "U", "V", "W", "Y",
  // Numbers
  "1", "2", "3", "4", "5",
];

export const DICTIONARY = [
  "HELLO",
  "GOODBYE",
  "THANK YOU",
  "PLEASE",
  "SORRY",
  "YES",
  "NO",
  "HELP",
  "LOVE",
  "FRIEND",
  "FAMILY",
  "WATER",
  "FOOD",
  "NAME",
  "MORE",
  "GOOD",
  "FINE",
  "WANT",
  "HAVE",
  "HOME",
  "SCHOOL",
  "HAPPY",
  "SICK",
  "TIRED",
  "TODAY",
  "HOW",
  "WHAT",
  "WHERE",
  "WHEN",
  "WHY",
];

/**
 * Calculate Euclidean distance between two 3D points
 */
function dist(p1, p2) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  const dz = (p1.z || 0) - (p2.z || 0);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Classify a 21-point MediaPipe hand landmark frame.
 * @param {Array<{x: number, y: number, z?: number}>} landmarks 21 raw landmarks
 * @param {number} minConfidence Minimum acceptable confidence threshold (default 0.70)
 * @returns {{ label: string|null, confidence: number, isConfident: boolean, statusText: string, candidates: Array<{label: string, confidence: number}> }}
 */
export function classifyHandGesture(landmarks, minConfidence = 0.70) {
  if (!landmarks || landmarks.length < 21) {
    return {
      label: null,
      confidence: 0,
      isConfident: false,
      statusText: "No hand detected",
      candidates: [],
    };
  }

  const wrist = landmarks[0];
  const thumbTip = landmarks[4];
  const indexPip = landmarks[6];
  const indexTip = landmarks[8];
  const middlePip = landmarks[10];
  const middleTip = landmarks[12];
  const ringPip = landmarks[14];
  const ringTip = landmarks[16];
  const pinkyMcp = landmarks[17];
  const pinkyPip = landmarks[18];
  const pinkyTip = landmarks[20];

  // Palm scale normalization based on wrist to middle MCP
  const palmScale = Math.max(0.05, dist(wrist, landmarks[9]));

  // Extension status (tip is farther from wrist than PIP + vertical orientation check)
  const isIndexExtended = dist(indexTip, wrist) > dist(indexPip, wrist) * 1.08 && indexTip.y < indexPip.y + 0.04;
  const isMiddleExtended = dist(middleTip, wrist) > dist(middlePip, wrist) * 1.08 && middleTip.y < middlePip.y + 0.04;
  const isRingExtended = dist(ringTip, wrist) > dist(ringPip, wrist) * 1.08 && ringTip.y < ringPip.y + 0.04;
  const isPinkyExtended = dist(pinkyTip, wrist) > dist(pinkyPip, wrist) * 1.08 && pinkyTip.y < pinkyPip.y + 0.04;

  // Thumb abduction: distance from thumb tip to pinky base (MCP 17)
  const thumbPinkyDist = dist(thumbTip, pinkyMcp) / palmScale;
  const isThumbExtended = thumbPinkyDist > 0.85;
  const isThumbPointingUp = thumbTip.y < landmarks[2].y - 0.05 * palmScale && isThumbExtended;

  // Inter-finger distances (normalized by palm scale)
  const pinchIndexThumb = dist(thumbTip, indexTip) / palmScale;
  const pinchMiddleThumb = dist(thumbTip, middleTip) / palmScale;
  const indexMiddleSpread = dist(indexTip, middleTip) / palmScale;

  const openFingerCount = [isIndexExtended, isMiddleExtended, isRingExtended, isPinkyExtended].filter(Boolean).length;

  const scores = {};

  // 1. "HELLO" / "5" (All 5 fingers open and extended, palm forward)
  if (openFingerCount === 4 && isThumbExtended) {
    if (indexMiddleSpread > 0.35) {
      scores["HELLO"] = 0.94;
      scores["5"] = 0.91;
    } else {
      scores["B"] = 0.88;
      scores["HELLO"] = 0.85;
    }
  }

  // 2. "B" / "4" (4 fingers extended straight up, thumb curled across palm)
  if (openFingerCount === 4 && !isThumbExtended) {
    if (indexMiddleSpread < 0.28) {
      scores["B"] = 0.95;
      scores["4"] = 0.90;
      scores["THANK YOU"] = 0.86;
    } else {
      scores["4"] = 0.94;
      scores["B"] = 0.85;
    }
  }

  // 3. "THANK YOU" / "PLEASE" (Flat open palm, fingers together)
  if (openFingerCount === 4 && !isThumbExtended && indexMiddleSpread < 0.22) {
    scores["THANK YOU"] = 0.93;
    scores["PLEASE"] = 0.91;
    scores["B"] = 0.90;
  }

  // 4. "I LOVE YOU" (Thumb, Index, Pinky extended; Middle and Ring curled)
  if (isIndexExtended && isPinkyExtended && isThumbExtended && !isMiddleExtended && !isRingExtended) {
    scores["I LOVE YOU"] = 0.96;
  }

  // 5. "Y" (Thumb and Pinky extended, Index, Middle, Ring curled)
  if (isThumbExtended && isPinkyExtended && !isIndexExtended && !isMiddleExtended && !isRingExtended) {
    scores["Y"] = 0.95;
  }

  // 6. "L" (Index extended upright, Thumb extended horizontally, Middle/Ring/Pinky curled)
  if (isIndexExtended && isThumbExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended) {
    scores["L"] = 0.96;
  }

  // 7. "V" / "2" vs "U" (Index + Middle extended, Ring and Pinky curled)
  if (isIndexExtended && isMiddleExtended && !isRingExtended && !isPinkyExtended && !isThumbExtended) {
    if (indexMiddleSpread > 0.25) {
      scores["V"] = 0.95;
      scores["2"] = 0.92;
    } else {
      scores["U"] = 0.94;
    }
  }

  // 8. "W" / "3" (Index, Middle, Ring extended, Pinky curled)
  if (isIndexExtended && isMiddleExtended && isRingExtended && !isPinkyExtended) {
    scores["W"] = 0.93;
    scores["3"] = 0.90;
  }

  // 9. "1" / "D" (Only Index extended upright, others curled)
  if (isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended) {
    if (pinchMiddleThumb < 0.35) {
      scores["D"] = 0.93;
      scores["1"] = 0.90;
    } else {
      scores["1"] = 0.95;
      scores["D"] = 0.88;
    }
  }

  // 10. "I" (Only Pinky extended, others curled)
  if (isPinkyExtended && !isIndexExtended && !isMiddleExtended && !isRingExtended && !isThumbExtended) {
    scores["I"] = 0.96;
  }

  // 11. "F" (Index and Thumb pinch in circle, Middle, Ring, Pinky extended)
  if (pinchIndexThumb < 0.32 && isMiddleExtended && isRingExtended && isPinkyExtended) {
    scores["F"] = 0.94;
  }

  // 12. "NO" (Index and Middle touch/pinch Thumb tip, Ring and Pinky curled)
  if (pinchIndexThumb < 0.35 && pinchMiddleThumb < 0.40 && !isRingExtended && !isPinkyExtended) {
    scores["NO"] = 0.94;
  }

  // 13. "HELP" (Thumbs-up gesture: all 4 fingers curled, thumb pointing straight up)
  if (openFingerCount === 0 && isThumbPointingUp) {
    scores["HELP"] = 0.96;
  }

  // 14. "YES" / "A" (Closed fist, 0 fingers extended)
  if (openFingerCount === 0 && !isThumbPointingUp) {
    if (thumbPinkyDist > 0.45) {
      scores["A"] = 0.92;
      scores["YES"] = 0.90;
    } else {
      scores["YES"] = 0.94;
      scores["A"] = 0.88;
    }
  }

  // 15. "C" / "O" (Curved C cup or rounded O)
  if (openFingerCount <= 1 && pinchIndexThumb > 0.35 && pinchIndexThumb < 0.70) {
    scores["C"] = 0.89;
  } else if (openFingerCount === 0 && pinchIndexThumb < 0.30) {
    scores["O"] = 0.91;
  }

  // Rank and select top candidate
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const candidates = sorted.map(([label, confidence]) => ({ label, confidence }));

  if (candidates.length === 0 || candidates[0].confidence < minConfidence) {
    return {
      label: null,
      confidence: candidates[0]?.confidence || 0,
      isConfident: false,
      statusText: "Not sure, keep signing",
      candidates,
    };
  }

  const top = candidates[0];
  return {
    label: top.label,
    confidence: top.confidence,
    isConfident: true,
    statusText: `Detected: ${top.label}`,
    candidates,
  };
}

/**
 * Autocorrect check against known dictionary
 */
export function getAutocorrectSuggestion(word) {
  if (!word || word.length < 3) return null;
  const upper = word.toUpperCase().trim();

  // If already exact match, no correction needed
  if (DICTIONARY.includes(upper)) return null;

  // Find candidate with edit distance of 1
  for (const dictWord of DICTIONARY) {
    if (Math.abs(dictWord.length - upper.length) > 1) continue;

    // Simple single-edit difference check (insert, delete, replace)
    let diff = 0;
    let i = 0;
    let j = 0;
    while (i < upper.length && j < dictWord.length) {
      if (upper[i] !== dictWord[j]) {
        diff++;
        if (diff > 1) break;
        if (upper.length > dictWord.length) i++;
        else if (dictWord.length > upper.length) j++;
        else {
          i++;
          j++;
        }
      } else {
        i++;
        j++;
      }
    }
    diff += (upper.length - i) + (dictWord.length - j);
    if (diff === 1) {
      return dictWord;
    }
  }
  return null;
}
