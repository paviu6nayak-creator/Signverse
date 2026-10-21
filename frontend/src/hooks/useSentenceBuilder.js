// frontend/src/hooks/useSentenceBuilder.js
import { useCallback, useRef, useState } from "react";
import { getAutocorrectSuggestion } from "../utils/signClassifier.js";

const STABILITY_WINDOW = 12; // 10-15 frames sliding window
const STABILITY_AGREEMENT_RATIO = 0.70; // 70% majority vote required
const MIN_MS_BETWEEN_COMMITS = 1200; // 1.2s cooldown to prevent repeat-fire on held sign

/**
 * Builds clean sentence text from accepted sign tokens.
 * Single letters/digits are concatenated into words, while multi-letter signs
 * or space tokens create natural word boundaries.
 */
export function tokensToSentence(tokensList) {
  let result = "";
  let inWord = false;

  tokensList.forEach((token) => {
    if (token === " ") {
      if (result.length > 0 && !result.endsWith(" ")) {
        result += " ";
      }
      inWord = false;
      return;
    }

    const isSingleChar = token.length === 1 && /[A-Za-z0-9]/.test(token);

    if (isSingleChar) {
      if (!inWord && result.length > 0 && !result.endsWith(" ")) {
        result += " ";
      }
      result += token;
      inWord = true;
    } else {
      // Full word sign (e.g., "HELLO", "THANK YOU")
      if (result.length > 0 && !result.endsWith(" ")) {
        result += " ";
      }
      result += token;
      result += " ";
      inWord = false;
    }
  });

  return result.replace(/\s+/g, " ").trim();
}

/**
 * Advanced SentenceBuilder hook with frame stabilization, majority voting,
 * duplicate suppression, pause/gap enforcement, space control, and autocorrect.
 */
export function useSentenceBuilder() {
  const [tokens, setTokens] = useState([]);
  const [sentence, setSentence] = useState("");
  const [suggestion, setSuggestion] = useState(null);

  const slidingWindowRef = useRef([]); // Stores recent valid predictions
  const lastCommitTimeRef = useRef(0);
  const lastCommittedTokenRef = useRef(null);
  const hadHandAbsenceRef = useRef(false); // Tracks if hand was lowered/neutral between same signs

  /**
   * Push a candidate detection frame into the stabilizer.
   * @param {string|null} label Detected sign label or null
   * @param {number} confidence Model confidence (0.0 - 1.0)
   * @param {number} threshold Minimum required confidence
   * @returns {string|null} Committed token if accepted on this frame, else null
   */
  const push = useCallback((label, confidence, threshold = 0.70) => {
    // If no hand or confidence too low, record that a gap/absence occurred
    if (!label || confidence < threshold) {
      hadHandAbsenceRef.current = true;
      return null;
    }

    // Add to sliding window
    slidingWindowRef.current = [...slidingWindowRef.current, label].slice(-STABILITY_WINDOW);

    // Need full window to evaluate majority vote
    if (slidingWindowRef.current.length < STABILITY_WINDOW) {
      return null;
    }

    // Compute majority vote counts
    const counts = {};
    slidingWindowRef.current.forEach((item) => {
      counts[item] = (counts[item] || 0) + 1;
    });

    const [topLabel, topCount] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    const agreementRatio = topCount / STABILITY_WINDOW;
    const isStable = agreementRatio >= STABILITY_AGREEMENT_RATIO;

    const now = Date.now();
    const cooldownElapsed = now - lastCommitTimeRef.current >= MIN_MS_BETWEEN_COMMITS;
    const isSameAsLastCommitted = topLabel === lastCommittedTokenRef.current;

    // Rule: Same sign requires either a cooldown + hand lowered gap before repeating
    const canRepeat = !isSameAsLastCommitted || (hadHandAbsenceRef.current && cooldownElapsed);

    if (isStable && cooldownElapsed && canRepeat) {
      lastCommitTimeRef.current = now;
      lastCommittedTokenRef.current = topLabel;
      hadHandAbsenceRef.current = false;
      slidingWindowRef.current = []; // Clear window after commit

      setTokens((prev) => {
        const next = [...prev, topLabel];
        const newSentence = tokensToSentence(next);
        setSentence(newSentence);

        // Check if the last word has an autocorrect suggestion
        const words = newSentence.split(" ").filter(Boolean);
        const lastWord = words[words.length - 1];
        const suggested = getAutocorrectSuggestion(lastWord);
        setSuggestion(suggested);

        return next;
      });

      return topLabel;
    }

    return null;
  }, []);

  /**
   * Manually insert a word break / space
   */
  const addSpace = useCallback(() => {
    setTokens((prev) => {
      const next = [...prev, " "];
      const newSentence = tokensToSentence(next);
      setSentence(newSentence);
      setSuggestion(null);
      return next;
    });
    lastCommittedTokenRef.current = null;
    hadHandAbsenceRef.current = true;
  }, []);

  /**
   * Remove the last committed token (Undo)
   */
  const backspace = useCallback(() => {
    setTokens((prev) => {
      const next = prev.slice(0, -1);
      const newSentence = tokensToSentence(next);
      setSentence(newSentence);

      const words = newSentence.split(" ").filter(Boolean);
      const lastWord = words[words.length - 1];
      setSuggestion(getAutocorrectSuggestion(lastWord));

      return next;
    });
    lastCommittedTokenRef.current = null;
    hadHandAbsenceRef.current = true;
  }, []);

  /**
   * Clear the entire sentence and reset buffers
   */
  const clear = useCallback(() => {
    setTokens([]);
    setSentence("");
    setSuggestion(null);
    slidingWindowRef.current = [];
    lastCommitTimeRef.current = 0;
    lastCommittedTokenRef.current = null;
    hadHandAbsenceRef.current = true;
  }, []);

  /**
   * Apply autocorrect suggestion to the current word
   */
  const applySuggestion = useCallback(() => {
    if (!suggestion) return;

    setTokens((prev) => {
      // Find where current word started by looking backward until a space or word-level sign
      let cutIndex = prev.length - 1;
      while (cutIndex >= 0 && prev[cutIndex] !== " " && prev[cutIndex].length === 1) {
        cutIndex--;
      }
      const kept = prev.slice(0, cutIndex + 1);
      const next = [...kept, suggestion, " "];
      const newSentence = tokensToSentence(next);
      setSentence(newSentence);
      setSuggestion(null);
      return next;
    });
  }, [suggestion]);

  return {
    sentence,
    tokens,
    suggestion,
    push,
    addSpace,
    backspace,
    clear,
    applySuggestion,
    slidingWindow: slidingWindowRef.current,
  };
}
