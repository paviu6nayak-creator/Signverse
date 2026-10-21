// frontend/src/components/common/Hand.jsx
import React from "react";
import { getHandshape, HANDSHAPES } from "../../data/handshapes";

/**
 * Maps legacy string names from lessons.js to canonical handshape specs
 */
function resolveHandshapeSpec(handshape) {
  if (!handshape) return HANDSHAPES["B"];
  if (typeof handshape === "object" && handshape.fingers) {
    return handshape;
  }

  const str = String(handshape).trim();

  // Direct letter or number lookup (e.g. "A", "7", "W")
  const direct = getHandshape(str);
  if (direct) return direct;

  // Legacy mappings
  switch (str.toLowerCase()) {
    case "flat_palm":
      return HANDSHAPES["B"];
    case "open_5":
      return HANDSHAPES["5"];
    case "fist":
    case "fist_a":
      return HANDSHAPES["A"];
    case "fist_s":
      return HANDSHAPES["S"];
    case "index_point":
    case "number_1":
      return HANDSHAPES["1"];
    case "v_shape":
    case "number_2":
      return HANDSHAPES["2"];
    case "3_shape":
    case "number_3":
      return HANDSHAPES["3"];
    case "c_shape":
      return HANDSHAPES["C"];
    case "hook_index":
      return HANDSHAPES["X"];
    case "flat_o":
      return HANDSHAPES["O"];
    case "thumbs_up":
      return HANDSHAPES["10"];
    case "pinched_g":
      return HANDSHAPES["G"];
    case "ily":
      return {
        id: "ily",
        label: "I Love You",
        type: "letter",
        description: "Thumb, index, and pinky extended; middle and ring curled.",
        aslNotes: "Lifeprint: Classic ILY combining I, L, and Y.",
        fingers: { index: "extended", middle: "curled", ring: "curled", pinky: "extended" },
        thumb: "out",
        palm: "forward",
        rotation: 0,
      };
    default:
      return HANDSHAPES["B"];
  }
}

/**
 * Parametric SVG Hand Component
 *
 * Can be rendered standalone in HTML as `<Hand spec="A" size={100} />`
 * or embedded inside an existing SVG canvas via `<Hand spec="A" asGroup={true} />`.
 */
export default function Hand({
  spec,
  orientation,
  rotation: propRotation,
  color = "#38bdf8",
  accentColor = "#bae6fd",
  highlightColor = "#e0f2fe",
  size = 120,
  className = "",
  mirror = false,
  showLabel = false,
  asGroup = false,
  scale = 0.55,
  fingerStatus = null,
}) {
  const resolvedSpec = resolveHandshapeSpec(spec);

  const fingers = resolvedSpec?.fingers || {
    index: "extended",
    middle: "extended",
    ring: "extended",
    pinky: "extended",
  };
  const thumb = resolvedSpec?.thumb || "across";

  // Helpers for per-finger correctness highlighting
  const getFingerFill = (fingerKey, defaultFill) => {
    if (!fingerStatus || !fingerStatus[fingerKey] || fingerStatus[fingerKey] === "neutral") {
      return defaultFill;
    }
    return fingerStatus[fingerKey] === "correct" ? "#10b981" : "#ef4444";
  };

  const getFingerStroke = (fingerKey, defaultStroke) => {
    if (!fingerStatus || !fingerStatus[fingerKey] || fingerStatus[fingerKey] === "neutral") {
      return defaultStroke;
    }
    return fingerStatus[fingerKey] === "correct" ? "#059669" : "#b91c1c";
  };

  const getKnuckleFill = (fingerKey, defaultFill) => {
    if (!fingerStatus || !fingerStatus[fingerKey] || fingerStatus[fingerKey] === "neutral") {
      return defaultFill;
    }
    return fingerStatus[fingerKey] === "correct" ? "#047857" : "#dc2626";
  };

  // Normalize palm orientation from prop or spec
  const explicitPalm = orientation
    ? orientation === "palm_down" || orientation === "down"
      ? "down"
      : orientation === "palm_inward" || orientation === "toward-body"
      ? "toward-body"
      : orientation === "facing_side" || orientation === "left" || orientation === "right"
      ? "left"
      : "forward"
    : null;

  const palm = explicitPalm || resolvedSpec?.palm || "forward";
  const isDorsal = palm === "toward-body" || palm === "down";

  const defaultRotation = resolvedSpec?.rotation || 0;
  // If palm is down and no custom rotation specified, rotate 180 degrees so fingers point downward/forward
  const rotation =
    propRotation !== undefined
      ? propRotation
      : (palm === "down" && defaultRotation === 0)
      ? 180
      : defaultRotation;

  const spread = resolvedSpec?.spread ?? 0.3;

  const palmFill = color;
  const palmStroke = "#0284c7";
  const knuckleColor = isDorsal ? "#0369a1" : accentColor;
  const creaseColor = isDorsal ? "#075985" : "#0284c7";

  const groupContent = (
    <g
      transform={`scale(${scale}) rotate(${rotation} 50 55) ${mirror ? "translate(100, 0) scale(-1, 1)" : ""}`}
      style={{ transformOrigin: "50px 55px", transition: "transform 0.3s ease" }}
    >
      {/* WRIST BASE */}
      <path
        d="M34 94 L32 108 L68 108 L66 94 Z"
        fill="#0369a1"
        stroke={palmStroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* PALM CARPUS & METACARPALS */}
      <path
        d="M24 72 C22 62 26 50 30 46 C34 44 66 44 72 48 C76 52 78 66 74 76 C70 88 64 94 50 95 C36 94 28 86 24 72 Z"
        fill={palmFill}
        stroke={palmStroke}
        strokeWidth="1.5"
      />

      {/* Palm details: creases vs dorsal tendons */}
      {isDorsal ? (
        <g stroke={creaseColor} strokeWidth="1.2" opacity="0.6">
          <line x1="33" y1="52" x2="38" y2="76" />
          <line x1="45" y1="50" x2="47" y2="78" />
          <line x1="57" y1="52" x2="55" y2="76" />
          <line x1="67" y1="56" x2="62" y2="74" />
        </g>
      ) : (
        <g stroke={creaseColor} strokeWidth="1.2" strokeLinecap="round" opacity="0.6" fill="none">
          <path d="M30 60 Q42 66 52 74" />
          <path d="M32 72 Q46 76 64 70" />
          <path d="M50 56 Q62 58 70 66" />
        </g>
      )}

      {/* ======================================================== */}
      {/* FINGERS */}
      {/* ======================================================== */}

      {/* 1. INDEX FINGER */}
      <g>
        {fingers.index === "extended" && (
          <path
            d="M28 46 L27 12 C27 8 35 8 35 12 L36 46 Z"
            fill={getFingerFill("index", accentColor)}
            stroke={getFingerStroke("index", palmStroke)}
            strokeWidth="1.5"
            transform={`rotate(${-8 * spread} 32 46)`}
          />
        )}
        {fingers.index === "crossed" && (
          <path
            d="M28 46 L28 12 C28 8 36 8 36 12 L36 46 Z"
            fill={getFingerFill("index", accentColor)}
            stroke={getFingerStroke("index", palmStroke)}
            strokeWidth="1.5"
          />
        )}
        {fingers.index === "bent" && (
          <path
            d="M28 46 C26 30 38 22 46 28 C50 32 46 38 40 36 C34 34 32 40 34 46 Z"
            fill={getFingerFill("index", accentColor)}
            stroke={getFingerStroke("index", palmStroke)}
            strokeWidth="1.5"
          />
        )}
        {fingers.index === "hooked" && (
          <path
            d="M28 46 L28 26 C28 20 40 20 38 30 C36 34 32 34 33 46 Z"
            fill={getFingerFill("index", accentColor)}
            stroke={getFingerStroke("index", palmStroke)}
            strokeWidth="1.5"
          />
        )}
        {fingers.index === "touching-thumb" && (
          <path
            d="M28 46 C26 34 22 28 24 38 C26 44 28 48 34 48 Z"
            fill={getFingerFill("index", accentColor)}
            stroke={getFingerStroke("index", palmStroke)}
            strokeWidth="1.5"
          />
        )}
        {fingers.index === "curled" && (
          <circle
            cx="32"
            cy="46"
            r="5"
            fill={getKnuckleFill("index", knuckleColor)}
            stroke={getFingerStroke("index", palmStroke)}
            strokeWidth="1.2"
          />
        )}
      </g>

      {/* 2. MIDDLE FINGER */}
      <g>
        {fingers.middle === "extended" && (
          <path
            d="M40 44 L39 8 C39 4 47 4 47 8 L48 44 Z"
            fill={getFingerFill("middle", highlightColor)}
            stroke={getFingerStroke("middle", palmStroke)}
            strokeWidth="1.5"
            transform={`rotate(${-2 * spread} 44 44)`}
          />
        )}
        {fingers.middle === "crossed" && (
          <path
            d="M42 44 L30 10 C29 6 37 6 39 10 L48 44 Z"
            fill={getFingerFill("middle", highlightColor)}
            stroke={getFingerStroke("middle", palmStroke)}
            strokeWidth="1.5"
          />
        )}
        {fingers.middle === "bent" && (
          <path
            d="M40 44 C38 30 50 20 58 26 C62 30 58 36 52 34 C46 32 44 38 46 44 Z"
            fill={getFingerFill("middle", highlightColor)}
            stroke={getFingerStroke("middle", palmStroke)}
            strokeWidth="1.5"
          />
        )}
        {fingers.middle === "hooked" && (
          <path
            d="M40 44 L40 24 C40 18 52 18 50 28 C48 32 44 32 45 44 Z"
            fill={getFingerFill("middle", highlightColor)}
            stroke={getFingerStroke("middle", palmStroke)}
            strokeWidth="1.5"
          />
        )}
        {fingers.middle === "touching-thumb" && (
          <path
            d="M40 44 C38 32 30 38 28 46 C32 48 38 46 45 46 Z"
            fill={getFingerFill("middle", highlightColor)}
            stroke={getFingerStroke("middle", palmStroke)}
            strokeWidth="1.5"
          />
        )}
        {fingers.middle === "curled" && (
          <circle
            cx="44"
            cy="44"
            r="5.2"
            fill={getKnuckleFill("middle", knuckleColor)}
            stroke={getFingerStroke("middle", palmStroke)}
            strokeWidth="1.2"
          />
        )}
      </g>

      {/* 3. RING FINGER */}
      <g>
        {fingers.ring === "extended" && (
          <path
            d="M52 46 L53 12 C53 8 61 8 61 12 L60 46 Z"
            fill={getFingerFill("ring", accentColor)}
            stroke={getFingerStroke("ring", palmStroke)}
            strokeWidth="1.5"
            transform={`rotate(${4 * spread} 56 46)`}
          />
        )}
        {fingers.ring === "bent" && (
          <path
            d="M52 46 C50 32 62 24 70 30 C74 34 70 40 64 38 C58 36 56 42 58 46 Z"
            fill={getFingerFill("ring", accentColor)}
            stroke={getFingerStroke("ring", palmStroke)}
            strokeWidth="1.5"
          />
        )}
        {fingers.ring === "hooked" && (
          <path
            d="M52 46 L52 26 C52 20 64 20 62 30 C60 34 56 34 57 46 Z"
            fill={getFingerFill("ring", accentColor)}
            stroke={getFingerStroke("ring", palmStroke)}
            strokeWidth="1.5"
          />
        )}
        {fingers.ring === "touching-thumb" && (
          <path
            d="M52 46 C48 34 38 40 32 48 C38 52 46 50 56 48 Z"
            fill={getFingerFill("ring", accentColor)}
            stroke={getFingerStroke("ring", palmStroke)}
            strokeWidth="1.5"
          />
        )}
        {fingers.ring === "curled" && (
          <circle
            cx="56"
            cy="46"
            r="5"
            fill={getKnuckleFill("ring", knuckleColor)}
            stroke={getFingerStroke("ring", palmStroke)}
            strokeWidth="1.2"
          />
        )}
      </g>

      {/* 4. PINKY FINGER */}
      <g>
        {fingers.pinky === "extended" && (
          <path
            d="M64 50 L66 18 C66 14 74 14 74 18 L72 50 Z"
            fill={getFingerFill("pinky", "#7dd3fc")}
            stroke={getFingerStroke("pinky", palmStroke)}
            strokeWidth="1.5"
            transform={`rotate(${12 * spread} 68 50)`}
          />
        )}
        {fingers.pinky === "bent" && (
          <path
            d="M64 50 C62 36 74 30 80 36 C84 40 80 46 74 44 C68 42 66 48 68 50 Z"
            fill={getFingerFill("pinky", "#7dd3fc")}
            stroke={getFingerStroke("pinky", palmStroke)}
            strokeWidth="1.5"
          />
        )}
        {fingers.pinky === "hooked" && (
          <path
            d="M64 50 L64 32 C64 26 76 26 74 36 C72 40 68 40 69 50 Z"
            fill={getFingerFill("pinky", "#7dd3fc")}
            stroke={getFingerStroke("pinky", palmStroke)}
            strokeWidth="1.5"
          />
        )}
        {fingers.pinky === "touching-thumb" && (
          <path
            d="M64 50 C58 36 40 46 32 54 C38 58 54 56 68 52 Z"
            fill={getFingerFill("pinky", "#7dd3fc")}
            stroke={getFingerStroke("pinky", palmStroke)}
            strokeWidth="1.5"
          />
        )}
        {fingers.pinky === "curled" && (
          <circle
            cx="68"
            cy="50"
            r="4.5"
            fill={getKnuckleFill("pinky", knuckleColor)}
            stroke={getFingerStroke("pinky", palmStroke)}
            strokeWidth="1.2"
          />
        )}
      </g>

      {/* ======================================================== */}
      {/* THUMB */}
      {/* ======================================================== */}
      <g>
        {thumb === "out" && (
          <path
            d="M24 72 C12 70 2 60 4 48 C6 42 14 42 16 48 C18 56 24 64 28 68 Z"
            fill={getFingerFill("thumb", "#38bdf8")}
            stroke={getFingerStroke("thumb", palmStroke)}
            strokeWidth="1.5"
          />
        )}
        {thumb === "up" && (
          <path
            d="M24 74 C18 64 16 46 16 34 C16 28 24 28 26 34 C28 44 28 60 28 72 Z"
            fill={getFingerFill("thumb", "#38bdf8")}
            stroke={getFingerStroke("thumb", palmStroke)}
            strokeWidth="1.5"
          />
        )}
        {thumb === "across" && (
          <path
            d="M20 74 C24 64 38 60 52 58 C58 64 52 70 38 72 C28 74 22 76 20 74 Z"
            fill={getFingerFill("thumb", "#38bdf8")}
            stroke={getFingerStroke("thumb", palmStroke)}
            strokeWidth="1.5"
          />
        )}
        {thumb === "tucked" && (
          <g>
            <path
              d="M22 72 C26 62 36 56 46 56 C50 60 46 66 36 68 C28 70 24 72 22 72 Z"
              fill={getFingerFill("thumb", "#0284c7")}
              stroke={getFingerStroke("thumb", palmStroke)}
              strokeWidth="1.2"
            />
            <ellipse
              cx="34"
              cy="54"
              rx="4"
              ry="3.5"
              fill={getFingerFill("thumb", "#bae6fd")}
              stroke={getFingerStroke("thumb", palmStroke)}
              strokeWidth="1"
            />
          </g>
        )}
        {thumb === "touching-index" && (
          <path
            d="M22 72 C16 58 18 42 26 38 C32 44 28 54 26 68 Z"
            fill={getFingerFill("thumb", "#38bdf8")}
            stroke={getFingerStroke("thumb", palmStroke)}
            strokeWidth="1.5"
          />
        )}
        {thumb === "touching-middle" && (
          <path
            d="M22 72 C22 58 26 48 34 46 C38 52 32 60 26 68 Z"
            fill={getFingerFill("thumb", "#38bdf8")}
            stroke={getFingerStroke("thumb", palmStroke)}
            strokeWidth="1.5"
          />
        )}
        {thumb === "touching-ring" && (
          <path
            d="M22 72 C26 60 36 52 46 48 C48 54 38 62 26 68 Z"
            fill={getFingerFill("thumb", "#38bdf8")}
            stroke={getFingerStroke("thumb", palmStroke)}
            strokeWidth="1.5"
          />
        )}
        {thumb === "touching-pinky" && (
          <path
            d="M22 72 C30 64 46 58 58 54 C60 60 44 66 26 68 Z"
            fill={getFingerFill("thumb", "#38bdf8")}
            stroke={getFingerStroke("thumb", palmStroke)}
            strokeWidth="1.5"
          />
        )}
      </g>

      {/* Visual Touch Point Indicator for pinch/contact */}
      {(thumb.startsWith("touching-") ||
        fingers.index === "touching-thumb" ||
        fingers.middle === "touching-thumb" ||
        fingers.ring === "touching-thumb" ||
        fingers.pinky === "touching-thumb") && (
        <circle
          cx={
            thumb === "touching-pinky" || fingers.pinky === "touching-thumb"
              ? 58
              : thumb === "touching-ring" || fingers.ring === "touching-thumb"
              ? 48
              : thumb === "touching-middle" || fingers.middle === "touching-thumb"
              ? 38
              : 28
          }
          cy={
            thumb === "touching-pinky" || fingers.pinky === "touching-thumb"
              ? 56
              : thumb === "touching-ring" || fingers.ring === "touching-thumb"
              ? 50
              : thumb === "touching-middle" || fingers.middle === "touching-thumb"
              ? 46
              : 40
          }
          r="3"
          fill="#fef08a"
          stroke="#ca8a04"
          strokeWidth="1"
          opacity="0.9"
        />
      )}
    </g>
  );

  if (asGroup) {
    return groupContent;
  }

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      <svg viewBox="0 0 100 110" width={size} height={size * 1.1} className="overflow-visible">
        {groupContent}
      </svg>
      {showLabel && resolvedSpec?.label && (
        <span className="mt-1 text-xs font-semibold text-ink font-mono text-center">
          {resolvedSpec.label}
        </span>
      )}
    </div>
  );
}
