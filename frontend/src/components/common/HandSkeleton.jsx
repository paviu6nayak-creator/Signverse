import { motion } from "framer-motion";

// Approximate relative positions for an open, palm-facing hand, laid out
// to match MediaPipe's own 21-point hand landmark topology. This is a
// decorative representation of what the AI model actually "sees" —
// wrist (0), thumb (1-4), index (5-8), middle (9-12), ring (13-16),
// pinky (17-20) — not a claim about any specific letter's handshape.
const POINTS = [
  [150, 260], // 0 wrist
  [120, 230], [95, 205], [78, 180], [65, 158], // thumb
  [120, 175], [112, 130], [107, 98], [103, 70], // index
  [150, 165], [150, 115], [150, 80], [150, 50], // middle
  [180, 170], [185, 122], [188, 88], [190, 60], // ring
  [208, 185], [218, 145], [225, 115], [230, 90], // pinky
];

const CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20],
  [0, 17],
];

export default function HandSkeleton({ className = "" }) {
  return (
    <svg viewBox="0 0 300 300" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="AI hand-tracking landmark visualization">
      {CONNECTIONS.map(([from, to], index) => {
        const [x1, y1] = POINTS[from];
        const [x2, y2] = POINTS[to];
        return (
          <motion.line
            key={`${from}-${to}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="url(#skeleton-gradient)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.8 }}
            transition={{ duration: 0.6, delay: index * 0.03, ease: "easeOut" }}
          />
        );
      })}

      {POINTS.map(([x, y], index) => (
        <motion.circle
          key={index}
          cx={x}
          cy={y}
          r={index === 0 ? 6 : 4.5}
          fill={index === 0 ? "#8B5CF6" : "#2DD4BF"}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 + index * 0.025, ease: "backOut" }}
          style={{ transformOrigin: `${x}px ${y}px` }}
        >
          <animate attributeName="opacity" values="0.7;1;0.7" dur={`${2 + (index % 5) * 0.3}s`} repeatCount="indefinite" />
        </motion.circle>
      ))}

      <defs>
        <linearGradient id="skeleton-gradient" x1="0" y1="0" x2="300" y2="300" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2DD4BF" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
    </svg>
  );
}
