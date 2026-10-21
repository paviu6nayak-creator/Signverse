import { ChevronRight, Layers, Pause, Play, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import Hand from "../common/Hand";
import { ANCHOR_COORDINATES, getAnchorCoordinates, normalizeAnchorKey } from "../../data/anchorSpecs";

/**
 * Parametric Vector Handshape Renderer
 */
function renderHandshapePath(handshape = "flat_palm", color = "#38bdf8", orientation, rotation, scale = 0.55) {
  return (
    <Hand
      spec={handshape}
      orientation={orientation}
      rotation={rotation}
      color={color}
      asGroup={true}
      scale={scale}
    />
  );
}

/**
 * Head-and-Shoulders Outline & Anchor Zone Guide Renderer
 * Renders the anatomical reference silhouette behind the hand with dynamic glowing beacon.
 */
function renderAnatomicalSilhouette(activeAnchor) {
  const normActive = normalizeAnchorKey(activeAnchor);

  // Key visible anchor zones on the silhouette
  const VISIBLE_ZONES = [
    "forehead",
    "eyes",
    "nose",
    "cheek",
    "chin/lips",
    "chest",
    "shoulder",
    "neutral_space",
  ];

  return (
    <g className="anatomical-layer select-none pointer-events-none">
      {/* 1. Upper Torso & Shoulders Silhouette */}
      <path
        d="M26 158 C28 140 34 116 46 106 C58 96 82 90 90 88 L110 88 C118 90 142 96 154 106 C166 116 172 140 174 158 Z"
        fill="#0b1329"
        stroke="#334155"
        strokeWidth="1.5"
        opacity="0.85"
      />

      {/* Clavicle / Collarbone Accent Line */}
      <path
        d="M56 108 Q100 114 144 108"
        stroke="#1e293b"
        strokeWidth="1.2"
        fill="none"
        opacity="0.6"
      />

      {/* Sternum / Chest Center Guideline */}
      <line
        x1="100"
        y1="92"
        x2="100"
        y2="136"
        stroke="#1e293b"
        strokeWidth="1"
        strokeDasharray="2 3"
        opacity="0.5"
      />

      {/* 2. Neck */}
      <path
        d="M91 76 L90 89 L110 89 L109 76 Z"
        fill="#0f172a"
        stroke="#334155"
        strokeWidth="1.5"
        opacity="0.9"
      />

      {/* 3. Head / Cranium Silhouette */}
      <path
        d="M80 48 C80 28 89 20 100 20 C111 20 120 28 120 48 C120 62 113 76 100 76 C87 76 80 62 80 48 Z"
        fill="#0f172a"
        stroke="#334155"
        strokeWidth="1.5"
        opacity="0.9"
      />

      {/* Subtle Facial Landmark Guides */}
      {/* Eyebrow / eye line */}
      <path
        d="M88 44 Q100 42 112 44"
        stroke="#334155"
        strokeWidth="1"
        strokeDasharray="2 2"
        fill="none"
        opacity="0.4"
      />
      {/* Nose guide */}
      <path
        d="M100 52 L98 56 L102 56"
        stroke="#334155"
        strokeWidth="1"
        fill="none"
        opacity="0.45"
      />
      {/* Lips line */}
      <path
        d="M94 65 Q100 67 106 65"
        stroke="#334155"
        strokeWidth="1.2"
        fill="none"
        opacity="0.5"
      />

      {/* Neutral Space Boundary (3D signing cylinder indicator) */}
      <circle
        cx="75"
        cy="65"
        r="26"
        fill="none"
        stroke="#334155"
        strokeWidth="1"
        strokeDasharray="3 3"
        opacity="0.3"
      />

      {/* Wrist Reference Landmark */}
      <rect
        x="66"
        y="98"
        width="24"
        height="12"
        rx="6"
        fill="#1e293b"
        stroke="#334155"
        strokeWidth="1"
        opacity="0.35"
      />

      {/* 4. Anchor Zones & Dynamic Glow Rendering */}
      {VISIBLE_ZONES.map((key) => {
        const anchor = ANCHOR_COORDINATES[key];
        if (!anchor) return null;
        const { x, y, label } = anchor;

        const isMatched =
          normActive === key ||
          (normActive === "chin" && key === "chin/lips") ||
          (normActive === "lips" && key === "chin/lips") ||
          (normActive === "temple" && key === "forehead") ||
          (normActive === "heart" && key === "chest");

        if (isMatched) {
          return (
            <g key={key} className="active-anchor-beacon">
              {/* Outer Pulsing Beacon Halo */}
              <circle
                cx={x}
                cy={y}
                r="11"
                fill="#38bdf8"
                fillOpacity="0.22"
                stroke="#38bdf8"
                strokeWidth="1.2"
                strokeDasharray="2 2"
                className="animate-pulse"
              />
              {/* Bright Core Dot */}
              <circle
                cx={x}
                cy={y}
                r="5"
                fill="#38bdf8"
                stroke="#ffffff"
                strokeWidth="1.5"
              />

              {/* Anchor Location Callout Label */}
              <g transform={`translate(${x > 110 ? x + 10 : x < 65 ? x - 10 : x}, ${y > 100 ? y + 16 : y - 12})`}>
                <rect
                  x={x < 65 ? -54 : x > 110 ? 0 : -32}
                  y="-8"
                  width="64"
                  height="16"
                  rx="4"
                  fill="#0b1329"
                  fillOpacity="0.94"
                  stroke="#38bdf8"
                  strokeWidth="1"
                  strokeOpacity="0.75"
                />
                <text
                  x={x < 65 ? -22 : x > 110 ? 32 : 0}
                  y="3.5"
                  fill="#38bdf8"
                  fontSize="8.5"
                  fontWeight="700"
                  fontFamily="system-ui, sans-serif"
                  textAnchor="middle"
                >
                  {label}
                </text>
              </g>
            </g>
          );
        }

        // Inactive subtle marker dot
        return (
          <circle
            key={key}
            cx={x}
            cy={y}
            r="2"
            fill="#475569"
            opacity="0.35"
          />
        );
      })}
    </g>
  );
}

/**
 * Data-Driven & Sequence-Aware Gesture Animation Component with Location Layer
 */
export default function GestureAnimation({
  spec,
  tokens: propTokens,
  steps = [],
  label = "Sign Gesture",
  compact = false,
  className = "w-full aspect-[4/3]",
  motionTag: propMotionTag,
}) {
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1); // 1x or 0.5x
  const [progress, setProgress] = useState(0); // 0 to 1 for continuous motion
  const [activeTokenIdx, setActiveTokenIdx] = useState(0);
  const [transitionProgress, setTransitionProgress] = useState(0); // 0 (settled) to 1 (hop/transition)
  const [isVisible, setIsVisible] = useState(true);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Normalize tokens array from prop or spec
  const rawTokens = useMemo(() => {
    if (propTokens && propTokens.length > 0) return propTokens;
    if (spec?.tokens && spec.tokens.length > 0) return spec.tokens;
    return [];
  }, [propTokens, spec]);

  const isSequence = rawTokens.length > 1;

  // Normalized token objects with per-token handshape, anchors, location, orientation
  const normalizedTokens = useMemo(() => {
    if (!isSequence) return [];
    return rawTokens.map((t, idx) => {
      if (typeof t === "string") {
        const defaultAnchor = idx === 0 ? spec?.startAnchor || spec?.location || "neutral_space" : spec?.endAnchor || "neutral_space";
        const pos = getAnchorCoordinates(defaultAnchor);
        return {
          id: `tok-${idx}`,
          label: t,
          handshape: t,
          startAnchor: defaultAnchor,
          endAnchor: defaultAnchor,
          location: defaultAnchor,
          path: spec?.path || "tap",
          orientation: spec?.orientation || "palm_forward",
          rotation: undefined,
          position: pos,
        };
      }

      const tokenStartAnchor = t.startAnchor || t.location || spec?.startAnchor || spec?.location || (idx === 0 ? "neutral_space" : "neutral_space");
      const tokenEndAnchor = t.endAnchor || tokenStartAnchor;
      const defaultPos = getAnchorCoordinates(tokenStartAnchor, t.position || { x: 75, y: 65 });

      return {
        id: t.id || `tok-${idx}`,
        label: t.label || t.signKey || String(idx + 1),
        handshape: t.handshape || t.signKey || t.label || spec?.handshape || "flat_palm",
        startAnchor: tokenStartAnchor,
        endAnchor: tokenEndAnchor,
        location: tokenStartAnchor,
        path: t.path || spec?.path || "tap",
        orientation: t.orientation || spec?.orientation || "palm_forward",
        rotation: t.rotation,
        position: t.position || defaultPos,
      };
    });
  }, [rawTokens, isSequence, spec]);

  // Reset active step when spec/label changes
  useEffect(() => {
    setActiveTokenIdx(0);
    setProgress(0);
    setTransitionProgress(0);
  }, [label, spec]);

  // Reduced motion preference detection
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mq.matches);
    const handler = (e) => setIsReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // IntersectionObserver: Pause animations outside the viewport for 60fps performance
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const hasSpec = Boolean(spec || normalizedTokens.length > 0);

  const {
    handshape = "flat_palm",
    startAnchor: specStartAnchor,
    endAnchor: specEndAnchor,
    startPosition,
    endPosition,
    path = "line", // 'forward' | 'tap' | 'arc' | 'circle' | 'shake' | 'flick' | 'hop' | 'line' | 'static'
    location = "neutral_space",
    durationMs = 1800,
    motionTag = propMotionTag || spec?.motionTag || "motion",
    orientation: specOrientation = "palm_forward",
    rotation: specRotation,
  } = spec || {};

  // Resolve current active token in sequence
  const currentToken = isSequence
    ? normalizedTokens[activeTokenIdx] || normalizedTokens[0]
    : null;

  // Active anchor zones
  const activeStartAnchor = isSequence
    ? currentToken?.startAnchor || currentToken?.location || location
    : specStartAnchor || location || "neutral_space";

  const activeEndAnchor = isSequence
    ? currentToken?.endAnchor || activeStartAnchor
    : specEndAnchor || activeStartAnchor;

  const currentPath = isSequence ? currentToken?.path || path : path;

  // Active anchor positions
  const startPos = useMemo(() => {
    return getAnchorCoordinates(activeStartAnchor, startPosition || { x: 75, y: 65 });
  }, [activeStartAnchor, startPosition]);

  const endPos = useMemo(() => {
    return getAnchorCoordinates(activeEndAnchor, endPosition || startPos);
  }, [activeEndAnchor, endPosition, startPos]);

  // Current active glowing anchor zone (based on progress)
  const currentlyGlowingAnchor = useMemo(() => {
    if (progress < 0.5) return activeStartAnchor;
    return activeEndAnchor;
  }, [progress, activeStartAnchor, activeEndAnchor]);

  // Sequence timing constants
  const DISPLAY_MS = 1000 / speed;
  const PAUSE_MS = 400 / speed;
  const STEP_DURATION = DISPLAY_MS + PAUSE_MS;
  const END_PAUSE_MS = 600 / speed;
  const TOTAL_CYCLE = normalizedTokens.length > 0
    ? STEP_DURATION * normalizedTokens.length + END_PAUSE_MS
    : durationMs / speed;

  // Animation loop
  useEffect(() => {
    if (isReducedMotion || !isPlaying || !isVisible) {
      return;
    }

    if (!isSequence && (motionTag === "static" || currentPath === "static")) {
      return;
    }

    let animationFrameId;
    let startTime = null;

    const tick = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      if (isSequence) {
        const cycleElapsed = elapsed % TOTAL_CYCLE;
        const totalStepsDuration = STEP_DURATION * normalizedTokens.length;

        if (cycleElapsed >= totalStepsDuration) {
          // End of cycle buffer pause
          setActiveTokenIdx(normalizedTokens.length - 1);
          setTransitionProgress(0);
          setProgress(1);
        } else {
          const currentIdx = Math.floor(cycleElapsed / STEP_DURATION);
          const stepElapsed = cycleElapsed % STEP_DURATION;
          setActiveTokenIdx(currentIdx);

          if (stepElapsed < DISPLAY_MS) {
            setTransitionProgress(0);
            setProgress(stepElapsed / DISPLAY_MS);
          } else {
            const hopT = (stepElapsed - DISPLAY_MS) / PAUSE_MS;
            setTransitionProgress(Math.min(1, Math.max(0, hopT)));
            setProgress(1);
          }
        }
      } else {
        const cycleDuration = durationMs / speed;
        const normalizedTime = (elapsed % cycleDuration) / cycleDuration;
        setProgress(normalizedTime);
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [
    isPlaying,
    isVisible,
    isReducedMotion,
    speed,
    isSequence,
    normalizedTokens.length,
    durationMs,
    motionTag,
    currentPath,
    TOTAL_CYCLE,
    STEP_DURATION,
    DISPLAY_MS,
    PAUSE_MS,
  ]);

  // Compute hand position and scale along trajectory
  const computePositionAndScale = useCallback(() => {
    if (isSequence) {
      const currentTok = normalizedTokens[activeTokenIdx] || normalizedTokens[0];
      const nextTok = normalizedTokens[(activeTokenIdx + 1) % normalizedTokens.length];

      const p1 = currentTok?.position || startPos;
      const p2 = nextTok?.position || endPos;

      if (transitionProgress === 0) {
        // Internal motion for current token
        if (currentTok?.path === "tap") {
          const dip = Math.sin(((progress * 2) % 1) * Math.PI) * 10;
          return { x: p1.x, y: p1.y + dip, scale: 0.55 };
        }
        if (currentTok?.path === "circle") {
          const angle = progress * Math.PI * 2;
          return { x: p1.x + 12 * Math.cos(angle), y: p1.y + 12 * Math.sin(angle), scale: 0.55 };
        }
        if (currentTok?.path === "shake") {
          const wiggle = Math.sin(progress * Math.PI * 6) * 8;
          return { x: p1.x + wiggle, y: p1.y, scale: 0.55 };
        }
        return { x: p1.x, y: p1.y, scale: 0.55 };
      }

      // Smooth transition to next token
      const easedT = 0.5 - 0.5 * Math.cos(transitionProgress * Math.PI);

      if (currentPath === "hop") {
        const currentX = p1.x + (p2.x - p1.x) * easedT;
        const currentY = p1.y + (p2.y - p1.y) * easedT - Math.sin(transitionProgress * Math.PI) * 16;
        return { x: currentX, y: currentY, scale: 0.55 };
      }

      const currentX = p1.x + (p2.x - p1.x) * easedT;
      const currentY = p1.y + (p2.y - p1.y) * easedT;
      return { x: currentX, y: currentY, scale: 0.55 };
    }

    if (motionTag === "static" || currentPath === "static") {
      return { x: startPos.x, y: startPos.y, scale: 0.55 };
    }

    // Smooth sine easing for single sign animation
    const easedT = 0.5 - 0.5 * Math.cos(progress * Math.PI * 2);

    switch (currentPath) {
      case "forward": {
        // Forward translation toward person with 3D scale expansion
        const currentX = startPos.x + (endPos.x - startPos.x) * easedT;
        const currentY = startPos.y + (endPos.y - startPos.y) * easedT;
        const dynamicScale = 0.52 + easedT * 0.12; // expands toward camera
        return { x: currentX, y: currentY, scale: dynamicScale };
      }

      case "tap": {
        // Double tap at anchor
        const tapPhase = (progress * 2) % 1;
        const dip = Math.sin(tapPhase * Math.PI) * 12;
        return { x: startPos.x, y: startPos.y + dip, scale: 0.55 };
      }

      case "circle": {
        // Orbit around anchor center
        const centerX = (startPos.x + endPos.x) / 2;
        const centerY = (startPos.y + endPos.y) / 2;
        const radius = Math.hypot(endPos.x - startPos.x, endPos.y - startPos.y) / 2 || 16;
        const angle = progress * Math.PI * 2;
        return {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
          scale: 0.55,
        };
      }

      case "shake": {
        // Horizontal shake
        const wiggle = Math.sin(progress * Math.PI * 6) * 12;
        return { x: startPos.x + wiggle, y: startPos.y, scale: 0.55 };
      }

      case "flick": {
        // Flick upward/outward
        const dip = Math.sin(easedT * Math.PI) * 16;
        const currentX = startPos.x + (endPos.x - startPos.x) * easedT;
        const currentY = startPos.y - dip;
        return { x: currentX, y: currentY, scale: 0.55 };
      }

      case "hop": {
        // Lateral bounce with upward arc
        const currentX = startPos.x + (endPos.x - startPos.x) * easedT;
        const currentY = startPos.y + (endPos.y - startPos.y) * easedT - Math.sin(easedT * Math.PI) * 16;
        return { x: currentX, y: currentY, scale: 0.55 };
      }

      case "arc": {
        // Arc between anchors
        const currentX = startPos.x + (endPos.x - startPos.x) * easedT;
        const currentY = startPos.y + (endPos.y - startPos.y) * easedT - Math.sin(easedT * Math.PI) * 20;
        return { x: currentX, y: currentY, scale: 0.55 };
      }

      case "line":
      default: {
        const currentX = startPos.x + (endPos.x - startPos.x) * easedT;
        const currentY = startPos.y + (endPos.y - startPos.y) * easedT;
        return { x: currentX, y: currentY, scale: 0.55 };
      }
    }
  }, [
    isSequence,
    normalizedTokens,
    activeTokenIdx,
    transitionProgress,
    progress,
    startPos,
    endPos,
    currentPath,
    motionTag,
  ]);

  const activePos = computePositionAndScale();

  // Active handshape & orientation
  const activeHandshape = isSequence
    ? currentToken?.handshape || currentToken?.label || handshape
    : handshape;

  const activeOrientation = isSequence
    ? currentToken?.orientation || specOrientation
    : specOrientation;

  const activeRotation = isSequence
    ? currentToken?.rotation !== undefined
      ? currentToken.rotation
      : specRotation
    : specRotation;

  // Active step index
  const activeStepIndex = isSequence
    ? Math.min(steps.length - 1, activeTokenIdx)
    : steps.length > 0
    ? Math.min(steps.length - 1, Math.floor(progress * steps.length))
    : 0;

  // Manual Next Step Handler
  const handleNextStep = useCallback(() => {
    if (!isSequence) return;
    setActiveTokenIdx((prev) => (prev + 1) % normalizedTokens.length);
    setTransitionProgress(0);
  }, [isSequence, normalizedTokens.length]);

  // Replay Handler
  const handleReplay = useCallback(() => {
    setActiveTokenIdx(0);
    setTransitionProgress(0);
    setProgress(0);
    setIsPlaying(true);
  }, []);

  if (!hasSpec) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-amber-500/30 bg-slate-900/95 p-4 text-center ${className}`}
        role="img"
        aria-label={`${label} animation coming soon`}
      >
        <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
          Visual Coming Soon
        </span>
        <h4 className="mt-2 font-display text-sm font-bold text-ink">{label}</h4>
        <p className="mt-1 line-clamp-2 text-[11px] text-ink-muted">
          {steps[0] || "Instructional visual sequence will appear here."}
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col overflow-hidden rounded-xl bg-slate-950 border border-slate-800 ${className}`}
      role="img"
      aria-label={`${label} animated reference gesture guide`}
    >
      {/* SVG Animation Stage */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-b from-slate-900/90 to-slate-950">
        <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
          {/* Card background */}
          <rect width="200" height="160" rx="12" fill="#0b1329" />

          {/* Minimal Head-and-Shoulders Silhouette Outline & Reactive Anchor Beacon */}
          {renderAnatomicalSilhouette(currentlyGlowingAnchor)}

          {/* Motion Path Vectors for Single Signs */}
          {!isSequence && currentPath !== "static" && motionTag !== "static" && (
            <g>
              {/* Ghost Start Pose (25% opacity) */}
              <g opacity="0.25" transform={`translate(${startPos.x}, ${startPos.y}) scale(0.75)`}>
                {renderHandshapePath(handshape, "#94a3b8", specOrientation, specRotation, 0.55)}
              </g>

              {/* Path Vector */}
              {currentPath === "forward" && (
                <g>
                  <line
                    x1={startPos.x + 16}
                    y1={startPos.y + 16}
                    x2={endPos.x + 16}
                    y2={endPos.y + 16}
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    strokeDasharray="4 3"
                    strokeLinecap="round"
                  />
                  <polygon
                    points={`${endPos.x + 22},${endPos.y + 16} ${endPos.x + 12},${endPos.y + 11} ${endPos.x + 15},${endPos.y + 22}`}
                    fill="#38bdf8"
                  />
                </g>
              )}

              {currentPath === "arc" && (
                <g>
                  <path
                    d={`M${startPos.x + 16} ${startPos.y + 16} Q${(startPos.x + endPos.x) / 2} ${
                      Math.min(startPos.y, endPos.y) - 20
                    } ${endPos.x + 16} ${endPos.y + 16}`}
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    strokeDasharray="4 3"
                    strokeLinecap="round"
                  />
                  <polygon
                    points={`${endPos.x + 22},${endPos.y + 16} ${endPos.x + 12},${endPos.y + 11} ${endPos.x + 15},${endPos.y + 22}`}
                    fill="#38bdf8"
                  />
                </g>
              )}

              {currentPath === "circle" && (
                <circle
                  cx={(startPos.x + endPos.x) / 2 + 16}
                  cy={(startPos.y + endPos.y) / 2 + 16}
                  r={Math.hypot(endPos.x - startPos.x, endPos.y - startPos.y) / 2 || 18}
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  fill="none"
                  opacity="0.6"
                />
              )}

              {currentPath === "tap" && (
                <g opacity="0.7">
                  <circle cx={startPos.x + 18} cy={startPos.y + 36} r="6" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
                  <circle cx={startPos.x + 18} cy={startPos.y + 36} r="12" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
                </g>
              )}

              {currentPath === "shake" && (
                <g opacity="0.7">
                  <path d={`M${startPos.x - 4} ${startPos.y + 18} C${startPos.x - 12} ${startPos.y + 12} ${startPos.x - 12} ${startPos.y + 24} ${startPos.x - 4} ${startPos.y + 18}`} stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
                  <path d={`M${startPos.x + 40} ${startPos.y + 18} C${startPos.x + 48} ${startPos.y + 12} ${startPos.x + 48} ${startPos.y + 24} ${startPos.x + 40} ${startPos.y + 18}`} stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
                </g>
              )}

              {currentPath === "line" && (
                <g>
                  <line
                    x1={startPos.x + 16}
                    y1={startPos.y + 16}
                    x2={endPos.x + 16}
                    y2={endPos.y + 16}
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    strokeDasharray="4 3"
                    strokeLinecap="round"
                  />
                  <polygon
                    points={`${endPos.x + 22},${endPos.y + 16} ${endPos.x + 12},${endPos.y + 11} ${endPos.x + 15},${endPos.y + 22}`}
                    fill="#38bdf8"
                  />
                </g>
              )}
            </g>
          )}

          {/* Real-time Moving Active Hand */}
          <g transform={`translate(${activePos.x}, ${activePos.y})`}>
            {renderHandshapePath(activeHandshape, "#38bdf8", activeOrientation, activeRotation, activePos.scale)}
          </g>

          {/* Bottom Identification Banner */}
          <rect x="8" y="132" width="184" height="20" rx="10" fill="#0f172a" fillOpacity="0.88" stroke="#38bdf8" strokeOpacity="0.3" strokeWidth="1" />
          <text x="100" y="146" fill="#38bdf8" fontSize="9.5" fontWeight="600" textAnchor="middle" fontFamily="system-ui, sans-serif">
            {label} · {isSequence ? `"${currentToken?.label}" at ${ANCHOR_COORDINATES[normalizeAnchorKey(currentlyGlowingAnchor)]?.label || "Location"}` : (ANCHOR_COORDINATES[normalizeAnchorKey(currentlyGlowingAnchor)]?.label || "Neutral Space")}
          </text>
        </svg>

        {/* Floating Animation Controls */}
        <div className="absolute top-2 right-2 flex items-center gap-1 rounded-lg bg-slate-900/90 p-1 backdrop-blur-md border border-white/10 z-10 shadow-lg">
          {/* Play / Pause */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsPlaying((prev) => !prev);
            }}
            className="flex h-6 w-6 items-center justify-center rounded-md bg-white/5 text-slate-300 hover:bg-white/15 hover:text-white transition"
            title={isPlaying ? "Pause animation" : "Play animation"}
            aria-label={isPlaying ? "Pause animation" : "Play animation"}
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} fill="currentColor" />}
          </button>

          {/* Replay */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleReplay();
            }}
            className="flex h-6 w-6 items-center justify-center rounded-md bg-white/5 text-slate-300 hover:bg-white/15 hover:text-white transition"
            title="Replay sequence"
            aria-label="Replay sequence"
          >
            <RotateCcw size={12} />
          </button>

          {/* 0.5x Speed */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSpeed(0.5);
            }}
            className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-bold transition ${
              speed === 0.5 ? "bg-signal text-void shadow-sm" : "bg-white/5 text-slate-300 hover:bg-white/15 hover:text-white"
            }`}
            title="0.5x speed"
            aria-label="0.5x speed"
          >
            0.5x
          </button>

          {/* 1x Speed */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSpeed(1);
            }}
            className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-bold transition ${
              speed === 1 ? "bg-signal text-void shadow-sm" : "bg-white/5 text-slate-300 hover:bg-white/15 hover:text-white"
            }`}
            title="1x speed"
            aria-label="1x speed"
          >
            1x
          </button>

          {/* Next Step Button (Sequence Mode) */}
          {isSequence && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNextStep();
              }}
              className="flex items-center gap-0.5 rounded-md bg-signal/15 px-1.5 py-0.5 text-[10px] font-semibold text-signal-light hover:bg-signal/25 transition border border-signal/30"
              title="Advance to next step"
              aria-label="Next step"
            >
              <span>Next</span>
              <ChevronRight size={11} />
            </button>
          )}
        </div>

        {/* Top-Left Motion Tag & Live Step Indicator */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
          <span className="rounded-md bg-slate-900/90 px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-300 backdrop-blur-md border border-white/10">
            {isSequence ? "Sequence" : motionTag === "static" ? "Static Pose" : "Motion Guide"}
          </span>
          {isSequence && (
            <span
              className="rounded-md bg-signal/20 px-2 py-0.5 text-[11px] font-mono font-bold text-signal backdrop-blur-md border border-signal/40 shadow-sm"
              title={`Step ${activeTokenIdx + 1} of ${normalizedTokens.length}`}
            >
              {activeTokenIdx + 1}/{normalizedTokens.length}
            </span>
          )}
        </div>
      </div>

      {/* SEQUENCE ROW: Interactive Chips with active token & anchor highlighting */}
      {isSequence && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 bg-slate-900/80 px-3 py-2 backdrop-blur-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-signal">
              <Layers size={11} /> Sequence:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {normalizedTokens.map((token, idx) => {
                const isActive = idx === activeTokenIdx;
                const tokenAnchorName = ANCHOR_COORDINATES[normalizeAnchorKey(token.startAnchor || token.location)]?.label || "Neutral";
                return (
                  <button
                    key={token.id || idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTokenIdx(idx);
                      setTransitionProgress(0);
                    }}
                    className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-mono font-bold transition-all ${
                      isActive
                        ? "bg-signal text-void shadow-md shadow-signal/30 ring-2 ring-signal ring-offset-1 ring-offset-slate-900 scale-105"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                    }`}
                    title={`Token ${idx + 1}: "${token.label}" at ${tokenAnchorName}`}
                  >
                    <span>{token.label}</span>
                    <span className={`text-[9px] font-normal ${isActive ? "text-void/90" : "text-slate-400"}`}>
                      ({tokenAnchorName})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-[11px] font-mono font-bold text-signal">
              {activeTokenIdx + 1}/{normalizedTokens.length}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNextStep();
              }}
              className="flex items-center gap-0.5 rounded bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition"
              title="Next step"
            >
              <span>Step</span>
              <ChevronRight size={11} />
            </button>
          </div>
        </div>
      )}

      {/* Synchronized Step Highlighting (Expanded Mode) */}
      {!compact && steps.length > 0 && (
        <div className="border-t border-slate-800 bg-slate-900/40 p-3 space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            How to sign:
          </span>
          <div className="space-y-1">
            {steps.map((step, idx) => {
              const isCurrent = idx === activeStepIndex && isPlaying && motionTag !== "static";
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-2 rounded-lg p-1.5 text-xs transition-all ${
                    isCurrent
                      ? "bg-signal/15 text-signal border border-signal/30 font-medium"
                      : "text-slate-400"
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                      isCurrent ? "bg-signal text-void" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="leading-snug">{step}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
