import SignVisual from "../common/SignVisual";
import { findLesson } from "../../data/lessons";
import { SIGN_GUIDES } from "../../data/signGuides";

export default function SignGestureIllustration({ signKey, className = "h-full w-full" }) {
  const normalizedKey = (signKey || "").toLowerCase().replace(/\s+/g, "_");

  // Check if it's a letter (e.g. 'A', 'letter_a', 'letter-a') or digit (e.g. '5', 'number_5')
  const letterMatch = normalizedKey.match(/^(?:letter_|number_)?([a-z0-9])$/i);
  if (letterMatch) {
    const char = letterMatch[1].toUpperCase();
    return (
      <SignVisual
        src={`/signs/asl/${char}.svg`}
        alt={`ASL sign for ${char}`}
        fallbackLabel={`Sign ${char}`}
        className={className}
      />
    );
  }

  // Check if it matches an item in curriculum with a media asset
  const practiceItem = findLesson(signKey);
  if (practiceItem?.media?.url && !SIGN_GUIDES[normalizedKey]) {
    return (
      <SignVisual
        src={practiceItem.media.url}
        alt={practiceItem.media.alt || practiceItem.label}
        mediaType={practiceItem.media.type}
        fallbackLabel={practiceItem.label}
        steps={practiceItem.steps}
        className={className}
      />
    );
  }

  const guide = SIGN_GUIDES[normalizedKey];

  // Render dedicated SVG gesture diagram according to sign
  switch (normalizedKey) {
    case "hello":
      return (
        <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="200" height="160" rx="16" fill="#0f172a" />
          <defs>
            <linearGradient id="helloGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <filter id="glowHello" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
          </defs>

          {/* Forehead guideline */}
          <path d="M40 70 Q70 45 100 50" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
          <circle cx="70" cy="48" r="3" fill="#64748b" />
          <text x="45" y="38" fill="#64748b" fontSize="10" fontFamily="sans-serif">Forehead</text>

          {/* Hand Palm & Extended Fingers (Hello Salute/Wave) */}
          <g filter="url(#glowHello)">
            {/* Palm */}
            <path d="M90 95 C85 85 92 68 108 68 C122 68 132 82 128 102 C125 118 108 128 92 122 Z" fill="url(#helloGrad)" opacity="0.9" />
            {/* Thumb */}
            <path d="M92 90 C82 86 78 98 86 106 C92 110 94 102 92 90 Z" fill="#7dd3fc" />
            {/* Index Finger */}
            <path d="M102 68 C102 48 112 48 112 68 Z" fill="#bae6fd" />
            {/* Middle Finger */}
            <path d="M112 66 C112 42 122 42 122 66 Z" fill="#e0f2fe" />
            {/* Ring Finger */}
            <path d="M122 70 C122 48 130 48 130 70 Z" fill="#bae6fd" />
            {/* Pinky Finger */}
            <path d="M130 76 C130 56 137 56 137 76 Z" fill="#7dd3fc" />
          </g>

          {/* Motion wave arrows */}
          <path d="M136 50 C155 52 165 68 160 84" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" strokeDasharray="3 3" />
          <polygon points="163,88 155,82 166,79" fill="#38bdf8" />

          {/* Wave ripple lines */}
          <path d="M148 42 Q164 56 156 70" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <path d="M156 36 Q176 52 166 74" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />

          {/* Instruction Label */}
          <rect x="24" y="128" width="152" height="22" rx="11" fill="#1e293b" />
          <text x="100" y="143" fill="#38bdf8" fontSize="11" fontWeight="600" textAnchor="middle" fontFamily="sans-serif">
            Wave Open Palm Near Temple
          </text>
        </svg>
      );

    case "goodbye":
      return (
        <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="200" height="160" rx="16" fill="#0f172a" />
          <defs>
            <linearGradient id="byeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>

          {/* Open Palm facing forward */}
          <g transform="translate(10, 0)">
            {/* Palm */}
            <rect x="70" y="70" width="46" height="48" rx="14" fill="url(#byeGrad)" />
            {/* Thumb */}
            <path d="M70 90 C56 86 52 100 62 106 C70 110 72 102 70 90 Z" fill="#93c5fd" />
            {/* Fingers Waving */}
            <rect x="70" y="32" width="9" height="42" rx="4.5" fill="#dbeafe" />
            <rect x="82" y="26" width="9" height="48" rx="4.5" fill="#eff6ff" />
            <rect x="94" y="28" width="9" height="46" rx="4.5" fill="#dbeafe" />
            <rect x="106" y="36" width="9" height="38" rx="4.5" fill="#93c5fd" />
            {/* Wrist */}
            <rect x="78" y="116" width="30" height="20" rx="6" fill="#1d4ed8" />
          </g>

          {/* Wave Motion Curves Left & Right */}
          <path d="M52 48 C44 58 44 72 52 82" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M42 42 C30 56 30 78 42 90" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
          <path d="M148 48 C156 58 156 72 148 82" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M158 42 C170 56 170 78 158 90" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />

          {/* Instruction Label */}
          <rect x="24" y="128" width="152" height="22" rx="11" fill="#1e293b" />
          <text x="100" y="143" fill="#60a5fa" fontSize="11" fontWeight="600" textAnchor="middle" fontFamily="sans-serif">
            Wave Hand Side to Side
          </text>
        </svg>
      );

    case "please":
      return (
        <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="200" height="160" rx="16" fill="#0f172a" />
          <defs>
            <linearGradient id="pleaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>

          {/* Torso/Chest Outline */}
          <path d="M45 125 C50 60 150 60 155 125 Z" fill="#1e293b" stroke="#334155" strokeWidth="2" opacity="0.5" />
          <circle cx="100" cy="85" r="28" fill="none" stroke="#34d399" strokeWidth="2" strokeDasharray="5 4" opacity="0.4" />

          {/* Flat Palm on Chest */}
          <g transform="translate(74, 52)">
            <rect x="10" y="24" width="34" height="38" rx="10" fill="url(#pleaseGrad)" />
            <rect x="10" y="2" width="7" height="26" rx="3.5" fill="#a7f3d0" />
            <rect x="19" y="0" width="7" height="28" rx="3.5" fill="#ecfdf5" />
            <rect x="28" y="2" width="7" height="26" rx="3.5" fill="#a7f3d0" />
            <rect x="37" y="6" width="6" height="22" rx="3" fill="#6ee7b7" />
            {/* Thumb */}
            <path d="M10 38 C0 34 0 46 8 50 Z" fill="#6ee7b7" />
          </g>

          {/* Circular Motion Arrow (Clockwise on Chest) */}
          <path d="M72 82 A34 34 0 1 1 128 82" stroke="#34d399" strokeWidth="3" fill="none" strokeLinecap="round" />
          <polygon points="132,88 126,78 136,78" fill="#34d399" />

          {/* Instruction Label */}
          <rect x="20" y="128" width="160" height="22" rx="11" fill="#1e293b" />
          <text x="100" y="143" fill="#34d399" fontSize="11" fontWeight="600" textAnchor="middle" fontFamily="sans-serif">
            Circular Rub on Center Chest
          </text>
        </svg>
      );

    case "thank_you":
      return (
        <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="200" height="160" rx="16" fill="#0f172a" />
          <defs>
            <linearGradient id="thankGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>

          {/* Chin Reference Dot & Guideline */}
          <circle cx="58" cy="52" r="5" fill="#64748b" />
          <text x="40" y="38" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">Lips / Chin</text>

          {/* Start Position (Faint Ghost) */}
          <g opacity="0.3" transform="translate(42, 46) scale(0.7)">
            <rect x="10" y="24" width="30" height="34" rx="8" fill="#a78bfa" />
            <rect x="10" y="2" width="6" height="24" rx="3" fill="#c4b5fd" />
            <rect x="18" y="0" width="6" height="26" rx="3" fill="#c4b5fd" />
            <rect x="26" y="2" width="6" height="24" rx="3" fill="#c4b5fd" />
          </g>

          {/* Motion Sweeping Arrow Forward */}
          <path d="M72 65 C100 60 120 75 140 85" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 3" />
          <polygon points="146,88 136,83 141,75" fill="#a78bfa" />

          {/* End Position (Prominent Hand moving out) */}
          <g transform="translate(112, 60)">
            <rect x="10" y="20" width="32" height="34" rx="8" fill="url(#thankGrad)" />
            <rect x="10" y="0" width="6" height="24" rx="3" fill="#ddd6fe" />
            <rect x="18" y="-2" width="6" height="26" rx="3" fill="#f5f3ff" />
            <rect x="26" y="0" width="6" height="24" rx="3" fill="#ddd6fe" />
            <rect x="34" y="4" width="6" height="20" rx="3" fill="#c4b5fd" />
            {/* Thumb */}
            <path d="M10 32 C0 28 0 38 8 42 Z" fill="#c4b5fd" />
          </g>

          {/* Instruction Label */}
          <rect x="20" y="128" width="160" height="22" rx="11" fill="#1e293b" />
          <text x="100" y="143" fill="#a78bfa" fontSize="11" fontWeight="600" textAnchor="middle" fontFamily="sans-serif">
            Chin Forward & Down to Person
          </text>
        </svg>
      );

    case "sorry":
      return (
        <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="200" height="160" rx="16" fill="#0f172a" />
          <defs>
            <linearGradient id="sorryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>

          {/* Chest Outline */}
          <path d="M45 125 C50 60 150 60 155 125 Z" fill="#1e293b" stroke="#334155" strokeWidth="2" opacity="0.5" />

          {/* Circular Rotation Arrows */}
          <circle cx="100" cy="78" r="32" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="5 5" opacity="0.4" />
          <path d="M70 78 A30 30 0 1 1 130 78" stroke="#fbbf24" strokeWidth="3" fill="none" strokeLinecap="round" />
          <polygon points="135,84 127,75 138,74" fill="#fbbf24" />

          {/* Closed Fist ('A' Handshape) */}
          <g transform="translate(80, 56)">
            {/* Curled Knuckles */}
            <rect x="6" y="10" width="28" height="34" rx="9" fill="url(#sorryGrad)" />
            <circle cx="12" cy="18" r="4.5" fill="#fef3c7" />
            <circle cx="20" cy="17" r="4.5" fill="#fffbeb" />
            <circle cx="28" cy="18" r="4.5" fill="#fef3c7" />
            {/* Thumb resting over fist */}
            <path d="M4 18 C4 12 10 10 16 14 C16 26 4 28 4 18 Z" fill="#fde68a" />
          </g>

          {/* Instruction Label */}
          <rect x="22" y="128" width="156" height="22" rx="11" fill="#1e293b" />
          <text x="100" y="143" fill="#fbbf24" fontSize="11" fontWeight="600" textAnchor="middle" fontFamily="sans-serif">
            Fist in Small Circles on Chest
          </text>
        </svg>
      );

    case "yes":
      return (
        <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="200" height="160" rx="16" fill="#0f172a" />
          <defs>
            <linearGradient id="yesGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>

          {/* Vertical Nodding Arrow (Up & Down like a head) */}
          <path d="M148 44 L148 100" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
          <polygon points="148,36 142,46 154,46" fill="#34d399" />
          <polygon points="148,108 142,98 154,98" fill="#34d399" />

          {/* Nodding Fist ('S' Handshape) */}
          <g transform="translate(75, 48)">
            {/* Fist Main Block */}
            <rect x="8" y="12" width="34" height="38" rx="12" fill="url(#yesGrad)" />
            {/* Folded Finger Knuckles */}
            <circle cx="16" cy="20" r="5" fill="#a7f3d0" />
            <circle cx="25" cy="19" r="5.5" fill="#ecfdf5" />
            <circle cx="34" cy="21" r="5" fill="#a7f3d0" />
            {/* Thumb wrapped across fingers */}
            <path d="M6 24 C4 18 14 16 28 20 C28 28 10 32 6 24 Z" fill="#6ee7b7" />
            {/* Forearm */}
            <rect x="14" y="48" width="22" height="24" rx="5" fill="#047857" opacity="0.8" />
          </g>

          {/* Instruction Label */}
          <rect x="22" y="128" width="156" height="22" rx="11" fill="#1e293b" />
          <text x="100" y="143" fill="#34d399" fontSize="11" fontWeight="600" textAnchor="middle" fontFamily="sans-serif">
            Nod Fist Up & Down ("Yes")
          </text>
        </svg>
      );

    case "no":
      return (
        <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="200" height="160" rx="16" fill="#0f172a" />
          <defs>
            <linearGradient id="noGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>

          {/* Snapping Pinch Hand (Index & Middle snapping to Thumb) */}
          <g transform="translate(68, 36)">
            {/* Palm base */}
            <rect x="14" y="38" width="34" height="34" rx="10" fill="url(#noGrad)" />
            {/* Curled Ring & Pinky */}
            <rect x="36" y="44" width="14" height="14" rx="7" fill="#b91c1c" />
            <rect x="34" y="56" width="14" height="14" rx="7" fill="#991b1b" />

            {/* Index and Middle pointing down toward thumb */}
            <path d="M18 36 L16 12 C16 6 26 6 26 12 L26 36 Z" fill="#fca5a5" />
            <path d="M28 36 L30 14 C30 8 40 8 38 14 L36 36 Z" fill="#fef2f2" />

            {/* Thumb extending up to meet fingers */}
            <path d="M12 50 C4 44 8 28 20 28 C22 34 22 46 12 50 Z" fill="#f87171" />

            {/* Snap impact point */}
            <circle cx="21" cy="27" r="4" fill="#fbbf24" />
          </g>

          {/* Snap Motion Indicator */}
          <path d="M122 42 L112 50" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M128 50 L118 56" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" />

          {/* Instruction Label */}
          <rect x="20" y="128" width="160" height="22" rx="11" fill="#1e293b" />
          <text x="100" y="143" fill="#f87171" fontSize="11" fontWeight="600" textAnchor="middle" fontFamily="sans-serif">
            Tap 2 Fingers to Thumb Shut
          </text>
        </svg>
      );

    case "love":
      return (
        <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="200" height="160" rx="16" fill="#0f172a" />
          <defs>
            <linearGradient id="loveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#db2777" />
            </linearGradient>
            <radialGradient id="heartGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f472b6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f472b6" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Heart aura glow */}
          <circle cx="100" cy="72" r="50" fill="url(#heartGlow)" />

          {/* Floating small hearts */}
          <path d="M52 50 C52 46 56 42 60 46 C64 42 68 46 68 50 C68 56 60 62 60 62 C60 62 52 56 52 50 Z" fill="#ec4899" opacity="0.6" />
          <path d="M142 42 C142 38 146 34 150 38 C154 34 158 38 158 42 C158 48 150 54 150 54 C150 54 142 48 142 42 Z" fill="#ec4899" opacity="0.6" />

          {/* ILY Hand: Thumb, Index, Pinky extended */}
          <g transform="translate(68, 30)">
            {/* Palm */}
            <rect x="18" y="44" width="36" height="42" rx="12" fill="url(#loveGrad)" />

            {/* Extended Thumb */}
            <path d="M18 64 C0 58 4 44 14 46 C20 48 20 60 18 64 Z" fill="#fbcfe8" />

            {/* Extended Index Finger */}
            <rect x="22" y="8" width="8" height="40" rx="4" fill="#fdf2f8" />

            {/* Curled Middle Finger */}
            <rect x="32" y="44" width="8" height="14" rx="4" fill="#be185d" />

            {/* Curled Ring Finger */}
            <rect x="42" y="46" width="8" height="14" rx="4" fill="#9d174d" />

            {/* Extended Pinky Finger */}
            <rect x="52" y="16" width="7" height="34" rx="3.5" fill="#fbcfe8" />
          </g>

          {/* Instruction Label */}
          <rect x="20" y="128" width="160" height="22" rx="11" fill="#1e293b" />
          <text x="100" y="143" fill="#f472b6" fontSize="11" fontWeight="600" textAnchor="middle" fontFamily="sans-serif">
            ILY: Thumb, Index & Pinky Up
          </text>
        </svg>
      );

    case "friend":
      return (
        <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="200" height="160" rx="16" fill="#0f172a" />
          <defs>
            <linearGradient id="friendGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
            <linearGradient id="friendGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>

          {/* Linked Hands (Two Interlocking Index Hooks) */}
          <g transform="translate(55, 42)">
            {/* Left Hand Fist */}
            <rect x="0" y="24" width="28" height="34" rx="9" fill="url(#friendGrad1)" />
            {/* Left Hooked Index Finger */}
            <path d="M22 28 C22 10 44 10 44 26 C44 32 36 34 32 30" stroke="#c7d2fe" strokeWidth="6" strokeLinecap="round" fill="none" />

            {/* Right Hand Fist */}
            <rect x="62" y="24" width="28" height="34" rx="9" fill="url(#friendGrad2)" />
            {/* Right Hooked Index Finger (Interlocking) */}
            <path d="M68 28 C68 10 46 10 46 26 C46 32 54 34 58 30" stroke="#bae6fd" strokeWidth="6" strokeLinecap="round" fill="none" />
          </g>

          {/* Link Sparkle */}
          <circle cx="100" cy="62" r="3" fill="#fbbf24" />
          <path d="M100 54 L100 70 M92 62 L108 62" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />

          {/* Instruction Label */}
          <rect x="20" y="128" width="160" height="22" rx="11" fill="#1e293b" />
          <text x="100" y="143" fill="#818cf8" fontSize="11" fontWeight="600" textAnchor="middle" fontFamily="sans-serif">
            Interlock Both Index Fingers
          </text>
        </svg>
      );

    case "help":
      return (
        <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="200" height="160" rx="16" fill="#0f172a" />
          <defs>
            <linearGradient id="helpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>

          {/* Flat Supporting Palm (Non-dominant base) */}
          <rect x="55" y="96" width="90" height="16" rx="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
          <rect x="58" y="98" width="84" height="12" rx="6" fill="#334155" />

          {/* Thumbs Up Fist on Top */}
          <g transform="translate(80, 42)">
            <rect x="8" y="24" width="30" height="32" rx="8" fill="url(#helpGrad)" />
            {/* Extended Thumb pointing UP */}
            <rect x="18" y="2" width="10" height="26" rx="5" fill="#bae6fd" />
            <circle cx="23" cy="28" r="4" fill="#e0f2fe" />
          </g>

          {/* Lift Upward Arrows */}
          <path d="M42 98 L42 70" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
          <polygon points="42,62 37,72 47,72" fill="#38bdf8" />
          <path d="M158 98 L158 70" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
          <polygon points="158,62 153,72 163,72" fill="#38bdf8" />

          {/* Instruction Label */}
          <rect x="20" y="128" width="160" height="22" rx="11" fill="#1e293b" />
          <text x="100" y="143" fill="#38bdf8" fontSize="11" fontWeight="600" textAnchor="middle" fontFamily="sans-serif">
            Lift Thumbs-Up on Flat Palm
          </text>
        </svg>
      );

    default: {
      const lesson = findLesson(signKey);
      const normalizedKey = (signKey || "").toLowerCase().trim().replace(/\s+/g, "_");
      const cleanUpper = (signKey || "").replace(/^(letter|number)\s*/i, "").trim().toUpperCase();

      const displayTitle = lesson?.label || (signKey || "Sign").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

      // If unified lesson has a media URL, use it
      if (lesson?.media?.url) {
        return (
          <SignVisual
            src={lesson.media.url}
            alt={lesson.media.alt || `ASL sign for ${displayTitle}`}
            fallbackLabel={displayTitle}
            steps={lesson.steps || guide?.steps || []}
            className={className}
          />
        );
      }

      // Try direct match from public/signs/asl
      const candidateSrc = cleanUpper.length > 0 ? `/signs/asl/${cleanUpper}.svg` : `/signs/asl/${normalizedKey}.svg`;

      return (
        <SignVisual
          src={candidateSrc}
          alt={`ASL sign for ${displayTitle}`}
          fallbackLabel={displayTitle}
          steps={lesson?.steps || guide?.steps || []}
          className={className}
        />
      );
    }
  }
}
