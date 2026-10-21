// frontend/scripts/testTranslationLogic.js
// Unit tests for Camera Error Mapping, Sentence Building, Window Smoothing, and Autocorrect

import { mapCameraError } from "../src/hooks/useCamera.js";
import { tokensToSentence } from "../src/hooks/useSentenceBuilder.js";
import { getAutocorrectSuggestion, classifyHandGesture, SUPPORTED_VOCABULARY } from "../src/utils/signClassifier.js";

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✅ ${message}`);
  } else {
    failed++;
    console.error(`  ❌ FAIL: ${message}`);
  }
}

console.log("🧪 Running SignVerse Translation & Camera Logic Unit Tests...\n");

// ==========================================
// TEST SUITE 1: Camera Error Mapping
// ==========================================
console.log("Suite 1: Camera Error Mapping (mapCameraError)");
{
  const notAllowed = mapCameraError({ name: "NotAllowedError" });
  assert(notAllowed.status === "denied", "NotAllowedError maps to status 'denied'");
  assert(notAllowed.fix.includes("lock/camera icon") && notAllowed.fix.includes("Windows Settings"), "NotAllowedError explains lock icon and Windows privacy settings");

  const permissionDenied = mapCameraError({ name: "PermissionDeniedError" });
  assert(permissionDenied.status === "denied", "PermissionDeniedError maps to status 'denied'");

  const notFound = mapCameraError({ name: "NotFoundError" });
  assert(notFound.status === "error", "NotFoundError maps to status 'error'");
  assert(notFound.title === "No camera found", "NotFoundError gives 'No camera found' title");

  const notReadable = mapCameraError({ name: "NotReadableError" });
  assert(notReadable.status === "error", "NotReadableError maps to status 'error'");
  assert(notReadable.fix.includes("Zoom") || notReadable.fix.includes("other applications"), "NotReadableError instructs closing conflicting video apps");

  const security = mapCameraError({ name: "SecurityError" });
  assert(security.fix.includes("HTTPS") || security.fix.includes("localhost"), "SecurityError explains HTTPS/localhost requirements");

  const overconstrained = mapCameraError({ name: "OverconstrainedError" });
  assert(overconstrained.title.includes("resolution") || overconstrained.fix.includes("Retry"), "OverconstrainedError handled");

  const unknown = mapCameraError({ name: "CustomHardwareGlitch", message: "USB interrupted" });
  assert(unknown.status === "error" && unknown.message === "USB interrupted", "Unknown error fallback preserves message");
}

// ==========================================
// TEST SUITE 2: Sentence Building & Spelling
// ==========================================
console.log("\nSuite 2: Sentence Building (tokensToSentence)");
{
  const singleWord = tokensToSentence(["H", "E", "L", "L", "O"]);
  assert(singleWord === "HELLO", `Spelled letters combine into one word: expected 'HELLO', got '${singleWord}'`);

  const twoWords = tokensToSentence(["H", "I", " ", "A", "L", "L"]);
  assert(twoWords === "HI ALL", `Space token creates word break: expected 'HI ALL', got '${twoWords}'`);

  const wholeSign = tokensToSentence(["HELLO", "THANK YOU"]);
  assert(wholeSign === "HELLO THANK YOU", `Word-level signs stay spaced: expected 'HELLO THANK YOU', got '${wholeSign}'`);

  const mixed = tokensToSentence(["HELLO", "M", "Y", "NAME", "I", "S"]);
  assert(mixed === "HELLO MY NAME IS", `Mixed letters and word tokens combine properly: got '${mixed}'`);
}

// ==========================================
// TEST SUITE 3: Autocorrect Engine
// ==========================================
console.log("\nSuite 3: Autocorrect Engine (getAutocorrectSuggestion)");
{
  const helo = getAutocorrectSuggestion("HELO");
  assert(helo === "HELLO", `Misspelled 'HELO' suggests 'HELLO': got '${helo}'`);

  const pleas = getAutocorrectSuggestion("PLEAS");
  assert(pleas === "PLEASE", `Misspelled 'PLEAS' suggests 'PLEASE': got '${pleas}'`);

  const exact = getAutocorrectSuggestion("HELLO");
  assert(exact === null, `Exact dictionary word 'HELLO' produces null suggestion: got '${exact}'`);

  const tooShort = getAutocorrectSuggestion("NO");
  assert(tooShort === null, `Short words (<= 2 chars) produce null suggestion: got '${tooShort}'`);
}

// ==========================================
// TEST SUITE 4: Sign Classifier & Vocabulary
// ==========================================
console.log("\nSuite 4: Verified Vocabulary & Rejection of Unknown Gestures");
{
  assert(SUPPORTED_VOCABULARY.length >= 20, `Verified vocabulary count >= 20 (has ${SUPPORTED_VOCABULARY.length})`);
  assert(SUPPORTED_VOCABULARY.includes("HELLO") && SUPPORTED_VOCABULARY.includes("THANK YOU"), "Vocabulary includes core greetings");
  assert(SUPPORTED_VOCABULARY.includes("A") && SUPPORTED_VOCABULARY.includes("B"), "Vocabulary includes alphabet");

  // Empty landmarks returns 'No hand detected'
  const emptyRes = classifyHandGesture(null);
  assert(emptyRes.isConfident === false && emptyRes.label === null, "Null landmarks safely rejected without throwing");

  // Degraded or partial landmark array returns 'No hand detected'
  const partialRes = classifyHandGesture([{ x: 0, y: 0 }]);
  assert(partialRes.isConfident === false && partialRes.label === null, "Partial landmarks (< 21) safely rejected");
}

// ==========================================
// SUMMARY
// ==========================================
console.log("\n----------------------------------------");
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.error("❌ Translation logic unit tests FAILED!");
  process.exit(1);
} else {
  console.log("🎉 ALL TRANSLATION LOGIC TESTS PASSED SUCCESSFULLY!");
  process.exit(0);
}
