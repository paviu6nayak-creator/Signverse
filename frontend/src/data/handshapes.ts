// frontend/src/data/handshapes.ts
/**
 * ASL Handshape Specifications
 * Verified against American Sign Language University (ASLU / Lifeprint by Dr. Bill Vicars)
 *
 * Each handshape is defined parametrically:
 * - fingers: { index, middle, ring, pinky } each 'extended' | 'curled' | 'touching-thumb' | 'hooked' | 'bent' | 'crossed'
 * - thumb: 'out' | 'across' | 'tucked' | 'up' | 'touching-pinky' | 'touching-ring' | 'touching-middle' | 'touching-index'
 * - palm: 'forward' | 'down' | 'up' | 'toward-body' | 'left' | 'right'
 * - rotation?: number (in degrees)
 * - needsReview?: boolean (set if uncertain against ASLU standards)
 */

export type FingerState = 'extended' | 'curled' | 'touching-thumb' | 'hooked' | 'bent' | 'crossed';
export type ThumbState =
  | 'out'
  | 'across'
  | 'tucked'
  | 'up'
  | 'touching-pinky'
  | 'touching-ring'
  | 'touching-middle'
  | 'touching-index';
export type PalmOrientation = 'forward' | 'down' | 'up' | 'toward-body' | 'left' | 'right';

export interface HandshapeSpec {
  id: string;
  label: string;
  type: 'letter' | 'digit';
  description: string;
  aslNotes: string;
  needsReview?: boolean;
  fingers: {
    index: FingerState;
    middle: FingerState;
    ring: FingerState;
    pinky: FingerState;
  };
  thumb: ThumbState;
  palm: PalmOrientation;
  rotation?: number;
  spread?: number; // 0 to 1
}

export const HANDSHAPES: Record<string, HandshapeSpec> = {
  // ==========================================
  // ALPHABET: LETTERS A - Z
  // ==========================================
  A: {
    id: "A",
    label: "Letter A",
    type: "letter",
    description: "Closed fist with the thumb resting upright alongside the index finger.",
    aslNotes: "Lifeprint: Thumb points up and presses against the side of the curled index finger; do not cross thumb over knuckles (which is 'S').",
    fingers: { index: "curled", middle: "curled", ring: "curled", pinky: "curled" },
    thumb: "up",
    palm: "forward",
    rotation: 0,
  },
  B: {
    id: "B",
    label: "Letter B",
    type: "letter",
    description: "Four fingers extended straight up touching, with the thumb folded flat across the palm.",
    aslNotes: "Lifeprint: Fingers held upright together without gaps; thumb folded tightly across base of palm.",
    fingers: { index: "extended", middle: "extended", ring: "extended", pinky: "extended" },
    thumb: "across",
    palm: "forward",
    rotation: 0,
    spread: 0,
  },
  C: {
    id: "C",
    label: "Letter C",
    type: "letter",
    description: "Curved open hand with fingers and thumb forming the arc of the letter 'C'.",
    aslNotes: "Lifeprint: All fingers and thumb curved into an open semicircular cup resembling the letter C.",
    fingers: { index: "bent", middle: "bent", ring: "bent", pinky: "bent" },
    thumb: "out",
    palm: "left",
    rotation: 0,
  },
  D: {
    id: "D",
    label: "Letter D",
    type: "letter",
    description: "Index finger extended straight up; middle, ring, and pinky curled touching the thumb tip.",
    aslNotes: "Lifeprint: Only the index points upward; middle, ring, and pinky curl to meet the thumb pad in an enclosed circle.",
    fingers: { index: "extended", middle: "touching-thumb", ring: "touching-thumb", pinky: "touching-thumb" },
    thumb: "across",
    palm: "forward",
    rotation: 0,
  },
  E: {
    id: "E",
    label: "Letter E",
    type: "letter",
    description: "All four fingers curled tightly down, with the fingertips resting on the tucked thumb.",
    aslNotes: "Lifeprint: Fingertips curled with nails resting on the top edge of the tucked thumb; thumb pulled in across palm.",
    fingers: { index: "hooked", middle: "hooked", ring: "hooked", pinky: "hooked" },
    thumb: "tucked",
    palm: "forward",
    rotation: 0,
  },
  F: {
    id: "F",
    label: "Letter F",
    type: "letter",
    description: "Index finger and thumb touch in a circle; middle, ring, and pinky extended upright and spread.",
    aslNotes: "Lifeprint: Index and thumb tip meet forming an 'O' ring; other three fingers flare upward and spread apart.",
    fingers: { index: "touching-thumb", middle: "extended", ring: "extended", pinky: "extended" },
    thumb: "touching-index",
    palm: "forward",
    rotation: 0,
    spread: 0.6,
  },
  G: {
    id: "G",
    label: "Letter G",
    type: "letter",
    description: "Index finger and thumb extended horizontally parallel with a small gap; other fingers curled.",
    aslNotes: "Lifeprint: Hand turned horizontally; index points sideways and thumb runs parallel like measuring an inch.",
    fingers: { index: "extended", middle: "curled", ring: "curled", pinky: "curled" },
    thumb: "out",
    palm: "toward-body",
    rotation: 90,
  },
  H: {
    id: "H",
    label: "Letter H",
    type: "letter",
    description: "Index and middle fingers extended together pointing horizontally; other fingers curled.",
    aslNotes: "Lifeprint: Index and middle fingers extended together side-by-side pointing horizontally; thumb tucked.",
    fingers: { index: "extended", middle: "extended", ring: "curled", pinky: "curled" },
    thumb: "across",
    palm: "toward-body",
    rotation: 90,
    spread: 0,
  },
  I: {
    id: "I",
    label: "Letter I",
    type: "letter",
    description: "Only the pinky finger extended straight up; other fingers curled into palm with thumb over them.",
    aslNotes: "Lifeprint: Pinky extends upright; thumb pins the curled index, middle, and ring fingers.",
    fingers: { index: "curled", middle: "curled", ring: "curled", pinky: "extended" },
    thumb: "across",
    palm: "forward",
    rotation: 0,
  },
  J: {
    id: "J",
    label: "Letter J",
    type: "letter",
    description: "Pinky extended upright, tracing a downward curve and hook in the air.",
    aslNotes: "Lifeprint: Base handshape is 'I', executing a dynamic scooping 'J' motion down and curving inward.",
    fingers: { index: "curled", middle: "curled", ring: "curled", pinky: "extended" },
    thumb: "across",
    palm: "forward",
    rotation: 15,
  },
  K: {
    id: "K",
    label: "Letter K",
    type: "letter",
    description: "Index pointing up, middle finger angled slightly forward, thumb resting on the middle knuckle.",
    aslNotes: "Lifeprint: Thumb tucks in between index and middle, resting its pad against the side of the middle finger's first knuckle.",
    fingers: { index: "extended", middle: "bent", ring: "curled", pinky: "curled" },
    thumb: "up",
    palm: "forward",
    rotation: 0,
  },
  L: {
    id: "L",
    label: "Letter L",
    type: "letter",
    description: "Index finger pointing up and thumb extended out sideways at 90 degrees forming an 'L'.",
    aslNotes: "Lifeprint: Classic right angle formed by index and thumb; middle, ring, and pinky curled into palm.",
    fingers: { index: "extended", middle: "curled", ring: "curled", pinky: "curled" },
    thumb: "out",
    palm: "forward",
    rotation: 0,
  },
  M: {
    id: "M",
    label: "Letter M",
    type: "letter",
    description: "Thumb tucked under the first three fingers (index, middle, ring) with its tip peeking out.",
    aslNotes: "Lifeprint: Three fingers draped over the tucked thumb; three knuckles visible across the top.",
    fingers: { index: "curled", middle: "curled", ring: "curled", pinky: "curled" },
    thumb: "tucked",
    palm: "forward",
    rotation: 0,
  },
  N: {
    id: "N",
    label: "Letter N",
    type: "letter",
    description: "Thumb tucked under the first two fingers (index and middle) with its tip peeking between middle and ring.",
    aslNotes: "Lifeprint: Two fingers draped over the tucked thumb; two knuckles visible across the top.",
    fingers: { index: "curled", middle: "curled", ring: "curled", pinky: "curled" },
    thumb: "tucked",
    palm: "forward",
    rotation: 0,
  },
  O: {
    id: "O",
    label: "Letter O",
    type: "letter",
    description: "All four fingers curved down with fingertips touching the thumb tip in an 'O' circle.",
    aslNotes: "Lifeprint: All fingertips curve to touch thumb tip, creating an open cylindrical 'O' silhouette.",
    fingers: { index: "touching-thumb", middle: "touching-thumb", ring: "touching-thumb", pinky: "touching-thumb" },
    thumb: "across",
    palm: "forward",
    rotation: 0,
  },
  P: {
    id: "P",
    label: "Letter P",
    type: "letter",
    description: "Like 'K' handshape, but oriented downwards with index pointing forward/down and middle down.",
    aslNotes: "Lifeprint: Same finger position as 'K', but wrist pivots downward so index points forward/down.",
    fingers: { index: "extended", middle: "bent", ring: "curled", pinky: "curled" },
    thumb: "up",
    palm: "down",
    rotation: 90,
  },
  Q: {
    id: "Q",
    label: "Letter Q",
    type: "letter",
    description: "Like 'G' handshape, but oriented downwards with index and thumb pointing toward the floor.",
    aslNotes: "Lifeprint: Same as 'G', but wrist is dropped so index and thumb point downward.",
    fingers: { index: "extended", middle: "curled", ring: "curled", pinky: "curled" },
    thumb: "out",
    palm: "down",
    rotation: 90,
  },
  R: {
    id: "R",
    label: "Letter R",
    type: "letter",
    description: "Index and middle fingers extended upright and crossed over each other.",
    aslNotes: "Lifeprint: Middle finger crosses in front of or behind the index finger (fingers crossed for luck).",
    fingers: { index: "crossed", middle: "crossed", ring: "curled", pinky: "curled" },
    thumb: "across",
    palm: "forward",
    rotation: 0,
  },
  S: {
    id: "S",
    label: "Letter S",
    type: "letter",
    description: "Fist with the thumb crossed over the front of the curled fingers.",
    aslNotes: "Lifeprint: Tight fist with thumb overlapping across the front of the curled fingers (unlike 'A').",
    fingers: { index: "curled", middle: "curled", ring: "curled", pinky: "curled" },
    thumb: "across",
    palm: "forward",
    rotation: 0,
  },
  T: {
    id: "T",
    label: "Letter T",
    type: "letter",
    description: "Thumb tucked between the index and middle fingers, poking up between their knuckles.",
    aslNotes: "Lifeprint: Thumb inserts under index finger only, protruding between index and middle knuckles.",
    fingers: { index: "curled", middle: "curled", ring: "curled", pinky: "curled" },
    thumb: "tucked",
    palm: "forward",
    rotation: 0,
  },
  U: {
    id: "U",
    label: "Letter U",
    type: "letter",
    description: "Index and middle fingers extended straight up together touching; ring and pinky curled.",
    aslNotes: "Lifeprint: Index and middle extended upward and held tightly together with no gap.",
    fingers: { index: "extended", middle: "extended", ring: "curled", pinky: "curled" },
    thumb: "across",
    palm: "forward",
    rotation: 0,
    spread: 0,
  },
  V: {
    id: "V",
    label: "Letter V",
    type: "letter",
    description: "Index and middle fingers extended straight up spread apart in a 'V' shape.",
    aslNotes: "Lifeprint: Index and middle extended in peace sign; thumb pins ring and pinky fingers.",
    fingers: { index: "extended", middle: "extended", ring: "curled", pinky: "curled" },
    thumb: "across",
    palm: "forward",
    rotation: 0,
    spread: 0.5,
  },
  W: {
    id: "W",
    label: "Letter W",
    type: "letter",
    description: "Index, middle, and ring fingers extended upright and spread apart in a 'W'.",
    aslNotes: "Lifeprint: Index, middle, and ring extended spread; thumb holds pinky tip down.",
    fingers: { index: "extended", middle: "extended", ring: "extended", pinky: "curled" },
    thumb: "touching-pinky",
    palm: "forward",
    rotation: 0,
    spread: 0.5,
  },
  X: {
    id: "X",
    label: "Letter X",
    type: "letter",
    description: "Index finger bent into a hook/crook; other fingers curled into palm.",
    aslNotes: "Lifeprint: Only the index finger is raised, bent at both knuckles into a hook like a pirate's hook.",
    fingers: { index: "hooked", middle: "curled", ring: "curled", pinky: "curled" },
    thumb: "across",
    palm: "forward",
    rotation: 0,
  },
  Y: {
    id: "Y",
    label: "Letter Y",
    type: "letter",
    description: "Thumb and pinky extended wide; index, middle, and ring fingers curled into palm.",
    aslNotes: "Lifeprint: 'Hang loose' / telephone handshape; thumb and pinky flared wide.",
    fingers: { index: "curled", middle: "curled", ring: "curled", pinky: "extended" },
    thumb: "out",
    palm: "forward",
    rotation: 0,
  },
  Z: {
    id: "Z",
    label: "Letter Z",
    type: "letter",
    description: "Index finger extended, tracing a 'Z' shape in the air.",
    aslNotes: "Lifeprint: Static base handshape is an index point pointing forward/up, tracing Z in the signing space.",
    fingers: { index: "extended", middle: "curled", ring: "curled", pinky: "curled" },
    thumb: "across",
    palm: "forward",
    rotation: 10,
  },

  // ==========================================
  // DIGITS: NUMBERS 0 - 10
  // ==========================================
  "0": {
    id: "0",
    label: "Number 0",
    type: "digit",
    description: "Fingertips touching thumb forming a zero / oval 'O' shape.",
    aslNotes: "Lifeprint: Same handshape as letter 'O', representing zero; palm faces forward toward the viewer.",
    fingers: { index: "touching-thumb", middle: "touching-thumb", ring: "touching-thumb", pinky: "touching-thumb" },
    thumb: "across",
    palm: "forward",
    rotation: 0,
  },
  "1": {
    id: "1",
    label: "Number 1",
    type: "digit",
    description: "Index finger extended straight up; other fingers curled with thumb across them.",
    aslNotes: "Lifeprint: Palm faces forward toward the viewer for identifying standalone numbers.",
    fingers: { index: "extended", middle: "curled", ring: "curled", pinky: "curled" },
    thumb: "across",
    palm: "forward",
    rotation: 0,
  },
  "2": {
    id: "2",
    label: "Number 2",
    type: "digit",
    description: "Index and middle fingers extended straight up spread in a V.",
    aslNotes: "Lifeprint: Index and middle extended upward in V shape; palm faces forward toward the viewer.",
    fingers: { index: "extended", middle: "extended", ring: "curled", pinky: "curled" },
    thumb: "across",
    palm: "forward",
    rotation: 0,
    spread: 0.5,
  },
  "3": {
    id: "3",
    label: "Number 3",
    type: "digit",
    description: "Thumb, index, and middle fingers extended; ring and pinky curled into palm.",
    aslNotes: "Lifeprint: CRITICAL ASL RULE: 3 uses thumb + index + middle (NOT index + middle + ring). Palm faces forward toward the viewer.",
    fingers: { index: "extended", middle: "extended", ring: "curled", pinky: "curled" },
    thumb: "out",
    palm: "forward",
    rotation: 0,
    spread: 0.5,
  },
  "4": {
    id: "4",
    label: "Number 4",
    type: "digit",
    description: "Four fingers extended straight up; thumb folded across palm.",
    aslNotes: "Lifeprint: All four fingers extended and slightly spread; thumb folded in across palm. Palm faces forward toward the viewer.",
    fingers: { index: "extended", middle: "extended", ring: "extended", pinky: "extended" },
    thumb: "across",
    palm: "forward",
    rotation: 0,
    spread: 0.35,
  },
  "5": {
    id: "5",
    label: "Number 5",
    type: "digit",
    description: "All five fingers extended straight up and spread wide.",
    aslNotes: "Lifeprint: Open five palm with thumb and all fingers fully spread. Palm faces forward toward the viewer.",
    fingers: { index: "extended", middle: "extended", ring: "extended", pinky: "extended" },
    thumb: "out",
    palm: "forward",
    rotation: 0,
    spread: 0.65,
  },
  "6": {
    id: "6",
    label: "Number 6",
    type: "digit",
    description: "Thumb touches the pinky finger tip; index, middle, and ring fingers extended upright.",
    aslNotes: "Lifeprint: Standard ASL rule: 6 is formed by thumb touching pinky tip (3 fingers up: index, middle, ring). Palm faces forward.",
    fingers: { index: "extended", middle: "extended", ring: "extended", pinky: "touching-thumb" },
    thumb: "touching-pinky",
    palm: "forward",
    rotation: 0,
    spread: 0.45,
  },
  "7": {
    id: "7",
    label: "Number 7",
    type: "digit",
    description: "Thumb touches the ring finger tip; index, middle, and pinky fingers extended upright.",
    aslNotes: "Lifeprint: Standard ASL rule: 7 is formed by thumb touching ring finger tip. Palm faces forward.",
    fingers: { index: "extended", middle: "extended", ring: "touching-thumb", pinky: "extended" },
    thumb: "touching-ring",
    palm: "forward",
    rotation: 0,
    spread: 0.45,
  },
  "8": {
    id: "8",
    label: "Number 8",
    type: "digit",
    description: "Thumb touches the middle finger tip; index, ring, and pinky fingers extended upright.",
    aslNotes: "Lifeprint: Standard ASL rule: 8 is formed by thumb touching middle finger tip. Palm faces forward.",
    fingers: { index: "extended", middle: "touching-thumb", ring: "extended", pinky: "extended" },
    thumb: "touching-middle",
    palm: "forward",
    rotation: 0,
    spread: 0.45,
  },
  "9": {
    id: "9",
    label: "Number 9",
    type: "digit",
    description: "Thumb touches the index finger tip; middle, ring, and pinky fingers extended upright.",
    aslNotes: "Lifeprint: Standard ASL rule: 9 is formed by thumb touching index finger tip (circle). Similar to 'F', palm faces forward.",
    fingers: { index: "touching-thumb", middle: "extended", ring: "extended", pinky: "extended" },
    thumb: "touching-index",
    palm: "forward",
    rotation: 0,
    spread: 0.45,
  },
  "10": {
    id: "10",
    label: "Number 10",
    type: "digit",
    description: "Fist with thumb extended upward (thumbs-up gesture) with a slight rotational wrist shake.",
    aslNotes: "Lifeprint: 'A' handshape / thumbs-up, shaking side to side from the wrist twice.",
    fingers: { index: "curled", middle: "curled", ring: "curled", pinky: "curled" },
    thumb: "up",
    palm: "left",
    rotation: 0,
  },
};

/**
 * Helper to fetch a handshape spec by ID or label
 */
export function getHandshape(key: string): HandshapeSpec | null {
  if (!key) return null;
  const clean = key.trim().toUpperCase();
  if (HANDSHAPES[clean]) return HANDSHAPES[clean];

  // Strip prefixes like "number-", "num-", "letter-", "alpha-"
  const stripped = clean.replace(/^(?:NUMBER|NUM|LETTER|ALPHA)[-_]/, "");
  if (HANDSHAPES[stripped]) return HANDSHAPES[stripped];

  return null;
}

/**
 * Return all handshapes as an array
 */
export function getAllHandshapes(): HandshapeSpec[] {
  return Object.values(HANDSHAPES);
}
