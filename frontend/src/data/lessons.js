/**
 * SignVerse Unified Lessons Data Source (Single Source of Truth)
 * 
 * Schema:
 * @typedef {Object} AnimationSpec
 * @property {string} handshape - e.g. "flat_palm", "fist_a", "index_point", "v_shape", "3_shape", "open_5", "c_shape", "ily", "hook_index", "flat_o", "thumbs_up", "pinched_g"
 * @property {{x: number, y: number}} startPosition - Coordinates in 200x160 SVG canvas
 * @property {{x: number, y: number}} endPosition - Coordinates in 200x160 SVG canvas
 * @property {'line' | 'arc' | 'circle' | 'tap' | 'shake' | 'static'} path - Motion trajectory
 * @property {string} orientation - e.g. "palm_forward", "palm_inward", "palm_down", "facing_side"
 * @property {string} location - e.g. "chin", "forehead", "chest", "neutral_space", "lips", "wrist"
 * @property {number | 'infinite'} [repeat]
 * @property {number} [durationMs]
 * @property {'static' | 'motion'} [motionTag]
 *
 * @typedef {Object} Lesson
 * @property {string} id - Unique identifier
 * @property {string} label - Human-readable display title (e.g. "Number 0", "Hello", "See You Later")
 * @property {'numbers' | 'greetings' | 'alphabet' | 'common_words' | 'daily_conversation'} category
 * @property {'beginner' | 'intermediate' | 'advanced'} level
 * @property {number} order - Numerical sorting order
 * @property {number} xp - XP reward awarded on completion
 * @property {{ type: 'svg' | 'image' | 'video', url: string, alt: string }} media
 * @property {string[]} steps - 2 to 4 complete instructional steps
 * @property {string} tip - Cultural or execution advice
 * @property {'static' | 'motion'} motionTag - Quick classifier tag
 * @property {AnimationSpec} animationSpec - Data-driven gesture animation spec
 * @property {Array<{ id: string, label: string, signKey: string, hint?: string }>} [tokens]
 * @property {string} [theme]
 * @property {boolean} [needsReview]
 */

export const ALL_LESSONS = [
  {
    "id": "alpha-a",
    "label": "Letter A",
    "category": "alphabet",
    "level": "beginner",
    "order": 1,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/A.svg",
      "alt": "ASL manual letter A"
    },
    "motionTag": "static",
    "animationSpec": {
      "handshape": "fist_a",
      "startPosition": {
        "x": 80,
        "y": 55
      },
      "endPosition": {
        "x": 80,
        "y": 55
      },
      "path": "static",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": 1,
      "durationMs": 1600,
      "motionTag": "static"
    },
    "steps": [
      "Form the handshape for Letter A: Closed fist with thumb resting alongside index finger.",
      "Hold palm steady facing forward toward your webcam.",
      "Maintain clear lighting and finger separation."
    ],
    "tip": "Keep hand relaxed and steady for Letter A."
  },
  {
    "id": "alpha-b",
    "label": "Letter B",
    "category": "alphabet",
    "level": "beginner",
    "order": 2,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/B.svg",
      "alt": "ASL manual letter B"
    },
    "motionTag": "static",
    "animationSpec": {
      "handshape": "flat_palm",
      "startPosition": {
        "x": 80,
        "y": 55
      },
      "endPosition": {
        "x": 80,
        "y": 55
      },
      "path": "static",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": 1,
      "durationMs": 1600,
      "motionTag": "static"
    },
    "steps": [
      "Form the handshape for Letter B: Four fingers held upright together, thumb folded over palm.",
      "Hold palm steady facing forward toward your webcam.",
      "Maintain clear lighting and finger separation."
    ],
    "tip": "Keep hand relaxed and steady for Letter B."
  },
  {
    "id": "alpha-c",
    "label": "Letter C",
    "category": "alphabet",
    "level": "beginner",
    "order": 3,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/C.svg",
      "alt": "ASL manual letter C"
    },
    "motionTag": "static",
    "animationSpec": {
      "handshape": "c_shape",
      "startPosition": {
        "x": 80,
        "y": 55
      },
      "endPosition": {
        "x": 80,
        "y": 55
      },
      "path": "static",
      "orientation": "facing_side",
      "location": "neutral_space",
      "repeat": 1,
      "durationMs": 1600,
      "motionTag": "static"
    },
    "steps": [
      "Form the handshape for Letter C: Curved fingers and thumb forming a 'C' profile.",
      "Hold palm steady facing forward toward your webcam.",
      "Maintain clear lighting and finger separation."
    ],
    "tip": "Keep hand relaxed and steady for Letter C."
  },
  {
    "id": "alpha-d",
    "label": "Letter D",
    "category": "alphabet",
    "level": "beginner",
    "order": 4,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/D.svg",
      "alt": "ASL manual letter D"
    },
    "motionTag": "static",
    "animationSpec": {
      "handshape": "index_point",
      "startPosition": {
        "x": 80,
        "y": 55
      },
      "endPosition": {
        "x": 80,
        "y": 55
      },
      "path": "static",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": 1,
      "durationMs": 1600,
      "motionTag": "static"
    },
    "steps": [
      "Form the handshape for Letter D: Index finger points upright, thumb touches curled middle/ring/pinky.",
      "Hold palm steady facing forward toward your webcam.",
      "Maintain clear lighting and finger separation."
    ],
    "tip": "Keep hand relaxed and steady for Letter D."
  },
  {
    "id": "alpha-e",
    "label": "Letter E",
    "category": "alphabet",
    "level": "beginner",
    "order": 5,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/E.svg",
      "alt": "ASL manual letter E"
    },
    "motionTag": "static",
    "animationSpec": {
      "handshape": "flat_o",
      "startPosition": {
        "x": 80,
        "y": 55
      },
      "endPosition": {
        "x": 80,
        "y": 55
      },
      "path": "static",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": 1,
      "durationMs": 1600,
      "motionTag": "static"
    },
    "steps": [
      "Form the handshape for Letter E: Fingertips curled tightly resting on top of thumb.",
      "Hold palm steady facing forward toward your webcam.",
      "Maintain clear lighting and finger separation."
    ],
    "tip": "Keep hand relaxed and steady for Letter E."
  },
  {
    "id": "alpha-f",
    "label": "Letter F",
    "category": "alphabet",
    "level": "beginner",
    "order": 6,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/F.svg",
      "alt": "ASL manual letter F"
    },
    "motionTag": "static",
    "animationSpec": {
      "handshape": "index_point",
      "startPosition": {
        "x": 80,
        "y": 55
      },
      "endPosition": {
        "x": 80,
        "y": 55
      },
      "path": "static",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": 1,
      "durationMs": 1600,
      "motionTag": "static"
    },
    "steps": [
      "Form the handshape for Letter F: Index finger and thumb form a circle, other three fingers upright.",
      "Hold palm steady facing forward toward your webcam.",
      "Maintain clear lighting and finger separation."
    ],
    "tip": "Keep hand relaxed and steady for Letter F."
  },
  {
    "id": "alpha-g",
    "label": "Letter G",
    "category": "alphabet",
    "level": "beginner",
    "order": 7,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/G.svg",
      "alt": "ASL manual letter G"
    },
    "motionTag": "static",
    "animationSpec": {
      "handshape": "pinched_g",
      "startPosition": {
        "x": 80,
        "y": 55
      },
      "endPosition": {
        "x": 80,
        "y": 55
      },
      "path": "static",
      "orientation": "facing_side",
      "location": "neutral_space",
      "repeat": 1,
      "durationMs": 1600,
      "motionTag": "static"
    },
    "steps": [
      "Form the handshape for Letter G: Index finger and thumb extend parallel horizontally.",
      "Hold palm steady facing forward toward your webcam.",
      "Maintain clear lighting and finger separation."
    ],
    "tip": "Keep hand relaxed and steady for Letter G."
  },
  {
    "id": "alpha-h",
    "label": "Letter H",
    "category": "alphabet",
    "level": "beginner",
    "order": 8,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/H.svg",
      "alt": "ASL manual letter H"
    },
    "motionTag": "static",
    "animationSpec": {
      "handshape": "flat_palm",
      "startPosition": {
        "x": 80,
        "y": 55
      },
      "endPosition": {
        "x": 80,
        "y": 55
      },
      "path": "static",
      "orientation": "facing_side",
      "location": "neutral_space",
      "repeat": 1,
      "durationMs": 1600,
      "motionTag": "static"
    },
    "steps": [
      "Form the handshape for Letter H: Index and middle fingers extend horizontally together.",
      "Hold palm steady facing forward toward your webcam.",
      "Maintain clear lighting and finger separation."
    ],
    "tip": "Keep hand relaxed and steady for Letter H."
  },
  {
    "id": "alpha-i",
    "label": "Letter I",
    "category": "alphabet",
    "level": "beginner",
    "order": 9,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/I.svg",
      "alt": "ASL manual letter I"
    },
    "motionTag": "static",
    "animationSpec": {
      "handshape": "index_point",
      "startPosition": {
        "x": 80,
        "y": 55
      },
      "endPosition": {
        "x": 80,
        "y": 55
      },
      "path": "static",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": 1,
      "durationMs": 1600,
      "motionTag": "static"
    },
    "steps": [
      "Form the handshape for Letter I: Pinky finger stands upright, other fingers curled into fist.",
      "Hold palm steady facing forward toward your webcam.",
      "Maintain clear lighting and finger separation."
    ],
    "tip": "Keep hand relaxed and steady for Letter I."
  },
  {
    "id": "alpha-j",
    "label": "Letter J",
    "category": "alphabet",
    "level": "beginner",
    "order": 10,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/J.svg",
      "alt": "ASL manual letter J"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "index_point",
      "startPosition": {
        "x": 80,
        "y": 55
      },
      "endPosition": {
        "x": 120,
        "y": 75
      },
      "path": "arc",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1600,
      "motionTag": "motion"
    },
    "steps": [
      "Form the handshape for Letter J: Pinky finger traces a 'J' curve in the air.",
      "Hold palm steady facing forward toward your webcam.",
      "Maintain clear lighting and finger separation."
    ],
    "tip": "Keep hand relaxed and steady for Letter J."
  },
  {
    "id": "alpha-k",
    "label": "Letter K",
    "category": "alphabet",
    "level": "beginner",
    "order": 11,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/K.svg",
      "alt": "ASL manual letter K"
    },
    "motionTag": "static",
    "animationSpec": {
      "handshape": "v_shape",
      "startPosition": {
        "x": 80,
        "y": 55
      },
      "endPosition": {
        "x": 80,
        "y": 55
      },
      "path": "static",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": 1,
      "durationMs": 1600,
      "motionTag": "static"
    },
    "steps": [
      "Form the handshape for Letter K: Index upright, middle pointed slightly forward, thumb between them.",
      "Hold palm steady facing forward toward your webcam.",
      "Maintain clear lighting and finger separation."
    ],
    "tip": "Keep hand relaxed and steady for Letter K."
  },
  {
    "id": "alpha-l",
    "label": "Letter L",
    "category": "alphabet",
    "level": "beginner",
    "order": 12,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/L.svg",
      "alt": "ASL manual letter L"
    },
    "motionTag": "static",
    "animationSpec": {
      "handshape": "v_shape",
      "startPosition": {
        "x": 80,
        "y": 55
      },
      "endPosition": {
        "x": 80,
        "y": 55
      },
      "path": "static",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": 1,
      "durationMs": 1600,
      "motionTag": "static"
    },
    "steps": [
      "Form the handshape for Letter L: Index and thumb form an upright right-angle 'L' shape.",
      "Hold palm steady facing forward toward your webcam.",
      "Maintain clear lighting and finger separation."
    ],
    "tip": "Keep hand relaxed and steady for Letter L."
  },
  {
    "id": "alpha-m",
    "label": "Letter M",
    "category": "alphabet",
    "level": "beginner",
    "order": 13,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/M.svg",
      "alt": "ASL manual letter M"
    },
    "motionTag": "static",
    "animationSpec": {
      "handshape": "fist_a",
      "startPosition": {
        "x": 80,
        "y": 55
      },
      "endPosition": {
        "x": 80,
        "y": 55
      },
      "path": "static",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": 1,
      "durationMs": 1600,
      "motionTag": "static"
    },
    "steps": [
      "Form the handshape for Letter M: Thumb tucked under first three fingers across knuckles.",
      "Hold palm steady facing forward toward your webcam.",
      "Maintain clear lighting and finger separation."
    ],
    "tip": "Keep hand relaxed and steady for Letter M."
  },
  {
    "id": "alpha-n",
    "label": "Letter N",
    "category": "alphabet",
    "level": "beginner",
    "order": 14,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/N.svg",
      "alt": "ASL manual letter N"
    },
    "motionTag": "static",
    "animationSpec": {
      "handshape": "fist_a",
      "startPosition": {
        "x": 80,
        "y": 55
      },
      "endPosition": {
        "x": 80,
        "y": 55
      },
      "path": "static",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": 1,
      "durationMs": 1600,
      "motionTag": "static"
    },
    "steps": [
      "Form the handshape for Letter N: Thumb tucked under first two fingers across knuckles.",
      "Hold palm steady facing forward toward your webcam.",
      "Maintain clear lighting and finger separation."
    ],
    "tip": "Keep hand relaxed and steady for Letter N."
  },
  {
    "id": "alpha-o",
    "label": "Letter O",
    "category": "alphabet",
    "level": "beginner",
    "order": 15,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/O.svg",
      "alt": "ASL manual letter O"
    },
    "motionTag": "static",
    "animationSpec": {
      "handshape": "flat_o",
      "startPosition": {
        "x": 80,
        "y": 55
      },
      "endPosition": {
        "x": 80,
        "y": 55
      },
      "path": "static",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": 1,
      "durationMs": 1600,
      "motionTag": "static"
    },
    "steps": [
      "Form the handshape for Letter O: All fingertips meet thumb tip in a circular 'O' contour.",
      "Hold palm steady facing forward toward your webcam.",
      "Maintain clear lighting and finger separation."
    ],
    "tip": "Keep hand relaxed and steady for Letter O."
  },
  {
    "id": "alpha-p",
    "label": "Letter P",
    "category": "alphabet",
    "level": "beginner",
    "order": 16,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/P.svg",
      "alt": "ASL manual letter P"
    },
    "motionTag": "static",
    "animationSpec": {
      "handshape": "v_shape",
      "startPosition": {
        "x": 80,
        "y": 55
      },
      "endPosition": {
        "x": 80,
        "y": 55
      },
      "path": "static",
      "orientation": "palm_down",
      "location": "neutral_space",
      "repeat": 1,
      "durationMs": 1600,
      "motionTag": "static"
    },
    "steps": [
      "Form the handshape for Letter P: 'K' handshape inverted with index and middle pointing down.",
      "Hold palm steady facing forward toward your webcam.",
      "Maintain clear lighting and finger separation."
    ],
    "tip": "Keep hand relaxed and steady for Letter P."
  },
  {
    "id": "alpha-q",
    "label": "Letter Q",
    "category": "alphabet",
    "level": "beginner",
    "order": 17,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/Q.svg",
      "alt": "ASL manual letter Q"
    },
    "motionTag": "static",
    "animationSpec": {
      "handshape": "pinched_g",
      "startPosition": {
        "x": 80,
        "y": 55
      },
      "endPosition": {
        "x": 80,
        "y": 55
      },
      "path": "static",
      "orientation": "palm_down",
      "location": "neutral_space",
      "repeat": 1,
      "durationMs": 1600,
      "motionTag": "static"
    },
    "steps": [
      "Form the handshape for Letter Q: 'G' handshape pointing downwards towards the floor.",
      "Hold palm steady facing forward toward your webcam.",
      "Maintain clear lighting and finger separation."
    ],
    "tip": "Keep hand relaxed and steady for Letter Q."
  },
  {
    "id": "alpha-r",
    "label": "Letter R",
    "category": "alphabet",
    "level": "beginner",
    "order": 18,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/R.svg",
      "alt": "ASL manual letter R"
    },
    "motionTag": "static",
    "animationSpec": {
      "handshape": "v_shape",
      "startPosition": {
        "x": 80,
        "y": 55
      },
      "endPosition": {
        "x": 80,
        "y": 55
      },
      "path": "static",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": 1,
      "durationMs": 1600,
      "motionTag": "static"
    },
    "steps": [
      "Form the handshape for Letter R: Index and middle fingers crossed over one another.",
      "Hold palm steady facing forward toward your webcam.",
      "Maintain clear lighting and finger separation."
    ],
    "tip": "Keep hand relaxed and steady for Letter R."
  },
  {
    "id": "alpha-s",
    "label": "Letter S",
    "category": "alphabet",
    "level": "beginner",
    "order": 19,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/S.svg",
      "alt": "ASL manual letter S"
    },
    "motionTag": "static",
    "animationSpec": {
      "handshape": "fist_a",
      "startPosition": {
        "x": 80,
        "y": 55
      },
      "endPosition": {
        "x": 80,
        "y": 55
      },
      "path": "static",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": 1,
      "durationMs": 1600,
      "motionTag": "static"
    },
    "steps": [
      "Form the handshape for Letter S: Closed fist with thumb folded across the front of fingers.",
      "Hold palm steady facing forward toward your webcam.",
      "Maintain clear lighting and finger separation."
    ],
    "tip": "Keep hand relaxed and steady for Letter S."
  },
  {
    "id": "alpha-t",
    "label": "Letter T",
    "category": "alphabet",
    "level": "beginner",
    "order": 20,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/T.svg",
      "alt": "ASL manual letter T"
    },
    "motionTag": "static",
    "animationSpec": {
      "handshape": "fist_a",
      "startPosition": {
        "x": 80,
        "y": 55
      },
      "endPosition": {
        "x": 80,
        "y": 55
      },
      "path": "static",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": 1,
      "durationMs": 1600,
      "motionTag": "static"
    },
    "steps": [
      "Form the handshape for Letter T: Thumb tucked between index and middle fingers.",
      "Hold palm steady facing forward toward your webcam.",
      "Maintain clear lighting and finger separation."
    ],
    "tip": "Keep hand relaxed and steady for Letter T."
  },
  {
    "id": "alpha-u",
    "label": "Letter U",
    "category": "alphabet",
    "level": "beginner",
    "order": 21,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/U.svg",
      "alt": "ASL manual letter U"
    },
    "motionTag": "static",
    "animationSpec": {
      "handshape": "v_shape",
      "startPosition": {
        "x": 80,
        "y": 55
      },
      "endPosition": {
        "x": 80,
        "y": 55
      },
      "path": "static",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": 1,
      "durationMs": 1600,
      "motionTag": "static"
    },
    "steps": [
      "Form the handshape for Letter U: Index and middle fingers held straight and together.",
      "Hold palm steady facing forward toward your webcam.",
      "Maintain clear lighting and finger separation."
    ],
    "tip": "Keep hand relaxed and steady for Letter U."
  },
  {
    "id": "alpha-v",
    "label": "Letter V",
    "category": "alphabet",
    "level": "beginner",
    "order": 22,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/V.svg",
      "alt": "ASL manual letter V"
    },
    "motionTag": "static",
    "animationSpec": {
      "handshape": "v_shape",
      "startPosition": {
        "x": 80,
        "y": 55
      },
      "endPosition": {
        "x": 80,
        "y": 55
      },
      "path": "static",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": 1,
      "durationMs": 1600,
      "motionTag": "static"
    },
    "steps": [
      "Form the handshape for Letter V: Index and middle fingers spread in a clean 'V' shape.",
      "Hold palm steady facing forward toward your webcam.",
      "Maintain clear lighting and finger separation."
    ],
    "tip": "Keep hand relaxed and steady for Letter V."
  },
  {
    "id": "alpha-w",
    "label": "Letter W",
    "category": "alphabet",
    "level": "beginner",
    "order": 23,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/W.svg",
      "alt": "ASL manual letter W"
    },
    "motionTag": "static",
    "animationSpec": {
      "handshape": "3_shape",
      "startPosition": {
        "x": 80,
        "y": 55
      },
      "endPosition": {
        "x": 80,
        "y": 55
      },
      "path": "static",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": 1,
      "durationMs": 1600,
      "motionTag": "static"
    },
    "steps": [
      "Form the handshape for Letter W: Index, middle, and ring fingers spread upright in a 'W'.",
      "Hold palm steady facing forward toward your webcam.",
      "Maintain clear lighting and finger separation."
    ],
    "tip": "Keep hand relaxed and steady for Letter W."
  },
  {
    "id": "alpha-x",
    "label": "Letter X",
    "category": "alphabet",
    "level": "beginner",
    "order": 24,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/X.svg",
      "alt": "ASL manual letter X"
    },
    "motionTag": "static",
    "animationSpec": {
      "handshape": "hook_index",
      "startPosition": {
        "x": 80,
        "y": 55
      },
      "endPosition": {
        "x": 80,
        "y": 55
      },
      "path": "static",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": 1,
      "durationMs": 1600,
      "motionTag": "static"
    },
    "steps": [
      "Form the handshape for Letter X: Index finger curved into a distinct hook shape.",
      "Hold palm steady facing forward toward your webcam.",
      "Maintain clear lighting and finger separation."
    ],
    "tip": "Keep hand relaxed and steady for Letter X."
  },
  {
    "id": "alpha-y",
    "label": "Letter Y",
    "category": "alphabet",
    "level": "beginner",
    "order": 25,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/Y.svg",
      "alt": "ASL manual letter Y"
    },
    "motionTag": "static",
    "animationSpec": {
      "handshape": "ily",
      "startPosition": {
        "x": 80,
        "y": 55
      },
      "endPosition": {
        "x": 80,
        "y": 55
      },
      "path": "static",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": 1,
      "durationMs": 1600,
      "motionTag": "static"
    },
    "steps": [
      "Form the handshape for Letter Y: Thumb and pinky extended wide, middle three fingers folded.",
      "Hold palm steady facing forward toward your webcam.",
      "Maintain clear lighting and finger separation."
    ],
    "tip": "Keep hand relaxed and steady for Letter Y."
  },
  {
    "id": "alpha-z",
    "label": "Letter Z",
    "category": "alphabet",
    "level": "beginner",
    "order": 26,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/Z.svg",
      "alt": "ASL manual letter Z"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "index_point",
      "startPosition": {
        "x": 80,
        "y": 55
      },
      "endPosition": {
        "x": 120,
        "y": 75
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1600,
      "motionTag": "motion"
    },
    "steps": [
      "Form the handshape for Letter Z: Index finger draws a 'Z' zigzag stroke in the air.",
      "Hold palm steady facing forward toward your webcam.",
      "Maintain clear lighting and finger separation."
    ],
    "tip": "Keep hand relaxed and steady for Letter Z."
  },
  {
    "id": "num-0",
    "label": "Number 0",
    "category": "numbers",
    "level": "beginner",
    "order": 27,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/0.svg",
      "alt": "ASL sign for number 0"
    },
    "motionTag": "static",
    "animationSpec": {
      "handshape": "0",
      "startPosition": {
        "x": 80,
        "y": 55
      },
      "endPosition": {
        "x": 80,
        "y": 55
      },
      "path": "static",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": 1,
      "durationMs": 1500,
      "motionTag": "static"
    },
    "steps": [
      "Handshape: Curve all four fingers and thumb together into a circular 'O' shape.",
      "Orientation: Palm faces forward toward the viewer.",
      "Location: Held upright in neutral space at shoulder height."
    ],
    "tip": "In ASL, 0 forms an 'O' silhouette with fingertips meeting thumb, held stationary facing forward."
  },
  {
    "id": "num-1",
    "label": "Number 1",
    "category": "numbers",
    "level": "beginner",
    "order": 28,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/1.svg",
      "alt": "ASL sign for number 1"
    },
    "motionTag": "static",
    "animationSpec": {
      "handshape": "1",
      "startPosition": {
        "x": 80,
        "y": 55
      },
      "endPosition": {
        "x": 80,
        "y": 55
      },
      "path": "static",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": 1,
      "durationMs": 1500,
      "motionTag": "static"
    },
    "steps": [
      "Handshape: Extend your index finger straight up with thumb securing curled fingers.",
      "Orientation: Palm faces forward toward the viewer.",
      "Location: Held upright in neutral space at shoulder height."
    ],
    "tip": "When identifying isolated digits and cardinal numbers, palm faces forward toward the viewer."
  },
  {
    "id": "num-2",
    "label": "Number 2",
    "category": "numbers",
    "level": "beginner",
    "order": 29,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/2.svg",
      "alt": "ASL sign for number 2"
    },
    "motionTag": "static",
    "animationSpec": {
      "handshape": "2",
      "startPosition": {
        "x": 80,
        "y": 55
      },
      "endPosition": {
        "x": 80,
        "y": 55
      },
      "path": "static",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": 1,
      "durationMs": 1500,
      "motionTag": "static"
    },
    "steps": [
      "Handshape: Extend index and middle fingers in a 'V' shape, thumb over ring and pinky.",
      "Orientation: Palm faces forward toward the viewer.",
      "Location: Held upright in neutral space at shoulder height."
    ],
    "tip": "Keep index and middle fingers separated cleanly into a V facing the viewer."
  },
  {
    "id": "num-3",
    "label": "Number 3",
    "category": "numbers",
    "level": "beginner",
    "order": 30,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/3.svg",
      "alt": "ASL sign for number 3"
    },
    "motionTag": "static",
    "animationSpec": {
      "handshape": "3",
      "startPosition": {
        "x": 80,
        "y": 55
      },
      "endPosition": {
        "x": 80,
        "y": 55
      },
      "path": "static",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": 1,
      "durationMs": 1500,
      "motionTag": "static"
    },
    "steps": [
      "Handshape: Extend thumb, index finger, and middle finger simultaneously.",
      "Ring and pinky fingers remain firmly curled into the palm.",
      "Orientation: Palm faces forward toward the viewer.",
      "Location: Held upright in neutral space at shoulder height."
    ],
    "tip": "CRITICAL ASL RULE: In ASL, 3 uses the THUMB, index, and middle finger (NOT index, middle, ring)."
  },
  {
    "id": "num-4",
    "label": "Number 4",
    "category": "numbers",
    "level": "beginner",
    "order": 31,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/4.svg",
      "alt": "ASL sign for number 4"
    },
    "motionTag": "static",
    "animationSpec": {
      "handshape": "4",
      "startPosition": {
        "x": 80,
        "y": 55
      },
      "endPosition": {
        "x": 80,
        "y": 55
      },
      "path": "static",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": 1,
      "durationMs": 1500,
      "motionTag": "static"
    },
    "steps": [
      "Handshape: Extend all four fingers straight up, separated slightly.",
      "Fold thumb across your inner palm.",
      "Orientation: Palm faces forward toward the viewer.",
      "Location: Held upright in neutral space at shoulder height."
    ],
    "tip": "Keep all four fingertips upright and spread slightly with thumb folded across palm."
  },
  {
    "id": "num-5",
    "label": "Number 5",
    "category": "numbers",
    "level": "beginner",
    "order": 32,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/5.svg",
      "alt": "ASL sign for number 5"
    },
    "motionTag": "static",
    "animationSpec": {
      "handshape": "5",
      "startPosition": {
        "x": 80,
        "y": 55
      },
      "endPosition": {
        "x": 80,
        "y": 55
      },
      "path": "static",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": 1,
      "durationMs": 1500,
      "motionTag": "static"
    },
    "steps": [
      "Handshape: Open all 5 fingers and thumb wide ('5' open handshape).",
      "Orientation: Palm faces forward toward the viewer.",
      "Location: Held upright in neutral space at shoulder height."
    ],
    "tip": "Spread all 5 fingers comfortably, holding steady facing forward."
  },
  {
    "id": "num-6",
    "label": "Number 6",
    "category": "numbers",
    "level": "beginner",
    "order": 33,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/6.svg",
      "alt": "ASL sign for number 6"
    },
    "motionTag": "static",
    "animationSpec": {
      "handshape": "6",
      "startPosition": {
        "x": 80,
        "y": 55
      },
      "endPosition": {
        "x": 80,
        "y": 55
      },
      "path": "static",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": 1,
      "durationMs": 1500,
      "motionTag": "static"
    },
    "steps": [
      "Handshape: Touch the tip of your thumb to the tip of your pinky finger.",
      "Keep index, middle, and ring fingers extended upright.",
      "Orientation: Palm faces forward toward the viewer.",
      "Location: Held upright in neutral space at shoulder height."
    ],
    "tip": "ASL counting 6-9 rule: 6 touches pinky (smallest finger = smallest 6-9 value)."
  },
  {
    "id": "num-7",
    "label": "Number 7",
    "category": "numbers",
    "level": "beginner",
    "order": 34,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/7.svg",
      "alt": "ASL sign for number 7"
    },
    "motionTag": "static",
    "animationSpec": {
      "handshape": "7",
      "startPosition": {
        "x": 80,
        "y": 55
      },
      "endPosition": {
        "x": 80,
        "y": 55
      },
      "path": "static",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": 1,
      "durationMs": 1500,
      "motionTag": "static"
    },
    "steps": [
      "Handshape: Touch the tip of your thumb to your ring finger tip.",
      "Index, middle, and pinky fingers remain extended upright.",
      "Orientation: Palm faces forward toward the viewer.",
      "Location: Held upright in neutral space at shoulder height."
    ],
    "tip": "Make sure only the ring finger contacts the thumb."
  },
  {
    "id": "num-8",
    "label": "Number 8",
    "category": "numbers",
    "level": "beginner",
    "order": 35,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/8.svg",
      "alt": "ASL sign for number 8"
    },
    "motionTag": "static",
    "animationSpec": {
      "handshape": "8",
      "startPosition": {
        "x": 80,
        "y": 55
      },
      "endPosition": {
        "x": 80,
        "y": 55
      },
      "path": "static",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": 1,
      "durationMs": 1500,
      "motionTag": "static"
    },
    "steps": [
      "Handshape: Touch the tip of your thumb to your middle finger tip.",
      "Index, ring, and pinky fingers remain extended upright.",
      "Orientation: Palm faces forward toward the viewer.",
      "Location: Held upright in neutral space at shoulder height."
    ],
    "tip": "Middle finger to thumb forms number 8. Do not pinch too hard."
  },
  {
    "id": "num-9",
    "label": "Number 9",
    "category": "numbers",
    "level": "beginner",
    "order": 36,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/9.svg",
      "alt": "ASL sign for number 9"
    },
    "motionTag": "static",
    "animationSpec": {
      "handshape": "9",
      "startPosition": {
        "x": 80,
        "y": 55
      },
      "endPosition": {
        "x": 80,
        "y": 55
      },
      "path": "static",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": 1,
      "durationMs": 1500,
      "motionTag": "static"
    },
    "steps": [
      "Handshape: Touch the tip of your thumb to your index finger tip (like an 'F' handshape).",
      "Middle, ring, and pinky fingers remain extended upright.",
      "Orientation: Palm faces forward toward the viewer.",
      "Location: Held upright in neutral space at shoulder height."
    ],
    "tip": "Number 9 touches index to thumb with palm facing forward."
  },
  {
    "id": "num-10",
    "label": "Number 10",
    "category": "numbers",
    "level": "beginner",
    "order": 37,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/10.svg",
      "alt": "ASL sign for number 10"
    },
    "motionTag": "static",
    "animationSpec": {
      "handshape": "10",
      "startPosition": {
        "x": 80,
        "y": 55
      },
      "endPosition": {
        "x": 80,
        "y": 55
      },
      "path": "static",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": 1,
      "durationMs": 1500,
      "motionTag": "static"
    },
    "steps": [
      "Handshape: Form an 'A' fist with thumb extended straight up ('thumbs-up').",
      "Orientation: Palm faces forward toward the viewer in neutral space.",
      "Location: Held steadily at shoulder height (can be shaken slightly from wrist in conversational ASL)."
    ],
    "tip": "Static thumbs-up held facing forward at shoulder height; slight wrist shake is common in rapid signing."
  },
  {
    "id": "word-hello",
    "label": "Hello",
    "category": "greetings",
    "level": "beginner",
    "theme": "Greetings and basics",
    "order": 40,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/hello.svg",
      "alt": "ASL sign for Hello"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "B",
      "startPosition": {
        "x": 100,
        "y": 34
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "arc",
      "orientation": "palm_forward",
      "location": "forehead",
      "repeat": "infinite",
      "durationMs": 1800,
      "motionTag": "motion",
      "startAnchor": "forehead",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Open dominant hand flat with fingers together.",
      "Touch fingertips lightly near your temple or forehead.",
      "Move hand outward in an open welcoming wave."
    ],
    "tip": "A warm salute starting from the temple.",
    "location": "forehead"
  },
  {
    "id": "word-goodbye",
    "label": "Goodbye",
    "category": "greetings",
    "level": "beginner",
    "theme": "Greetings and basics",
    "order": 41,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/hello.svg",
      "alt": "ASL sign for Goodbye"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "B",
      "startPosition": {
        "x": 75,
        "y": 65
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "shake",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1400,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Raise open palm facing forward at shoulder height.",
      "Hinge fingers forward from knuckles up and down in a wave.",
      "Repeat the gentle waving motion twice."
    ],
    "tip": "Standard open-palm parting wave facing the viewer.",
    "location": "neutral_space"
  },
  {
    "id": "word-good-morning",
    "label": "Good Morning",
    "category": "greetings",
    "level": "beginner",
    "theme": "Greetings and basics",
    "order": 42,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/good.svg",
      "alt": "ASL sign for Good Morning"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "B",
      "startPosition": {
        "x": 100,
        "y": 74
      },
      "endPosition": {
        "x": 100,
        "y": 114
      },
      "path": "forward",
      "orientation": "palm_inward",
      "location": "chin",
      "repeat": "infinite",
      "durationMs": 1900,
      "motionTag": "motion",
      "startAnchor": "chin",
      "endAnchor": "chest"
    },
    "steps": [
      "Sign 'Good' by touching flat fingertips to your chin and moving down to flat palm.",
      "Place non-dominant arm across body as the horizon.",
      "Rise dominant open hand upward underneath forearm like the rising sun."
    ],
    "tip": "Compound sign: Good + Morning (sun rising over the horizon).",
    "location": "chin"
  },
  {
    "id": "word-good-night",
    "label": "Good Night",
    "category": "greetings",
    "level": "beginner",
    "theme": "Greetings and basics",
    "order": 43,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/good.svg",
      "alt": "ASL sign for Good Night"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "B",
      "startPosition": {
        "x": 100,
        "y": 74
      },
      "endPosition": {
        "x": 100,
        "y": 114
      },
      "path": "forward",
      "orientation": "palm_inward",
      "location": "chin",
      "repeat": "infinite",
      "durationMs": 1900,
      "motionTag": "motion",
      "startAnchor": "chin",
      "endAnchor": "chest"
    },
    "steps": [
      "Sign 'Good' from chin to non-dominant supporting palm.",
      "Curve dominant hand over non-dominant arm like the sun dipping below horizon.",
      "Rest curved wrist gently over edge of supporting arm."
    ],
    "tip": "Compound sign: Good + Night (sun setting below horizon).",
    "location": "chin"
  },
  {
    "id": "word-thank-you",
    "label": "Thank You",
    "category": "greetings",
    "level": "beginner",
    "theme": "Greetings and basics",
    "order": 44,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/thank_you.svg",
      "alt": "ASL sign for Thank You"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "B",
      "startPosition": {
        "x": 100,
        "y": 74
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "forward",
      "orientation": "palm_inward",
      "location": "chin",
      "repeat": "infinite",
      "durationMs": 1800,
      "motionTag": "motion",
      "startAnchor": "chin",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Touch fingertips to your chin or lower lip with flat palm.",
      "Move hand forward and slightly downward toward the other person.",
      "End with open palm facing slightly upward."
    ],
    "tip": "Movement flows toward the person you are thanking.",
    "location": "chin"
  },
  {
    "id": "word-please",
    "label": "Please",
    "category": "greetings",
    "level": "beginner",
    "theme": "Greetings and basics",
    "order": 45,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/please.svg",
      "alt": "ASL sign for Please"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "B",
      "startPosition": {
        "x": 100,
        "y": 114
      },
      "endPosition": {
        "x": 100,
        "y": 114
      },
      "path": "circle",
      "orientation": "palm_inward",
      "location": "chest",
      "repeat": "infinite",
      "durationMs": 1800,
      "motionTag": "motion",
      "startAnchor": "chest",
      "endAnchor": "chest"
    },
    "steps": [
      "Place flat open palm on center of your chest with fingers together.",
      "Keep thumb slightly extended.",
      "Rub gently in clockwise circles across your sternum."
    ],
    "tip": "Gentle circular rub on the center of the chest.",
    "location": "chest"
  },
  {
    "id": "word-sorry",
    "label": "Sorry",
    "category": "greetings",
    "level": "beginner",
    "theme": "Greetings and basics",
    "order": 46,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/sorry.svg",
      "alt": "ASL sign for Sorry"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "A",
      "startPosition": {
        "x": 100,
        "y": 114
      },
      "endPosition": {
        "x": 100,
        "y": 114
      },
      "path": "circle",
      "orientation": "palm_inward",
      "location": "chest",
      "repeat": "infinite",
      "durationMs": 1800,
      "motionTag": "motion",
      "startAnchor": "chest",
      "endAnchor": "chest"
    },
    "steps": [
      "Form an 'A' handshape fist with dominant hand.",
      "Place knuckles against center-left of chest over your heart.",
      "Rub in small clockwise circles a few times with remorseful expression."
    ],
    "tip": "Use an apologetic facial expression to convey sincerity.",
    "location": "chest"
  },
  {
    "id": "word-yes",
    "label": "Yes",
    "category": "greetings",
    "level": "beginner",
    "theme": "Greetings and basics",
    "order": 47,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/yes.svg",
      "alt": "ASL sign for Yes"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "S",
      "startPosition": {
        "x": 75,
        "y": 65
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "tap",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1400,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Make a closed fist ('S' handshape) at chest height.",
      "Flex wrist so fist tilts downward, then back up.",
      "Repeat the nodding motion like a nodding head."
    ],
    "tip": "Fist simulates a nodding head.",
    "location": "neutral_space"
  },
  {
    "id": "word-no",
    "label": "No",
    "category": "greetings",
    "level": "beginner",
    "theme": "Greetings and basics",
    "order": 48,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/no.svg",
      "alt": "ASL sign for No"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "3",
      "startPosition": {
        "x": 75,
        "y": 65
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "tap",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1300,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Extend index and middle fingers together alongside thumb.",
      "Snap fingertips down onto thumb tip firmly.",
      "Movement is quick, like a closing bird beak."
    ],
    "tip": "Firm double snap with a subtle head shake.",
    "location": "neutral_space"
  },
  {
    "id": "word-welcome",
    "label": "Welcome",
    "category": "greetings",
    "level": "beginner",
    "theme": "Greetings and basics",
    "order": 49,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/welcome.svg",
      "alt": "ASL sign for Welcome"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "B",
      "startPosition": {
        "x": 75,
        "y": 65
      },
      "endPosition": {
        "x": 100,
        "y": 114
      },
      "path": "arc",
      "orientation": "palm_up",
      "location": "chest",
      "repeat": "infinite",
      "durationMs": 1800,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "chest"
    },
    "steps": [
      "Hold dominant flat palm out at side with palm facing upward.",
      "Sweep hand in a welcoming arc inward toward your waist / torso.",
      "Smile to express welcoming openness."
    ],
    "tip": "An inviting sweep bringing the guest toward you.",
    "location": "chest"
  },
  {
    "id": "word-family",
    "label": "Family",
    "category": "greetings",
    "level": "beginner",
    "theme": "Family",
    "order": 50,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/family.svg",
      "alt": "ASL sign for Family"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "F",
      "startPosition": {
        "x": 100,
        "y": 114
      },
      "endPosition": {
        "x": 100,
        "y": 114
      },
      "path": "circle",
      "orientation": "palm_forward",
      "location": "chest",
      "repeat": "infinite",
      "durationMs": 1800,
      "motionTag": "motion",
      "startAnchor": "chest",
      "endAnchor": "chest"
    },
    "steps": [
      "Form 'F' handshapes with both hands touching index fingers and thumbs in front.",
      "Circle both hands outward away from each other.",
      "Bring pinky edges together completing a closed circle of inclusion."
    ],
    "tip": "Circles around representing the family circle.",
    "location": "chest"
  },
  {
    "id": "word-mom",
    "label": "Mom",
    "category": "greetings",
    "level": "beginner",
    "theme": "Family",
    "order": 51,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/mom.svg",
      "alt": "ASL sign for Mom"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "5",
      "startPosition": {
        "x": 100,
        "y": 74
      },
      "endPosition": {
        "x": 100,
        "y": 74
      },
      "path": "tap",
      "orientation": "palm_forward",
      "location": "chin",
      "repeat": "infinite",
      "durationMs": 1400,
      "motionTag": "motion",
      "startAnchor": "chin",
      "endAnchor": "chin"
    },
    "steps": [
      "Open dominant hand into an open '5' shape with fingers spread.",
      "Touch tip of thumb against the center of your chin.",
      "Tap thumb against chin twice gently."
    ],
    "tip": "ASL Rule: Female signs are located near the chin / lower face.",
    "location": "chin"
  },
  {
    "id": "word-dad",
    "label": "Dad",
    "category": "greetings",
    "level": "beginner",
    "theme": "Family",
    "order": 52,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/dad.svg",
      "alt": "ASL sign for Dad"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "5",
      "startPosition": {
        "x": 100,
        "y": 34
      },
      "endPosition": {
        "x": 100,
        "y": 34
      },
      "path": "tap",
      "orientation": "palm_forward",
      "location": "forehead",
      "repeat": "infinite",
      "durationMs": 1400,
      "motionTag": "motion",
      "startAnchor": "forehead",
      "endAnchor": "forehead"
    },
    "steps": [
      "Open dominant hand into an open '5' shape with fingers spread.",
      "Touch tip of thumb against your forehead temple.",
      "Tap thumb against forehead twice gently."
    ],
    "tip": "ASL Rule: Male signs are located near the forehead / upper face.",
    "location": "forehead"
  },
  {
    "id": "word-parents",
    "label": "Parents",
    "category": "greetings",
    "level": "beginner",
    "theme": "Family",
    "order": 53,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/family.svg",
      "alt": "ASL sign for Parents"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "P",
      "startPosition": {
        "x": 100,
        "y": 34
      },
      "endPosition": {
        "x": 100,
        "y": 74
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "forehead",
      "repeat": "infinite",
      "durationMs": 1800,
      "motionTag": "motion",
      "startAnchor": "forehead",
      "endAnchor": "chin"
    },
    "steps": [
      "Touch thumb of open '5' hand to forehead (Dad).",
      "Smoothly bring hand down and touch thumb to chin (Mom).",
      "Combines Dad and Mom in one fluid motion."
    ],
    "tip": "Compound: Forehead (Dad) + Chin (Mom).",
    "location": "forehead"
  },
  {
    "id": "word-baby",
    "label": "Baby",
    "category": "greetings",
    "level": "beginner",
    "theme": "Family",
    "order": 54,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/baby.svg",
      "alt": "ASL sign for Baby"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "B",
      "startPosition": {
        "x": 100,
        "y": 114
      },
      "endPosition": {
        "x": 100,
        "y": 114
      },
      "path": "shake",
      "orientation": "palm_up",
      "location": "chest",
      "repeat": "infinite",
      "durationMs": 1600,
      "motionTag": "motion",
      "startAnchor": "chest",
      "endAnchor": "chest"
    },
    "steps": [
      "Cross arms in front of your chest like cradling an infant.",
      "Rest dominant arm over non-dominant arm.",
      "Gently rock arms side to side."
    ],
    "tip": "Natural cradling and rocking gesture.",
    "location": "chest"
  },
  {
    "id": "word-brother",
    "label": "Brother",
    "category": "greetings",
    "level": "beginner",
    "theme": "Family",
    "order": 55,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/brother.svg",
      "alt": "ASL sign for Brother"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "L",
      "startPosition": {
        "x": 100,
        "y": 34
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "forehead",
      "repeat": "infinite",
      "durationMs": 1700,
      "motionTag": "motion",
      "startAnchor": "forehead",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Form an 'L' or index hand at forehead (male zone).",
      "Hold non-dominant 'L' or index hand in neutral space below.",
      "Bring dominant hand down so hands meet barrel-to-barrel."
    ],
    "tip": "Boy/male sign from forehead coming down to join partner hand.",
    "location": "forehead"
  },
  {
    "id": "word-sister",
    "label": "Sister",
    "category": "greetings",
    "level": "beginner",
    "theme": "Family",
    "order": 56,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/sister.svg",
      "alt": "ASL sign for Sister"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "L",
      "startPosition": {
        "x": 100,
        "y": 74
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "chin",
      "repeat": "infinite",
      "durationMs": 1700,
      "motionTag": "motion",
      "startAnchor": "chin",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Form an 'L' or index hand at chin (female zone).",
      "Hold non-dominant 'L' or index hand in neutral space below.",
      "Bring dominant hand down so hands meet barrel-to-barrel."
    ],
    "tip": "Girl/female sign from chin coming down to join partner hand.",
    "location": "chin"
  },
  {
    "id": "word-grandma",
    "label": "Grandma",
    "category": "greetings",
    "level": "beginner",
    "theme": "Family",
    "order": 57,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/mom.svg",
      "alt": "ASL sign for Grandma"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "5",
      "startPosition": {
        "x": 100,
        "y": 74
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "arc",
      "orientation": "palm_forward",
      "location": "chin",
      "repeat": "infinite",
      "durationMs": 1800,
      "motionTag": "motion",
      "startAnchor": "chin",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Start with open '5' hand thumb on chin (Mom sign).",
      "Bounce hand forward in two small progressive arcs.",
      "Each arc represents one generation forward."
    ],
    "tip": "Mom + generation bounce forward = Grandma.",
    "location": "chin"
  },
  {
    "id": "word-grandpa",
    "label": "Grandpa",
    "category": "greetings",
    "level": "beginner",
    "theme": "Family",
    "order": 58,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/dad.svg",
      "alt": "ASL sign for Grandpa"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "5",
      "startPosition": {
        "x": 100,
        "y": 34
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "arc",
      "orientation": "palm_forward",
      "location": "forehead",
      "repeat": "infinite",
      "durationMs": 1800,
      "motionTag": "motion",
      "startAnchor": "forehead",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Start with open '5' hand thumb on forehead (Dad sign).",
      "Bounce hand forward in two small progressive arcs.",
      "Each arc represents one generation forward."
    ],
    "tip": "Dad + generation bounce forward = Grandpa.",
    "location": "forehead"
  },
  {
    "id": "word-son",
    "label": "Son",
    "category": "greetings",
    "level": "beginner",
    "theme": "Family",
    "order": 59,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/dad.svg",
      "alt": "ASL sign for Son"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "B",
      "startPosition": {
        "x": 100,
        "y": 34
      },
      "endPosition": {
        "x": 100,
        "y": 114
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "forehead",
      "repeat": "infinite",
      "durationMs": 1700,
      "motionTag": "motion",
      "startAnchor": "forehead",
      "endAnchor": "chest"
    },
    "steps": [
      "Touch forehead with side of hand salute (Male marker).",
      "Bring hand down into neutral chest space.",
      "Cradle arm like holding a baby boy."
    ],
    "tip": "Male (forehead) + Baby cradle = Son.",
    "location": "forehead"
  },
  {
    "id": "word-daughter",
    "label": "Daughter",
    "category": "greetings",
    "level": "beginner",
    "theme": "Family",
    "order": 60,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/mom.svg",
      "alt": "ASL sign for Daughter"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "B",
      "startPosition": {
        "x": 100,
        "y": 74
      },
      "endPosition": {
        "x": 100,
        "y": 114
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "chin",
      "repeat": "infinite",
      "durationMs": 1700,
      "motionTag": "motion",
      "startAnchor": "chin",
      "endAnchor": "chest"
    },
    "steps": [
      "Touch edge of jaw or chin with side of hand (Female marker).",
      "Bring hand down into neutral chest space.",
      "Cradle arm like holding a baby girl."
    ],
    "tip": "Female (chin) + Baby cradle = Daughter.",
    "location": "chin"
  },
  {
    "id": "word-help",
    "label": "Help",
    "category": "greetings",
    "level": "beginner",
    "theme": "Essentials",
    "order": 61,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/help.svg",
      "alt": "ASL sign for Help"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "10",
      "startPosition": {
        "x": 75,
        "y": 65
      },
      "endPosition": {
        "x": 100,
        "y": 114
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "chest",
      "repeat": "infinite",
      "durationMs": 1700,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "chest"
    },
    "steps": [
      "Extend non-dominant palm flat facing upward.",
      "Place dominant 'thumbs-up' fist on top of the palm.",
      "Lift both hands upward together firmly."
    ],
    "tip": "The flat palm physically lifts and supports the fist.",
    "location": "chest"
  },
  {
    "id": "word-stop",
    "label": "Stop",
    "category": "greetings",
    "level": "beginner",
    "theme": "Essentials",
    "order": 62,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/stop.svg",
      "alt": "ASL sign for Stop"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "B",
      "startPosition": {
        "x": 75,
        "y": 65
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "tap",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1300,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Hold non-dominant hand flat, palm facing upward.",
      "Bring dominant hand down with side edge cutting sharply into palm.",
      "Stop abruptly on impact."
    ],
    "tip": "Decisive karate-chop style motion onto flat palm.",
    "location": "neutral_space"
  },
  {
    "id": "word-good",
    "label": "Good",
    "category": "greetings",
    "level": "beginner",
    "theme": "Essentials",
    "order": 63,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/good.svg",
      "alt": "ASL sign for Good"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "B",
      "startPosition": {
        "x": 100,
        "y": 74
      },
      "endPosition": {
        "x": 100,
        "y": 114
      },
      "path": "forward",
      "orientation": "palm_inward",
      "location": "chin",
      "repeat": "infinite",
      "durationMs": 1600,
      "motionTag": "motion",
      "startAnchor": "chin",
      "endAnchor": "chest"
    },
    "steps": [
      "Place fingertips of flat dominant hand against chin/lips.",
      "Move hand down and forward into non-dominant palm facing up.",
      "End with both palms facing upward."
    ],
    "tip": "Fingertips leave the chin and land on the other palm.",
    "location": "chin"
  },
  {
    "id": "word-bad",
    "label": "Bad",
    "category": "greetings",
    "level": "beginner",
    "theme": "Essentials",
    "order": 64,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/bad.svg",
      "alt": "ASL sign for Bad"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "B",
      "startPosition": {
        "x": 100,
        "y": 74
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "arc",
      "orientation": "palm_inward",
      "location": "chin",
      "repeat": "infinite",
      "durationMs": 1600,
      "motionTag": "motion",
      "startAnchor": "chin",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Touch fingertips of dominant flat palm to chin.",
      "Turn hand outward and flip palm face downward sharply.",
      "Drop hand downward with a disapproving facial expression."
    ],
    "tip": "Opposite of Good; turns palm down toward ground.",
    "location": "chin"
  },
  {
    "id": "word-more",
    "label": "More",
    "category": "greetings",
    "level": "beginner",
    "theme": "Essentials",
    "order": 65,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/more.svg",
      "alt": "ASL sign for More"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "O",
      "startPosition": {
        "x": 75,
        "y": 65
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "tap",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1400,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Form flattened 'O' shapes (all fingertips touching thumbs) with both hands.",
      "Bring fingertips together in front of chest.",
      "Tap fingertips together twice gently."
    ],
    "tip": "Fingertip pinches tap together twice.",
    "location": "neutral_space"
  },
  {
    "id": "word-finished",
    "label": "Finished",
    "category": "greetings",
    "level": "beginner",
    "theme": "Essentials",
    "order": 66,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/finished.svg",
      "alt": "ASL sign for Finished"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "5",
      "startPosition": {
        "x": 100,
        "y": 114
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "shake",
      "orientation": "palm_forward",
      "location": "chest",
      "repeat": "infinite",
      "durationMs": 1500,
      "motionTag": "motion",
      "startAnchor": "chest",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Hold open '5' hands in front of chest with palms facing you.",
      "Flick both wrists outward so palms face down/outward.",
      "Mouth 'fish' or 'all done' cleanly."
    ],
    "tip": "Quick double wrist flick turning hands outward.",
    "location": "chest"
  },
  {
    "id": "word-name",
    "label": "Name",
    "category": "greetings",
    "level": "beginner",
    "theme": "Essentials",
    "order": 67,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/name.svg",
      "alt": "ASL sign for Name"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "H",
      "startPosition": {
        "x": 75,
        "y": 65
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "tap",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1400,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Form 'H' (or 'U') handshapes with both hands (index and middle fingers together).",
      "Cross dominant fingers over non-dominant fingers at right angles.",
      "Tap the dominant fingers on top twice."
    ],
    "tip": "Two taps crossing index/middle fingers.",
    "location": "neutral_space"
  },
  {
    "id": "word-friend",
    "label": "Friend",
    "category": "greetings",
    "level": "beginner",
    "theme": "Essentials",
    "order": 68,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/friend.svg",
      "alt": "ASL sign for Friend"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "X",
      "startPosition": {
        "x": 75,
        "y": 65
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "tap",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1600,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Hook dominant index finger over non-dominant index finger.",
      "Flip hands and hook in reverse.",
      "Shows interlocked mutual bond."
    ],
    "tip": "Two index hooks linking together and reversing.",
    "location": "neutral_space"
  },
  {
    "id": "word-love",
    "label": "Love",
    "category": "greetings",
    "level": "beginner",
    "theme": "Essentials",
    "order": 69,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/love.svg",
      "alt": "ASL sign for Love"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "S",
      "startPosition": {
        "x": 100,
        "y": 114
      },
      "endPosition": {
        "x": 100,
        "y": 114
      },
      "path": "tap",
      "orientation": "palm_inward",
      "location": "chest",
      "repeat": "infinite",
      "durationMs": 1600,
      "motionTag": "motion",
      "startAnchor": "chest",
      "endAnchor": "chest"
    },
    "steps": [
      "Cross both closed fists over chest in an 'X' hug over your heart.",
      "Alternatively, flash ILY hand (thumb, index, pinky) forward.",
      "Press wrists gently against chest."
    ],
    "tip": "Warm cross-arm hug over the heart.",
    "location": "chest"
  },
  {
    "id": "word-happy",
    "label": "Happy",
    "category": "greetings",
    "level": "beginner",
    "theme": "Essentials",
    "order": 70,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/happy.svg",
      "alt": "ASL sign for Happy"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "B",
      "startPosition": {
        "x": 100,
        "y": 114
      },
      "endPosition": {
        "x": 100,
        "y": 114
      },
      "path": "arc",
      "orientation": "palm_inward",
      "location": "chest",
      "repeat": "infinite",
      "durationMs": 1500,
      "motionTag": "motion",
      "startAnchor": "chest",
      "endAnchor": "chest"
    },
    "steps": [
      "Place open flat palms facing inward against upper chest.",
      "Brush hands upward in circular fluttering motions.",
      "Smile expressively while brushing upward."
    ],
    "tip": "Upward brushing motion with a genuine smile.",
    "location": "chest"
  },
  {
    "id": "word-sad",
    "label": "Sad",
    "category": "greetings",
    "level": "beginner",
    "theme": "Essentials",
    "order": 71,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/sad.svg",
      "alt": "ASL sign for Sad"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "5",
      "startPosition": {
        "x": 100,
        "y": 46
      },
      "endPosition": {
        "x": 100,
        "y": 74
      },
      "path": "line",
      "orientation": "palm_inward",
      "location": "chin",
      "repeat": "infinite",
      "durationMs": 1600,
      "motionTag": "motion",
      "startAnchor": "eyes",
      "endAnchor": "chin"
    },
    "steps": [
      "Hold open '5' hands in front of your face with fingers slightly bent.",
      "Draw hands downward slowly while lowering your head and eyes.",
      "Facial expression shows sadness."
    ],
    "tip": "Downward motion accompanied by an expressive solemn face.",
    "location": "chin"
  },
  {
    "id": "num-11",
    "label": "Number 11",
    "category": "numbers",
    "level": "intermediate",
    "order": 11,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/11.svg",
      "alt": "ASL sign for number 11"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "1",
      "tokens": [
        {
          "id": "t-11-0",
          "label": "Fist",
          "handshape": "A",
          "orientation": "palm_inward",
          "position": {
            "x": 75,
            "y": 65
          }
        },
        {
          "id": "t-11-1",
          "label": "1",
          "handshape": "1",
          "orientation": "palm_inward",
          "position": {
            "x": 75,
            "y": 48
          }
        }
      ],
      "startPosition": {
        "x": 75,
        "y": 65
      },
      "endPosition": {
        "x": 75,
        "y": 48
      },
      "path": "line",
      "orientation": "palm_inward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1400,
      "motionTag": "motion"
    },
    "tokens": [
      {
        "id": "t-11-0",
        "label": "Fist",
        "handshape": "A",
        "orientation": "palm_inward",
        "position": {
          "x": 75,
          "y": 65
        }
      },
      {
        "id": "t-11-1",
        "label": "1",
        "handshape": "1",
        "orientation": "palm_inward",
        "position": {
          "x": 75,
          "y": 48
        }
      }
    ],
    "steps": [
      "Start with a closed fist, palm facing inward toward your chest.",
      "Flick your index finger upward and outward from under the thumb.",
      "Repeat the flick with a crisp, rhythmic motion at shoulder height."
    ],
    "tip": "Numbers 11-15 in ASL face inward toward the signer, flicking upward from a closed fist."
  },
  {
    "id": "num-12",
    "label": "Number 12",
    "category": "numbers",
    "level": "intermediate",
    "order": 12,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/12.svg",
      "alt": "ASL sign for number 12"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "2",
      "tokens": [
        {
          "id": "t-12-0",
          "label": "Fist",
          "handshape": "A",
          "orientation": "palm_inward",
          "position": {
            "x": 75,
            "y": 65
          }
        },
        {
          "id": "t-12-1",
          "label": "2",
          "handshape": "2",
          "orientation": "palm_inward",
          "position": {
            "x": 75,
            "y": 48
          }
        }
      ],
      "startPosition": {
        "x": 75,
        "y": 65
      },
      "endPosition": {
        "x": 75,
        "y": 48
      },
      "path": "line",
      "orientation": "palm_inward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1400,
      "motionTag": "motion"
    },
    "tokens": [
      {
        "id": "t-12-0",
        "label": "Fist",
        "handshape": "A",
        "orientation": "palm_inward",
        "position": {
          "x": 75,
          "y": 65
        }
      },
      {
        "id": "t-12-1",
        "label": "2",
        "handshape": "2",
        "orientation": "palm_inward",
        "position": {
          "x": 75,
          "y": 48
        }
      }
    ],
    "steps": [
      "Start with a closed fist, palm facing inward toward your chest.",
      "Flick your index and middle fingers upward and outward from under the thumb.",
      "Repeat the flick with a crisp, rhythmic motion at shoulder height."
    ],
    "tip": "Numbers 11-15 in ASL face inward toward the signer, flicking upward from a closed fist."
  },
  {
    "id": "num-13",
    "label": "Number 13",
    "category": "numbers",
    "level": "intermediate",
    "order": 13,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/13.svg",
      "alt": "ASL sign for number 13"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "3",
      "tokens": [
        {
          "id": "t-13-0",
          "label": "Fist",
          "handshape": "A",
          "orientation": "palm_inward",
          "position": {
            "x": 75,
            "y": 65
          }
        },
        {
          "id": "t-13-1",
          "label": "3",
          "handshape": "3",
          "orientation": "palm_inward",
          "position": {
            "x": 75,
            "y": 48
          }
        }
      ],
      "startPosition": {
        "x": 75,
        "y": 65
      },
      "endPosition": {
        "x": 75,
        "y": 48
      },
      "path": "line",
      "orientation": "palm_inward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1400,
      "motionTag": "motion"
    },
    "tokens": [
      {
        "id": "t-13-0",
        "label": "Fist",
        "handshape": "A",
        "orientation": "palm_inward",
        "position": {
          "x": 75,
          "y": 65
        }
      },
      {
        "id": "t-13-1",
        "label": "3",
        "handshape": "3",
        "orientation": "palm_inward",
        "position": {
          "x": 75,
          "y": 48
        }
      }
    ],
    "steps": [
      "Start with a closed fist, palm facing inward toward your chest.",
      "Flick your thumb, index, and middle fingers upward and outward from under the thumb.",
      "Repeat the flick with a crisp, rhythmic motion at shoulder height."
    ],
    "tip": "Numbers 11-15 in ASL face inward toward the signer, flicking upward from a closed fist."
  },
  {
    "id": "num-14",
    "label": "Number 14",
    "category": "numbers",
    "level": "intermediate",
    "order": 14,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/14.svg",
      "alt": "ASL sign for number 14"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "4",
      "tokens": [
        {
          "id": "t-14-0",
          "label": "Fist",
          "handshape": "A",
          "orientation": "palm_inward",
          "position": {
            "x": 75,
            "y": 65
          }
        },
        {
          "id": "t-14-1",
          "label": "4",
          "handshape": "4",
          "orientation": "palm_inward",
          "position": {
            "x": 75,
            "y": 48
          }
        }
      ],
      "startPosition": {
        "x": 75,
        "y": 65
      },
      "endPosition": {
        "x": 75,
        "y": 48
      },
      "path": "line",
      "orientation": "palm_inward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1400,
      "motionTag": "motion"
    },
    "tokens": [
      {
        "id": "t-14-0",
        "label": "Fist",
        "handshape": "A",
        "orientation": "palm_inward",
        "position": {
          "x": 75,
          "y": 65
        }
      },
      {
        "id": "t-14-1",
        "label": "4",
        "handshape": "4",
        "orientation": "palm_inward",
        "position": {
          "x": 75,
          "y": 48
        }
      }
    ],
    "steps": [
      "Start with a closed fist, palm facing inward toward your chest.",
      "Flick your four fingers upward and outward from under the thumb.",
      "Repeat the flick with a crisp, rhythmic motion at shoulder height."
    ],
    "tip": "Numbers 11-15 in ASL face inward toward the signer, flicking upward from a closed fist."
  },
  {
    "id": "num-15",
    "label": "Number 15",
    "category": "numbers",
    "level": "intermediate",
    "order": 15,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/15.svg",
      "alt": "ASL sign for number 15"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "5",
      "tokens": [
        {
          "id": "t-15-0",
          "label": "Fist",
          "handshape": "A",
          "orientation": "palm_inward",
          "position": {
            "x": 75,
            "y": 65
          }
        },
        {
          "id": "t-15-1",
          "label": "5",
          "handshape": "5",
          "orientation": "palm_inward",
          "position": {
            "x": 75,
            "y": 48
          }
        }
      ],
      "startPosition": {
        "x": 75,
        "y": 65
      },
      "endPosition": {
        "x": 75,
        "y": 48
      },
      "path": "line",
      "orientation": "palm_inward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1400,
      "motionTag": "motion"
    },
    "tokens": [
      {
        "id": "t-15-0",
        "label": "Fist",
        "handshape": "A",
        "orientation": "palm_inward",
        "position": {
          "x": 75,
          "y": 65
        }
      },
      {
        "id": "t-15-1",
        "label": "5",
        "handshape": "5",
        "orientation": "palm_inward",
        "position": {
          "x": 75,
          "y": 48
        }
      }
    ],
    "steps": [
      "Start with a closed fist, palm facing inward toward your chest.",
      "Flick your all five fingers upward and outward from under the thumb.",
      "Repeat the flick with a crisp, rhythmic motion at shoulder height."
    ],
    "tip": "Numbers 11-15 in ASL face inward toward the signer, flicking upward from a closed fist."
  },
  {
    "id": "num-16",
    "label": "Number 16",
    "category": "numbers",
    "level": "intermediate",
    "order": 16,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/16.svg",
      "alt": "ASL sign for number 16"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "6",
      "tokens": [
        {
          "id": "t-16-0",
          "label": "1",
          "handshape": "1",
          "orientation": "palm_forward",
          "position": {
            "x": 68,
            "y": 55
          }
        },
        {
          "id": "t-16-1",
          "label": "6",
          "handshape": "6",
          "orientation": "palm_forward",
          "position": {
            "x": 92,
            "y": 55
          }
        }
      ],
      "startPosition": {
        "x": 68,
        "y": 55
      },
      "endPosition": {
        "x": 92,
        "y": 55
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1100,
      "motionTag": "motion"
    },
    "tokens": [
      {
        "id": "t-16-0",
        "label": "1",
        "handshape": "1",
        "orientation": "palm_forward",
        "position": {
          "x": 68,
          "y": 55
        }
      },
      {
        "id": "t-16-1",
        "label": "6",
        "handshape": "6",
        "orientation": "palm_forward",
        "position": {
          "x": 92,
          "y": 55
        }
      }
    ],
    "steps": [
      "Sign number 1 with index finger upright, palm facing forward.",
      "Quickly transition to number 6 with palm facing forward.",
      "The two digits are signed quickly and smoothly in neutral space."
    ],
    "tip": "Numbers 16-19 in ASL are signed quickly as the two digits (1 then 6) or twisting from 10 into 6."
  },
  {
    "id": "num-17",
    "label": "Number 17",
    "category": "numbers",
    "level": "intermediate",
    "order": 17,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/17.svg",
      "alt": "ASL sign for number 17"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "7",
      "tokens": [
        {
          "id": "t-17-0",
          "label": "1",
          "handshape": "1",
          "orientation": "palm_forward",
          "position": {
            "x": 68,
            "y": 55
          }
        },
        {
          "id": "t-17-1",
          "label": "7",
          "handshape": "7",
          "orientation": "palm_forward",
          "position": {
            "x": 92,
            "y": 55
          }
        }
      ],
      "startPosition": {
        "x": 68,
        "y": 55
      },
      "endPosition": {
        "x": 92,
        "y": 55
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1100,
      "motionTag": "motion"
    },
    "tokens": [
      {
        "id": "t-17-0",
        "label": "1",
        "handshape": "1",
        "orientation": "palm_forward",
        "position": {
          "x": 68,
          "y": 55
        }
      },
      {
        "id": "t-17-1",
        "label": "7",
        "handshape": "7",
        "orientation": "palm_forward",
        "position": {
          "x": 92,
          "y": 55
        }
      }
    ],
    "steps": [
      "Sign number 1 with index finger upright, palm facing forward.",
      "Quickly transition to number 7 with palm facing forward.",
      "The two digits are signed quickly and smoothly in neutral space."
    ],
    "tip": "Numbers 16-19 in ASL are signed quickly as the two digits (1 then 7) or twisting from 10 into 7."
  },
  {
    "id": "num-18",
    "label": "Number 18",
    "category": "numbers",
    "level": "intermediate",
    "order": 18,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/18.svg",
      "alt": "ASL sign for number 18"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "8",
      "tokens": [
        {
          "id": "t-18-0",
          "label": "1",
          "handshape": "1",
          "orientation": "palm_forward",
          "position": {
            "x": 68,
            "y": 55
          }
        },
        {
          "id": "t-18-1",
          "label": "8",
          "handshape": "8",
          "orientation": "palm_forward",
          "position": {
            "x": 92,
            "y": 55
          }
        }
      ],
      "startPosition": {
        "x": 68,
        "y": 55
      },
      "endPosition": {
        "x": 92,
        "y": 55
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1100,
      "motionTag": "motion"
    },
    "tokens": [
      {
        "id": "t-18-0",
        "label": "1",
        "handshape": "1",
        "orientation": "palm_forward",
        "position": {
          "x": 68,
          "y": 55
        }
      },
      {
        "id": "t-18-1",
        "label": "8",
        "handshape": "8",
        "orientation": "palm_forward",
        "position": {
          "x": 92,
          "y": 55
        }
      }
    ],
    "steps": [
      "Sign number 1 with index finger upright, palm facing forward.",
      "Quickly transition to number 8 with palm facing forward.",
      "The two digits are signed quickly and smoothly in neutral space."
    ],
    "tip": "Numbers 16-19 in ASL are signed quickly as the two digits (1 then 8) or twisting from 10 into 8."
  },
  {
    "id": "num-19",
    "label": "Number 19",
    "category": "numbers",
    "level": "intermediate",
    "order": 19,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/19.svg",
      "alt": "ASL sign for number 19"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "9",
      "tokens": [
        {
          "id": "t-19-0",
          "label": "1",
          "handshape": "1",
          "orientation": "palm_forward",
          "position": {
            "x": 68,
            "y": 55
          }
        },
        {
          "id": "t-19-1",
          "label": "9",
          "handshape": "9",
          "orientation": "palm_forward",
          "position": {
            "x": 92,
            "y": 55
          }
        }
      ],
      "startPosition": {
        "x": 68,
        "y": 55
      },
      "endPosition": {
        "x": 92,
        "y": 55
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1100,
      "motionTag": "motion"
    },
    "tokens": [
      {
        "id": "t-19-0",
        "label": "1",
        "handshape": "1",
        "orientation": "palm_forward",
        "position": {
          "x": 68,
          "y": 55
        }
      },
      {
        "id": "t-19-1",
        "label": "9",
        "handshape": "9",
        "orientation": "palm_forward",
        "position": {
          "x": 92,
          "y": 55
        }
      }
    ],
    "steps": [
      "Sign number 1 with index finger upright, palm facing forward.",
      "Quickly transition to number 9 with palm facing forward.",
      "The two digits are signed quickly and smoothly in neutral space."
    ],
    "tip": "Numbers 16-19 in ASL are signed quickly as the two digits (1 then 9) or twisting from 10 into 9."
  },
  {
    "id": "num-20",
    "label": "Number 20",
    "category": "numbers",
    "level": "intermediate",
    "order": 20,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/20.svg",
      "alt": "ASL sign for number 20"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "2",
      "tokens": [
        {
          "id": "t-20-0",
          "label": "2",
          "handshape": "2",
          "orientation": "palm_forward",
          "position": {
            "x": 68,
            "y": 55
          }
        },
        {
          "id": "t-20-1",
          "label": "0",
          "handshape": "0",
          "orientation": "palm_forward",
          "position": {
            "x": 92,
            "y": 55
          }
        }
      ],
      "startPosition": {
        "x": 68,
        "y": 55
      },
      "endPosition": {
        "x": 92,
        "y": 55
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1400,
      "motionTag": "motion"
    },
    "tokens": [
      {
        "id": "t-20-0",
        "label": "2",
        "handshape": "2",
        "orientation": "palm_forward",
        "position": {
          "x": 68,
          "y": 55
        }
      },
      {
        "id": "t-20-1",
        "label": "0",
        "handshape": "0",
        "orientation": "palm_forward",
        "position": {
          "x": 92,
          "y": 55
        }
      }
    ],
    "steps": [
      "Sign the first digit '2' with palm facing forward.",
      "Transition smoothly into '0' (oval 'O' shape), moving slightly to the right.",
      "Held in neutral space at shoulder height."
    ],
    "tip": "20 in ASL can be signed digit-by-digit (2 then 0) or by tapping thumb and index together ('pinched G')."
  },
  {
    "id": "num-30",
    "label": "Number 30",
    "category": "numbers",
    "level": "intermediate",
    "order": 30,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/30.svg",
      "alt": "ASL sign for number 30"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "3",
      "tokens": [
        {
          "id": "t-30-0",
          "label": "3",
          "handshape": "3",
          "orientation": "palm_forward",
          "position": {
            "x": 68,
            "y": 55
          }
        },
        {
          "id": "t-30-1",
          "label": "0",
          "handshape": "0",
          "orientation": "palm_forward",
          "position": {
            "x": 92,
            "y": 55
          }
        }
      ],
      "startPosition": {
        "x": 68,
        "y": 55
      },
      "endPosition": {
        "x": 92,
        "y": 55
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1500,
      "motionTag": "motion"
    },
    "tokens": [
      {
        "id": "t-30-0",
        "label": "3",
        "handshape": "3",
        "orientation": "palm_forward",
        "position": {
          "x": 68,
          "y": 55
        }
      },
      {
        "id": "t-30-1",
        "label": "0",
        "handshape": "0",
        "orientation": "palm_forward",
        "position": {
          "x": 92,
          "y": 55
        }
      }
    ],
    "steps": [
      "Sign the tens digit (3) with palm facing forward.",
      "Transition smoothly into an 'O' (0) handshape moving slightly to the right.",
      "Palm faces forward throughout in neutral space."
    ],
    "tip": "Tens ending in 0 transition smoothly from the tens digit into a zero with palm forward."
  },
  {
    "id": "num-40",
    "label": "Number 40",
    "category": "numbers",
    "level": "intermediate",
    "order": 40,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/40.svg",
      "alt": "ASL sign for number 40"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "4",
      "tokens": [
        {
          "id": "t-40-0",
          "label": "4",
          "handshape": "4",
          "orientation": "palm_forward",
          "position": {
            "x": 68,
            "y": 55
          }
        },
        {
          "id": "t-40-1",
          "label": "0",
          "handshape": "0",
          "orientation": "palm_forward",
          "position": {
            "x": 92,
            "y": 55
          }
        }
      ],
      "startPosition": {
        "x": 68,
        "y": 55
      },
      "endPosition": {
        "x": 92,
        "y": 55
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1500,
      "motionTag": "motion"
    },
    "tokens": [
      {
        "id": "t-40-0",
        "label": "4",
        "handshape": "4",
        "orientation": "palm_forward",
        "position": {
          "x": 68,
          "y": 55
        }
      },
      {
        "id": "t-40-1",
        "label": "0",
        "handshape": "0",
        "orientation": "palm_forward",
        "position": {
          "x": 92,
          "y": 55
        }
      }
    ],
    "steps": [
      "Sign the tens digit (4) with palm facing forward.",
      "Transition smoothly into an 'O' (0) handshape moving slightly to the right.",
      "Palm faces forward throughout in neutral space."
    ],
    "tip": "Tens ending in 0 transition smoothly from the tens digit into a zero with palm forward."
  },
  {
    "id": "num-50",
    "label": "Number 50",
    "category": "numbers",
    "level": "intermediate",
    "order": 50,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/50.svg",
      "alt": "ASL sign for number 50"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "5",
      "tokens": [
        {
          "id": "t-50-0",
          "label": "5",
          "handshape": "5",
          "orientation": "palm_forward",
          "position": {
            "x": 68,
            "y": 55
          }
        },
        {
          "id": "t-50-1",
          "label": "0",
          "handshape": "0",
          "orientation": "palm_forward",
          "position": {
            "x": 92,
            "y": 55
          }
        }
      ],
      "startPosition": {
        "x": 68,
        "y": 55
      },
      "endPosition": {
        "x": 92,
        "y": 55
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1500,
      "motionTag": "motion"
    },
    "tokens": [
      {
        "id": "t-50-0",
        "label": "5",
        "handshape": "5",
        "orientation": "palm_forward",
        "position": {
          "x": 68,
          "y": 55
        }
      },
      {
        "id": "t-50-1",
        "label": "0",
        "handshape": "0",
        "orientation": "palm_forward",
        "position": {
          "x": 92,
          "y": 55
        }
      }
    ],
    "steps": [
      "Sign the tens digit (5) with palm facing forward.",
      "Transition smoothly into an 'O' (0) handshape moving slightly to the right.",
      "Palm faces forward throughout in neutral space."
    ],
    "tip": "Tens ending in 0 transition smoothly from the tens digit into a zero with palm forward."
  },
  {
    "id": "num-60",
    "label": "Number 60",
    "category": "numbers",
    "level": "intermediate",
    "order": 60,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/60.svg",
      "alt": "ASL sign for number 60"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "6",
      "tokens": [
        {
          "id": "t-60-0",
          "label": "6",
          "handshape": "6",
          "orientation": "palm_forward",
          "position": {
            "x": 68,
            "y": 55
          }
        },
        {
          "id": "t-60-1",
          "label": "0",
          "handshape": "0",
          "orientation": "palm_forward",
          "position": {
            "x": 92,
            "y": 55
          }
        }
      ],
      "startPosition": {
        "x": 68,
        "y": 55
      },
      "endPosition": {
        "x": 92,
        "y": 55
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1500,
      "motionTag": "motion"
    },
    "tokens": [
      {
        "id": "t-60-0",
        "label": "6",
        "handshape": "6",
        "orientation": "palm_forward",
        "position": {
          "x": 68,
          "y": 55
        }
      },
      {
        "id": "t-60-1",
        "label": "0",
        "handshape": "0",
        "orientation": "palm_forward",
        "position": {
          "x": 92,
          "y": 55
        }
      }
    ],
    "steps": [
      "Sign the tens digit (6) with palm facing forward.",
      "Transition smoothly into an 'O' (0) handshape moving slightly to the right.",
      "Palm faces forward throughout in neutral space."
    ],
    "tip": "Tens ending in 0 transition smoothly from the tens digit into a zero with palm forward."
  },
  {
    "id": "num-70",
    "label": "Number 70",
    "category": "numbers",
    "level": "intermediate",
    "order": 70,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/70.svg",
      "alt": "ASL sign for number 70"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "7",
      "tokens": [
        {
          "id": "t-70-0",
          "label": "7",
          "handshape": "7",
          "orientation": "palm_forward",
          "position": {
            "x": 68,
            "y": 55
          }
        },
        {
          "id": "t-70-1",
          "label": "0",
          "handshape": "0",
          "orientation": "palm_forward",
          "position": {
            "x": 92,
            "y": 55
          }
        }
      ],
      "startPosition": {
        "x": 68,
        "y": 55
      },
      "endPosition": {
        "x": 92,
        "y": 55
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1500,
      "motionTag": "motion"
    },
    "tokens": [
      {
        "id": "t-70-0",
        "label": "7",
        "handshape": "7",
        "orientation": "palm_forward",
        "position": {
          "x": 68,
          "y": 55
        }
      },
      {
        "id": "t-70-1",
        "label": "0",
        "handshape": "0",
        "orientation": "palm_forward",
        "position": {
          "x": 92,
          "y": 55
        }
      }
    ],
    "steps": [
      "Sign the tens digit (7) with palm facing forward.",
      "Transition smoothly into an 'O' (0) handshape moving slightly to the right.",
      "Palm faces forward throughout in neutral space."
    ],
    "tip": "Tens ending in 0 transition smoothly from the tens digit into a zero with palm forward."
  },
  {
    "id": "num-80",
    "label": "Number 80",
    "category": "numbers",
    "level": "intermediate",
    "order": 80,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/80.svg",
      "alt": "ASL sign for number 80"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "8",
      "tokens": [
        {
          "id": "t-80-0",
          "label": "8",
          "handshape": "8",
          "orientation": "palm_forward",
          "position": {
            "x": 68,
            "y": 55
          }
        },
        {
          "id": "t-80-1",
          "label": "0",
          "handshape": "0",
          "orientation": "palm_forward",
          "position": {
            "x": 92,
            "y": 55
          }
        }
      ],
      "startPosition": {
        "x": 68,
        "y": 55
      },
      "endPosition": {
        "x": 92,
        "y": 55
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1500,
      "motionTag": "motion"
    },
    "tokens": [
      {
        "id": "t-80-0",
        "label": "8",
        "handshape": "8",
        "orientation": "palm_forward",
        "position": {
          "x": 68,
          "y": 55
        }
      },
      {
        "id": "t-80-1",
        "label": "0",
        "handshape": "0",
        "orientation": "palm_forward",
        "position": {
          "x": 92,
          "y": 55
        }
      }
    ],
    "steps": [
      "Sign the tens digit (8) with palm facing forward.",
      "Transition smoothly into an 'O' (0) handshape moving slightly to the right.",
      "Palm faces forward throughout in neutral space."
    ],
    "tip": "Tens ending in 0 transition smoothly from the tens digit into a zero with palm forward."
  },
  {
    "id": "num-90",
    "label": "Number 90",
    "category": "numbers",
    "level": "intermediate",
    "order": 90,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/90.svg",
      "alt": "ASL sign for number 90"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "9",
      "tokens": [
        {
          "id": "t-90-0",
          "label": "9",
          "handshape": "9",
          "orientation": "palm_forward",
          "position": {
            "x": 68,
            "y": 55
          }
        },
        {
          "id": "t-90-1",
          "label": "0",
          "handshape": "0",
          "orientation": "palm_forward",
          "position": {
            "x": 92,
            "y": 55
          }
        }
      ],
      "startPosition": {
        "x": 68,
        "y": 55
      },
      "endPosition": {
        "x": 92,
        "y": 55
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1500,
      "motionTag": "motion"
    },
    "tokens": [
      {
        "id": "t-90-0",
        "label": "9",
        "handshape": "9",
        "orientation": "palm_forward",
        "position": {
          "x": 68,
          "y": 55
        }
      },
      {
        "id": "t-90-1",
        "label": "0",
        "handshape": "0",
        "orientation": "palm_forward",
        "position": {
          "x": 92,
          "y": 55
        }
      }
    ],
    "steps": [
      "Sign the tens digit (9) with palm facing forward.",
      "Transition smoothly into an 'O' (0) handshape moving slightly to the right.",
      "Palm faces forward throughout in neutral space."
    ],
    "tip": "Tens ending in 0 transition smoothly from the tens digit into a zero with palm forward."
  },
  {
    "id": "word-aunt",
    "label": "Aunt",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Extended family",
    "order": 80,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/mom.svg",
      "alt": "ASL sign for Aunt"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "A",
      "startPosition": {
        "x": 122,
        "y": 58
      },
      "endPosition": {
        "x": 100,
        "y": 74
      },
      "path": "shake",
      "orientation": "palm_forward",
      "location": "chin",
      "repeat": "infinite",
      "durationMs": 1400,
      "motionTag": "motion",
      "startAnchor": "cheek",
      "endAnchor": "chin"
    },
    "steps": [
      "Form an 'A' handshape with your dominant hand.",
      "Hold hand near the jawline or chin (female sign region).",
      "Shake or twist wrist gently twice."
    ],
    "tip": "Female sign zone: 'A' hand near the chin/jaw.",
    "location": "chin"
  },
  {
    "id": "word-uncle",
    "label": "Uncle",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Extended family",
    "order": 81,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/dad.svg",
      "alt": "ASL sign for Uncle"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "U",
      "startPosition": {
        "x": 100,
        "y": 34
      },
      "endPosition": {
        "x": 100,
        "y": 34
      },
      "path": "shake",
      "orientation": "palm_forward",
      "location": "forehead",
      "repeat": "infinite",
      "durationMs": 1400,
      "motionTag": "motion",
      "startAnchor": "forehead",
      "endAnchor": "forehead"
    },
    "steps": [
      "Form a 'U' handshape (index and middle fingers held tight together).",
      "Hold hand near temple / forehead (male sign region).",
      "Twist wrist gently twice."
    ],
    "tip": "Male sign zone: 'U' hand near temple/forehead.",
    "location": "forehead"
  },
  {
    "id": "word-cousin",
    "label": "Cousin",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Extended family",
    "order": 82,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/friend.svg",
      "alt": "ASL sign for Cousin"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "C",
      "startPosition": {
        "x": 122,
        "y": 58
      },
      "endPosition": {
        "x": 100,
        "y": 34
      },
      "path": "shake",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1400,
      "motionTag": "motion",
      "startAnchor": "cheek",
      "endAnchor": "forehead"
    },
    "steps": [
      "Form a 'C' handshape with dominant hand.",
      "Hold near ear/temple level (or shake between forehead and chin for gender-neutral).",
      "Shake hand gently back and forth."
    ],
    "tip": "'C' hand shaking beside the head.",
    "location": "neutral_space"
  },
  {
    "id": "word-husband",
    "label": "Husband",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Extended family",
    "order": 83,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/dad.svg",
      "alt": "ASL sign for Husband"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "C",
      "startPosition": {
        "x": 100,
        "y": 34
      },
      "endPosition": {
        "x": 100,
        "y": 114
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "forehead",
      "repeat": "infinite",
      "durationMs": 1800,
      "motionTag": "motion",
      "startAnchor": "forehead",
      "endAnchor": "chest"
    },
    "steps": [
      "Touch forehead with curved hand (Male sign marker).",
      "Bring hand down into neutral space.",
      "Clasp both hands together firmly like holding hands in marriage."
    ],
    "tip": "Male marker (forehead) + clasp hands (marriage).",
    "location": "forehead"
  },
  {
    "id": "word-wife",
    "label": "Wife",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Extended family",
    "order": 84,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/mom.svg",
      "alt": "ASL sign for Wife"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "C",
      "startPosition": {
        "x": 100,
        "y": 74
      },
      "endPosition": {
        "x": 100,
        "y": 114
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "chin",
      "repeat": "infinite",
      "durationMs": 1800,
      "motionTag": "motion",
      "startAnchor": "chin",
      "endAnchor": "chest"
    },
    "steps": [
      "Touch chin with curved fingertips (Female sign marker).",
      "Bring hand down into neutral space.",
      "Clasp both hands together firmly like holding hands in marriage."
    ],
    "tip": "Female marker (chin) + clasp hands (marriage).",
    "location": "chin"
  },
  {
    "id": "word-partner",
    "label": "Boyfriend/Girlfriend",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Extended family",
    "order": 85,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/friend.svg",
      "alt": "ASL sign for Boyfriend/Girlfriend"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "V",
      "startPosition": {
        "x": 75,
        "y": 65
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "tap",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1800,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Start with male (forehead) or female (chin) gesture.",
      "Transition smoothly into the 'Friend' interlocking sign.",
      "Alternatively, tap modified index fingers together denoting dating partner."
    ],
    "tip": "Boy/Girl marker leading into the interlocking Friend sign.",
    "location": "neutral_space"
  },
  {
    "id": "word-neighbor",
    "label": "Neighbor",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Extended family",
    "order": 86,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/friend.svg",
      "alt": "ASL sign for Neighbor"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "B",
      "startPosition": {
        "x": 75,
        "y": 65
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "arc",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1700,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Hold curved non-dominant hand in front.",
      "Bring dominant curved hand right beside it indicating 'Near'.",
      "Add the person/agent marker (hands dropping down sides)."
    ],
    "tip": "Near + Person marker = Neighbor.",
    "location": "neutral_space"
  },
  {
    "id": "word-home",
    "label": "Home",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Home and school",
    "order": 87,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/home.svg",
      "alt": "ASL sign for Home"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "O",
      "startPosition": {
        "x": 100,
        "y": 74
      },
      "endPosition": {
        "x": 122,
        "y": 58
      },
      "path": "line",
      "orientation": "palm_inward",
      "location": "chin",
      "repeat": "infinite",
      "durationMs": 1700,
      "motionTag": "motion",
      "startAnchor": "chin",
      "endAnchor": "cheek"
    },
    "steps": [
      "Form a flattened 'O' handshape with fingertips touching thumb.",
      "Touch fingertips to the side of your chin.",
      "Move hand up and touch near upper cheek/ear."
    ],
    "tip": "Combines Eat (chin/mouth) + Sleep (cheek) = Home.",
    "location": "chin"
  },
  {
    "id": "word-school",
    "label": "School",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Home and school",
    "order": 88,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/school.svg",
      "alt": "ASL sign for School"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "B",
      "startPosition": {
        "x": 75,
        "y": 65
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "tap",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1400,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Hold non-dominant hand flat, palm facing up.",
      "Clap dominant flat hand down onto non-dominant palm twice.",
      "Movement is crisp like a teacher clapping chalkboards."
    ],
    "tip": "Two flat-palm claps horizontally.",
    "location": "neutral_space"
  },
  {
    "id": "word-teacher",
    "label": "Teacher",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Home and school",
    "order": 89,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/school.svg",
      "alt": "ASL sign for Teacher"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "O",
      "startPosition": {
        "x": 100,
        "y": 34
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "forehead",
      "repeat": "infinite",
      "durationMs": 1800,
      "motionTag": "motion",
      "startAnchor": "forehead",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Hold flat-O hands near temples and move forward (Teach sign).",
      "Transition hands into flat open palms moving downward (Person marker).",
      "Combines Teach + Person."
    ],
    "tip": "Teach + Person marker = Teacher.",
    "location": "forehead"
  },
  {
    "id": "word-student",
    "label": "Student",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Home and school",
    "order": 90,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/school.svg",
      "alt": "ASL sign for Student"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "O",
      "startPosition": {
        "x": 75,
        "y": 65
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1800,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Lift information from flat non-dominant palm to forehead (Learn).",
      "Drop flat open palms down along torso (Person marker).",
      "Combines Learn + Person."
    ],
    "tip": "Learn + Person marker = Student.",
    "location": "neutral_space"
  },
  {
    "id": "word-book",
    "label": "Book",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Home and school",
    "order": 91,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/school.svg",
      "alt": "ASL sign for Book"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "B",
      "startPosition": {
        "x": 75,
        "y": 65
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "arc",
      "orientation": "palm_up",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1500,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Press flat palms together with pinky edges facing down.",
      "Hinge hands open keeping pinky edges touching.",
      "Imitates opening a book."
    ],
    "tip": "Hands open like cover and pages of a book.",
    "location": "neutral_space"
  },
  {
    "id": "word-learn",
    "label": "Learn",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Home and school",
    "order": 92,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/school.svg",
      "alt": "ASL sign for Learn"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "O",
      "startPosition": {
        "x": 75,
        "y": 65
      },
      "endPosition": {
        "x": 100,
        "y": 34
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1600,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "forehead"
    },
    "steps": [
      "Hold non-dominant palm flat like a page.",
      "Pinch dominant fingers lifting knowledge from palm.",
      "Place fingertips against your forehead."
    ],
    "tip": "Lifting knowledge from a book into your brain.",
    "location": "neutral_space"
  },
  {
    "id": "word-work",
    "label": "Work",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Home and school",
    "order": 93,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/work.svg",
      "alt": "ASL sign for Work"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "S",
      "startPosition": {
        "x": 78,
        "y": 104
      },
      "endPosition": {
        "x": 78,
        "y": 104
      },
      "path": "tap",
      "orientation": "palm_forward",
      "location": "wrist",
      "repeat": "infinite",
      "durationMs": 1400,
      "motionTag": "motion",
      "startAnchor": "wrist",
      "endAnchor": "wrist"
    },
    "steps": [
      "Make fists with both hands ('S' handshapes), palms facing down.",
      "Tap the heel/wrist of dominant fist onto back of non-dominant wrist.",
      "Tap twice firmly."
    ],
    "tip": "Fist tapping onto the back of the other wrist.",
    "location": "wrist"
  },
  {
    "id": "word-friend-group",
    "label": "Friend Group",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Home and school",
    "order": 94,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/friend.svg",
      "alt": "ASL sign for Friend Group"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "G",
      "startPosition": {
        "x": 75,
        "y": 65
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "circle",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1800,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Sign 'Friend' by hooking index fingers.",
      "Circle both hands in a horizontal circle in front of you.",
      "Represents a collective circle of friends."
    ],
    "tip": "Friend sign + circular group sweep.",
    "location": "neutral_space"
  },
  {
    "id": "word-class",
    "label": "Class",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Home and school",
    "order": 95,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/school.svg",
      "alt": "ASL sign for Class"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "C",
      "startPosition": {
        "x": 100,
        "y": 114
      },
      "endPosition": {
        "x": 100,
        "y": 114
      },
      "path": "circle",
      "orientation": "palm_forward",
      "location": "chest",
      "repeat": "infinite",
      "durationMs": 1700,
      "motionTag": "motion",
      "startAnchor": "chest",
      "endAnchor": "chest"
    },
    "steps": [
      "Form 'C' handshapes with both hands touching index fingers/thumbs in front.",
      "Sweep both hands outward in a horizontal circle.",
      "Bring pinky edges together at the end of the circle."
    ],
    "tip": "Both 'C' hands circle outward together.",
    "location": "chest"
  },
  {
    "id": "word-eat",
    "label": "Eat",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Food and drink",
    "order": 96,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/eat.svg",
      "alt": "ASL sign for Eat"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "O",
      "startPosition": {
        "x": 100,
        "y": 70
      },
      "endPosition": {
        "x": 100,
        "y": 70
      },
      "path": "tap",
      "orientation": "palm_inward",
      "location": "chin",
      "repeat": "infinite",
      "durationMs": 1300,
      "motionTag": "motion",
      "startAnchor": "chin/lips",
      "endAnchor": "chin/lips"
    },
    "steps": [
      "Form flattened 'O' handshape with all fingertips touching thumb.",
      "Tap fingertips against your mouth/lips twice.",
      "Single tap means 'Eat'; double tap means 'Food'."
    ],
    "tip": "Direct feeding motion to mouth.",
    "location": "chin"
  },
  {
    "id": "word-drink",
    "label": "Drink",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Food and drink",
    "order": 97,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/drink.svg",
      "alt": "ASL sign for Drink"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "C",
      "startPosition": {
        "x": 100,
        "y": 70
      },
      "endPosition": {
        "x": 100,
        "y": 70
      },
      "path": "arc",
      "orientation": "facing_side",
      "location": "chin",
      "repeat": "infinite",
      "durationMs": 1400,
      "motionTag": "motion",
      "startAnchor": "chin/lips",
      "endAnchor": "chin/lips"
    },
    "steps": [
      "Form a 'C' handshape like holding a small cup.",
      "Tip hand upward toward mouth like drinking from a glass.",
      "Tilt head slightly back."
    ],
    "tip": "Natural cup-drinking movement.",
    "location": "chin"
  },
  {
    "id": "word-water",
    "label": "Water",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Food and drink",
    "order": 98,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/water.svg",
      "alt": "ASL sign for Water"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "W",
      "startPosition": {
        "x": 100,
        "y": 70
      },
      "endPosition": {
        "x": 100,
        "y": 70
      },
      "path": "tap",
      "orientation": "facing_side",
      "location": "chin",
      "repeat": "infinite",
      "durationMs": 1300,
      "motionTag": "motion",
      "startAnchor": "chin/lips",
      "endAnchor": "chin/lips"
    },
    "steps": [
      "Form a 'W' handshape with dominant hand (index, middle, ring fingers up).",
      "Touch side of index finger to the center of your chin.",
      "Tap chin twice lightly."
    ],
    "tip": "'W' handshape taps chin twice.",
    "location": "chin"
  },
  {
    "id": "word-milk",
    "label": "Milk",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Food and drink",
    "order": 99,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/drink.svg",
      "alt": "ASL sign for Milk"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "S",
      "startPosition": {
        "x": 75,
        "y": 65
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "shake",
      "orientation": "facing_side",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1300,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Hold dominant hand in neutral space with fingers extended slightly.",
      "Squeeze hand into an 'S' fist twice like milking a cow.",
      "Keep wrist steady."
    ],
    "tip": "Two gentle rhythmic squeezes of the fist.",
    "location": "neutral_space"
  },
  {
    "id": "word-food",
    "label": "Food",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Food and drink",
    "order": 100,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/eat.svg",
      "alt": "ASL sign for Food"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "O",
      "startPosition": {
        "x": 100,
        "y": 70
      },
      "endPosition": {
        "x": 100,
        "y": 70
      },
      "path": "tap",
      "orientation": "palm_inward",
      "location": "chin",
      "repeat": "infinite",
      "durationMs": 1400,
      "motionTag": "motion",
      "startAnchor": "chin/lips",
      "endAnchor": "chin/lips"
    },
    "steps": [
      "Form flat-O handshape with dominant hand.",
      "Double-tap fingertips to lips.",
      "Double tap distinguishes the noun 'Food' from verb 'Eat'."
    ],
    "tip": "Double tap = Food (noun); Single tap = Eat (verb).",
    "location": "chin"
  },
  {
    "id": "word-hungry",
    "label": "Hungry",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Food and drink",
    "order": 101,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/eat.svg",
      "alt": "ASL sign for Hungry"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "C",
      "startPosition": {
        "x": 100,
        "y": 114
      },
      "endPosition": {
        "x": 100,
        "y": 114
      },
      "path": "line",
      "orientation": "palm_inward",
      "location": "chest",
      "repeat": "infinite",
      "durationMs": 1500,
      "motionTag": "motion",
      "startAnchor": "chest",
      "endAnchor": "chest"
    },
    "steps": [
      "Form a 'C' handshape with dominant hand facing chest.",
      "Place fingers below collarbone.",
      "Slide hand downward along center of chest toward stomach."
    ],
    "tip": "'C' hand sliding down toward the stomach.",
    "location": "chest"
  },
  {
    "id": "word-thirsty",
    "label": "Thirsty",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Food and drink",
    "order": 102,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/water.svg",
      "alt": "ASL sign for Thirsty"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "1",
      "startPosition": {
        "x": 100,
        "y": 74
      },
      "endPosition": {
        "x": 100,
        "y": 114
      },
      "path": "line",
      "orientation": "palm_inward",
      "location": "chin",
      "repeat": "infinite",
      "durationMs": 1500,
      "motionTag": "motion",
      "startAnchor": "chin",
      "endAnchor": "chest"
    },
    "steps": [
      "Extend dominant index finger pointing at throat.",
      "Trace index fingertip down from chin along throat.",
      "Mouth or express thirst."
    ],
    "tip": "Index finger tracing a dry throat downward.",
    "location": "chin"
  },
  {
    "id": "word-coffee",
    "label": "Coffee",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Food and drink",
    "order": 103,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/drink.svg",
      "alt": "ASL sign for Coffee"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "S",
      "startPosition": {
        "x": 75,
        "y": 65
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "circle",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1600,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Hold non-dominant fist stationary in front like a coffee grinder base.",
      "Place dominant fist on top of non-dominant fist.",
      "Rotate dominant fist in circular grinding motions."
    ],
    "tip": "Simulates turning an old-fashioned coffee grinder crank.",
    "location": "neutral_space"
  },
  {
    "id": "word-bread",
    "label": "Bread",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Food and drink",
    "order": 104,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/eat.svg",
      "alt": "ASL sign for Bread"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "B",
      "startPosition": {
        "x": 75,
        "y": 65
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "tap",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1500,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Hold non-dominant arm across body like a loaf of bread.",
      "Slice fingertips of dominant curved hand downward along back of arm.",
      "Make two downward slicing cuts."
    ],
    "tip": "Slicing across a loaf of bread.",
    "location": "neutral_space"
  },
  {
    "id": "word-tired",
    "label": "Tired",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Feelings and states",
    "order": 105,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/sad.svg",
      "alt": "ASL sign for Tired"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "B",
      "startPosition": {
        "x": 100,
        "y": 114
      },
      "endPosition": {
        "x": 100,
        "y": 114
      },
      "path": "arc",
      "orientation": "palm_inward",
      "location": "chest",
      "repeat": "infinite",
      "durationMs": 1600,
      "motionTag": "motion",
      "startAnchor": "chest",
      "endAnchor": "chest"
    },
    "steps": [
      "Place bent fingertips of both hands on chest near shoulders.",
      "Roll wrists and elbows down so hands droop downward.",
      "Slump shoulders slightly and exhale weariness."
    ],
    "tip": "Hands and posture droop with fatigue.",
    "location": "chest"
  },
  {
    "id": "word-angry",
    "label": "Angry",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Feelings and states",
    "order": 106,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/bad.svg",
      "alt": "ASL sign for Angry"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "5",
      "startPosition": {
        "x": 100,
        "y": 74
      },
      "endPosition": {
        "x": 100,
        "y": 34
      },
      "path": "arc",
      "orientation": "palm_inward",
      "location": "forehead",
      "repeat": "infinite",
      "durationMs": 1500,
      "motionTag": "motion",
      "startAnchor": "chin",
      "endAnchor": "forehead"
    },
    "steps": [
      "Form a claw handshape with curved fingers near face.",
      "Pull hand abruptly outward while flexing fingers.",
      "Show strong angry facial expression with furrowed brow."
    ],
    "tip": "Claw pulls away from face with a scowl.",
    "location": "forehead"
  },
  {
    "id": "word-excited",
    "label": "Excited",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Feelings and states",
    "order": 107,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/happy.svg",
      "alt": "ASL sign for Excited"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "8",
      "startPosition": {
        "x": 100,
        "y": 114
      },
      "endPosition": {
        "x": 100,
        "y": 114
      },
      "path": "circle",
      "orientation": "palm_inward",
      "location": "chest",
      "repeat": "infinite",
      "durationMs": 1400,
      "motionTag": "motion",
      "startAnchor": "chest",
      "endAnchor": "chest"
    },
    "steps": [
      "Extend both hands with middle fingers bent forward slightly ('open 8' handshape).",
      "Brush upward across chest in alternating energetic circles.",
      "Display vibrant energetic smile."
    ],
    "tip": "Alternating upward circles on the chest.",
    "location": "chest"
  },
  {
    "id": "word-sick",
    "label": "Sick",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Feelings and states",
    "order": 108,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/sad.svg",
      "alt": "ASL sign for Sick"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "8",
      "startPosition": {
        "x": 100,
        "y": 34
      },
      "endPosition": {
        "x": 100,
        "y": 114
      },
      "path": "tap",
      "orientation": "palm_inward",
      "location": "forehead",
      "repeat": "infinite",
      "durationMs": 1600,
      "motionTag": "motion",
      "startAnchor": "forehead",
      "endAnchor": "chest"
    },
    "steps": [
      "Touch bent middle finger of dominant hand to forehead.",
      "Simultaneously touch bent middle finger of non-dominant hand to stomach.",
      "Twist or press slightly with a pained facial expression."
    ],
    "tip": "Middle fingers touch head (headache) and stomach (nausea).",
    "location": "forehead"
  },
  {
    "id": "word-hot",
    "label": "Hot",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Feelings and states",
    "order": 109,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/bad.svg",
      "alt": "ASL sign for Hot"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "C",
      "startPosition": {
        "x": 100,
        "y": 70
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "forward",
      "orientation": "palm_inward",
      "location": "chin",
      "repeat": "infinite",
      "durationMs": 1400,
      "motionTag": "motion",
      "startAnchor": "chin/lips",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Form a 'C' claw hand over mouth as if holding hot food.",
      "Quickly flick hand outward and away turning palm down.",
      "Facial expression mimics spitting out hot food."
    ],
    "tip": "Hand snaps away from mouth like ejecting something hot.",
    "location": "chin"
  },
  {
    "id": "word-cold",
    "label": "Cold",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Feelings and states",
    "order": 110,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/sad.svg",
      "alt": "ASL sign for Cold"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "S",
      "startPosition": {
        "x": 100,
        "y": 114
      },
      "endPosition": {
        "x": 100,
        "y": 114
      },
      "path": "shake",
      "orientation": "palm_forward",
      "location": "chest",
      "repeat": "infinite",
      "durationMs": 1300,
      "motionTag": "motion",
      "startAnchor": "chest",
      "endAnchor": "chest"
    },
    "steps": [
      "Make 'S' fists with both hands near chest.",
      "Pull elbows in tight.",
      "Shiver and shake both fists rapidly like freezing cold."
    ],
    "tip": "Natural shivering motion with both fists.",
    "location": "chest"
  },
  {
    "id": "word-hurt",
    "label": "Hurt",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Feelings and states",
    "order": 111,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/bad.svg",
      "alt": "ASL sign for Hurt"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "1",
      "startPosition": {
        "x": 75,
        "y": 65
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "tap",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1400,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Point both index fingers toward each other with fingertip gap.",
      "Twist wrists in opposite directions pushing fingertips toward each other.",
      "Can be placed near location of pain (e.g. head, stomach)."
    ],
    "tip": "Twisting index fingers facing each other.",
    "location": "neutral_space"
  },
  {
    "id": "word-today",
    "label": "Today",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Time and places",
    "order": 112,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/today.svg",
      "alt": "ASL sign for Today"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "Y",
      "startPosition": {
        "x": 75,
        "y": 65
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "tap",
      "orientation": "palm_up",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1400,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Form 'Y' handshapes with both hands (thumb and pinky extended).",
      "Drop both hands downward twice in front of you.",
      "Represents 'Now + Day'."
    ],
    "tip": "Two downward drops with 'Y' hands.",
    "location": "neutral_space"
  },
  {
    "id": "word-tomorrow",
    "label": "Tomorrow",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Time and places",
    "order": 113,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/tomorrow.svg",
      "alt": "ASL sign for Tomorrow"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "10",
      "startPosition": {
        "x": 100,
        "y": 74
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "arc",
      "orientation": "palm_forward",
      "location": "chin",
      "repeat": "infinite",
      "durationMs": 1500,
      "motionTag": "motion",
      "startAnchor": "chin",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Form an 'A' fist with thumb extended upward.",
      "Touch thumb tip to your cheek or jawline.",
      "Rotate hand forward in an arc toward the future."
    ],
    "tip": "ASL Timeline: Forward motion = future / tomorrow.",
    "location": "chin"
  },
  {
    "id": "word-yesterday",
    "label": "Yesterday",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Time and places",
    "order": 114,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/yesterday.svg",
      "alt": "ASL sign for Yesterday"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "10",
      "startPosition": {
        "x": 100,
        "y": 74
      },
      "endPosition": {
        "x": 122,
        "y": 58
      },
      "path": "arc",
      "orientation": "palm_forward",
      "location": "chin",
      "repeat": "infinite",
      "durationMs": 1500,
      "motionTag": "motion",
      "startAnchor": "chin",
      "endAnchor": "cheek"
    },
    "steps": [
      "Form a 'Y' or 'A' handshape with thumb out.",
      "Touch thumb to chin or lower jaw.",
      "Move thumb backward to touch near the ear/cheek."
    ],
    "tip": "ASL Timeline: Backward motion = past / yesterday.",
    "location": "chin"
  },
  {
    "id": "word-now",
    "label": "Now",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Time and places",
    "order": 115,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/today.svg",
      "alt": "ASL sign for Now"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "Y",
      "startPosition": {
        "x": 75,
        "y": 65
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "tap",
      "orientation": "palm_up",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1300,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Form 'Y' hands (or bent flat palms) in front of chest.",
      "Drop hands down once sharply.",
      "Indicates present immediacy."
    ],
    "tip": "One decisive downward drop.",
    "location": "neutral_space"
  },
  {
    "id": "word-later",
    "label": "Later",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Time and places",
    "order": 116,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/tomorrow.svg",
      "alt": "ASL sign for Later"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "L",
      "startPosition": {
        "x": 75,
        "y": 65
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "arc",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1500,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Form an 'L' handshape with dominant hand.",
      "Tilt wrist so index finger points forward like clock hands.",
      "Move hand forward into the future."
    ],
    "tip": "'L' hand rotates forward like hands on a clock.",
    "location": "neutral_space"
  },
  {
    "id": "word-bathroom",
    "label": "Bathroom",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Time and places",
    "order": 117,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/bathroom.svg",
      "alt": "ASL sign for Bathroom"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "T",
      "startPosition": {
        "x": 75,
        "y": 65
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "shake",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1400,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Form a 'T' handshape (thumb poking between index and middle fingers).",
      "Hold hand at shoulder height.",
      "Shake hand side-to-side twice."
    ],
    "tip": "Letter 'T' (toilet) shaken side to side.",
    "location": "neutral_space"
  },
  {
    "id": "word-hospital",
    "label": "Hospital",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Time and places",
    "order": 118,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/help.svg",
      "alt": "ASL sign for Hospital"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "H",
      "startPosition": {
        "x": 48,
        "y": 106
      },
      "endPosition": {
        "x": 48,
        "y": 106
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "shoulder",
      "repeat": "infinite",
      "durationMs": 1600,
      "motionTag": "motion",
      "startAnchor": "shoulder",
      "endAnchor": "shoulder"
    },
    "steps": [
      "Form an 'H' handshape with dominant index and middle fingers together.",
      "Draw a vertical line on non-dominant upper arm.",
      "Draw a horizontal crossbar creating a medical cross symbol."
    ],
    "tip": "Draws a Red Cross on the shoulder with 'H' fingers.",
    "location": "shoulder"
  },
  {
    "id": "word-store",
    "label": "Store",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Time and places",
    "order": 119,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/school.svg",
      "alt": "ASL sign for Store"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "O",
      "startPosition": {
        "x": 75,
        "y": 65
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "shake",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1500,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Form flattened 'O' shapes with both hands pointing downward.",
      "Pivot wrists swinging fingertips forward and outward twice.",
      "Imitates displaying goods in a market."
    ],
    "tip": "Double forward wrist swing with fingertips down.",
    "location": "neutral_space"
  },
  {
    "id": "word-what",
    "label": "What",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Question words",
    "order": 120,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/what.svg",
      "alt": "ASL sign for What"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "5",
      "startPosition": {
        "x": 75,
        "y": 65
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "shake",
      "orientation": "palm_up",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1400,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Hold both open palms up at waist/chest height.",
      "Shake hands side to side across each other.",
      "Furrow brows for WH-question grammar."
    ],
    "tip": "WH-Question rule: Furrow your eyebrows.",
    "location": "neutral_space"
  },
  {
    "id": "word-where",
    "label": "Where",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Question words",
    "order": 121,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/where.svg",
      "alt": "ASL sign for Where"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "1",
      "startPosition": {
        "x": 75,
        "y": 65
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "shake",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1300,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Hold dominant index finger pointing upward.",
      "Wiggle/pivot finger side to side like searching.",
      "Furrow eyebrows."
    ],
    "tip": "Index finger pivots side to side with furrowed brow.",
    "location": "neutral_space"
  },
  {
    "id": "word-who",
    "label": "Who",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Question words",
    "order": 122,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/where.svg",
      "alt": "ASL sign for Who"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "1",
      "startPosition": {
        "x": 100,
        "y": 70
      },
      "endPosition": {
        "x": 100,
        "y": 70
      },
      "path": "circle",
      "orientation": "palm_forward",
      "location": "chin",
      "repeat": "infinite",
      "durationMs": 1300,
      "motionTag": "motion",
      "startAnchor": "chin/lips",
      "endAnchor": "chin/lips"
    },
    "steps": [
      "Place thumb of index-extended hand against center of chin.",
      "Wiggle/bend index finger up and down like a questioning beak.",
      "Furrow brows with puckered lips."
    ],
    "tip": "Thumb on chin while index finger wiggles.",
    "location": "chin"
  },
  {
    "id": "word-when",
    "label": "When",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Question words",
    "order": 123,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/where.svg",
      "alt": "ASL sign for When"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "1",
      "startPosition": {
        "x": 75,
        "y": 65
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "circle",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1600,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Hold non-dominant index finger pointed up as clock center.",
      "Circle dominant index finger clockwise around it.",
      "Land dominant fingertip on non-dominant fingertip."
    ],
    "tip": "Circle around non-dominant index finger like a clock hand.",
    "location": "neutral_space"
  },
  {
    "id": "word-why",
    "label": "Why",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Question words",
    "order": 124,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/where.svg",
      "alt": "ASL sign for Why"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "Y",
      "startPosition": {
        "x": 100,
        "y": 34
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "forward",
      "orientation": "palm_forward",
      "location": "forehead",
      "repeat": "infinite",
      "durationMs": 1600,
      "motionTag": "motion",
      "startAnchor": "forehead",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Touch fingertips of flat hand to forehead.",
      "Pull hand outward away from forehead while collapsing to a 'Y' handshape.",
      "Furrow brows in inquiry."
    ],
    "tip": "Pulls away from forehead into a 'Y' handshape.",
    "location": "forehead"
  },
  {
    "id": "word-how",
    "label": "How",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Question words",
    "order": 125,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/where.svg",
      "alt": "ASL sign for How"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "B",
      "startPosition": {
        "x": 100,
        "y": 114
      },
      "endPosition": {
        "x": 100,
        "y": 114
      },
      "path": "arc",
      "orientation": "palm_inward",
      "location": "chest",
      "repeat": "infinite",
      "durationMs": 1500,
      "motionTag": "motion",
      "startAnchor": "chest",
      "endAnchor": "chest"
    },
    "steps": [
      "Place curved hands together with knuckles facing down.",
      "Roll both hands upward and outward so palms face up.",
      "Tilt head with furrowed brows."
    ],
    "tip": "Hands roll upward together ending palms up.",
    "location": "chest"
  },

  /* ── NEW LESSONS: Colors (Beginner) ─────────────────────────────── */
  {
    "id": "word-red",
    "label": "Red",
    "category": "greetings",
    "level": "beginner",
    "theme": "Colors",
    "order": 126,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/hello.svg",
      "alt": "ASL sign for Red"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "index_point",
      "startPosition": { "x": 100, "y": 74 },
      "endPosition": { "x": 100, "y": 90 },
      "path": "line",
      "orientation": "palm_inward",
      "location": "lips",
      "repeat": "infinite",
      "durationMs": 1400,
      "motionTag": "motion",
      "startAnchor": "lips",
      "endAnchor": "chin"
    },
    "steps": [
      "Extend index finger and touch your lower lip.",
      "Drag fingertip downward across the lip once.",
      "The motion symbolises the red colour of the lips."
    ],
    "tip": "Index finger strokes down from the lips — think of lipstick red.",
    "location": "lips"
  },
  {
    "id": "word-blue",
    "label": "Blue",
    "category": "greetings",
    "level": "beginner",
    "theme": "Colors",
    "order": 127,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/hello.svg",
      "alt": "ASL sign for Blue"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "flat_palm",
      "startPosition": { "x": 80, "y": 65 },
      "endPosition": { "x": 80, "y": 65 },
      "path": "shake",
      "orientation": "facing_side",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1400,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Form a 'B' handshape with fingers together.",
      "Hold hand in neutral space with palm facing outward.",
      "Twist wrist back and forth twice (like shaking the letter B)."
    ],
    "tip": "B-handshape twisted in neutral space — B for Blue.",
    "location": "neutral_space"
  },
  {
    "id": "word-green",
    "label": "Green",
    "category": "greetings",
    "level": "beginner",
    "theme": "Colors",
    "order": 128,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/hello.svg",
      "alt": "ASL sign for Green"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "pinched_g",
      "startPosition": { "x": 80, "y": 65 },
      "endPosition": { "x": 80, "y": 65 },
      "path": "shake",
      "orientation": "facing_side",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1400,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Form a 'G' handshape (index finger and thumb extended parallel).",
      "Hold hand in neutral space.",
      "Twist wrist back and forth twice (like shaking the letter G)."
    ],
    "tip": "G-handshape twisted in neutral space — G for Green.",
    "location": "neutral_space"
  },
  {
    "id": "word-yellow",
    "label": "Yellow",
    "category": "greetings",
    "level": "beginner",
    "theme": "Colors",
    "order": 129,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/hello.svg",
      "alt": "ASL sign for Yellow"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "v_shape",
      "startPosition": { "x": 80, "y": 65 },
      "endPosition": { "x": 80, "y": 65 },
      "path": "shake",
      "orientation": "facing_side",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1400,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Form a 'Y' handshape (thumb and pinky extended, other fingers closed).",
      "Hold hand in neutral space.",
      "Twist wrist back and forth twice (like shaking the letter Y)."
    ],
    "tip": "Y-handshape twisted in neutral space — Y for Yellow.",
    "location": "neutral_space"
  },
  {
    "id": "word-orange-color",
    "label": "Orange (Color)",
    "category": "greetings",
    "level": "beginner",
    "theme": "Colors",
    "order": 130,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/hello.svg",
      "alt": "ASL sign for Orange"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "c_shape",
      "startPosition": { "x": 100, "y": 74 },
      "endPosition": { "x": 100, "y": 74 },
      "path": "tap",
      "orientation": "palm_inward",
      "location": "chin",
      "repeat": "infinite",
      "durationMs": 1400,
      "motionTag": "motion",
      "startAnchor": "chin",
      "endAnchor": "chin"
    },
    "steps": [
      "Form a 'C' or 'S' handshape near your chin.",
      "Squeeze hand open and closed near chin/mouth area.",
      "Repeat the squeezing motion twice — like squeezing an orange."
    ],
    "tip": "Squeezing motion near the chin — mimics squeezing an orange.",
    "location": "chin"
  },
  {
    "id": "word-black",
    "label": "Black",
    "category": "greetings",
    "level": "beginner",
    "theme": "Colors",
    "order": 131,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/hello.svg",
      "alt": "ASL sign for Black"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "index_point",
      "startPosition": { "x": 80, "y": 34 },
      "endPosition": { "x": 120, "y": 34 },
      "path": "line",
      "orientation": "palm_down",
      "location": "forehead",
      "repeat": "infinite",
      "durationMs": 1400,
      "motionTag": "motion",
      "startAnchor": "forehead",
      "endAnchor": "forehead"
    },
    "steps": [
      "Extend index finger with palm facing down.",
      "Place fingertip on your forehead.",
      "Slide finger across forehead from one side to the other."
    ],
    "tip": "Index finger slides across the forehead — traces the brow line.",
    "location": "forehead"
  },
  {
    "id": "word-white",
    "label": "White",
    "category": "greetings",
    "level": "beginner",
    "theme": "Colors",
    "order": 132,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/hello.svg",
      "alt": "ASL sign for White"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "open_5",
      "startPosition": { "x": 100, "y": 114 },
      "endPosition": { "x": 100, "y": 90 },
      "path": "line",
      "orientation": "palm_inward",
      "location": "chest",
      "repeat": "infinite",
      "durationMs": 1600,
      "motionTag": "motion",
      "startAnchor": "chest",
      "endAnchor": "chest"
    },
    "steps": [
      "Place open '5' hand on your chest with fingers spread.",
      "Pull hand away from chest while closing fingers together (into flat-O).",
      "The motion symbolises pulling the colour out of a white shirt."
    ],
    "tip": "Open hand on chest pulls away into a pinch — like pulling colour from a white shirt.",
    "location": "chest"
  },

  /* ── NEW LESSONS: Days of the Week (Intermediate) ─────────────── */
  {
    "id": "word-monday",
    "label": "Monday",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Days of the week",
    "order": 133,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/hello.svg",
      "alt": "ASL sign for Monday"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "flat_palm",
      "startPosition": { "x": 80, "y": 65 },
      "endPosition": { "x": 80, "y": 65 },
      "path": "circle",
      "orientation": "palm_inward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1600,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Form the letter 'M' handshape (thumb tucked under three fingers).",
      "Hold hand in neutral space, palm facing you.",
      "Move hand in a small circle or gentle bounce."
    ],
    "tip": "M-handshape with a small circular motion — M for Monday.",
    "location": "neutral_space"
  },
  {
    "id": "word-tuesday",
    "label": "Tuesday",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Days of the week",
    "order": 134,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/hello.svg",
      "alt": "ASL sign for Tuesday"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "fist_a",
      "startPosition": { "x": 80, "y": 65 },
      "endPosition": { "x": 80, "y": 65 },
      "path": "circle",
      "orientation": "palm_inward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1600,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Form the letter 'T' handshape (thumb tucked between index and middle fingers).",
      "Hold hand in neutral space, palm facing you.",
      "Move hand in a small circle or gentle bounce."
    ],
    "tip": "T-handshape with a small circular motion — T for Tuesday.",
    "location": "neutral_space"
  },
  {
    "id": "word-wednesday",
    "label": "Wednesday",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Days of the week",
    "order": 135,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/hello.svg",
      "alt": "ASL sign for Wednesday"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "flat_palm",
      "startPosition": { "x": 80, "y": 65 },
      "endPosition": { "x": 80, "y": 65 },
      "path": "circle",
      "orientation": "palm_inward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1600,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Form the letter 'W' handshape (index, middle, ring fingers spread upward).",
      "Hold hand in neutral space, palm facing you.",
      "Move hand in a small circle or gentle bounce."
    ],
    "tip": "W-handshape with a small circular motion — W for Wednesday.",
    "location": "neutral_space"
  },
  {
    "id": "word-thursday",
    "label": "Thursday",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Days of the week",
    "order": 136,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/hello.svg",
      "alt": "ASL sign for Thursday"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "flat_palm",
      "startPosition": { "x": 80, "y": 65 },
      "endPosition": { "x": 80, "y": 65 },
      "path": "circle",
      "orientation": "palm_inward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1600,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Form the letter 'H' handshape (index and middle fingers extended horizontally).",
      "Hold hand in neutral space, palm facing you.",
      "Move hand in a small circle or gentle bounce."
    ],
    "tip": "H-handshape with a circular motion — Thursday can also use 'TH' variant.",
    "needsReview": true,
    "location": "neutral_space"
  },
  {
    "id": "word-friday",
    "label": "Friday",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Days of the week",
    "order": 137,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/hello.svg",
      "alt": "ASL sign for Friday"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "index_point",
      "startPosition": { "x": 80, "y": 65 },
      "endPosition": { "x": 80, "y": 65 },
      "path": "circle",
      "orientation": "palm_inward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1600,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Form the letter 'F' handshape (index and thumb form a circle, other fingers up).",
      "Hold hand in neutral space, palm facing you.",
      "Move hand in a small circle or gentle bounce."
    ],
    "tip": "F-handshape with a small circular motion — F for Friday.",
    "location": "neutral_space"
  },
  {
    "id": "word-saturday",
    "label": "Saturday",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Days of the week",
    "order": 138,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/hello.svg",
      "alt": "ASL sign for Saturday"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "fist_a",
      "startPosition": { "x": 80, "y": 65 },
      "endPosition": { "x": 80, "y": 65 },
      "path": "circle",
      "orientation": "palm_inward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1600,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Form the letter 'S' handshape (fist with thumb across front of fingers).",
      "Hold hand in neutral space, palm facing you.",
      "Move hand in a small circle or gentle bounce."
    ],
    "tip": "S-handshape with a small circular motion — S for Saturday.",
    "location": "neutral_space"
  },
  {
    "id": "word-sunday",
    "label": "Sunday",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Days of the week",
    "order": 139,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/hello.svg",
      "alt": "ASL sign for Sunday"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "open_5",
      "startPosition": { "x": 75, "y": 55 },
      "endPosition": { "x": 75, "y": 75 },
      "path": "arc",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1800,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Hold both hands open with palms forward and fingers spread.",
      "Move both hands symmetrically in small outward circles.",
      "The motion is calm and expansive, symbolising a day of openness."
    ],
    "tip": "Both open palms circle outward gently — a calm, open gesture for Sunday.",
    "location": "neutral_space"
  },

  /* ── NEW LESSONS: Months (Intermediate) ───────────────────────── */
  {
    "id": "word-january",
    "label": "January",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Months",
    "order": 140,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/hello.svg",
      "alt": "ASL sign for January"
    },
    "motionTag": "motion",
    "needsReview": true,
    "animationSpec": {
      "handshape": "flat_palm",
      "startPosition": { "x": 75, "y": 55 },
      "endPosition": { "x": 75, "y": 75 },
      "path": "line",
      "orientation": "palm_inward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1800,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Fingerspell J-A-N or use the month sign variation.",
      "Some signers use a calendar-page-turning motion followed by the number 1.",
      "End with hands settled in neutral space."
    ],
    "tip": "Months are often fingerspelled in ASL; abbreviated forms vary by region.",
    "location": "neutral_space"
  },
  {
    "id": "word-february",
    "label": "February",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Months",
    "order": 141,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/hello.svg",
      "alt": "ASL sign for February"
    },
    "motionTag": "motion",
    "needsReview": true,
    "animationSpec": {
      "handshape": "flat_palm",
      "startPosition": { "x": 75, "y": 55 },
      "endPosition": { "x": 75, "y": 75 },
      "path": "line",
      "orientation": "palm_inward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1800,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Fingerspell F-E-B or use the month sign variation.",
      "Some signers use a calendar-page-turning motion followed by the number 2.",
      "End with hands settled in neutral space."
    ],
    "tip": "Months are often fingerspelled in ASL; abbreviated forms vary by region.",
    "location": "neutral_space"
  },
  {
    "id": "word-march",
    "label": "March",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Months",
    "order": 142,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/hello.svg",
      "alt": "ASL sign for March"
    },
    "motionTag": "motion",
    "needsReview": true,
    "animationSpec": {
      "handshape": "flat_palm",
      "startPosition": { "x": 75, "y": 55 },
      "endPosition": { "x": 75, "y": 75 },
      "path": "line",
      "orientation": "palm_inward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1800,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Fingerspell M-A-R-C-H or use the abbreviated month sign.",
      "Some signers use a calendar-page-turning motion followed by the number 3.",
      "End with hands settled in neutral space."
    ],
    "tip": "Months are often fingerspelled in ASL; abbreviated forms vary by region.",
    "location": "neutral_space"
  },

  /* ── NEW LESSONS: Animals (Beginner) ──────────────────────────── */
  {
    "id": "word-cat",
    "label": "Cat",
    "category": "greetings",
    "level": "beginner",
    "theme": "Animals",
    "order": 143,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/hello.svg",
      "alt": "ASL sign for Cat"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "pinched_g",
      "startPosition": { "x": 100, "y": 74 },
      "endPosition": { "x": 120, "y": 74 },
      "path": "line",
      "orientation": "palm_inward",
      "location": "chin",
      "repeat": "infinite",
      "durationMs": 1400,
      "motionTag": "motion",
      "startAnchor": "chin",
      "endAnchor": "cheek"
    },
    "steps": [
      "Pinch thumb and index finger together (like holding a whisker).",
      "Place pinched fingers at the side of your upper lip/cheek.",
      "Pull hand outward as if tracing a cat whisker — repeat twice."
    ],
    "tip": "Trace imaginary whiskers outward from beside your nose or lip.",
    "location": "chin"
  },
  {
    "id": "word-dog",
    "label": "Dog",
    "category": "greetings",
    "level": "beginner",
    "theme": "Animals",
    "order": 144,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/hello.svg",
      "alt": "ASL sign for Dog"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "flat_palm",
      "startPosition": { "x": 75, "y": 95 },
      "endPosition": { "x": 75, "y": 95 },
      "path": "tap",
      "orientation": "palm_inward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1400,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Pat your thigh with your dominant hand as if calling a dog.",
      "Snap fingers or pat twice to simulate calling a pet.",
      "Some variants include a small snap followed by a pat."
    ],
    "tip": "Pat your thigh and snap — like calling a dog to come.",
    "location": "neutral_space"
  },
  {
    "id": "word-bird",
    "label": "Bird",
    "category": "greetings",
    "level": "beginner",
    "theme": "Animals",
    "order": 145,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/hello.svg",
      "alt": "ASL sign for Bird"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "pinched_g",
      "startPosition": { "x": 100, "y": 74 },
      "endPosition": { "x": 100, "y": 74 },
      "path": "tap",
      "orientation": "palm_forward",
      "location": "chin",
      "repeat": "infinite",
      "durationMs": 1400,
      "motionTag": "motion",
      "startAnchor": "chin",
      "endAnchor": "chin"
    },
    "steps": [
      "Form a pinched 'G' or 'L' handshape (index and thumb form a beak).",
      "Hold hand near your mouth/chin with thumb and index forming a beak.",
      "Open and close index against thumb twice — like a bird's beak."
    ],
    "tip": "Index-thumb beak opens and closes at the chin — chirp chirp!",
    "location": "chin"
  },
  {
    "id": "word-fish",
    "label": "Fish",
    "category": "greetings",
    "level": "beginner",
    "theme": "Animals",
    "order": 146,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/hello.svg",
      "alt": "ASL sign for Fish"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "flat_palm",
      "startPosition": { "x": 60, "y": 75 },
      "endPosition": { "x": 120, "y": 75 },
      "path": "line",
      "orientation": "facing_side",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1800,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Hold dominant hand flat with fingers together, palm facing sideways.",
      "Point fingertips forward and wiggle the hand side to side.",
      "Move hand forward while wiggling — like a fish swimming through water."
    ],
    "tip": "Flat hand swims forward with a wriggling motion — like a fish in water.",
    "location": "neutral_space"
  },

  /* ── NEW LESSONS: Emotions (Intermediate) ─────────────────────── */
  {
    "id": "word-scared",
    "label": "Scared",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Emotions",
    "order": 147,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/hello.svg",
      "alt": "ASL sign for Scared"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "open_5",
      "startPosition": { "x": 75, "y": 95 },
      "endPosition": { "x": 100, "y": 65 },
      "path": "line",
      "orientation": "palm_inward",
      "location": "chest",
      "repeat": "infinite",
      "durationMs": 1200,
      "motionTag": "motion",
      "startAnchor": "chest",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Hold both fists at your sides near waist level.",
      "Thrust both hands upward and open them into '5' handshapes.",
      "Widen eyes and show fearful expression while hands open upward."
    ],
    "tip": "Fists burst open upward in front of chest — a startled reaction.",
    "location": "chest"
  },
  {
    "id": "word-surprised",
    "label": "Surprised",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Emotions",
    "order": 148,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/hello.svg",
      "alt": "ASL sign for Surprised"
    },
    "motionTag": "motion",
    "needsReview": true,
    "animationSpec": {
      "handshape": "index_point",
      "startPosition": { "x": 80, "y": 45 },
      "endPosition": { "x": 110, "y": 45 },
      "path": "line",
      "orientation": "palm_inward",
      "location": "forehead",
      "repeat": "infinite",
      "durationMs": 1200,
      "motionTag": "motion",
      "startAnchor": "forehead",
      "endAnchor": "forehead"
    },
    "steps": [
      "Place closed index fingers and thumbs near each eye (like small 'C' shapes).",
      "Flick both hands open simultaneously near eyes.",
      "Widen eyes to show surprise — the flick represents eyes popping open."
    ],
    "tip": "Closed pinches at the eyes flick open — eyes 'popping' in surprise.",
    "location": "forehead"
  },
  {
    "id": "word-proud",
    "label": "Proud",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Emotions",
    "order": 149,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/hello.svg",
      "alt": "ASL sign for Proud"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "thumbs_up",
      "startPosition": { "x": 100, "y": 130 },
      "endPosition": { "x": 100, "y": 95 },
      "path": "line",
      "orientation": "palm_down",
      "location": "chest",
      "repeat": "infinite",
      "durationMs": 1600,
      "motionTag": "motion",
      "startAnchor": "chest",
      "endAnchor": "chest"
    },
    "steps": [
      "Form a fist with thumb extended downward (or use 'A' handshape).",
      "Place thumb against your lower chest/abdomen.",
      "Slide thumb upward along your torso to upper chest — chin held high."
    ],
    "tip": "Thumb slides up the chest with pride — head held high.",
    "location": "chest"
  },

  /* ── NEW LESSONS: Health and Body (Intermediate) ──────────────── */
  {
    "id": "word-doctor",
    "label": "Doctor",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Health and body",
    "order": 150,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/hello.svg",
      "alt": "ASL sign for Doctor"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "flat_palm",
      "startPosition": { "x": 75, "y": 95 },
      "endPosition": { "x": 75, "y": 95 },
      "path": "tap",
      "orientation": "palm_down",
      "location": "wrist",
      "repeat": "infinite",
      "durationMs": 1400,
      "motionTag": "motion",
      "startAnchor": "wrist",
      "endAnchor": "wrist"
    },
    "steps": [
      "Hold non-dominant arm out with wrist facing up.",
      "Tap the inside of your non-dominant wrist with dominant fingertips (like taking a pulse).",
      "Tap twice with a flat 'M' or 'D' handshape."
    ],
    "tip": "Fingertips tap the wrist — mimics taking a pulse, the doctor's gesture.",
    "location": "wrist"
  },
  {
    "id": "word-medicine",
    "label": "Medicine",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Health and body",
    "order": 151,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/hello.svg",
      "alt": "ASL sign for Medicine"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "open_5",
      "startPosition": { "x": 75, "y": 85 },
      "endPosition": { "x": 75, "y": 85 },
      "path": "circle",
      "orientation": "palm_down",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1600,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Hold non-dominant hand flat, palm up.",
      "Place dominant middle finger into the center of non-dominant palm.",
      "Rock or circle the middle finger in the palm — like mixing medicine."
    ],
    "tip": "Middle finger circles in the opposite palm — grinding medicine in a mortar.",
    "location": "neutral_space"
  },
  {
    "id": "word-head",
    "label": "Head",
    "category": "greetings",
    "level": "beginner",
    "theme": "Health and body",
    "order": 152,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/hello.svg",
      "alt": "ASL sign for Head"
    },
    "motionTag": "motion",
    "needsReview": true,
    "animationSpec": {
      "handshape": "flat_palm",
      "startPosition": { "x": 100, "y": 30 },
      "endPosition": { "x": 100, "y": 50 },
      "path": "line",
      "orientation": "palm_down",
      "location": "forehead",
      "repeat": "infinite",
      "durationMs": 1400,
      "motionTag": "motion",
      "startAnchor": "forehead",
      "endAnchor": "chin"
    },
    "steps": [
      "Place flat hand on the side of your forehead/temple.",
      "Move hand downward alongside your head to chin level.",
      "The motion traces the outline of the head."
    ],
    "tip": "Flat hand traces down the side of the head — outlines the head shape.",
    "location": "forehead"
  },
  {
    "id": "word-stomach",
    "label": "Stomach",
    "category": "greetings",
    "level": "beginner",
    "theme": "Health and body",
    "order": 153,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/hello.svg",
      "alt": "ASL sign for Stomach"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "flat_palm",
      "startPosition": { "x": 100, "y": 130 },
      "endPosition": { "x": 100, "y": 130 },
      "path": "tap",
      "orientation": "palm_inward",
      "location": "chest",
      "repeat": "infinite",
      "durationMs": 1200,
      "motionTag": "motion",
      "startAnchor": "chest",
      "endAnchor": "chest"
    },
    "steps": [
      "Form a flat hand or use fingertips.",
      "Pat or tap your stomach/abdomen area.",
      "Repeat the patting motion twice."
    ],
    "tip": "Pat the stomach area — a direct body-location sign.",
    "location": "chest"
  },

  /* ── NEW LESSONS: Travel and Places (Intermediate) ────────────── */
  {
    "id": "word-car",
    "label": "Car",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Travel and places",
    "order": 154,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/hello.svg",
      "alt": "ASL sign for Car"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "fist_a",
      "startPosition": { "x": 70, "y": 75 },
      "endPosition": { "x": 110, "y": 65 },
      "path": "arc",
      "orientation": "palm_inward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1600,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Hold both fists in front of you as if gripping a steering wheel.",
      "Move fists alternately up and down, mimicking steering a car.",
      "Keep hands about shoulder-width apart."
    ],
    "tip": "Mimic steering wheel movements with both fists — vroom!",
    "location": "neutral_space"
  },
  {
    "id": "word-airport",
    "label": "Airport",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Travel and places",
    "order": 155,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/hello.svg",
      "alt": "ASL sign for Airport"
    },
    "motionTag": "motion",
    "needsReview": true,
    "animationSpec": {
      "handshape": "v_shape",
      "startPosition": { "x": 60, "y": 85 },
      "endPosition": { "x": 120, "y": 55 },
      "path": "line",
      "orientation": "palm_down",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1800,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Extend thumb, index, and pinky (ILY handshape or modified Y).",
      "Hold on the non-dominant flat palm.",
      "Move the dominant hand forward and upward — plane taking off from a runway."
    ],
    "tip": "Airplane takes off from flat palm — combines FLY + a location concept.",
    "location": "neutral_space"
  },
  {
    "id": "word-city",
    "label": "City",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Travel and places",
    "order": 156,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/hello.svg",
      "alt": "ASL sign for City"
    },
    "motionTag": "motion",
    "needsReview": true,
    "animationSpec": {
      "handshape": "flat_palm",
      "startPosition": { "x": 70, "y": 55 },
      "endPosition": { "x": 110, "y": 55 },
      "path": "line",
      "orientation": "facing_side",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1600,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Hold both hands as flat 'B' handshapes with fingertips touching to form a roof peak.",
      "Separate and reform the roof shape while moving hands to the side.",
      "Repeat — represents the rooftops of buildings in a city."
    ],
    "tip": "Hands form and reform rooftop peaks moving across — a skyline of buildings.",
    "location": "neutral_space"
  },
  {
    "id": "word-park",
    "label": "Park",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Travel and places",
    "order": 157,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/hello.svg",
      "alt": "ASL sign for Park"
    },
    "motionTag": "motion",
    "needsReview": true,
    "animationSpec": {
      "handshape": "open_5",
      "startPosition": { "x": 75, "y": 65 },
      "endPosition": { "x": 75, "y": 65 },
      "path": "tap",
      "orientation": "palm_down",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1600,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Form a 'P' handshape with dominant hand.",
      "Rest on the back of non-dominant flat hand.",
      "Tap twice — indicates a park location/area."
    ],
    "tip": "P-handshape taps on the back of the non-dominant hand — a place marker.",
    "location": "neutral_space"
  },

  /* ── NEW LESSONS: Question Words (Intermediate) ───────────────── */
  {
    "id": "word-which",
    "label": "Which",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Question words",
    "order": 158,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/where.svg",
      "alt": "ASL sign for Which"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "thumbs_up",
      "startPosition": { "x": 70, "y": 65 },
      "endPosition": { "x": 110, "y": 65 },
      "path": "line",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1600,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Hold both hands as 'A' or '10' handshapes (fists with thumbs up) in front of chest.",
      "Alternate moving hands up and down (one rises while the other falls).",
      "Furrow brows with a questioning expression."
    ],
    "tip": "Alternating thumbs-up hands — weighing two options back and forth.",
    "location": "neutral_space"
  },
  {
    "id": "word-how-much",
    "label": "How Much / How Many",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Question words",
    "order": 159,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/where.svg",
      "alt": "ASL sign for How Much"
    },
    "motionTag": "motion",
    "needsReview": true,
    "animationSpec": {
      "handshape": "open_5",
      "startPosition": { "x": 80, "y": 75 },
      "endPosition": { "x": 80, "y": 55 },
      "path": "line",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1400,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Hold both hands as curved open handshapes (claw shape), palms facing up.",
      "Thrust hands upward while spreading fingers apart.",
      "Furrow brows with questioning expression."
    ],
    "tip": "Curved hands thrust upward with spread fingers — how many / how much?",
    "location": "neutral_space"
  },

  /* ── NEW LESSONS: Common Verbs ────────────────────────────────── */
  {
    "id": "word-go",
    "label": "Go",
    "category": "greetings",
    "level": "beginner",
    "theme": "Common verbs",
    "order": 160,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/hello.svg",
      "alt": "ASL sign for Go"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "index_point",
      "startPosition": { "x": 75, "y": 75 },
      "endPosition": { "x": 125, "y": 55 },
      "path": "arc",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1400,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Point both index fingers upward in front of you.",
      "Bend both wrists to arc both index fingers forward and away.",
      "Motion flows in the direction you are 'going'."
    ],
    "tip": "Index fingers arc forward — pointing in the direction of travel.",
    "location": "neutral_space"
  },
  {
    "id": "word-come",
    "label": "Come",
    "category": "greetings",
    "level": "beginner",
    "theme": "Common verbs",
    "order": 161,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/hello.svg",
      "alt": "ASL sign for Come"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "index_point",
      "startPosition": { "x": 125, "y": 55 },
      "endPosition": { "x": 75, "y": 75 },
      "path": "arc",
      "orientation": "palm_inward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1400,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Point both index fingers outward away from your body.",
      "Curl/arc both index fingers inward toward your chest.",
      "Motion flows toward you — beckoning someone to come."
    ],
    "tip": "Index fingers arc inward toward yourself — beckoning motion.",
    "location": "neutral_space"
  },
  {
    "id": "word-want",
    "label": "Want",
    "category": "greetings",
    "level": "beginner",
    "theme": "Common verbs",
    "order": 162,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/hello.svg",
      "alt": "ASL sign for Want"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "open_5",
      "startPosition": { "x": 80, "y": 65 },
      "endPosition": { "x": 80, "y": 85 },
      "path": "line",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1400,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Hold both hands open with fingers spread, palms facing up.",
      "Pull both hands toward your body while curling fingers into claw shapes.",
      "The pulling motion expresses desire — pulling what you want toward you."
    ],
    "tip": "Open hands pull inward into claws — grabbing what you want.",
    "location": "neutral_space"
  },
  {
    "id": "word-need",
    "label": "Need",
    "category": "greetings",
    "level": "beginner",
    "theme": "Common verbs",
    "order": 163,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/hello.svg",
      "alt": "ASL sign for Need"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "index_point",
      "startPosition": { "x": 80, "y": 55 },
      "endPosition": { "x": 80, "y": 75 },
      "path": "line",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1200,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Form an 'X' handshape (index finger bent at the knuckle into a hook).",
      "Hold hand in neutral space in front of you.",
      "Bend the wrist downward firmly once or twice."
    ],
    "tip": "Hooked index finger nods downward — a firm necessity.",
    "location": "neutral_space"
  },
  {
    "id": "word-think",
    "label": "Think",
    "category": "greetings",
    "level": "beginner",
    "theme": "Common verbs",
    "order": 164,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/hello.svg",
      "alt": "ASL sign for Think"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "index_point",
      "startPosition": { "x": 100, "y": 34 },
      "endPosition": { "x": 100, "y": 34 },
      "path": "tap",
      "orientation": "palm_inward",
      "location": "forehead",
      "repeat": "infinite",
      "durationMs": 1200,
      "motionTag": "motion",
      "startAnchor": "forehead",
      "endAnchor": "forehead"
    },
    "steps": [
      "Extend index finger and point it toward your forehead.",
      "Touch or tap fingertip to your forehead/temple once.",
      "This indicates the location of thought — the mind."
    ],
    "tip": "Index finger taps the forehead — pointing to where you think.",
    "location": "forehead"
  },
  {
    "id": "word-know",
    "label": "Know",
    "category": "greetings",
    "level": "beginner",
    "theme": "Common verbs",
    "order": 165,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/hello.svg",
      "alt": "ASL sign for Know"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "flat_palm",
      "startPosition": { "x": 100, "y": 34 },
      "endPosition": { "x": 100, "y": 34 },
      "path": "tap",
      "orientation": "palm_inward",
      "location": "forehead",
      "repeat": "infinite",
      "durationMs": 1200,
      "motionTag": "motion",
      "startAnchor": "forehead",
      "endAnchor": "forehead"
    },
    "steps": [
      "Hold dominant hand flat with fingers together.",
      "Tap fingertips to your forehead or temple.",
      "Single confident tap — you know it."
    ],
    "tip": "Flat fingertips tap the forehead — knowledge is in the mind.",
    "location": "forehead"
  },
  {
    "id": "word-see",
    "label": "See",
    "category": "greetings",
    "level": "beginner",
    "theme": "Common verbs",
    "order": 166,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/hello.svg",
      "alt": "ASL sign for See"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "v_shape",
      "startPosition": { "x": 100, "y": 45 },
      "endPosition": { "x": 120, "y": 65 },
      "path": "line",
      "orientation": "palm_inward",
      "location": "forehead",
      "repeat": "infinite",
      "durationMs": 1400,
      "motionTag": "motion",
      "startAnchor": "forehead",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Form a 'V' handshape (index and middle finger extended).",
      "Point the 'V' fingers toward your eyes.",
      "Move hand outward away from your face — directing your line of sight."
    ],
    "tip": "V-fingers at the eyes move outward — 'seeing' into the distance.",
    "location": "forehead"
  },
  {
    "id": "word-understand",
    "label": "Understand",
    "category": "greetings",
    "level": "intermediate",
    "theme": "Common verbs",
    "order": 167,
    "xp": 15,
    "media": {
      "type": "svg",
      "url": "/signs/asl/hello.svg",
      "alt": "ASL sign for Understand"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "index_point",
      "startPosition": { "x": 100, "y": 34 },
      "endPosition": { "x": 100, "y": 34 },
      "path": "tap",
      "orientation": "palm_inward",
      "location": "forehead",
      "repeat": "infinite",
      "durationMs": 1400,
      "motionTag": "motion",
      "startAnchor": "forehead",
      "endAnchor": "forehead"
    },
    "steps": [
      "Hold fist near your forehead with index finger pointing up.",
      "Flick index finger upward from the fist — like a light bulb turning on.",
      "The 'aha' flick represents comprehension."
    ],
    "tip": "Index finger flicks up near the forehead — the 'light bulb' moment.",
    "location": "forehead"
  },
  {
    "id": "word-give",
    "label": "Give",
    "category": "greetings",
    "level": "beginner",
    "theme": "Common verbs",
    "order": 168,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/hello.svg",
      "alt": "ASL sign for Give"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "flat_o",
      "startPosition": { "x": 75, "y": 75 },
      "endPosition": { "x": 125, "y": 65 },
      "path": "line",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1400,
      "motionTag": "motion",
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Form a flattened 'O' handshape (fingertips touching thumb).",
      "Start with hand near your body in neutral space.",
      "Move hand forward and open fingers outward — releasing what you hold."
    ],
    "tip": "Pinched hand extends forward and opens — releasing/giving.",
    "location": "neutral_space"
  },
  {
    "id": "word-like",
    "label": "Like",
    "category": "greetings",
    "level": "beginner",
    "theme": "Common verbs",
    "order": 169,
    "xp": 10,
    "media": {
      "type": "svg",
      "url": "/signs/asl/hello.svg",
      "alt": "ASL sign for Like"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "open_5",
      "startPosition": { "x": 100, "y": 114 },
      "endPosition": { "x": 120, "y": 95 },
      "path": "line",
      "orientation": "palm_inward",
      "location": "chest",
      "repeat": "infinite",
      "durationMs": 1400,
      "motionTag": "motion",
      "startAnchor": "chest",
      "endAnchor": "neutral_space"
    },
    "steps": [
      "Place thumb and middle finger (open hand) against your chest.",
      "Pull hand away from chest while pinching thumb and middle finger together.",
      "The motion pulls from the heart — drawing out what you like."
    ],
    "tip": "Thumb and middle finger pinch outward from chest — pulling preference from the heart.",
    "location": "chest"
  },

  {
    "id": "num-21",
    "label": "Number 21",
    "category": "numbers",
    "level": "advanced",
    "order": 100,
    "xp": 25,
    "media": {
      "type": "svg",
      "url": "/signs/asl/21.svg",
      "alt": "ASL sign for number 21"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "2",
      "tokens": [
        {
          "id": "t-21-0",
          "label": "2",
          "handshape": "2",
          "orientation": "palm_forward",
          "position": {
            "x": 65,
            "y": 55
          }
        },
        {
          "id": "t-21-1",
          "label": "1",
          "handshape": "1",
          "orientation": "palm_forward",
          "position": {
            "x": 95,
            "y": 55
          }
        }
      ],
      "startPosition": {
        "x": 65,
        "y": 55
      },
      "endPosition": {
        "x": 95,
        "y": 55
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1800,
      "motionTag": "motion"
    },
    "tokens": [
      {
        "id": "t-21-0",
        "label": "2",
        "handshape": "2",
        "orientation": "palm_forward",
        "position": {
          "x": 65,
          "y": 55
        }
      },
      {
        "id": "t-21-1",
        "label": "1",
        "handshape": "1",
        "orientation": "palm_forward",
        "position": {
          "x": 95,
          "y": 55
        }
      }
    ],
    "steps": [
      "Sign the first digit (2) with palm facing the viewer.",
      "Move hand slightly to the side and sign the next digit (1).",
      "Maintain clear rhythm and digit separation from left to right."
    ],
    "tip": "Compound number 21 is signed digit-by-digit from left to right with palm forward."
  },
  {
    "id": "num-22",
    "label": "Number 22",
    "category": "numbers",
    "level": "advanced",
    "order": 101,
    "xp": 25,
    "media": {
      "type": "svg",
      "url": "/signs/asl/22.svg",
      "alt": "ASL sign for number 22"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "2",
      "tokens": [
        {
          "id": "t-22-0",
          "label": "2",
          "handshape": "2",
          "orientation": "palm_down",
          "position": {
            "x": 65,
            "y": 55
          }
        },
        {
          "id": "t-22-1",
          "label": "2",
          "handshape": "2",
          "orientation": "palm_down",
          "position": {
            "x": 95,
            "y": 55
          }
        }
      ],
      "startPosition": {
        "x": 65,
        "y": 55
      },
      "endPosition": {
        "x": 95,
        "y": 55
      },
      "path": "hop",
      "orientation": "palm_down",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1600,
      "motionTag": "motion"
    },
    "tokens": [
      {
        "id": "t-22-0",
        "label": "2",
        "handshape": "2",
        "orientation": "palm_down",
        "position": {
          "x": 65,
          "y": 55
        }
      },
      {
        "id": "t-22-1",
        "label": "2",
        "handshape": "2",
        "orientation": "palm_down",
        "position": {
          "x": 95,
          "y": 55
        }
      }
    ],
    "steps": [
      "Form number 2 handshape with palm facing DOWN towards the ground.",
      "Execute a small sideways hop to the dominant side for the second 2.",
      "Keep palm oriented downward throughout with a crisp bounce."
    ],
    "tip": "ASL Rule: Repeated double digits (22) are signed with the palm facing DOWN, with a small sideways bounce/hop."
  },
  {
    "id": "num-25",
    "label": "Number 25",
    "category": "numbers",
    "level": "advanced",
    "order": 102,
    "xp": 25,
    "media": {
      "type": "svg",
      "url": "/signs/asl/25.svg",
      "alt": "ASL sign for number 25"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "2",
      "tokens": [
        {
          "id": "t-25-0",
          "label": "2",
          "handshape": "2",
          "orientation": "palm_forward",
          "position": {
            "x": 65,
            "y": 55
          }
        },
        {
          "id": "t-25-1",
          "label": "5",
          "handshape": "5",
          "orientation": "palm_forward",
          "position": {
            "x": 95,
            "y": 55
          }
        }
      ],
      "startPosition": {
        "x": 65,
        "y": 55
      },
      "endPosition": {
        "x": 95,
        "y": 55
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1800,
      "motionTag": "motion"
    },
    "tokens": [
      {
        "id": "t-25-0",
        "label": "2",
        "handshape": "2",
        "orientation": "palm_forward",
        "position": {
          "x": 65,
          "y": 55
        }
      },
      {
        "id": "t-25-1",
        "label": "5",
        "handshape": "5",
        "orientation": "palm_forward",
        "position": {
          "x": 95,
          "y": 55
        }
      }
    ],
    "steps": [
      "Sign the first digit (2) with palm facing the viewer.",
      "Move hand slightly to the side and sign the next digit (5).",
      "Maintain clear rhythm and digit separation from left to right."
    ],
    "tip": "Compound number 25 is signed digit-by-digit from left to right with palm forward."
  },
  {
    "id": "num-33",
    "label": "Number 33",
    "category": "numbers",
    "level": "advanced",
    "order": 103,
    "xp": 25,
    "media": {
      "type": "svg",
      "url": "/signs/asl/33.svg",
      "alt": "ASL sign for number 33"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "3",
      "tokens": [
        {
          "id": "t-33-0",
          "label": "3",
          "handshape": "3",
          "orientation": "palm_down",
          "position": {
            "x": 65,
            "y": 55
          }
        },
        {
          "id": "t-33-1",
          "label": "3",
          "handshape": "3",
          "orientation": "palm_down",
          "position": {
            "x": 95,
            "y": 55
          }
        }
      ],
      "startPosition": {
        "x": 65,
        "y": 55
      },
      "endPosition": {
        "x": 95,
        "y": 55
      },
      "path": "hop",
      "orientation": "palm_down",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1600,
      "motionTag": "motion"
    },
    "tokens": [
      {
        "id": "t-33-0",
        "label": "3",
        "handshape": "3",
        "orientation": "palm_down",
        "position": {
          "x": 65,
          "y": 55
        }
      },
      {
        "id": "t-33-1",
        "label": "3",
        "handshape": "3",
        "orientation": "palm_down",
        "position": {
          "x": 95,
          "y": 55
        }
      }
    ],
    "steps": [
      "Form number 3 handshape with palm facing DOWN towards the ground.",
      "Execute a small sideways hop to the dominant side for the second 3.",
      "Keep palm oriented downward throughout with a crisp bounce."
    ],
    "tip": "ASL Rule: Repeated double digits (33) are signed with the palm facing DOWN, with a small sideways bounce/hop."
  },
  {
    "id": "num-42",
    "label": "Number 42",
    "category": "numbers",
    "level": "advanced",
    "order": 104,
    "xp": 25,
    "media": {
      "type": "svg",
      "url": "/signs/asl/42.svg",
      "alt": "ASL sign for number 42"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "4",
      "tokens": [
        {
          "id": "t-42-0",
          "label": "4",
          "handshape": "4",
          "orientation": "palm_forward",
          "position": {
            "x": 65,
            "y": 55
          }
        },
        {
          "id": "t-42-1",
          "label": "2",
          "handshape": "2",
          "orientation": "palm_forward",
          "position": {
            "x": 95,
            "y": 55
          }
        }
      ],
      "startPosition": {
        "x": 65,
        "y": 55
      },
      "endPosition": {
        "x": 95,
        "y": 55
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1800,
      "motionTag": "motion"
    },
    "tokens": [
      {
        "id": "t-42-0",
        "label": "4",
        "handshape": "4",
        "orientation": "palm_forward",
        "position": {
          "x": 65,
          "y": 55
        }
      },
      {
        "id": "t-42-1",
        "label": "2",
        "handshape": "2",
        "orientation": "palm_forward",
        "position": {
          "x": 95,
          "y": 55
        }
      }
    ],
    "steps": [
      "Sign the first digit (4) with palm facing the viewer.",
      "Move hand slightly to the side and sign the next digit (2).",
      "Maintain clear rhythm and digit separation from left to right."
    ],
    "tip": "Compound number 42 is signed digit-by-digit from left to right with palm forward."
  },
  {
    "id": "num-44",
    "label": "Number 44",
    "category": "numbers",
    "level": "advanced",
    "order": 105,
    "xp": 25,
    "media": {
      "type": "svg",
      "url": "/signs/asl/44.svg",
      "alt": "ASL sign for number 44"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "4",
      "tokens": [
        {
          "id": "t-44-0",
          "label": "4",
          "handshape": "4",
          "orientation": "palm_down",
          "position": {
            "x": 65,
            "y": 55
          }
        },
        {
          "id": "t-44-1",
          "label": "4",
          "handshape": "4",
          "orientation": "palm_down",
          "position": {
            "x": 95,
            "y": 55
          }
        }
      ],
      "startPosition": {
        "x": 65,
        "y": 55
      },
      "endPosition": {
        "x": 95,
        "y": 55
      },
      "path": "hop",
      "orientation": "palm_down",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1600,
      "motionTag": "motion"
    },
    "tokens": [
      {
        "id": "t-44-0",
        "label": "4",
        "handshape": "4",
        "orientation": "palm_down",
        "position": {
          "x": 65,
          "y": 55
        }
      },
      {
        "id": "t-44-1",
        "label": "4",
        "handshape": "4",
        "orientation": "palm_down",
        "position": {
          "x": 95,
          "y": 55
        }
      }
    ],
    "steps": [
      "Form number 4 handshape with palm facing DOWN towards the ground.",
      "Execute a small sideways hop to the dominant side for the second 4.",
      "Keep palm oriented downward throughout with a crisp bounce."
    ],
    "tip": "ASL Rule: Repeated double digits (44) are signed with the palm facing DOWN, with a small sideways bounce/hop."
  },
  {
    "id": "num-55",
    "label": "Number 55",
    "category": "numbers",
    "level": "advanced",
    "order": 106,
    "xp": 25,
    "media": {
      "type": "svg",
      "url": "/signs/asl/55.svg",
      "alt": "ASL sign for number 55"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "5",
      "tokens": [
        {
          "id": "t-55-0",
          "label": "5",
          "handshape": "5",
          "orientation": "palm_down",
          "position": {
            "x": 65,
            "y": 55
          }
        },
        {
          "id": "t-55-1",
          "label": "5",
          "handshape": "5",
          "orientation": "palm_down",
          "position": {
            "x": 95,
            "y": 55
          }
        }
      ],
      "startPosition": {
        "x": 65,
        "y": 55
      },
      "endPosition": {
        "x": 95,
        "y": 55
      },
      "path": "hop",
      "orientation": "palm_down",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1600,
      "motionTag": "motion"
    },
    "tokens": [
      {
        "id": "t-55-0",
        "label": "5",
        "handshape": "5",
        "orientation": "palm_down",
        "position": {
          "x": 65,
          "y": 55
        }
      },
      {
        "id": "t-55-1",
        "label": "5",
        "handshape": "5",
        "orientation": "palm_down",
        "position": {
          "x": 95,
          "y": 55
        }
      }
    ],
    "steps": [
      "Form number 5 handshape with palm facing DOWN towards the ground.",
      "Execute a small sideways hop to the dominant side for the second 5.",
      "Keep palm oriented downward throughout with a crisp bounce."
    ],
    "tip": "ASL Rule: Repeated double digits (55) are signed with the palm facing DOWN, with a small sideways bounce/hop."
  },
  {
    "id": "num-64",
    "label": "Number 64",
    "category": "numbers",
    "level": "advanced",
    "order": 107,
    "xp": 25,
    "media": {
      "type": "svg",
      "url": "/signs/asl/64.svg",
      "alt": "ASL sign for number 64"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "6",
      "tokens": [
        {
          "id": "t-64-0",
          "label": "6",
          "handshape": "6",
          "orientation": "palm_forward",
          "position": {
            "x": 65,
            "y": 55
          }
        },
        {
          "id": "t-64-1",
          "label": "4",
          "handshape": "4",
          "orientation": "palm_forward",
          "position": {
            "x": 95,
            "y": 55
          }
        }
      ],
      "startPosition": {
        "x": 65,
        "y": 55
      },
      "endPosition": {
        "x": 95,
        "y": 55
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1800,
      "motionTag": "motion"
    },
    "tokens": [
      {
        "id": "t-64-0",
        "label": "6",
        "handshape": "6",
        "orientation": "palm_forward",
        "position": {
          "x": 65,
          "y": 55
        }
      },
      {
        "id": "t-64-1",
        "label": "4",
        "handshape": "4",
        "orientation": "palm_forward",
        "position": {
          "x": 95,
          "y": 55
        }
      }
    ],
    "steps": [
      "Sign the first digit (6) with palm facing the viewer.",
      "Move hand slightly to the side and sign the next digit (4).",
      "Maintain clear rhythm and digit separation from left to right."
    ],
    "tip": "Compound number 64 is signed digit-by-digit from left to right with palm forward."
  },
  {
    "id": "num-66",
    "label": "Number 66",
    "category": "numbers",
    "level": "advanced",
    "order": 108,
    "xp": 25,
    "media": {
      "type": "svg",
      "url": "/signs/asl/66.svg",
      "alt": "ASL sign for number 66"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "6",
      "tokens": [
        {
          "id": "t-66-0",
          "label": "6",
          "handshape": "6",
          "orientation": "palm_down",
          "position": {
            "x": 65,
            "y": 55
          }
        },
        {
          "id": "t-66-1",
          "label": "6",
          "handshape": "6",
          "orientation": "palm_down",
          "position": {
            "x": 95,
            "y": 55
          }
        }
      ],
      "startPosition": {
        "x": 65,
        "y": 55
      },
      "endPosition": {
        "x": 95,
        "y": 55
      },
      "path": "hop",
      "orientation": "palm_down",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1600,
      "motionTag": "motion"
    },
    "tokens": [
      {
        "id": "t-66-0",
        "label": "6",
        "handshape": "6",
        "orientation": "palm_down",
        "position": {
          "x": 65,
          "y": 55
        }
      },
      {
        "id": "t-66-1",
        "label": "6",
        "handshape": "6",
        "orientation": "palm_down",
        "position": {
          "x": 95,
          "y": 55
        }
      }
    ],
    "steps": [
      "Form number 6 handshape with palm facing DOWN towards the ground.",
      "Execute a small sideways hop to the dominant side for the second 6.",
      "Keep palm oriented downward throughout with a crisp bounce."
    ],
    "tip": "ASL Rule: Repeated double digits (66) are signed with the palm facing DOWN, with a small sideways bounce/hop."
  },
  {
    "id": "num-77",
    "label": "Number 77",
    "category": "numbers",
    "level": "advanced",
    "order": 109,
    "xp": 25,
    "media": {
      "type": "svg",
      "url": "/signs/asl/77.svg",
      "alt": "ASL sign for number 77"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "7",
      "tokens": [
        {
          "id": "t-77-0",
          "label": "7",
          "handshape": "7",
          "orientation": "palm_down",
          "position": {
            "x": 65,
            "y": 55
          }
        },
        {
          "id": "t-77-1",
          "label": "7",
          "handshape": "7",
          "orientation": "palm_down",
          "position": {
            "x": 95,
            "y": 55
          }
        }
      ],
      "startPosition": {
        "x": 65,
        "y": 55
      },
      "endPosition": {
        "x": 95,
        "y": 55
      },
      "path": "hop",
      "orientation": "palm_down",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1600,
      "motionTag": "motion"
    },
    "tokens": [
      {
        "id": "t-77-0",
        "label": "7",
        "handshape": "7",
        "orientation": "palm_down",
        "position": {
          "x": 65,
          "y": 55
        }
      },
      {
        "id": "t-77-1",
        "label": "7",
        "handshape": "7",
        "orientation": "palm_down",
        "position": {
          "x": 95,
          "y": 55
        }
      }
    ],
    "steps": [
      "Form number 7 handshape with palm facing DOWN towards the ground.",
      "Execute a small sideways hop to the dominant side for the second 7.",
      "Keep palm oriented downward throughout with a crisp bounce."
    ],
    "tip": "ASL Rule: Repeated double digits (77) are signed with the palm facing DOWN, with a small sideways bounce/hop."
  },
  {
    "id": "num-88",
    "label": "Number 88",
    "category": "numbers",
    "level": "advanced",
    "order": 110,
    "xp": 25,
    "media": {
      "type": "svg",
      "url": "/signs/asl/88.svg",
      "alt": "ASL sign for number 88"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "8",
      "tokens": [
        {
          "id": "t-88-0",
          "label": "8",
          "handshape": "8",
          "orientation": "palm_down",
          "position": {
            "x": 65,
            "y": 55
          }
        },
        {
          "id": "t-88-1",
          "label": "8",
          "handshape": "8",
          "orientation": "palm_down",
          "position": {
            "x": 95,
            "y": 55
          }
        }
      ],
      "startPosition": {
        "x": 65,
        "y": 55
      },
      "endPosition": {
        "x": 95,
        "y": 55
      },
      "path": "hop",
      "orientation": "palm_down",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1600,
      "motionTag": "motion"
    },
    "tokens": [
      {
        "id": "t-88-0",
        "label": "8",
        "handshape": "8",
        "orientation": "palm_down",
        "position": {
          "x": 65,
          "y": 55
        }
      },
      {
        "id": "t-88-1",
        "label": "8",
        "handshape": "8",
        "orientation": "palm_down",
        "position": {
          "x": 95,
          "y": 55
        }
      }
    ],
    "steps": [
      "Form number 8 handshape with palm facing DOWN towards the ground.",
      "Execute a small sideways hop to the dominant side for the second 8.",
      "Keep palm oriented downward throughout with a crisp bounce."
    ],
    "tip": "ASL Rule: Repeated double digits (88) are signed with the palm facing DOWN, with a small sideways bounce/hop."
  },
  {
    "id": "num-99",
    "label": "Number 99",
    "category": "numbers",
    "level": "advanced",
    "order": 111,
    "xp": 25,
    "media": {
      "type": "svg",
      "url": "/signs/asl/99.svg",
      "alt": "ASL sign for number 99"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "9",
      "tokens": [
        {
          "id": "t-99-0",
          "label": "9",
          "handshape": "9",
          "orientation": "palm_down",
          "position": {
            "x": 65,
            "y": 55
          }
        },
        {
          "id": "t-99-1",
          "label": "9",
          "handshape": "9",
          "orientation": "palm_down",
          "position": {
            "x": 95,
            "y": 55
          }
        }
      ],
      "startPosition": {
        "x": 65,
        "y": 55
      },
      "endPosition": {
        "x": 95,
        "y": 55
      },
      "path": "hop",
      "orientation": "palm_down",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1600,
      "motionTag": "motion"
    },
    "tokens": [
      {
        "id": "t-99-0",
        "label": "9",
        "handshape": "9",
        "orientation": "palm_down",
        "position": {
          "x": 65,
          "y": 55
        }
      },
      {
        "id": "t-99-1",
        "label": "9",
        "handshape": "9",
        "orientation": "palm_down",
        "position": {
          "x": 95,
          "y": 55
        }
      }
    ],
    "steps": [
      "Form number 9 handshape with palm facing DOWN towards the ground.",
      "Execute a small sideways hop to the dominant side for the second 9.",
      "Keep palm oriented downward throughout with a crisp bounce."
    ],
    "tip": "ASL Rule: Repeated double digits (99) are signed with the palm facing DOWN, with a small sideways bounce/hop."
  },
  {
    "id": "num-100",
    "label": "Number 100",
    "category": "numbers",
    "level": "advanced",
    "order": 112,
    "xp": 25,
    "media": {
      "type": "svg",
      "url": "/signs/asl/100.svg",
      "alt": "ASL sign for number 100"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "1",
      "tokens": [
        {
          "id": "t-100-0",
          "label": "1",
          "handshape": "1",
          "orientation": "palm_forward",
          "position": {
            "x": 65,
            "y": 55
          }
        },
        {
          "id": "t-100-1",
          "label": "C",
          "handshape": "C",
          "orientation": "facing_side",
          "position": {
            "x": 95,
            "y": 55
          }
        }
      ],
      "startPosition": {
        "x": 65,
        "y": 55
      },
      "endPosition": {
        "x": 95,
        "y": 55
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1800,
      "motionTag": "motion"
    },
    "tokens": [
      {
        "id": "t-100-0",
        "label": "1",
        "handshape": "1",
        "orientation": "palm_forward",
        "position": {
          "x": 65,
          "y": 55
        }
      },
      {
        "id": "t-100-1",
        "label": "C",
        "handshape": "C",
        "orientation": "facing_side",
        "position": {
          "x": 95,
          "y": 55
        }
      }
    ],
    "steps": [
      "Sign number 1 with index finger upright, palm facing forward.",
      "Smoothly transition into a 'C' handshape representing 100.",
      "Hold in neutral space at shoulder height."
    ],
    "tip": "100 is signed in ASL as '1' followed by 'C' (derived from Roman numeral / Latin centum)."
  },
  {
    "id": "num-125",
    "label": "Number 125",
    "category": "numbers",
    "level": "advanced",
    "order": 113,
    "xp": 25,
    "media": {
      "type": "svg",
      "url": "/signs/asl/125.svg",
      "alt": "ASL sign for number 125"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "1",
      "tokens": [
        {
          "id": "t-125-0",
          "label": "1",
          "handshape": "1",
          "orientation": "palm_forward",
          "position": {
            "x": 55,
            "y": 55
          }
        },
        {
          "id": "t-125-1",
          "label": "C",
          "handshape": "C",
          "orientation": "facing_side",
          "position": {
            "x": 75,
            "y": 55
          }
        },
        {
          "id": "t-125-2",
          "label": "2",
          "handshape": "2",
          "orientation": "palm_forward",
          "position": {
            "x": 95,
            "y": 55
          }
        },
        {
          "id": "t-125-3",
          "label": "5",
          "handshape": "5",
          "orientation": "palm_forward",
          "position": {
            "x": 115,
            "y": 55
          }
        }
      ],
      "startPosition": {
        "x": 55,
        "y": 55
      },
      "endPosition": {
        "x": 115,
        "y": 55
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1800,
      "motionTag": "motion"
    },
    "tokens": [
      {
        "id": "t-125-0",
        "label": "1",
        "handshape": "1",
        "orientation": "palm_forward",
        "position": {
          "x": 55,
          "y": 55
        }
      },
      {
        "id": "t-125-1",
        "label": "C",
        "handshape": "C",
        "orientation": "facing_side",
        "position": {
          "x": 75,
          "y": 55
        }
      },
      {
        "id": "t-125-2",
        "label": "2",
        "handshape": "2",
        "orientation": "palm_forward",
        "position": {
          "x": 95,
          "y": 55
        }
      },
      {
        "id": "t-125-3",
        "label": "5",
        "handshape": "5",
        "orientation": "palm_forward",
        "position": {
          "x": 115,
          "y": 55
        }
      }
    ],
    "steps": [
      "Sign the first digit (1) with palm facing the viewer.",
      "Move hand slightly to the side and sign the next digit (C).",
      "Maintain clear rhythm and digit separation from left to right."
    ],
    "tip": "Compound number 125 is signed digit-by-digit from left to right with palm forward."
  },
  {
    "id": "num-340",
    "label": "Number 340",
    "category": "numbers",
    "level": "advanced",
    "order": 114,
    "xp": 25,
    "media": {
      "type": "svg",
      "url": "/signs/asl/340.svg",
      "alt": "ASL sign for number 340"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "3",
      "tokens": [
        {
          "id": "t-340-0",
          "label": "3",
          "handshape": "3",
          "orientation": "palm_forward",
          "position": {
            "x": 55,
            "y": 55
          }
        },
        {
          "id": "t-340-1",
          "label": "C",
          "handshape": "C",
          "orientation": "facing_side",
          "position": {
            "x": 75,
            "y": 55
          }
        },
        {
          "id": "t-340-2",
          "label": "4",
          "handshape": "4",
          "orientation": "palm_forward",
          "position": {
            "x": 95,
            "y": 55
          }
        },
        {
          "id": "t-340-3",
          "label": "0",
          "handshape": "0",
          "orientation": "palm_forward",
          "position": {
            "x": 115,
            "y": 55
          }
        }
      ],
      "startPosition": {
        "x": 55,
        "y": 55
      },
      "endPosition": {
        "x": 115,
        "y": 55
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1800,
      "motionTag": "motion"
    },
    "tokens": [
      {
        "id": "t-340-0",
        "label": "3",
        "handshape": "3",
        "orientation": "palm_forward",
        "position": {
          "x": 55,
          "y": 55
        }
      },
      {
        "id": "t-340-1",
        "label": "C",
        "handshape": "C",
        "orientation": "facing_side",
        "position": {
          "x": 75,
          "y": 55
        }
      },
      {
        "id": "t-340-2",
        "label": "4",
        "handshape": "4",
        "orientation": "palm_forward",
        "position": {
          "x": 95,
          "y": 55
        }
      },
      {
        "id": "t-340-3",
        "label": "0",
        "handshape": "0",
        "orientation": "palm_forward",
        "position": {
          "x": 115,
          "y": 55
        }
      }
    ],
    "steps": [
      "Sign the first digit (3) with palm facing the viewer.",
      "Move hand slightly to the side and sign the next digit (C).",
      "Maintain clear rhythm and digit separation from left to right."
    ],
    "tip": "Compound number 340 is signed digit-by-digit from left to right with palm forward."
  },
  {
    "id": "num-500",
    "label": "Number 500",
    "category": "numbers",
    "level": "advanced",
    "order": 115,
    "xp": 25,
    "media": {
      "type": "svg",
      "url": "/signs/asl/500.svg",
      "alt": "ASL sign for number 500"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "5",
      "tokens": [
        {
          "id": "t-500-0",
          "label": "5",
          "handshape": "5",
          "orientation": "palm_forward",
          "position": {
            "x": 65,
            "y": 55
          }
        },
        {
          "id": "t-500-1",
          "label": "C",
          "handshape": "C",
          "orientation": "facing_side",
          "position": {
            "x": 95,
            "y": 55
          }
        }
      ],
      "startPosition": {
        "x": 65,
        "y": 55
      },
      "endPosition": {
        "x": 95,
        "y": 55
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1800,
      "motionTag": "motion"
    },
    "tokens": [
      {
        "id": "t-500-0",
        "label": "5",
        "handshape": "5",
        "orientation": "palm_forward",
        "position": {
          "x": 65,
          "y": 55
        }
      },
      {
        "id": "t-500-1",
        "label": "C",
        "handshape": "C",
        "orientation": "facing_side",
        "position": {
          "x": 95,
          "y": 55
        }
      }
    ],
    "steps": [
      "Sign the first digit (5) with palm facing the viewer.",
      "Move hand slightly to the side and sign the next digit (C).",
      "Maintain clear rhythm and digit separation from left to right."
    ],
    "tip": "Compound number 500 is signed digit-by-digit from left to right with palm forward."
  },
  {
    "id": "num-750",
    "label": "Number 750",
    "category": "numbers",
    "level": "advanced",
    "order": 116,
    "xp": 25,
    "media": {
      "type": "svg",
      "url": "/signs/asl/750.svg",
      "alt": "ASL sign for number 750"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "7",
      "tokens": [
        {
          "id": "t-750-0",
          "label": "7",
          "handshape": "7",
          "orientation": "palm_forward",
          "position": {
            "x": 55,
            "y": 55
          }
        },
        {
          "id": "t-750-1",
          "label": "C",
          "handshape": "C",
          "orientation": "facing_side",
          "position": {
            "x": 75,
            "y": 55
          }
        },
        {
          "id": "t-750-2",
          "label": "5",
          "handshape": "5",
          "orientation": "palm_forward",
          "position": {
            "x": 95,
            "y": 55
          }
        },
        {
          "id": "t-750-3",
          "label": "0",
          "handshape": "0",
          "orientation": "palm_forward",
          "position": {
            "x": 115,
            "y": 55
          }
        }
      ],
      "startPosition": {
        "x": 55,
        "y": 55
      },
      "endPosition": {
        "x": 115,
        "y": 55
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1800,
      "motionTag": "motion"
    },
    "tokens": [
      {
        "id": "t-750-0",
        "label": "7",
        "handshape": "7",
        "orientation": "palm_forward",
        "position": {
          "x": 55,
          "y": 55
        }
      },
      {
        "id": "t-750-1",
        "label": "C",
        "handshape": "C",
        "orientation": "facing_side",
        "position": {
          "x": 75,
          "y": 55
        }
      },
      {
        "id": "t-750-2",
        "label": "5",
        "handshape": "5",
        "orientation": "palm_forward",
        "position": {
          "x": 95,
          "y": 55
        }
      },
      {
        "id": "t-750-3",
        "label": "0",
        "handshape": "0",
        "orientation": "palm_forward",
        "position": {
          "x": 115,
          "y": 55
        }
      }
    ],
    "steps": [
      "Sign the first digit (7) with palm facing the viewer.",
      "Move hand slightly to the side and sign the next digit (C).",
      "Maintain clear rhythm and digit separation from left to right."
    ],
    "tip": "Compound number 750 is signed digit-by-digit from left to right with palm forward."
  },
  {
    "id": "num-1000",
    "label": "Number 1000",
    "category": "numbers",
    "level": "advanced",
    "order": 117,
    "xp": 25,
    "media": {
      "type": "svg",
      "url": "/signs/asl/1000.svg",
      "alt": "ASL sign for number 1000"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "1",
      "tokens": [
        {
          "id": "t-1000-0",
          "label": "1",
          "handshape": "1",
          "orientation": "palm_forward",
          "position": {
            "x": 65,
            "y": 55
          }
        },
        {
          "id": "t-1000-1",
          "label": "M",
          "handshape": "M",
          "orientation": "palm_forward",
          "position": {
            "x": 95,
            "y": 55
          }
        }
      ],
      "startPosition": {
        "x": 65,
        "y": 55
      },
      "endPosition": {
        "x": 95,
        "y": 55
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 1800,
      "motionTag": "motion"
    },
    "tokens": [
      {
        "id": "t-1000-0",
        "label": "1",
        "handshape": "1",
        "orientation": "palm_forward",
        "position": {
          "x": 65,
          "y": 55
        }
      },
      {
        "id": "t-1000-1",
        "label": "M",
        "handshape": "M",
        "orientation": "palm_forward",
        "position": {
          "x": 95,
          "y": 55
        }
      }
    ],
    "steps": [
      "Sign number 1 with index finger upright, palm facing forward.",
      "Transition into 'M' handshape (or tap palm for thousand).",
      "Clear transition between numeral and thousand multiplier."
    ],
    "tip": "1000 is signed in ASL as '1' followed by 'M' (or 1 then tapping the palm for thousand)."
  },
  {
    "id": "adv-where-is-my-mom",
    "label": "Where Is My Mom?",
    "category": "greetings",
    "level": "advanced",
    "theme": "Family and social",
    "order": 200,
    "xp": 25,
    "prerequisites": [
      "word-where",
      "word-mom"
    ],
    "media": {
      "type": "svg",
      "url": "/signs/asl/where_is_my_mom.svg",
      "alt": "ASL phrase: Where Is My Mom?"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "5",
      "startPosition": {
        "x": 100,
        "y": 74
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "chin",
      "repeat": "infinite",
      "durationMs": 2200,
      "motionTag": "motion",
      "tokens": [
        {
          "id": "t-adv-where-is-my-mom-0",
          "label": "Mom",
          "signKey": "mom",
          "handshape": "5",
          "startAnchor": "chin",
          "endAnchor": "chin",
          "startPosition": {
            "x": 100,
            "y": 74
          },
          "endPosition": {
            "x": 100,
            "y": 74
          },
          "path": "tap",
          "orientation": "palm_forward",
          "location": "chin"
        },
        {
          "id": "t-adv-where-is-my-mom-1",
          "label": "My",
          "signKey": "my",
          "handshape": "B",
          "startAnchor": "chest",
          "endAnchor": "chest",
          "startPosition": {
            "x": 100,
            "y": 114
          },
          "endPosition": {
            "x": 100,
            "y": 114
          },
          "path": "tap",
          "orientation": "palm_inward",
          "location": "chest"
        },
        {
          "id": "t-adv-where-is-my-mom-2",
          "label": "Where",
          "signKey": "where",
          "handshape": "1",
          "startAnchor": "neutral_space",
          "endAnchor": "neutral_space",
          "startPosition": {
            "x": 75,
            "y": 65
          },
          "endPosition": {
            "x": 75,
            "y": 65
          },
          "path": "shake",
          "orientation": "palm_forward",
          "location": "neutral_space"
        }
      ],
      "startAnchor": "chin",
      "endAnchor": "neutral_space"
    },
    "tokens": [
      {
        "id": "t-adv-where-is-my-mom-0",
        "label": "Mom",
        "signKey": "mom",
        "handshape": "5",
        "startAnchor": "chin",
        "endAnchor": "chin",
        "startPosition": {
          "x": 100,
          "y": 74
        },
        "endPosition": {
          "x": 100,
          "y": 74
        },
        "path": "tap",
        "orientation": "palm_forward",
        "location": "chin"
      },
      {
        "id": "t-adv-where-is-my-mom-1",
        "label": "My",
        "signKey": "my",
        "handshape": "B",
        "startAnchor": "chest",
        "endAnchor": "chest",
        "startPosition": {
          "x": 100,
          "y": 114
        },
        "endPosition": {
          "x": 100,
          "y": 114
        },
        "path": "tap",
        "orientation": "palm_inward",
        "location": "chest"
      },
      {
        "id": "t-adv-where-is-my-mom-2",
        "label": "Where",
        "signKey": "where",
        "handshape": "1",
        "startAnchor": "neutral_space",
        "endAnchor": "neutral_space",
        "startPosition": {
          "x": 75,
          "y": 65
        },
        "endPosition": {
          "x": 75,
          "y": 65
        },
        "path": "shake",
        "orientation": "palm_forward",
        "location": "neutral_space"
      }
    ],
    "steps": [
      "Sign each component sign in conversational sequence: Mom → My → Where.",
      "Express grammatical mode with facial expressions (eyebrows raised for yes/no, furrowed for WH-questions).",
      "Transition smoothly between signs at natural conversational tempo."
    ],
    "tip": "Conversational phrase built from foundational vocabulary signs."
  },
  {
    "id": "adv-my-grandpa-is-sick",
    "label": "My Grandpa Is Sick",
    "category": "greetings",
    "level": "advanced",
    "theme": "Family and social",
    "order": 201,
    "xp": 25,
    "prerequisites": [
      "word-grandpa",
      "word-sick"
    ],
    "media": {
      "type": "svg",
      "url": "/signs/asl/my_grandpa_is_sick.svg",
      "alt": "ASL phrase: My Grandpa Is Sick"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "B",
      "startPosition": {
        "x": 100,
        "y": 114
      },
      "endPosition": {
        "x": 100,
        "y": 114
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "chest",
      "repeat": "infinite",
      "durationMs": 2200,
      "motionTag": "motion",
      "tokens": [
        {
          "id": "t-adv-my-grandpa-is-sick-0",
          "label": "My",
          "signKey": "my",
          "handshape": "B",
          "startAnchor": "chest",
          "endAnchor": "chest",
          "startPosition": {
            "x": 100,
            "y": 114
          },
          "endPosition": {
            "x": 100,
            "y": 114
          },
          "path": "tap",
          "orientation": "palm_inward",
          "location": "chest"
        },
        {
          "id": "t-adv-my-grandpa-is-sick-1",
          "label": "Grandpa",
          "signKey": "grandpa",
          "handshape": "5",
          "startAnchor": "forehead",
          "endAnchor": "neutral_space",
          "startPosition": {
            "x": 100,
            "y": 34
          },
          "endPosition": {
            "x": 75,
            "y": 65
          },
          "path": "arc",
          "orientation": "palm_forward",
          "location": "forehead"
        },
        {
          "id": "t-adv-my-grandpa-is-sick-2",
          "label": "Sick",
          "signKey": "sick",
          "handshape": "8",
          "startAnchor": "forehead",
          "endAnchor": "chest",
          "startPosition": {
            "x": 100,
            "y": 34
          },
          "endPosition": {
            "x": 100,
            "y": 114
          },
          "path": "tap",
          "orientation": "palm_inward",
          "location": "forehead"
        }
      ],
      "startAnchor": "chest",
      "endAnchor": "chest"
    },
    "tokens": [
      {
        "id": "t-adv-my-grandpa-is-sick-0",
        "label": "My",
        "signKey": "my",
        "handshape": "B",
        "startAnchor": "chest",
        "endAnchor": "chest",
        "startPosition": {
          "x": 100,
          "y": 114
        },
        "endPosition": {
          "x": 100,
          "y": 114
        },
        "path": "tap",
        "orientation": "palm_inward",
        "location": "chest"
      },
      {
        "id": "t-adv-my-grandpa-is-sick-1",
        "label": "Grandpa",
        "signKey": "grandpa",
        "handshape": "5",
        "startAnchor": "forehead",
        "endAnchor": "neutral_space",
        "startPosition": {
          "x": 100,
          "y": 34
        },
        "endPosition": {
          "x": 75,
          "y": 65
        },
        "path": "arc",
        "orientation": "palm_forward",
        "location": "forehead"
      },
      {
        "id": "t-adv-my-grandpa-is-sick-2",
        "label": "Sick",
        "signKey": "sick",
        "handshape": "8",
        "startAnchor": "forehead",
        "endAnchor": "chest",
        "startPosition": {
          "x": 100,
          "y": 34
        },
        "endPosition": {
          "x": 100,
          "y": 114
        },
        "path": "tap",
        "orientation": "palm_inward",
        "location": "forehead"
      }
    ],
    "steps": [
      "Sign each component sign in conversational sequence: My → Grandpa → Sick.",
      "Express grammatical mode with facial expressions (eyebrows raised for yes/no, furrowed for WH-questions).",
      "Transition smoothly between signs at natural conversational tempo."
    ],
    "tip": "Conversational phrase built from foundational vocabulary signs."
  },
  {
    "id": "adv-i-love-my-family",
    "label": "I Love My Family",
    "category": "greetings",
    "level": "advanced",
    "theme": "Family and social",
    "order": 202,
    "xp": 25,
    "prerequisites": [
      "word-love",
      "word-family"
    ],
    "media": {
      "type": "svg",
      "url": "/signs/asl/i_love_my_family.svg",
      "alt": "ASL phrase: I Love My Family"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "1",
      "startPosition": {
        "x": 100,
        "y": 114
      },
      "endPosition": {
        "x": 100,
        "y": 114
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "chest",
      "repeat": "infinite",
      "durationMs": 2200,
      "motionTag": "motion",
      "tokens": [
        {
          "id": "t-adv-i-love-my-family-0",
          "label": "I",
          "signKey": "i",
          "handshape": "1",
          "startAnchor": "chest",
          "endAnchor": "chest",
          "startPosition": {
            "x": 100,
            "y": 114
          },
          "endPosition": {
            "x": 100,
            "y": 114
          },
          "path": "tap",
          "orientation": "palm_inward",
          "location": "chest"
        },
        {
          "id": "t-adv-i-love-my-family-1",
          "label": "Love",
          "signKey": "love",
          "handshape": "S",
          "startAnchor": "chest",
          "endAnchor": "chest",
          "startPosition": {
            "x": 100,
            "y": 114
          },
          "endPosition": {
            "x": 100,
            "y": 114
          },
          "path": "tap",
          "orientation": "palm_inward",
          "location": "chest"
        },
        {
          "id": "t-adv-i-love-my-family-2",
          "label": "Family",
          "signKey": "family",
          "handshape": "F",
          "startAnchor": "chest",
          "endAnchor": "chest",
          "startPosition": {
            "x": 100,
            "y": 114
          },
          "endPosition": {
            "x": 100,
            "y": 114
          },
          "path": "circle",
          "orientation": "palm_forward",
          "location": "chest"
        }
      ],
      "startAnchor": "chest",
      "endAnchor": "chest"
    },
    "tokens": [
      {
        "id": "t-adv-i-love-my-family-0",
        "label": "I",
        "signKey": "i",
        "handshape": "1",
        "startAnchor": "chest",
        "endAnchor": "chest",
        "startPosition": {
          "x": 100,
          "y": 114
        },
        "endPosition": {
          "x": 100,
          "y": 114
        },
        "path": "tap",
        "orientation": "palm_inward",
        "location": "chest"
      },
      {
        "id": "t-adv-i-love-my-family-1",
        "label": "Love",
        "signKey": "love",
        "handshape": "S",
        "startAnchor": "chest",
        "endAnchor": "chest",
        "startPosition": {
          "x": 100,
          "y": 114
        },
        "endPosition": {
          "x": 100,
          "y": 114
        },
        "path": "tap",
        "orientation": "palm_inward",
        "location": "chest"
      },
      {
        "id": "t-adv-i-love-my-family-2",
        "label": "Family",
        "signKey": "family",
        "handshape": "F",
        "startAnchor": "chest",
        "endAnchor": "chest",
        "startPosition": {
          "x": 100,
          "y": 114
        },
        "endPosition": {
          "x": 100,
          "y": 114
        },
        "path": "circle",
        "orientation": "palm_forward",
        "location": "chest"
      }
    ],
    "steps": [
      "Sign each component sign in conversational sequence: I → Love → Family.",
      "Express grammatical mode with facial expressions (eyebrows raised for yes/no, furrowed for WH-questions).",
      "Transition smoothly between signs at natural conversational tempo."
    ],
    "tip": "Conversational phrase built from foundational vocabulary signs."
  },
  {
    "id": "adv-my-brother-is-happy",
    "label": "My Brother Is Happy",
    "category": "greetings",
    "level": "advanced",
    "theme": "Family and social",
    "order": 203,
    "xp": 25,
    "prerequisites": [
      "word-brother",
      "word-happy"
    ],
    "media": {
      "type": "svg",
      "url": "/signs/asl/my_brother_is_happy.svg",
      "alt": "ASL phrase: My Brother Is Happy"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "B",
      "startPosition": {
        "x": 100,
        "y": 114
      },
      "endPosition": {
        "x": 100,
        "y": 114
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "chest",
      "repeat": "infinite",
      "durationMs": 2200,
      "motionTag": "motion",
      "tokens": [
        {
          "id": "t-adv-my-brother-is-happy-0",
          "label": "My",
          "signKey": "my",
          "handshape": "B",
          "startAnchor": "chest",
          "endAnchor": "chest",
          "startPosition": {
            "x": 100,
            "y": 114
          },
          "endPosition": {
            "x": 100,
            "y": 114
          },
          "path": "tap",
          "orientation": "palm_inward",
          "location": "chest"
        },
        {
          "id": "t-adv-my-brother-is-happy-1",
          "label": "Brother",
          "signKey": "brother",
          "handshape": "L",
          "startAnchor": "forehead",
          "endAnchor": "neutral_space",
          "startPosition": {
            "x": 100,
            "y": 34
          },
          "endPosition": {
            "x": 75,
            "y": 65
          },
          "path": "line",
          "orientation": "palm_forward",
          "location": "forehead"
        },
        {
          "id": "t-adv-my-brother-is-happy-2",
          "label": "Happy",
          "signKey": "happy",
          "handshape": "B",
          "startAnchor": "chest",
          "endAnchor": "chest",
          "startPosition": {
            "x": 100,
            "y": 114
          },
          "endPosition": {
            "x": 100,
            "y": 114
          },
          "path": "arc",
          "orientation": "palm_inward",
          "location": "chest"
        }
      ],
      "startAnchor": "chest",
      "endAnchor": "chest"
    },
    "tokens": [
      {
        "id": "t-adv-my-brother-is-happy-0",
        "label": "My",
        "signKey": "my",
        "handshape": "B",
        "startAnchor": "chest",
        "endAnchor": "chest",
        "startPosition": {
          "x": 100,
          "y": 114
        },
        "endPosition": {
          "x": 100,
          "y": 114
        },
        "path": "tap",
        "orientation": "palm_inward",
        "location": "chest"
      },
      {
        "id": "t-adv-my-brother-is-happy-1",
        "label": "Brother",
        "signKey": "brother",
        "handshape": "L",
        "startAnchor": "forehead",
        "endAnchor": "neutral_space",
        "startPosition": {
          "x": 100,
          "y": 34
        },
        "endPosition": {
          "x": 75,
          "y": 65
        },
        "path": "line",
        "orientation": "palm_forward",
        "location": "forehead"
      },
      {
        "id": "t-adv-my-brother-is-happy-2",
        "label": "Happy",
        "signKey": "happy",
        "handshape": "B",
        "startAnchor": "chest",
        "endAnchor": "chest",
        "startPosition": {
          "x": 100,
          "y": 114
        },
        "endPosition": {
          "x": 100,
          "y": 114
        },
        "path": "arc",
        "orientation": "palm_inward",
        "location": "chest"
      }
    ],
    "steps": [
      "Sign each component sign in conversational sequence: My → Brother → Happy.",
      "Express grammatical mode with facial expressions (eyebrows raised for yes/no, furrowed for WH-questions).",
      "Transition smoothly between signs at natural conversational tempo."
    ],
    "tip": "Conversational phrase built from foundational vocabulary signs."
  },
  {
    "id": "adv-nice-to-meet-you",
    "label": "Nice To Meet You",
    "category": "greetings",
    "level": "advanced",
    "theme": "Family and social",
    "order": 204,
    "xp": 25,
    "prerequisites": [
      "word-good",
      "word-friend"
    ],
    "media": {
      "type": "svg",
      "url": "/signs/asl/nice_to_meet_you.svg",
      "alt": "ASL phrase: Nice To Meet You"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "B",
      "startPosition": {
        "x": 75,
        "y": 65
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 2200,
      "motionTag": "motion",
      "tokens": [
        {
          "id": "t-adv-nice-to-meet-you-0",
          "label": "Nice",
          "signKey": "nice",
          "handshape": "B",
          "startAnchor": "neutral_space",
          "endAnchor": "neutral_space",
          "startPosition": {
            "x": 75,
            "y": 65
          },
          "endPosition": {
            "x": 75,
            "y": 65
          },
          "path": "tap",
          "orientation": "palm_forward",
          "location": "neutral_space"
        },
        {
          "id": "t-adv-nice-to-meet-you-1",
          "label": "Meet",
          "signKey": "meet",
          "handshape": "1",
          "startAnchor": "neutral_space",
          "endAnchor": "neutral_space",
          "startPosition": {
            "x": 75,
            "y": 65
          },
          "endPosition": {
            "x": 75,
            "y": 65
          },
          "path": "tap",
          "orientation": "palm_forward",
          "location": "neutral_space"
        },
        {
          "id": "t-adv-nice-to-meet-you-2",
          "label": "You",
          "signKey": "you",
          "handshape": "1",
          "startAnchor": "neutral_space",
          "endAnchor": "neutral_space",
          "startPosition": {
            "x": 75,
            "y": 65
          },
          "endPosition": {
            "x": 75,
            "y": 65
          },
          "path": "forward",
          "orientation": "palm_forward",
          "location": "neutral_space"
        }
      ],
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "tokens": [
      {
        "id": "t-adv-nice-to-meet-you-0",
        "label": "Nice",
        "signKey": "nice",
        "handshape": "B",
        "startAnchor": "neutral_space",
        "endAnchor": "neutral_space",
        "startPosition": {
          "x": 75,
          "y": 65
        },
        "endPosition": {
          "x": 75,
          "y": 65
        },
        "path": "tap",
        "orientation": "palm_forward",
        "location": "neutral_space"
      },
      {
        "id": "t-adv-nice-to-meet-you-1",
        "label": "Meet",
        "signKey": "meet",
        "handshape": "1",
        "startAnchor": "neutral_space",
        "endAnchor": "neutral_space",
        "startPosition": {
          "x": 75,
          "y": 65
        },
        "endPosition": {
          "x": 75,
          "y": 65
        },
        "path": "tap",
        "orientation": "palm_forward",
        "location": "neutral_space"
      },
      {
        "id": "t-adv-nice-to-meet-you-2",
        "label": "You",
        "signKey": "you",
        "handshape": "1",
        "startAnchor": "neutral_space",
        "endAnchor": "neutral_space",
        "startPosition": {
          "x": 75,
          "y": 65
        },
        "endPosition": {
          "x": 75,
          "y": 65
        },
        "path": "forward",
        "orientation": "palm_forward",
        "location": "neutral_space"
      }
    ],
    "steps": [
      "Sign each component sign in conversational sequence: Nice → Meet → You.",
      "Express grammatical mode with facial expressions (eyebrows raised for yes/no, furrowed for WH-questions).",
      "Transition smoothly between signs at natural conversational tempo."
    ],
    "tip": "Conversational phrase built from foundational vocabulary signs."
  },
  {
    "id": "adv-my-sister-at-home",
    "label": "My Sister Is At Home",
    "category": "greetings",
    "level": "advanced",
    "theme": "Family and social",
    "order": 205,
    "xp": 25,
    "prerequisites": [
      "word-sister",
      "word-home"
    ],
    "media": {
      "type": "svg",
      "url": "/signs/asl/my_sister_at_home.svg",
      "alt": "ASL phrase: My Sister Is At Home"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "B",
      "startPosition": {
        "x": 100,
        "y": 114
      },
      "endPosition": {
        "x": 122,
        "y": 58
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "chest",
      "repeat": "infinite",
      "durationMs": 2200,
      "motionTag": "motion",
      "tokens": [
        {
          "id": "t-adv-my-sister-at-home-0",
          "label": "My",
          "signKey": "my",
          "handshape": "B",
          "startAnchor": "chest",
          "endAnchor": "chest",
          "startPosition": {
            "x": 100,
            "y": 114
          },
          "endPosition": {
            "x": 100,
            "y": 114
          },
          "path": "tap",
          "orientation": "palm_inward",
          "location": "chest"
        },
        {
          "id": "t-adv-my-sister-at-home-1",
          "label": "Sister",
          "signKey": "sister",
          "handshape": "L",
          "startAnchor": "chin",
          "endAnchor": "neutral_space",
          "startPosition": {
            "x": 100,
            "y": 74
          },
          "endPosition": {
            "x": 75,
            "y": 65
          },
          "path": "line",
          "orientation": "palm_forward",
          "location": "chin"
        },
        {
          "id": "t-adv-my-sister-at-home-2",
          "label": "Home",
          "signKey": "home",
          "handshape": "O",
          "startAnchor": "chin",
          "endAnchor": "cheek",
          "startPosition": {
            "x": 100,
            "y": 74
          },
          "endPosition": {
            "x": 122,
            "y": 58
          },
          "path": "line",
          "orientation": "palm_inward",
          "location": "chin"
        }
      ],
      "startAnchor": "chest",
      "endAnchor": "cheek"
    },
    "tokens": [
      {
        "id": "t-adv-my-sister-at-home-0",
        "label": "My",
        "signKey": "my",
        "handshape": "B",
        "startAnchor": "chest",
        "endAnchor": "chest",
        "startPosition": {
          "x": 100,
          "y": 114
        },
        "endPosition": {
          "x": 100,
          "y": 114
        },
        "path": "tap",
        "orientation": "palm_inward",
        "location": "chest"
      },
      {
        "id": "t-adv-my-sister-at-home-1",
        "label": "Sister",
        "signKey": "sister",
        "handshape": "L",
        "startAnchor": "chin",
        "endAnchor": "neutral_space",
        "startPosition": {
          "x": 100,
          "y": 74
        },
        "endPosition": {
          "x": 75,
          "y": 65
        },
        "path": "line",
        "orientation": "palm_forward",
        "location": "chin"
      },
      {
        "id": "t-adv-my-sister-at-home-2",
        "label": "Home",
        "signKey": "home",
        "handshape": "O",
        "startAnchor": "chin",
        "endAnchor": "cheek",
        "startPosition": {
          "x": 100,
          "y": 74
        },
        "endPosition": {
          "x": 122,
          "y": 58
        },
        "path": "line",
        "orientation": "palm_inward",
        "location": "chin"
      }
    ],
    "steps": [
      "Sign each component sign in conversational sequence: My → Sister → Home.",
      "Express grammatical mode with facial expressions (eyebrows raised for yes/no, furrowed for WH-questions).",
      "Transition smoothly between signs at natural conversational tempo."
    ],
    "tip": "Conversational phrase built from foundational vocabulary signs."
  },
  {
    "id": "adv-i-need-help",
    "label": "I Need Help",
    "category": "greetings",
    "level": "advanced",
    "theme": "Needs and health",
    "order": 206,
    "xp": 25,
    "prerequisites": [
      "word-help",
      "word-please"
    ],
    "media": {
      "type": "svg",
      "url": "/signs/asl/i_need_help.svg",
      "alt": "ASL phrase: I Need Help"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "1",
      "startPosition": {
        "x": 100,
        "y": 114
      },
      "endPosition": {
        "x": 100,
        "y": 114
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "chest",
      "repeat": "infinite",
      "durationMs": 2200,
      "motionTag": "motion",
      "tokens": [
        {
          "id": "t-adv-i-need-help-0",
          "label": "I",
          "signKey": "i",
          "handshape": "1",
          "startAnchor": "chest",
          "endAnchor": "chest",
          "startPosition": {
            "x": 100,
            "y": 114
          },
          "endPosition": {
            "x": 100,
            "y": 114
          },
          "path": "tap",
          "orientation": "palm_inward",
          "location": "chest"
        },
        {
          "id": "t-adv-i-need-help-1",
          "label": "Need",
          "signKey": "need",
          "handshape": "X",
          "startAnchor": "neutral_space",
          "endAnchor": "neutral_space",
          "startPosition": {
            "x": 75,
            "y": 65
          },
          "endPosition": {
            "x": 75,
            "y": 65
          },
          "path": "tap",
          "orientation": "palm_forward",
          "location": "neutral_space"
        },
        {
          "id": "t-adv-i-need-help-2",
          "label": "Help",
          "signKey": "help",
          "handshape": "10",
          "startAnchor": "neutral_space",
          "endAnchor": "chest",
          "startPosition": {
            "x": 75,
            "y": 65
          },
          "endPosition": {
            "x": 100,
            "y": 114
          },
          "path": "line",
          "orientation": "palm_forward",
          "location": "chest"
        }
      ],
      "startAnchor": "chest",
      "endAnchor": "chest"
    },
    "tokens": [
      {
        "id": "t-adv-i-need-help-0",
        "label": "I",
        "signKey": "i",
        "handshape": "1",
        "startAnchor": "chest",
        "endAnchor": "chest",
        "startPosition": {
          "x": 100,
          "y": 114
        },
        "endPosition": {
          "x": 100,
          "y": 114
        },
        "path": "tap",
        "orientation": "palm_inward",
        "location": "chest"
      },
      {
        "id": "t-adv-i-need-help-1",
        "label": "Need",
        "signKey": "need",
        "handshape": "X",
        "startAnchor": "neutral_space",
        "endAnchor": "neutral_space",
        "startPosition": {
          "x": 75,
          "y": 65
        },
        "endPosition": {
          "x": 75,
          "y": 65
        },
        "path": "tap",
        "orientation": "palm_forward",
        "location": "neutral_space"
      },
      {
        "id": "t-adv-i-need-help-2",
        "label": "Help",
        "signKey": "help",
        "handshape": "10",
        "startAnchor": "neutral_space",
        "endAnchor": "chest",
        "startPosition": {
          "x": 75,
          "y": 65
        },
        "endPosition": {
          "x": 100,
          "y": 114
        },
        "path": "line",
        "orientation": "palm_forward",
        "location": "chest"
      }
    ],
    "steps": [
      "Sign each component sign in conversational sequence: I → Need → Help.",
      "Express grammatical mode with facial expressions (eyebrows raised for yes/no, furrowed for WH-questions).",
      "Transition smoothly between signs at natural conversational tempo."
    ],
    "tip": "Conversational phrase built from foundational vocabulary signs."
  },
  {
    "id": "adv-where-bathroom",
    "label": "Where Is The Bathroom?",
    "category": "greetings",
    "level": "advanced",
    "theme": "Needs and health",
    "order": 207,
    "xp": 25,
    "prerequisites": [
      "word-where",
      "word-bathroom"
    ],
    "media": {
      "type": "svg",
      "url": "/signs/asl/where_bathroom.svg",
      "alt": "ASL phrase: Where Is The Bathroom?"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "T",
      "startPosition": {
        "x": 75,
        "y": 65
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 2200,
      "motionTag": "motion",
      "tokens": [
        {
          "id": "t-adv-where-bathroom-0",
          "label": "Bathroom",
          "signKey": "bathroom",
          "handshape": "T",
          "startAnchor": "neutral_space",
          "endAnchor": "neutral_space",
          "startPosition": {
            "x": 75,
            "y": 65
          },
          "endPosition": {
            "x": 75,
            "y": 65
          },
          "path": "shake",
          "orientation": "palm_forward",
          "location": "neutral_space"
        },
        {
          "id": "t-adv-where-bathroom-1",
          "label": "Where",
          "signKey": "where",
          "handshape": "1",
          "startAnchor": "neutral_space",
          "endAnchor": "neutral_space",
          "startPosition": {
            "x": 75,
            "y": 65
          },
          "endPosition": {
            "x": 75,
            "y": 65
          },
          "path": "shake",
          "orientation": "palm_forward",
          "location": "neutral_space"
        }
      ],
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "tokens": [
      {
        "id": "t-adv-where-bathroom-0",
        "label": "Bathroom",
        "signKey": "bathroom",
        "handshape": "T",
        "startAnchor": "neutral_space",
        "endAnchor": "neutral_space",
        "startPosition": {
          "x": 75,
          "y": 65
        },
        "endPosition": {
          "x": 75,
          "y": 65
        },
        "path": "shake",
        "orientation": "palm_forward",
        "location": "neutral_space"
      },
      {
        "id": "t-adv-where-bathroom-1",
        "label": "Where",
        "signKey": "where",
        "handshape": "1",
        "startAnchor": "neutral_space",
        "endAnchor": "neutral_space",
        "startPosition": {
          "x": 75,
          "y": 65
        },
        "endPosition": {
          "x": 75,
          "y": 65
        },
        "path": "shake",
        "orientation": "palm_forward",
        "location": "neutral_space"
      }
    ],
    "steps": [
      "Sign each component sign in conversational sequence: Bathroom → Where.",
      "Express grammatical mode with facial expressions (eyebrows raised for yes/no, furrowed for WH-questions).",
      "Transition smoothly between signs at natural conversational tempo."
    ],
    "tip": "Conversational phrase built from foundational vocabulary signs."
  },
  {
    "id": "adv-where-hospital",
    "label": "Where Is The Hospital?",
    "category": "greetings",
    "level": "advanced",
    "theme": "Needs and health",
    "order": 208,
    "xp": 25,
    "prerequisites": [
      "word-where",
      "word-hospital"
    ],
    "media": {
      "type": "svg",
      "url": "/signs/asl/where_hospital.svg",
      "alt": "ASL phrase: Where Is The Hospital?"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "H",
      "startPosition": {
        "x": 48,
        "y": 106
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "shoulder",
      "repeat": "infinite",
      "durationMs": 2200,
      "motionTag": "motion",
      "tokens": [
        {
          "id": "t-adv-where-hospital-0",
          "label": "Hospital",
          "signKey": "hospital",
          "handshape": "H",
          "startAnchor": "shoulder",
          "endAnchor": "shoulder",
          "startPosition": {
            "x": 48,
            "y": 106
          },
          "endPosition": {
            "x": 48,
            "y": 106
          },
          "path": "line",
          "orientation": "palm_forward",
          "location": "shoulder"
        },
        {
          "id": "t-adv-where-hospital-1",
          "label": "Where",
          "signKey": "where",
          "handshape": "1",
          "startAnchor": "neutral_space",
          "endAnchor": "neutral_space",
          "startPosition": {
            "x": 75,
            "y": 65
          },
          "endPosition": {
            "x": 75,
            "y": 65
          },
          "path": "shake",
          "orientation": "palm_forward",
          "location": "neutral_space"
        }
      ],
      "startAnchor": "shoulder",
      "endAnchor": "neutral_space"
    },
    "tokens": [
      {
        "id": "t-adv-where-hospital-0",
        "label": "Hospital",
        "signKey": "hospital",
        "handshape": "H",
        "startAnchor": "shoulder",
        "endAnchor": "shoulder",
        "startPosition": {
          "x": 48,
          "y": 106
        },
        "endPosition": {
          "x": 48,
          "y": 106
        },
        "path": "line",
        "orientation": "palm_forward",
        "location": "shoulder"
      },
      {
        "id": "t-adv-where-hospital-1",
        "label": "Where",
        "signKey": "where",
        "handshape": "1",
        "startAnchor": "neutral_space",
        "endAnchor": "neutral_space",
        "startPosition": {
          "x": 75,
          "y": 65
        },
        "endPosition": {
          "x": 75,
          "y": 65
        },
        "path": "shake",
        "orientation": "palm_forward",
        "location": "neutral_space"
      }
    ],
    "steps": [
      "Sign each component sign in conversational sequence: Hospital → Where.",
      "Express grammatical mode with facial expressions (eyebrows raised for yes/no, furrowed for WH-questions).",
      "Transition smoothly between signs at natural conversational tempo."
    ],
    "tip": "Conversational phrase built from foundational vocabulary signs."
  },
  {
    "id": "adv-i-am-hungry",
    "label": "I Am Hungry",
    "category": "greetings",
    "level": "advanced",
    "theme": "Needs and health",
    "order": 209,
    "xp": 25,
    "prerequisites": [
      "word-hungry",
      "word-eat"
    ],
    "media": {
      "type": "svg",
      "url": "/signs/asl/i_am_hungry.svg",
      "alt": "ASL phrase: I Am Hungry"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "1",
      "startPosition": {
        "x": 100,
        "y": 114
      },
      "endPosition": {
        "x": 100,
        "y": 114
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "chest",
      "repeat": "infinite",
      "durationMs": 2200,
      "motionTag": "motion",
      "tokens": [
        {
          "id": "t-adv-i-am-hungry-0",
          "label": "I",
          "signKey": "i",
          "handshape": "1",
          "startAnchor": "chest",
          "endAnchor": "chest",
          "startPosition": {
            "x": 100,
            "y": 114
          },
          "endPosition": {
            "x": 100,
            "y": 114
          },
          "path": "tap",
          "orientation": "palm_inward",
          "location": "chest"
        },
        {
          "id": "t-adv-i-am-hungry-1",
          "label": "Hungry",
          "signKey": "hungry",
          "handshape": "C",
          "startAnchor": "chest",
          "endAnchor": "chest",
          "startPosition": {
            "x": 100,
            "y": 114
          },
          "endPosition": {
            "x": 100,
            "y": 114
          },
          "path": "line",
          "orientation": "palm_inward",
          "location": "chest"
        }
      ],
      "startAnchor": "chest",
      "endAnchor": "chest"
    },
    "tokens": [
      {
        "id": "t-adv-i-am-hungry-0",
        "label": "I",
        "signKey": "i",
        "handshape": "1",
        "startAnchor": "chest",
        "endAnchor": "chest",
        "startPosition": {
          "x": 100,
          "y": 114
        },
        "endPosition": {
          "x": 100,
          "y": 114
        },
        "path": "tap",
        "orientation": "palm_inward",
        "location": "chest"
      },
      {
        "id": "t-adv-i-am-hungry-1",
        "label": "Hungry",
        "signKey": "hungry",
        "handshape": "C",
        "startAnchor": "chest",
        "endAnchor": "chest",
        "startPosition": {
          "x": 100,
          "y": 114
        },
        "endPosition": {
          "x": 100,
          "y": 114
        },
        "path": "line",
        "orientation": "palm_inward",
        "location": "chest"
      }
    ],
    "steps": [
      "Sign each component sign in conversational sequence: I → Hungry.",
      "Express grammatical mode with facial expressions (eyebrows raised for yes/no, furrowed for WH-questions).",
      "Transition smoothly between signs at natural conversational tempo."
    ],
    "tip": "Conversational phrase built from foundational vocabulary signs."
  },
  {
    "id": "adv-i-am-thirsty",
    "label": "I Am Thirsty",
    "category": "greetings",
    "level": "advanced",
    "theme": "Needs and health",
    "order": 210,
    "xp": 25,
    "prerequisites": [
      "word-thirsty",
      "word-water"
    ],
    "media": {
      "type": "svg",
      "url": "/signs/asl/i_am_thirsty.svg",
      "alt": "ASL phrase: I Am Thirsty"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "1",
      "startPosition": {
        "x": 100,
        "y": 114
      },
      "endPosition": {
        "x": 100,
        "y": 114
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "chest",
      "repeat": "infinite",
      "durationMs": 2200,
      "motionTag": "motion",
      "tokens": [
        {
          "id": "t-adv-i-am-thirsty-0",
          "label": "I",
          "signKey": "i",
          "handshape": "1",
          "startAnchor": "chest",
          "endAnchor": "chest",
          "startPosition": {
            "x": 100,
            "y": 114
          },
          "endPosition": {
            "x": 100,
            "y": 114
          },
          "path": "tap",
          "orientation": "palm_inward",
          "location": "chest"
        },
        {
          "id": "t-adv-i-am-thirsty-1",
          "label": "Thirsty",
          "signKey": "thirsty",
          "handshape": "1",
          "startAnchor": "chin",
          "endAnchor": "chest",
          "startPosition": {
            "x": 100,
            "y": 74
          },
          "endPosition": {
            "x": 100,
            "y": 114
          },
          "path": "line",
          "orientation": "palm_inward",
          "location": "chin"
        }
      ],
      "startAnchor": "chest",
      "endAnchor": "chest"
    },
    "tokens": [
      {
        "id": "t-adv-i-am-thirsty-0",
        "label": "I",
        "signKey": "i",
        "handshape": "1",
        "startAnchor": "chest",
        "endAnchor": "chest",
        "startPosition": {
          "x": 100,
          "y": 114
        },
        "endPosition": {
          "x": 100,
          "y": 114
        },
        "path": "tap",
        "orientation": "palm_inward",
        "location": "chest"
      },
      {
        "id": "t-adv-i-am-thirsty-1",
        "label": "Thirsty",
        "signKey": "thirsty",
        "handshape": "1",
        "startAnchor": "chin",
        "endAnchor": "chest",
        "startPosition": {
          "x": 100,
          "y": 74
        },
        "endPosition": {
          "x": 100,
          "y": 114
        },
        "path": "line",
        "orientation": "palm_inward",
        "location": "chin"
      }
    ],
    "steps": [
      "Sign each component sign in conversational sequence: I → Thirsty.",
      "Express grammatical mode with facial expressions (eyebrows raised for yes/no, furrowed for WH-questions).",
      "Transition smoothly between signs at natural conversational tempo."
    ],
    "tip": "Conversational phrase built from foundational vocabulary signs."
  },
  {
    "id": "adv-help-my-friend",
    "label": "Please Help My Friend",
    "category": "greetings",
    "level": "advanced",
    "theme": "Needs and health",
    "order": 211,
    "xp": 25,
    "prerequisites": [
      "word-please",
      "word-help",
      "word-friend"
    ],
    "media": {
      "type": "svg",
      "url": "/signs/asl/help_my_friend.svg",
      "alt": "ASL phrase: Please Help My Friend"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "B",
      "startPosition": {
        "x": 100,
        "y": 114
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "chest",
      "repeat": "infinite",
      "durationMs": 2200,
      "motionTag": "motion",
      "tokens": [
        {
          "id": "t-adv-help-my-friend-0",
          "label": "Please",
          "signKey": "please",
          "handshape": "B",
          "startAnchor": "chest",
          "endAnchor": "chest",
          "startPosition": {
            "x": 100,
            "y": 114
          },
          "endPosition": {
            "x": 100,
            "y": 114
          },
          "path": "circle",
          "orientation": "palm_inward",
          "location": "chest"
        },
        {
          "id": "t-adv-help-my-friend-1",
          "label": "Help",
          "signKey": "help",
          "handshape": "10",
          "startAnchor": "neutral_space",
          "endAnchor": "chest",
          "startPosition": {
            "x": 75,
            "y": 65
          },
          "endPosition": {
            "x": 100,
            "y": 114
          },
          "path": "line",
          "orientation": "palm_forward",
          "location": "chest"
        },
        {
          "id": "t-adv-help-my-friend-2",
          "label": "Friend",
          "signKey": "friend",
          "handshape": "X",
          "startAnchor": "neutral_space",
          "endAnchor": "neutral_space",
          "startPosition": {
            "x": 75,
            "y": 65
          },
          "endPosition": {
            "x": 75,
            "y": 65
          },
          "path": "tap",
          "orientation": "palm_forward",
          "location": "neutral_space"
        }
      ],
      "startAnchor": "chest",
      "endAnchor": "neutral_space"
    },
    "tokens": [
      {
        "id": "t-adv-help-my-friend-0",
        "label": "Please",
        "signKey": "please",
        "handshape": "B",
        "startAnchor": "chest",
        "endAnchor": "chest",
        "startPosition": {
          "x": 100,
          "y": 114
        },
        "endPosition": {
          "x": 100,
          "y": 114
        },
        "path": "circle",
        "orientation": "palm_inward",
        "location": "chest"
      },
      {
        "id": "t-adv-help-my-friend-1",
        "label": "Help",
        "signKey": "help",
        "handshape": "10",
        "startAnchor": "neutral_space",
        "endAnchor": "chest",
        "startPosition": {
          "x": 75,
          "y": 65
        },
        "endPosition": {
          "x": 100,
          "y": 114
        },
        "path": "line",
        "orientation": "palm_forward",
        "location": "chest"
      },
      {
        "id": "t-adv-help-my-friend-2",
        "label": "Friend",
        "signKey": "friend",
        "handshape": "X",
        "startAnchor": "neutral_space",
        "endAnchor": "neutral_space",
        "startPosition": {
          "x": 75,
          "y": 65
        },
        "endPosition": {
          "x": 75,
          "y": 65
        },
        "path": "tap",
        "orientation": "palm_forward",
        "location": "neutral_space"
      }
    ],
    "steps": [
      "Sign each component sign in conversational sequence: Please → Help → Friend.",
      "Express grammatical mode with facial expressions (eyebrows raised for yes/no, furrowed for WH-questions).",
      "Transition smoothly between signs at natural conversational tempo."
    ],
    "tip": "Conversational phrase built from foundational vocabulary signs."
  },
  {
    "id": "adv-go-to-school",
    "label": "I Go To School",
    "category": "greetings",
    "level": "advanced",
    "theme": "School and work",
    "order": 212,
    "xp": 25,
    "prerequisites": [
      "word-school",
      "word-learn"
    ],
    "media": {
      "type": "svg",
      "url": "/signs/asl/go_to_school.svg",
      "alt": "ASL phrase: I Go To School"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "1",
      "startPosition": {
        "x": 100,
        "y": 114
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "chest",
      "repeat": "infinite",
      "durationMs": 2200,
      "motionTag": "motion",
      "tokens": [
        {
          "id": "t-adv-go-to-school-0",
          "label": "I",
          "signKey": "i",
          "handshape": "1",
          "startAnchor": "chest",
          "endAnchor": "chest",
          "startPosition": {
            "x": 100,
            "y": 114
          },
          "endPosition": {
            "x": 100,
            "y": 114
          },
          "path": "tap",
          "orientation": "palm_inward",
          "location": "chest"
        },
        {
          "id": "t-adv-go-to-school-1",
          "label": "Go",
          "signKey": "go",
          "handshape": "1",
          "startAnchor": "neutral_space",
          "endAnchor": "neutral_space",
          "startPosition": {
            "x": 75,
            "y": 65
          },
          "endPosition": {
            "x": 75,
            "y": 65
          },
          "path": "forward",
          "orientation": "palm_forward",
          "location": "neutral_space"
        },
        {
          "id": "t-adv-go-to-school-2",
          "label": "School",
          "signKey": "school",
          "handshape": "B",
          "startAnchor": "neutral_space",
          "endAnchor": "neutral_space",
          "startPosition": {
            "x": 75,
            "y": 65
          },
          "endPosition": {
            "x": 75,
            "y": 65
          },
          "path": "tap",
          "orientation": "palm_forward",
          "location": "neutral_space"
        }
      ],
      "startAnchor": "chest",
      "endAnchor": "neutral_space"
    },
    "tokens": [
      {
        "id": "t-adv-go-to-school-0",
        "label": "I",
        "signKey": "i",
        "handshape": "1",
        "startAnchor": "chest",
        "endAnchor": "chest",
        "startPosition": {
          "x": 100,
          "y": 114
        },
        "endPosition": {
          "x": 100,
          "y": 114
        },
        "path": "tap",
        "orientation": "palm_inward",
        "location": "chest"
      },
      {
        "id": "t-adv-go-to-school-1",
        "label": "Go",
        "signKey": "go",
        "handshape": "1",
        "startAnchor": "neutral_space",
        "endAnchor": "neutral_space",
        "startPosition": {
          "x": 75,
          "y": 65
        },
        "endPosition": {
          "x": 75,
          "y": 65
        },
        "path": "forward",
        "orientation": "palm_forward",
        "location": "neutral_space"
      },
      {
        "id": "t-adv-go-to-school-2",
        "label": "School",
        "signKey": "school",
        "handshape": "B",
        "startAnchor": "neutral_space",
        "endAnchor": "neutral_space",
        "startPosition": {
          "x": 75,
          "y": 65
        },
        "endPosition": {
          "x": 75,
          "y": 65
        },
        "path": "tap",
        "orientation": "palm_forward",
        "location": "neutral_space"
      }
    ],
    "steps": [
      "Sign each component sign in conversational sequence: I → Go → School.",
      "Express grammatical mode with facial expressions (eyebrows raised for yes/no, furrowed for WH-questions).",
      "Transition smoothly between signs at natural conversational tempo."
    ],
    "tip": "Conversational phrase built from foundational vocabulary signs."
  },
  {
    "id": "adv-who-is-teacher",
    "label": "Who Is The Teacher?",
    "category": "greetings",
    "level": "advanced",
    "theme": "School and work",
    "order": 213,
    "xp": 25,
    "prerequisites": [
      "word-who",
      "word-teacher"
    ],
    "media": {
      "type": "svg",
      "url": "/signs/asl/who_is_teacher.svg",
      "alt": "ASL phrase: Who Is The Teacher?"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "O",
      "startPosition": {
        "x": 100,
        "y": 34
      },
      "endPosition": {
        "x": 100,
        "y": 70
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "forehead",
      "repeat": "infinite",
      "durationMs": 2200,
      "motionTag": "motion",
      "tokens": [
        {
          "id": "t-adv-who-is-teacher-0",
          "label": "Teacher",
          "signKey": "teacher",
          "handshape": "O",
          "startAnchor": "forehead",
          "endAnchor": "neutral_space",
          "startPosition": {
            "x": 100,
            "y": 34
          },
          "endPosition": {
            "x": 75,
            "y": 65
          },
          "path": "line",
          "orientation": "palm_forward",
          "location": "forehead"
        },
        {
          "id": "t-adv-who-is-teacher-1",
          "label": "Who",
          "signKey": "who",
          "handshape": "1",
          "startAnchor": "chin/lips",
          "endAnchor": "chin/lips",
          "startPosition": {
            "x": 100,
            "y": 70
          },
          "endPosition": {
            "x": 100,
            "y": 70
          },
          "path": "circle",
          "orientation": "palm_forward",
          "location": "chin"
        }
      ],
      "startAnchor": "forehead",
      "endAnchor": "chin/lips"
    },
    "tokens": [
      {
        "id": "t-adv-who-is-teacher-0",
        "label": "Teacher",
        "signKey": "teacher",
        "handshape": "O",
        "startAnchor": "forehead",
        "endAnchor": "neutral_space",
        "startPosition": {
          "x": 100,
          "y": 34
        },
        "endPosition": {
          "x": 75,
          "y": 65
        },
        "path": "line",
        "orientation": "palm_forward",
        "location": "forehead"
      },
      {
        "id": "t-adv-who-is-teacher-1",
        "label": "Who",
        "signKey": "who",
        "handshape": "1",
        "startAnchor": "chin/lips",
        "endAnchor": "chin/lips",
        "startPosition": {
          "x": 100,
          "y": 70
        },
        "endPosition": {
          "x": 100,
          "y": 70
        },
        "path": "circle",
        "orientation": "palm_forward",
        "location": "chin"
      }
    ],
    "steps": [
      "Sign each component sign in conversational sequence: Teacher → Who.",
      "Express grammatical mode with facial expressions (eyebrows raised for yes/no, furrowed for WH-questions).",
      "Transition smoothly between signs at natural conversational tempo."
    ],
    "tip": "Conversational phrase built from foundational vocabulary signs."
  },
  {
    "id": "adv-i-love-learn",
    "label": "I Love To Learn",
    "category": "greetings",
    "level": "advanced",
    "theme": "School and work",
    "order": 214,
    "xp": 25,
    "prerequisites": [
      "word-love",
      "word-learn",
      "word-book"
    ],
    "media": {
      "type": "svg",
      "url": "/signs/asl/i_love_learn.svg",
      "alt": "ASL phrase: I Love To Learn"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "1",
      "startPosition": {
        "x": 100,
        "y": 114
      },
      "endPosition": {
        "x": 100,
        "y": 34
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "chest",
      "repeat": "infinite",
      "durationMs": 2200,
      "motionTag": "motion",
      "tokens": [
        {
          "id": "t-adv-i-love-learn-0",
          "label": "I",
          "signKey": "i",
          "handshape": "1",
          "startAnchor": "chest",
          "endAnchor": "chest",
          "startPosition": {
            "x": 100,
            "y": 114
          },
          "endPosition": {
            "x": 100,
            "y": 114
          },
          "path": "tap",
          "orientation": "palm_inward",
          "location": "chest"
        },
        {
          "id": "t-adv-i-love-learn-1",
          "label": "Love",
          "signKey": "love",
          "handshape": "S",
          "startAnchor": "chest",
          "endAnchor": "chest",
          "startPosition": {
            "x": 100,
            "y": 114
          },
          "endPosition": {
            "x": 100,
            "y": 114
          },
          "path": "tap",
          "orientation": "palm_inward",
          "location": "chest"
        },
        {
          "id": "t-adv-i-love-learn-2",
          "label": "Learn",
          "signKey": "learn",
          "handshape": "O",
          "startAnchor": "neutral_space",
          "endAnchor": "forehead",
          "startPosition": {
            "x": 75,
            "y": 65
          },
          "endPosition": {
            "x": 100,
            "y": 34
          },
          "path": "line",
          "orientation": "palm_forward",
          "location": "forehead"
        }
      ],
      "startAnchor": "chest",
      "endAnchor": "forehead"
    },
    "tokens": [
      {
        "id": "t-adv-i-love-learn-0",
        "label": "I",
        "signKey": "i",
        "handshape": "1",
        "startAnchor": "chest",
        "endAnchor": "chest",
        "startPosition": {
          "x": 100,
          "y": 114
        },
        "endPosition": {
          "x": 100,
          "y": 114
        },
        "path": "tap",
        "orientation": "palm_inward",
        "location": "chest"
      },
      {
        "id": "t-adv-i-love-learn-1",
        "label": "Love",
        "signKey": "love",
        "handshape": "S",
        "startAnchor": "chest",
        "endAnchor": "chest",
        "startPosition": {
          "x": 100,
          "y": 114
        },
        "endPosition": {
          "x": 100,
          "y": 114
        },
        "path": "tap",
        "orientation": "palm_inward",
        "location": "chest"
      },
      {
        "id": "t-adv-i-love-learn-2",
        "label": "Learn",
        "signKey": "learn",
        "handshape": "O",
        "startAnchor": "neutral_space",
        "endAnchor": "forehead",
        "startPosition": {
          "x": 75,
          "y": 65
        },
        "endPosition": {
          "x": 100,
          "y": 34
        },
        "path": "line",
        "orientation": "palm_forward",
        "location": "forehead"
      }
    ],
    "steps": [
      "Sign each component sign in conversational sequence: I → Love → Learn.",
      "Express grammatical mode with facial expressions (eyebrows raised for yes/no, furrowed for WH-questions).",
      "Transition smoothly between signs at natural conversational tempo."
    ],
    "tip": "Conversational phrase built from foundational vocabulary signs."
  },
  {
    "id": "adv-dad-at-work",
    "label": "My Dad Is At Work",
    "category": "greetings",
    "level": "advanced",
    "theme": "School and work",
    "order": 215,
    "xp": 25,
    "prerequisites": [
      "word-dad",
      "word-work"
    ],
    "media": {
      "type": "svg",
      "url": "/signs/asl/dad_at_work.svg",
      "alt": "ASL phrase: My Dad Is At Work"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "5",
      "startPosition": {
        "x": 100,
        "y": 34
      },
      "endPosition": {
        "x": 78,
        "y": 104
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "forehead",
      "repeat": "infinite",
      "durationMs": 2200,
      "motionTag": "motion",
      "tokens": [
        {
          "id": "t-adv-dad-at-work-0",
          "label": "Dad",
          "signKey": "dad",
          "handshape": "5",
          "startAnchor": "forehead",
          "endAnchor": "forehead",
          "startPosition": {
            "x": 100,
            "y": 34
          },
          "endPosition": {
            "x": 100,
            "y": 34
          },
          "path": "tap",
          "orientation": "palm_forward",
          "location": "forehead"
        },
        {
          "id": "t-adv-dad-at-work-1",
          "label": "At",
          "signKey": "at",
          "handshape": "B",
          "startAnchor": "neutral_space",
          "endAnchor": "neutral_space",
          "startPosition": {
            "x": 75,
            "y": 65
          },
          "endPosition": {
            "x": 75,
            "y": 65
          },
          "path": "tap",
          "orientation": "palm_forward",
          "location": "neutral_space"
        },
        {
          "id": "t-adv-dad-at-work-2",
          "label": "Work",
          "signKey": "work",
          "handshape": "S",
          "startAnchor": "wrist",
          "endAnchor": "wrist",
          "startPosition": {
            "x": 78,
            "y": 104
          },
          "endPosition": {
            "x": 78,
            "y": 104
          },
          "path": "tap",
          "orientation": "palm_forward",
          "location": "wrist"
        }
      ],
      "startAnchor": "forehead",
      "endAnchor": "wrist"
    },
    "tokens": [
      {
        "id": "t-adv-dad-at-work-0",
        "label": "Dad",
        "signKey": "dad",
        "handshape": "5",
        "startAnchor": "forehead",
        "endAnchor": "forehead",
        "startPosition": {
          "x": 100,
          "y": 34
        },
        "endPosition": {
          "x": 100,
          "y": 34
        },
        "path": "tap",
        "orientation": "palm_forward",
        "location": "forehead"
      },
      {
        "id": "t-adv-dad-at-work-1",
        "label": "At",
        "signKey": "at",
        "handshape": "B",
        "startAnchor": "neutral_space",
        "endAnchor": "neutral_space",
        "startPosition": {
          "x": 75,
          "y": 65
        },
        "endPosition": {
          "x": 75,
          "y": 65
        },
        "path": "tap",
        "orientation": "palm_forward",
        "location": "neutral_space"
      },
      {
        "id": "t-adv-dad-at-work-2",
        "label": "Work",
        "signKey": "work",
        "handshape": "S",
        "startAnchor": "wrist",
        "endAnchor": "wrist",
        "startPosition": {
          "x": 78,
          "y": 104
        },
        "endPosition": {
          "x": 78,
          "y": 104
        },
        "path": "tap",
        "orientation": "palm_forward",
        "location": "wrist"
      }
    ],
    "steps": [
      "Sign each component sign in conversational sequence: Dad → At → Work.",
      "Express grammatical mode with facial expressions (eyebrows raised for yes/no, furrowed for WH-questions).",
      "Transition smoothly between signs at natural conversational tempo."
    ],
    "tip": "Conversational phrase built from foundational vocabulary signs."
  },
  {
    "id": "adv-do-you-have-class",
    "label": "Do You Have Class?",
    "category": "greetings",
    "level": "advanced",
    "theme": "School and work",
    "order": 216,
    "xp": 25,
    "prerequisites": [
      "word-class",
      "word-student"
    ],
    "media": {
      "type": "svg",
      "url": "/signs/asl/do_you_have_class.svg",
      "alt": "ASL phrase: Do You Have Class?"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "1",
      "startPosition": {
        "x": 75,
        "y": 65
      },
      "endPosition": {
        "x": 100,
        "y": 114
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 2200,
      "motionTag": "motion",
      "tokens": [
        {
          "id": "t-adv-do-you-have-class-0",
          "label": "You",
          "signKey": "you",
          "handshape": "1",
          "startAnchor": "neutral_space",
          "endAnchor": "neutral_space",
          "startPosition": {
            "x": 75,
            "y": 65
          },
          "endPosition": {
            "x": 75,
            "y": 65
          },
          "path": "forward",
          "orientation": "palm_forward",
          "location": "neutral_space"
        },
        {
          "id": "t-adv-do-you-have-class-1",
          "label": "Have",
          "signKey": "have",
          "handshape": "B",
          "startAnchor": "chest",
          "endAnchor": "chest",
          "startPosition": {
            "x": 100,
            "y": 114
          },
          "endPosition": {
            "x": 100,
            "y": 114
          },
          "path": "tap",
          "orientation": "palm_inward",
          "location": "chest"
        },
        {
          "id": "t-adv-do-you-have-class-2",
          "label": "Class",
          "signKey": "class",
          "handshape": "C",
          "startAnchor": "chest",
          "endAnchor": "chest",
          "startPosition": {
            "x": 100,
            "y": 114
          },
          "endPosition": {
            "x": 100,
            "y": 114
          },
          "path": "circle",
          "orientation": "palm_forward",
          "location": "chest"
        }
      ],
      "startAnchor": "neutral_space",
      "endAnchor": "chest"
    },
    "tokens": [
      {
        "id": "t-adv-do-you-have-class-0",
        "label": "You",
        "signKey": "you",
        "handshape": "1",
        "startAnchor": "neutral_space",
        "endAnchor": "neutral_space",
        "startPosition": {
          "x": 75,
          "y": 65
        },
        "endPosition": {
          "x": 75,
          "y": 65
        },
        "path": "forward",
        "orientation": "palm_forward",
        "location": "neutral_space"
      },
      {
        "id": "t-adv-do-you-have-class-1",
        "label": "Have",
        "signKey": "have",
        "handshape": "B",
        "startAnchor": "chest",
        "endAnchor": "chest",
        "startPosition": {
          "x": 100,
          "y": 114
        },
        "endPosition": {
          "x": 100,
          "y": 114
        },
        "path": "tap",
        "orientation": "palm_inward",
        "location": "chest"
      },
      {
        "id": "t-adv-do-you-have-class-2",
        "label": "Class",
        "signKey": "class",
        "handshape": "C",
        "startAnchor": "chest",
        "endAnchor": "chest",
        "startPosition": {
          "x": 100,
          "y": 114
        },
        "endPosition": {
          "x": 100,
          "y": 114
        },
        "path": "circle",
        "orientation": "palm_forward",
        "location": "chest"
      }
    ],
    "steps": [
      "Sign each component sign in conversational sequence: You → Have → Class.",
      "Express grammatical mode with facial expressions (eyebrows raised for yes/no, furrowed for WH-questions).",
      "Transition smoothly between signs at natural conversational tempo."
    ],
    "tip": "Conversational phrase built from foundational vocabulary signs."
  },
  {
    "id": "adv-i-learning-asl",
    "label": "I Am Learning Sign Language",
    "category": "greetings",
    "level": "advanced",
    "theme": "School and work",
    "order": 217,
    "xp": 25,
    "prerequisites": [
      "word-learn",
      "word-name"
    ],
    "media": {
      "type": "svg",
      "url": "/signs/asl/i_learning_asl.svg",
      "alt": "ASL phrase: I Am Learning Sign Language"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "1",
      "startPosition": {
        "x": 100,
        "y": 114
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "chest",
      "repeat": "infinite",
      "durationMs": 2200,
      "motionTag": "motion",
      "tokens": [
        {
          "id": "t-adv-i-learning-asl-0",
          "label": "I",
          "signKey": "i",
          "handshape": "1",
          "startAnchor": "chest",
          "endAnchor": "chest",
          "startPosition": {
            "x": 100,
            "y": 114
          },
          "endPosition": {
            "x": 100,
            "y": 114
          },
          "path": "tap",
          "orientation": "palm_inward",
          "location": "chest"
        },
        {
          "id": "t-adv-i-learning-asl-1",
          "label": "Learn",
          "signKey": "learn",
          "handshape": "O",
          "startAnchor": "neutral_space",
          "endAnchor": "forehead",
          "startPosition": {
            "x": 75,
            "y": 65
          },
          "endPosition": {
            "x": 100,
            "y": 34
          },
          "path": "line",
          "orientation": "palm_forward",
          "location": "forehead"
        },
        {
          "id": "t-adv-i-learning-asl-2",
          "label": "Sign",
          "signKey": "sign",
          "handshape": "B",
          "startAnchor": "neutral_space",
          "endAnchor": "neutral_space",
          "startPosition": {
            "x": 75,
            "y": 65
          },
          "endPosition": {
            "x": 75,
            "y": 65
          },
          "path": "tap",
          "orientation": "palm_forward",
          "location": "neutral_space"
        }
      ],
      "startAnchor": "chest",
      "endAnchor": "neutral_space"
    },
    "tokens": [
      {
        "id": "t-adv-i-learning-asl-0",
        "label": "I",
        "signKey": "i",
        "handshape": "1",
        "startAnchor": "chest",
        "endAnchor": "chest",
        "startPosition": {
          "x": 100,
          "y": 114
        },
        "endPosition": {
          "x": 100,
          "y": 114
        },
        "path": "tap",
        "orientation": "palm_inward",
        "location": "chest"
      },
      {
        "id": "t-adv-i-learning-asl-1",
        "label": "Learn",
        "signKey": "learn",
        "handshape": "O",
        "startAnchor": "neutral_space",
        "endAnchor": "forehead",
        "startPosition": {
          "x": 75,
          "y": 65
        },
        "endPosition": {
          "x": 100,
          "y": 34
        },
        "path": "line",
        "orientation": "palm_forward",
        "location": "forehead"
      },
      {
        "id": "t-adv-i-learning-asl-2",
        "label": "Sign",
        "signKey": "sign",
        "handshape": "B",
        "startAnchor": "neutral_space",
        "endAnchor": "neutral_space",
        "startPosition": {
          "x": 75,
          "y": 65
        },
        "endPosition": {
          "x": 75,
          "y": 65
        },
        "path": "tap",
        "orientation": "palm_forward",
        "location": "neutral_space"
      }
    ],
    "steps": [
      "Sign each component sign in conversational sequence: I → Learn → Sign.",
      "Express grammatical mode with facial expressions (eyebrows raised for yes/no, furrowed for WH-questions).",
      "Transition smoothly between signs at natural conversational tempo."
    ],
    "tip": "Conversational phrase built from foundational vocabulary signs."
  },
  {
    "id": "adv-tired-today",
    "label": "I Am Tired Today",
    "category": "greetings",
    "level": "advanced",
    "theme": "Feelings and daily conversation",
    "order": 218,
    "xp": 25,
    "prerequisites": [
      "word-tired",
      "word-today"
    ],
    "media": {
      "type": "svg",
      "url": "/signs/asl/tired_today.svg",
      "alt": "ASL phrase: I Am Tired Today"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "Y",
      "startPosition": {
        "x": 75,
        "y": 65
      },
      "endPosition": {
        "x": 100,
        "y": 114
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 2200,
      "motionTag": "motion",
      "tokens": [
        {
          "id": "t-adv-tired-today-0",
          "label": "Today",
          "signKey": "today",
          "handshape": "Y",
          "startAnchor": "neutral_space",
          "endAnchor": "neutral_space",
          "startPosition": {
            "x": 75,
            "y": 65
          },
          "endPosition": {
            "x": 75,
            "y": 65
          },
          "path": "tap",
          "orientation": "palm_up",
          "location": "neutral_space"
        },
        {
          "id": "t-adv-tired-today-1",
          "label": "I",
          "signKey": "i",
          "handshape": "1",
          "startAnchor": "chest",
          "endAnchor": "chest",
          "startPosition": {
            "x": 100,
            "y": 114
          },
          "endPosition": {
            "x": 100,
            "y": 114
          },
          "path": "tap",
          "orientation": "palm_inward",
          "location": "chest"
        },
        {
          "id": "t-adv-tired-today-2",
          "label": "Tired",
          "signKey": "tired",
          "handshape": "B",
          "startAnchor": "chest",
          "endAnchor": "chest",
          "startPosition": {
            "x": 100,
            "y": 114
          },
          "endPosition": {
            "x": 100,
            "y": 114
          },
          "path": "arc",
          "orientation": "palm_inward",
          "location": "chest"
        }
      ],
      "startAnchor": "neutral_space",
      "endAnchor": "chest"
    },
    "tokens": [
      {
        "id": "t-adv-tired-today-0",
        "label": "Today",
        "signKey": "today",
        "handshape": "Y",
        "startAnchor": "neutral_space",
        "endAnchor": "neutral_space",
        "startPosition": {
          "x": 75,
          "y": 65
        },
        "endPosition": {
          "x": 75,
          "y": 65
        },
        "path": "tap",
        "orientation": "palm_up",
        "location": "neutral_space"
      },
      {
        "id": "t-adv-tired-today-1",
        "label": "I",
        "signKey": "i",
        "handshape": "1",
        "startAnchor": "chest",
        "endAnchor": "chest",
        "startPosition": {
          "x": 100,
          "y": 114
        },
        "endPosition": {
          "x": 100,
          "y": 114
        },
        "path": "tap",
        "orientation": "palm_inward",
        "location": "chest"
      },
      {
        "id": "t-adv-tired-today-2",
        "label": "Tired",
        "signKey": "tired",
        "handshape": "B",
        "startAnchor": "chest",
        "endAnchor": "chest",
        "startPosition": {
          "x": 100,
          "y": 114
        },
        "endPosition": {
          "x": 100,
          "y": 114
        },
        "path": "arc",
        "orientation": "palm_inward",
        "location": "chest"
      }
    ],
    "steps": [
      "Sign each component sign in conversational sequence: Today → I → Tired.",
      "Express grammatical mode with facial expressions (eyebrows raised for yes/no, furrowed for WH-questions).",
      "Transition smoothly between signs at natural conversational tempo."
    ],
    "tip": "Conversational phrase built from foundational vocabulary signs."
  },
  {
    "id": "adv-why-are-you-sad",
    "label": "Why Are You Sad?",
    "category": "greetings",
    "level": "advanced",
    "theme": "Feelings and daily conversation",
    "order": 219,
    "xp": 25,
    "prerequisites": [
      "word-why",
      "word-sad"
    ],
    "media": {
      "type": "svg",
      "url": "/signs/asl/why_are_you_sad.svg",
      "alt": "ASL phrase: Why Are You Sad?"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "1",
      "startPosition": {
        "x": 75,
        "y": 65
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 2200,
      "motionTag": "motion",
      "tokens": [
        {
          "id": "t-adv-why-are-you-sad-0",
          "label": "You",
          "signKey": "you",
          "handshape": "1",
          "startAnchor": "neutral_space",
          "endAnchor": "neutral_space",
          "startPosition": {
            "x": 75,
            "y": 65
          },
          "endPosition": {
            "x": 75,
            "y": 65
          },
          "path": "forward",
          "orientation": "palm_forward",
          "location": "neutral_space"
        },
        {
          "id": "t-adv-why-are-you-sad-1",
          "label": "Sad",
          "signKey": "sad",
          "handshape": "5",
          "startAnchor": "eyes",
          "endAnchor": "chin",
          "startPosition": {
            "x": 100,
            "y": 46
          },
          "endPosition": {
            "x": 100,
            "y": 74
          },
          "path": "line",
          "orientation": "palm_inward",
          "location": "chin"
        },
        {
          "id": "t-adv-why-are-you-sad-2",
          "label": "Why",
          "signKey": "why",
          "handshape": "Y",
          "startAnchor": "forehead",
          "endAnchor": "neutral_space",
          "startPosition": {
            "x": 100,
            "y": 34
          },
          "endPosition": {
            "x": 75,
            "y": 65
          },
          "path": "forward",
          "orientation": "palm_forward",
          "location": "forehead"
        }
      ],
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "tokens": [
      {
        "id": "t-adv-why-are-you-sad-0",
        "label": "You",
        "signKey": "you",
        "handshape": "1",
        "startAnchor": "neutral_space",
        "endAnchor": "neutral_space",
        "startPosition": {
          "x": 75,
          "y": 65
        },
        "endPosition": {
          "x": 75,
          "y": 65
        },
        "path": "forward",
        "orientation": "palm_forward",
        "location": "neutral_space"
      },
      {
        "id": "t-adv-why-are-you-sad-1",
        "label": "Sad",
        "signKey": "sad",
        "handshape": "5",
        "startAnchor": "eyes",
        "endAnchor": "chin",
        "startPosition": {
          "x": 100,
          "y": 46
        },
        "endPosition": {
          "x": 100,
          "y": 74
        },
        "path": "line",
        "orientation": "palm_inward",
        "location": "chin"
      },
      {
        "id": "t-adv-why-are-you-sad-2",
        "label": "Why",
        "signKey": "why",
        "handshape": "Y",
        "startAnchor": "forehead",
        "endAnchor": "neutral_space",
        "startPosition": {
          "x": 100,
          "y": 34
        },
        "endPosition": {
          "x": 75,
          "y": 65
        },
        "path": "forward",
        "orientation": "palm_forward",
        "location": "forehead"
      }
    ],
    "steps": [
      "Sign each component sign in conversational sequence: You → Sad → Why.",
      "Express grammatical mode with facial expressions (eyebrows raised for yes/no, furrowed for WH-questions).",
      "Transition smoothly between signs at natural conversational tempo."
    ],
    "tip": "Conversational phrase built from foundational vocabulary signs."
  },
  {
    "id": "adv-how-are-you",
    "label": "How Are You?",
    "category": "greetings",
    "level": "advanced",
    "theme": "Feelings and daily conversation",
    "order": 220,
    "xp": 25,
    "prerequisites": [
      "word-how",
      "word-good"
    ],
    "media": {
      "type": "svg",
      "url": "/signs/asl/how_are_you.svg",
      "alt": "ASL phrase: How Are You?"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "B",
      "startPosition": {
        "x": 100,
        "y": 114
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "chest",
      "repeat": "infinite",
      "durationMs": 2200,
      "motionTag": "motion",
      "tokens": [
        {
          "id": "t-adv-how-are-you-0",
          "label": "How",
          "signKey": "how",
          "handshape": "B",
          "startAnchor": "chest",
          "endAnchor": "chest",
          "startPosition": {
            "x": 100,
            "y": 114
          },
          "endPosition": {
            "x": 100,
            "y": 114
          },
          "path": "arc",
          "orientation": "palm_inward",
          "location": "chest"
        },
        {
          "id": "t-adv-how-are-you-1",
          "label": "Are",
          "signKey": "are",
          "handshape": "B",
          "startAnchor": "neutral_space",
          "endAnchor": "neutral_space",
          "startPosition": {
            "x": 75,
            "y": 65
          },
          "endPosition": {
            "x": 75,
            "y": 65
          },
          "path": "tap",
          "orientation": "palm_forward",
          "location": "neutral_space"
        },
        {
          "id": "t-adv-how-are-you-2",
          "label": "You",
          "signKey": "you",
          "handshape": "1",
          "startAnchor": "neutral_space",
          "endAnchor": "neutral_space",
          "startPosition": {
            "x": 75,
            "y": 65
          },
          "endPosition": {
            "x": 75,
            "y": 65
          },
          "path": "forward",
          "orientation": "palm_forward",
          "location": "neutral_space"
        }
      ],
      "startAnchor": "chest",
      "endAnchor": "neutral_space"
    },
    "tokens": [
      {
        "id": "t-adv-how-are-you-0",
        "label": "How",
        "signKey": "how",
        "handshape": "B",
        "startAnchor": "chest",
        "endAnchor": "chest",
        "startPosition": {
          "x": 100,
          "y": 114
        },
        "endPosition": {
          "x": 100,
          "y": 114
        },
        "path": "arc",
        "orientation": "palm_inward",
        "location": "chest"
      },
      {
        "id": "t-adv-how-are-you-1",
        "label": "Are",
        "signKey": "are",
        "handshape": "B",
        "startAnchor": "neutral_space",
        "endAnchor": "neutral_space",
        "startPosition": {
          "x": 75,
          "y": 65
        },
        "endPosition": {
          "x": 75,
          "y": 65
        },
        "path": "tap",
        "orientation": "palm_forward",
        "location": "neutral_space"
      },
      {
        "id": "t-adv-how-are-you-2",
        "label": "You",
        "signKey": "you",
        "handshape": "1",
        "startAnchor": "neutral_space",
        "endAnchor": "neutral_space",
        "startPosition": {
          "x": 75,
          "y": 65
        },
        "endPosition": {
          "x": 75,
          "y": 65
        },
        "path": "forward",
        "orientation": "palm_forward",
        "location": "neutral_space"
      }
    ],
    "steps": [
      "Sign each component sign in conversational sequence: How → Are → You.",
      "Express grammatical mode with facial expressions (eyebrows raised for yes/no, furrowed for WH-questions).",
      "Transition smoothly between signs at natural conversational tempo."
    ],
    "tip": "Conversational phrase built from foundational vocabulary signs."
  },
  {
    "id": "adv-what-is-your-name",
    "label": "What Is Your Name?",
    "category": "greetings",
    "level": "advanced",
    "theme": "Feelings and daily conversation",
    "order": 221,
    "xp": 25,
    "prerequisites": [
      "word-what",
      "word-name"
    ],
    "media": {
      "type": "svg",
      "url": "/signs/asl/what_is_your_name.svg",
      "alt": "ASL phrase: What Is Your Name?"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "B",
      "startPosition": {
        "x": 75,
        "y": 65
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 2200,
      "motionTag": "motion",
      "tokens": [
        {
          "id": "t-adv-what-is-your-name-0",
          "label": "Your",
          "signKey": "your",
          "handshape": "B",
          "startAnchor": "neutral_space",
          "endAnchor": "neutral_space",
          "startPosition": {
            "x": 75,
            "y": 65
          },
          "endPosition": {
            "x": 75,
            "y": 65
          },
          "path": "tap",
          "orientation": "palm_forward",
          "location": "neutral_space"
        },
        {
          "id": "t-adv-what-is-your-name-1",
          "label": "Name",
          "signKey": "name",
          "handshape": "H",
          "startAnchor": "neutral_space",
          "endAnchor": "neutral_space",
          "startPosition": {
            "x": 75,
            "y": 65
          },
          "endPosition": {
            "x": 75,
            "y": 65
          },
          "path": "tap",
          "orientation": "palm_forward",
          "location": "neutral_space"
        },
        {
          "id": "t-adv-what-is-your-name-2",
          "label": "What",
          "signKey": "what",
          "handshape": "5",
          "startAnchor": "neutral_space",
          "endAnchor": "neutral_space",
          "startPosition": {
            "x": 75,
            "y": 65
          },
          "endPosition": {
            "x": 75,
            "y": 65
          },
          "path": "shake",
          "orientation": "palm_up",
          "location": "neutral_space"
        }
      ],
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "tokens": [
      {
        "id": "t-adv-what-is-your-name-0",
        "label": "Your",
        "signKey": "your",
        "handshape": "B",
        "startAnchor": "neutral_space",
        "endAnchor": "neutral_space",
        "startPosition": {
          "x": 75,
          "y": 65
        },
        "endPosition": {
          "x": 75,
          "y": 65
        },
        "path": "tap",
        "orientation": "palm_forward",
        "location": "neutral_space"
      },
      {
        "id": "t-adv-what-is-your-name-1",
        "label": "Name",
        "signKey": "name",
        "handshape": "H",
        "startAnchor": "neutral_space",
        "endAnchor": "neutral_space",
        "startPosition": {
          "x": 75,
          "y": 65
        },
        "endPosition": {
          "x": 75,
          "y": 65
        },
        "path": "tap",
        "orientation": "palm_forward",
        "location": "neutral_space"
      },
      {
        "id": "t-adv-what-is-your-name-2",
        "label": "What",
        "signKey": "what",
        "handshape": "5",
        "startAnchor": "neutral_space",
        "endAnchor": "neutral_space",
        "startPosition": {
          "x": 75,
          "y": 65
        },
        "endPosition": {
          "x": 75,
          "y": 65
        },
        "path": "shake",
        "orientation": "palm_up",
        "location": "neutral_space"
      }
    ],
    "steps": [
      "Sign each component sign in conversational sequence: Your → Name → What.",
      "Express grammatical mode with facial expressions (eyebrows raised for yes/no, furrowed for WH-questions).",
      "Transition smoothly between signs at natural conversational tempo."
    ],
    "tip": "Conversational phrase built from foundational vocabulary signs."
  },
  {
    "id": "adv-want-coffee",
    "label": "Do You Want Coffee?",
    "category": "greetings",
    "level": "advanced",
    "theme": "Feelings and daily conversation",
    "order": 222,
    "xp": 25,
    "prerequisites": [
      "word-coffee",
      "word-drink"
    ],
    "media": {
      "type": "svg",
      "url": "/signs/asl/want_coffee.svg",
      "alt": "ASL phrase: Do You Want Coffee?"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "1",
      "startPosition": {
        "x": 75,
        "y": 65
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 2200,
      "motionTag": "motion",
      "tokens": [
        {
          "id": "t-adv-want-coffee-0",
          "label": "You",
          "signKey": "you",
          "handshape": "1",
          "startAnchor": "neutral_space",
          "endAnchor": "neutral_space",
          "startPosition": {
            "x": 75,
            "y": 65
          },
          "endPosition": {
            "x": 75,
            "y": 65
          },
          "path": "forward",
          "orientation": "palm_forward",
          "location": "neutral_space"
        },
        {
          "id": "t-adv-want-coffee-1",
          "label": "Want",
          "signKey": "want",
          "handshape": "5",
          "startAnchor": "neutral_space",
          "endAnchor": "neutral_space",
          "startPosition": {
            "x": 75,
            "y": 65
          },
          "endPosition": {
            "x": 75,
            "y": 65
          },
          "path": "tap",
          "orientation": "palm_up",
          "location": "neutral_space"
        },
        {
          "id": "t-adv-want-coffee-2",
          "label": "Coffee",
          "signKey": "coffee",
          "handshape": "S",
          "startAnchor": "neutral_space",
          "endAnchor": "neutral_space",
          "startPosition": {
            "x": 75,
            "y": 65
          },
          "endPosition": {
            "x": 75,
            "y": 65
          },
          "path": "circle",
          "orientation": "palm_forward",
          "location": "neutral_space"
        }
      ],
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "tokens": [
      {
        "id": "t-adv-want-coffee-0",
        "label": "You",
        "signKey": "you",
        "handshape": "1",
        "startAnchor": "neutral_space",
        "endAnchor": "neutral_space",
        "startPosition": {
          "x": 75,
          "y": 65
        },
        "endPosition": {
          "x": 75,
          "y": 65
        },
        "path": "forward",
        "orientation": "palm_forward",
        "location": "neutral_space"
      },
      {
        "id": "t-adv-want-coffee-1",
        "label": "Want",
        "signKey": "want",
        "handshape": "5",
        "startAnchor": "neutral_space",
        "endAnchor": "neutral_space",
        "startPosition": {
          "x": 75,
          "y": 65
        },
        "endPosition": {
          "x": 75,
          "y": 65
        },
        "path": "tap",
        "orientation": "palm_up",
        "location": "neutral_space"
      },
      {
        "id": "t-adv-want-coffee-2",
        "label": "Coffee",
        "signKey": "coffee",
        "handshape": "S",
        "startAnchor": "neutral_space",
        "endAnchor": "neutral_space",
        "startPosition": {
          "x": 75,
          "y": 65
        },
        "endPosition": {
          "x": 75,
          "y": 65
        },
        "path": "circle",
        "orientation": "palm_forward",
        "location": "neutral_space"
      }
    ],
    "steps": [
      "Sign each component sign in conversational sequence: You → Want → Coffee.",
      "Express grammatical mode with facial expressions (eyebrows raised for yes/no, furrowed for WH-questions).",
      "Transition smoothly between signs at natural conversational tempo."
    ],
    "tip": "Conversational phrase built from foundational vocabulary signs."
  },
  {
    "id": "adv-see-you-later",
    "label": "See You Later",
    "category": "greetings",
    "level": "advanced",
    "theme": "Courtesy and communication",
    "order": 223,
    "xp": 25,
    "prerequisites": [
      "word-goodbye",
      "word-later"
    ],
    "media": {
      "type": "svg",
      "url": "/signs/asl/see_you_later.svg",
      "alt": "ASL phrase: See You Later"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "2",
      "startPosition": {
        "x": 100,
        "y": 46
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "eyes",
      "repeat": "infinite",
      "durationMs": 2200,
      "motionTag": "motion",
      "tokens": [
        {
          "id": "t-adv-see-you-later-0",
          "label": "See",
          "signKey": "see",
          "handshape": "2",
          "startAnchor": "eyes",
          "endAnchor": "neutral_space",
          "startPosition": {
            "x": 100,
            "y": 46
          },
          "endPosition": {
            "x": 75,
            "y": 65
          },
          "path": "forward",
          "orientation": "palm_forward",
          "location": "eyes"
        },
        {
          "id": "t-adv-see-you-later-1",
          "label": "You",
          "signKey": "you",
          "handshape": "1",
          "startAnchor": "neutral_space",
          "endAnchor": "neutral_space",
          "startPosition": {
            "x": 75,
            "y": 65
          },
          "endPosition": {
            "x": 75,
            "y": 65
          },
          "path": "forward",
          "orientation": "palm_forward",
          "location": "neutral_space"
        },
        {
          "id": "t-adv-see-you-later-2",
          "label": "Later",
          "signKey": "later",
          "handshape": "L",
          "startAnchor": "neutral_space",
          "endAnchor": "neutral_space",
          "startPosition": {
            "x": 75,
            "y": 65
          },
          "endPosition": {
            "x": 75,
            "y": 65
          },
          "path": "arc",
          "orientation": "palm_forward",
          "location": "neutral_space"
        }
      ],
      "startAnchor": "eyes",
      "endAnchor": "neutral_space"
    },
    "tokens": [
      {
        "id": "t-adv-see-you-later-0",
        "label": "See",
        "signKey": "see",
        "handshape": "2",
        "startAnchor": "eyes",
        "endAnchor": "neutral_space",
        "startPosition": {
          "x": 100,
          "y": 46
        },
        "endPosition": {
          "x": 75,
          "y": 65
        },
        "path": "forward",
        "orientation": "palm_forward",
        "location": "eyes"
      },
      {
        "id": "t-adv-see-you-later-1",
        "label": "You",
        "signKey": "you",
        "handshape": "1",
        "startAnchor": "neutral_space",
        "endAnchor": "neutral_space",
        "startPosition": {
          "x": 75,
          "y": 65
        },
        "endPosition": {
          "x": 75,
          "y": 65
        },
        "path": "forward",
        "orientation": "palm_forward",
        "location": "neutral_space"
      },
      {
        "id": "t-adv-see-you-later-2",
        "label": "Later",
        "signKey": "later",
        "handshape": "L",
        "startAnchor": "neutral_space",
        "endAnchor": "neutral_space",
        "startPosition": {
          "x": 75,
          "y": 65
        },
        "endPosition": {
          "x": 75,
          "y": 65
        },
        "path": "arc",
        "orientation": "palm_forward",
        "location": "neutral_space"
      }
    ],
    "steps": [
      "Sign each component sign in conversational sequence: See → You → Later.",
      "Express grammatical mode with facial expressions (eyebrows raised for yes/no, furrowed for WH-questions).",
      "Transition smoothly between signs at natural conversational tempo."
    ],
    "tip": "Conversational phrase built from foundational vocabulary signs."
  },
  {
    "id": "adv-see-you-tomorrow",
    "label": "See You Tomorrow",
    "category": "greetings",
    "level": "advanced",
    "theme": "Courtesy and communication",
    "order": 224,
    "xp": 25,
    "prerequisites": [
      "word-goodbye",
      "word-tomorrow"
    ],
    "media": {
      "type": "svg",
      "url": "/signs/asl/see_you_tomorrow.svg",
      "alt": "ASL phrase: See You Tomorrow"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "2",
      "startPosition": {
        "x": 100,
        "y": 46
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "eyes",
      "repeat": "infinite",
      "durationMs": 2200,
      "motionTag": "motion",
      "tokens": [
        {
          "id": "t-adv-see-you-tomorrow-0",
          "label": "See",
          "signKey": "see",
          "handshape": "2",
          "startAnchor": "eyes",
          "endAnchor": "neutral_space",
          "startPosition": {
            "x": 100,
            "y": 46
          },
          "endPosition": {
            "x": 75,
            "y": 65
          },
          "path": "forward",
          "orientation": "palm_forward",
          "location": "eyes"
        },
        {
          "id": "t-adv-see-you-tomorrow-1",
          "label": "You",
          "signKey": "you",
          "handshape": "1",
          "startAnchor": "neutral_space",
          "endAnchor": "neutral_space",
          "startPosition": {
            "x": 75,
            "y": 65
          },
          "endPosition": {
            "x": 75,
            "y": 65
          },
          "path": "forward",
          "orientation": "palm_forward",
          "location": "neutral_space"
        },
        {
          "id": "t-adv-see-you-tomorrow-2",
          "label": "Tomorrow",
          "signKey": "tomorrow",
          "handshape": "10",
          "startAnchor": "chin",
          "endAnchor": "neutral_space",
          "startPosition": {
            "x": 100,
            "y": 74
          },
          "endPosition": {
            "x": 75,
            "y": 65
          },
          "path": "arc",
          "orientation": "palm_forward",
          "location": "chin"
        }
      ],
      "startAnchor": "eyes",
      "endAnchor": "neutral_space"
    },
    "tokens": [
      {
        "id": "t-adv-see-you-tomorrow-0",
        "label": "See",
        "signKey": "see",
        "handshape": "2",
        "startAnchor": "eyes",
        "endAnchor": "neutral_space",
        "startPosition": {
          "x": 100,
          "y": 46
        },
        "endPosition": {
          "x": 75,
          "y": 65
        },
        "path": "forward",
        "orientation": "palm_forward",
        "location": "eyes"
      },
      {
        "id": "t-adv-see-you-tomorrow-1",
        "label": "You",
        "signKey": "you",
        "handshape": "1",
        "startAnchor": "neutral_space",
        "endAnchor": "neutral_space",
        "startPosition": {
          "x": 75,
          "y": 65
        },
        "endPosition": {
          "x": 75,
          "y": 65
        },
        "path": "forward",
        "orientation": "palm_forward",
        "location": "neutral_space"
      },
      {
        "id": "t-adv-see-you-tomorrow-2",
        "label": "Tomorrow",
        "signKey": "tomorrow",
        "handshape": "10",
        "startAnchor": "chin",
        "endAnchor": "neutral_space",
        "startPosition": {
          "x": 100,
          "y": 74
        },
        "endPosition": {
          "x": 75,
          "y": 65
        },
        "path": "arc",
        "orientation": "palm_forward",
        "location": "chin"
      }
    ],
    "steps": [
      "Sign each component sign in conversational sequence: See → You → Tomorrow.",
      "Express grammatical mode with facial expressions (eyebrows raised for yes/no, furrowed for WH-questions).",
      "Transition smoothly between signs at natural conversational tempo."
    ],
    "tip": "Conversational phrase built from foundational vocabulary signs."
  },
  {
    "id": "adv-excuse-me",
    "label": "Excuse Me",
    "category": "greetings",
    "level": "advanced",
    "theme": "Courtesy and communication",
    "order": 225,
    "xp": 25,
    "prerequisites": [
      "word-please",
      "word-sorry"
    ],
    "media": {
      "type": "svg",
      "url": "/signs/asl/excuse_me.svg",
      "alt": "ASL phrase: Excuse Me"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "B",
      "startPosition": {
        "x": 75,
        "y": 65
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "neutral_space",
      "repeat": "infinite",
      "durationMs": 2200,
      "motionTag": "motion",
      "tokens": [
        {
          "id": "t-adv-excuse-me-0",
          "label": "Excuse",
          "signKey": "excuse",
          "handshape": "B",
          "startAnchor": "neutral_space",
          "endAnchor": "neutral_space",
          "startPosition": {
            "x": 75,
            "y": 65
          },
          "endPosition": {
            "x": 75,
            "y": 65
          },
          "path": "tap",
          "orientation": "palm_forward",
          "location": "neutral_space"
        },
        {
          "id": "t-adv-excuse-me-1",
          "label": "Me",
          "signKey": "me",
          "handshape": "B",
          "startAnchor": "neutral_space",
          "endAnchor": "neutral_space",
          "startPosition": {
            "x": 75,
            "y": 65
          },
          "endPosition": {
            "x": 75,
            "y": 65
          },
          "path": "tap",
          "orientation": "palm_forward",
          "location": "neutral_space"
        }
      ],
      "startAnchor": "neutral_space",
      "endAnchor": "neutral_space"
    },
    "tokens": [
      {
        "id": "t-adv-excuse-me-0",
        "label": "Excuse",
        "signKey": "excuse",
        "handshape": "B",
        "startAnchor": "neutral_space",
        "endAnchor": "neutral_space",
        "startPosition": {
          "x": 75,
          "y": 65
        },
        "endPosition": {
          "x": 75,
          "y": 65
        },
        "path": "tap",
        "orientation": "palm_forward",
        "location": "neutral_space"
      },
      {
        "id": "t-adv-excuse-me-1",
        "label": "Me",
        "signKey": "me",
        "handshape": "B",
        "startAnchor": "neutral_space",
        "endAnchor": "neutral_space",
        "startPosition": {
          "x": 75,
          "y": 65
        },
        "endPosition": {
          "x": 75,
          "y": 65
        },
        "path": "tap",
        "orientation": "palm_forward",
        "location": "neutral_space"
      }
    ],
    "steps": [
      "Sign each component sign in conversational sequence: Excuse → Me.",
      "Express grammatical mode with facial expressions (eyebrows raised for yes/no, furrowed for WH-questions).",
      "Transition smoothly between signs at natural conversational tempo."
    ],
    "tip": "Conversational phrase built from foundational vocabulary signs."
  },
  {
    "id": "adv-dont-understand",
    "label": "I Don't Understand",
    "category": "greetings",
    "level": "advanced",
    "theme": "Courtesy and communication",
    "order": 226,
    "xp": 25,
    "prerequisites": [
      "word-no",
      "word-learn"
    ],
    "media": {
      "type": "svg",
      "url": "/signs/asl/dont_understand.svg",
      "alt": "ASL phrase: I Don't Understand"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "1",
      "startPosition": {
        "x": 100,
        "y": 114
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "chest",
      "repeat": "infinite",
      "durationMs": 2200,
      "motionTag": "motion",
      "tokens": [
        {
          "id": "t-adv-dont-understand-0",
          "label": "I",
          "signKey": "i",
          "handshape": "1",
          "startAnchor": "chest",
          "endAnchor": "chest",
          "startPosition": {
            "x": 100,
            "y": 114
          },
          "endPosition": {
            "x": 100,
            "y": 114
          },
          "path": "tap",
          "orientation": "palm_inward",
          "location": "chest"
        },
        {
          "id": "t-adv-dont-understand-1",
          "label": "Understand",
          "signKey": "understand",
          "handshape": "1",
          "startAnchor": "forehead",
          "endAnchor": "forehead",
          "startPosition": {
            "x": 100,
            "y": 34
          },
          "endPosition": {
            "x": 100,
            "y": 34
          },
          "path": "flick",
          "orientation": "palm_inward",
          "location": "forehead"
        },
        {
          "id": "t-adv-dont-understand-2",
          "label": "Not",
          "signKey": "not",
          "handshape": "10",
          "startAnchor": "chin",
          "endAnchor": "neutral_space",
          "startPosition": {
            "x": 100,
            "y": 74
          },
          "endPosition": {
            "x": 75,
            "y": 65
          },
          "path": "forward",
          "orientation": "palm_forward",
          "location": "chin"
        }
      ],
      "startAnchor": "chest",
      "endAnchor": "neutral_space"
    },
    "tokens": [
      {
        "id": "t-adv-dont-understand-0",
        "label": "I",
        "signKey": "i",
        "handshape": "1",
        "startAnchor": "chest",
        "endAnchor": "chest",
        "startPosition": {
          "x": 100,
          "y": 114
        },
        "endPosition": {
          "x": 100,
          "y": 114
        },
        "path": "tap",
        "orientation": "palm_inward",
        "location": "chest"
      },
      {
        "id": "t-adv-dont-understand-1",
        "label": "Understand",
        "signKey": "understand",
        "handshape": "1",
        "startAnchor": "forehead",
        "endAnchor": "forehead",
        "startPosition": {
          "x": 100,
          "y": 34
        },
        "endPosition": {
          "x": 100,
          "y": 34
        },
        "path": "flick",
        "orientation": "palm_inward",
        "location": "forehead"
      },
      {
        "id": "t-adv-dont-understand-2",
        "label": "Not",
        "signKey": "not",
        "handshape": "10",
        "startAnchor": "chin",
        "endAnchor": "neutral_space",
        "startPosition": {
          "x": 100,
          "y": 74
        },
        "endPosition": {
          "x": 75,
          "y": 65
        },
        "path": "forward",
        "orientation": "palm_forward",
        "location": "chin"
      }
    ],
    "steps": [
      "Sign each component sign in conversational sequence: I → Understand → Not.",
      "Express grammatical mode with facial expressions (eyebrows raised for yes/no, furrowed for WH-questions).",
      "Transition smoothly between signs at natural conversational tempo."
    ],
    "tip": "Conversational phrase built from foundational vocabulary signs."
  },
  {
    "id": "adv-please-slow-down",
    "label": "Please Slow Down",
    "category": "greetings",
    "level": "advanced",
    "theme": "Courtesy and communication",
    "order": 227,
    "xp": 25,
    "prerequisites": [
      "word-please",
      "word-stop"
    ],
    "media": {
      "type": "svg",
      "url": "/signs/asl/please_slow_down.svg",
      "alt": "ASL phrase: Please Slow Down"
    },
    "motionTag": "motion",
    "animationSpec": {
      "handshape": "B",
      "startPosition": {
        "x": 100,
        "y": 114
      },
      "endPosition": {
        "x": 75,
        "y": 65
      },
      "path": "line",
      "orientation": "palm_forward",
      "location": "chest",
      "repeat": "infinite",
      "durationMs": 2200,
      "motionTag": "motion",
      "tokens": [
        {
          "id": "t-adv-please-slow-down-0",
          "label": "Please",
          "signKey": "please",
          "handshape": "B",
          "startAnchor": "chest",
          "endAnchor": "chest",
          "startPosition": {
            "x": 100,
            "y": 114
          },
          "endPosition": {
            "x": 100,
            "y": 114
          },
          "path": "circle",
          "orientation": "palm_inward",
          "location": "chest"
        },
        {
          "id": "t-adv-please-slow-down-1",
          "label": "Slow",
          "signKey": "slow",
          "handshape": "B",
          "startAnchor": "neutral_space",
          "endAnchor": "neutral_space",
          "startPosition": {
            "x": 75,
            "y": 65
          },
          "endPosition": {
            "x": 75,
            "y": 65
          },
          "path": "line",
          "orientation": "palm_forward",
          "location": "neutral_space"
        }
      ],
      "startAnchor": "chest",
      "endAnchor": "neutral_space"
    },
    "tokens": [
      {
        "id": "t-adv-please-slow-down-0",
        "label": "Please",
        "signKey": "please",
        "handshape": "B",
        "startAnchor": "chest",
        "endAnchor": "chest",
        "startPosition": {
          "x": 100,
          "y": 114
        },
        "endPosition": {
          "x": 100,
          "y": 114
        },
        "path": "circle",
        "orientation": "palm_inward",
        "location": "chest"
      },
      {
        "id": "t-adv-please-slow-down-1",
        "label": "Slow",
        "signKey": "slow",
        "handshape": "B",
        "startAnchor": "neutral_space",
        "endAnchor": "neutral_space",
        "startPosition": {
          "x": 75,
          "y": 65
        },
        "endPosition": {
          "x": 75,
          "y": 65
        },
        "path": "line",
        "orientation": "palm_forward",
        "location": "neutral_space"
      }
    ],
    "steps": [
      "Sign each component sign in conversational sequence: Please → Slow.",
      "Express grammatical mode with facial expressions (eyebrows raised for yes/no, furrowed for WH-questions).",
      "Transition smoothly between signs at natural conversational tempo."
    ],
    "tip": "Conversational phrase built from foundational vocabulary signs."
  }
];

export function findLesson(key) {
  if (!key) return null;
  const clean = String(key).toLowerCase().replace(/\s+/g, "_");
  return ALL_LESSONS.find(
    (l) =>
      l.id.toLowerCase() === clean ||
      l.label.toLowerCase() === key.toLowerCase() ||
      l.label.toLowerCase().replace(/^(letter|number)\s*/i, "").trim() === key.toLowerCase().trim()
  );
}

export function getLessons(category = "all") {
  if (!category || category === "all") return ALL_LESSONS;
  return ALL_LESSONS.filter((l) => l.category === category);
}

export function getLessonsByCategory(category) {
  return getLessons(category);
}

export function getLessonsByLevel(level) {
  if (!level || level === "all") return ALL_LESSONS;
  return ALL_LESSONS.filter((l) => l.level === level);
}

export function getBeginnerPathLessons() {
  const all = ALL_LESSONS.filter((l) => l.level === "beginner");
  const coreWords = all.filter((l) => l.category === "greetings");
  return {
    all,
    total: all.length,
    alphabet: all.filter((l) => l.category === "alphabet"),
    numbers: all.filter((l) => l.category === "numbers"),
    greetings: coreWords,
    coreWords,
  };
}

