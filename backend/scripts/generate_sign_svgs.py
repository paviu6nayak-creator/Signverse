import os
from pathlib import Path

out_dir = Path(r"c:\Users\hp\Desktop\signverse\frontend\public\signs\asl")
out_dir.mkdir(parents=True, exist_ok=True)

# Define unique geometric descriptors for every ASL letter and number
# Each entry defines:
# - title
# - subtitle / key characteristic
# - color palette (gradient stops)
# - specific SVG geometry paths representing the handshape
signs = {
    "A": {
        "title": "Letter A",
        "desc": "Closed fist, thumb resting upright against side of index",
        "accent": "#38bdf8",
        "elements": """
            <!-- Palm / Fist Base -->
            <rect x="68" y="65" width="64" height="60" rx="20" fill="url(#handGrad)" />
            <!-- Curled 4 fingers (horizontal pads) -->
            <rect x="72" y="66" width="56" height="13" rx="6" fill="#7dd3fc" />
            <rect x="72" y="79" width="56" height="13" rx="6" fill="#38bdf8" />
            <rect x="74" y="92" width="54" height="13" rx="6" fill="#0284c7" />
            <rect x="76" y="105" width="50" height="12" rx="6" fill="#0369a1" />
            <!-- Thumb standing straight up along side of index -->
            <rect x="52" y="52" width="20" height="58" rx="10" fill="#bae6fd" stroke="#0284c7" stroke-width="2" />
            <!-- Thumb knuckle line -->
            <line x1="56" y1="80" x2="68" y2="80" stroke="#0284c7" stroke-width="1.5" />
            <!-- Wrist -->
            <rect x="80" y="125" width="40" height="25" rx="6" fill="#0c4a6e" />
        """
    },
    "B": {
        "title": "Letter B",
        "desc": "Flat open 4 fingers held straight up, thumb folded across palm",
        "accent": "#818cf8",
        "elements": """
            <!-- Palm Base -->
            <rect x="70" y="75" width="60" height="52" rx="16" fill="url(#handGrad)" />
            <!-- 4 Straight Fingers standing tall together -->
            <rect x="72" y="22" width="13" height="60" rx="6.5" fill="#c7d2fe" stroke="#4f46e5" stroke-width="1.5" />
            <rect x="86" y="18" width="13" height="64" rx="6.5" fill="#e0e7ff" stroke="#4f46e5" stroke-width="1.5" />
            <rect x="100" y="20" width="13" height="62" rx="6.5" fill="#c7d2fe" stroke="#4f46e5" stroke-width="1.5" />
            <rect x="114" y="28" width="12" height="54" rx="6" fill="#a5b4fc" stroke="#4f46e5" stroke-width="1.5" />
            <!-- Finger joint crease lines -->
            <line x1="72" y1="45" x2="126" y2="45" stroke="#6366f1" stroke-width="1" stroke-dasharray="2 2" />
            <!-- Thumb folded flat across lower palm -->
            <rect x="66" y="94" width="42" height="16" rx="8" fill="#e0e7ff" stroke="#4f46e5" stroke-width="2" />
            <!-- Wrist -->
            <rect x="82" y="127" width="36" height="23" rx="6" fill="#312e81" />
        """
    },
    "C": {
        "title": "Letter C",
        "desc": "Fingers and thumb curved into an open 'C' profile arc",
        "accent": "#34d399",
        "elements": """
            <!-- Curved C Shape -->
            <!-- Top finger arc -->
            <path d="M 130 45 C 80 40, 58 75, 60 100 C 62 125, 90 135, 130 130 L 126 114 C 95 116, 78 110, 78 98 C 78 86, 92 60, 126 62 Z" fill="url(#handGrad)" stroke="#059669" stroke-width="2" />
            <!-- Individual 4 fingers curved together in arc -->
            <rect x="108" y="44" width="24" height="16" rx="7" fill="#a7f3d0" />
            <!-- Thumb bottom curve -->
            <rect x="108" y="116" width="24" height="15" rx="7" fill="#6ee7b7" />
            <!-- Inner open space indication -->
            <circle cx="95" cy="88" r="14" fill="#064e3b" opacity="0.4" />
            <!-- Wrist -->
            <rect x="44" y="90" width="22" height="28" rx="6" fill="#064e3b" />
        """
    },
    "D": {
        "title": "Letter D",
        "desc": "Index finger pointing straight up, thumb touching curved fingertips",
        "accent": "#f472b6",
        "elements": """
            <!-- Index pointing straight up -->
            <rect x="80" y="20" width="16" height="66" rx="8" fill="#fbcfe8" stroke="#db2777" stroke-width="2" />
            <!-- Circle of middle, ring, pinky touching thumb -->
            <ellipse cx="106" cy="94" rx="28" ry="24" fill="url(#handGrad)" stroke="#db2777" stroke-width="2" />
            <!-- Inner hole formed by thumb and finger loop -->
            <ellipse cx="104" cy="94" rx="12" ry="10" fill="#831843" />
            <!-- Thumb forming front of circle -->
            <path d="M 80 94 Q 92 108 108 104" stroke="#f472b6" stroke-width="4" fill="none" stroke-linecap="round" />
            <!-- Wrist -->
            <rect x="84" y="124" width="34" height="26" rx="6" fill="#500724" />
        """
    },
    "E": {
        "title": "Letter E",
        "desc": "All 4 fingertips tightly curled down touching thumb tucked beneath",
        "accent": "#fbbf24",
        "elements": """
            <!-- Palm Base -->
            <rect x="70" y="70" width="60" height="55" rx="18" fill="url(#handGrad)" />
            <!-- Curled fingers perched at top edge (E claws) -->
            <rect x="72" y="55" width="12" height="22" rx="6" fill="#fef08a" stroke="#d97706" stroke-width="1.5" />
            <rect x="85" y="54" width="12" height="23" rx="6" fill="#fef9c3" stroke="#d97706" stroke-width="1.5" />
            <rect x="98" y="55" width="12" height="22" rx="6" fill="#fef08a" stroke="#d97706" stroke-width="1.5" />
            <rect x="111" y="58" width="12" height="19" rx="6" fill="#fde047" stroke="#d97706" stroke-width="1.5" />
            <!-- Thumb horizontal bar tucked underneath the 4 curled tips -->
            <rect x="70" y="76" width="55" height="15" rx="7.5" fill="#fde047" stroke="#b45309" stroke-width="2" />
            <!-- Wrist -->
            <rect x="82" y="125" width="36" height="25" rx="6" fill="#451a03" />
        """
    },
    "F": {
        "title": "Letter F",
        "desc": "Index and thumb form an 'OK' circle; remaining 3 fingers spread high",
        "accent": "#2dd4bf",
        "elements": """
            <!-- 3 Open fingers standing upright & slightly fanned -->
            <rect x="92" y="20" width="12" height="60" rx="6" fill="#99f6e4" stroke="#0d9488" stroke-width="1.5" transform="rotate(-6 98 50)" />
            <rect x="108" y="22" width="12" height="58" rx="6" fill="#ccfbf1" stroke="#0d9488" stroke-width="1.5" />
            <rect x="123" y="28" width="11" height="52" rx="5.5" fill="#99f6e4" stroke="#0d9488" stroke-width="1.5" transform="rotate(6 128 54)" />
            <!-- Index & Thumb touch forming circle at left/front -->
            <ellipse cx="76" cy="86" rx="22" ry="20" fill="url(#handGrad)" stroke="#0d9488" stroke-width="2" />
            <ellipse cx="76" cy="86" rx="9" ry="8" fill="#134e4a" />
            <!-- Wrist -->
            <rect x="82" y="125" width="36" height="25" rx="6" fill="#115e59" />
        """
    },
    "G": {
        "title": "Letter G",
        "desc": "Index finger and thumb pointing horizontally parallel forward",
        "accent": "#a78bfa",
        "elements": """
            <!-- Closed fist base pointing sideways -->
            <rect x="65" y="65" width="55" height="55" rx="16" fill="url(#handGrad)" />
            <!-- Index finger pointing left horizontally -->
            <rect x="24" y="64" width="56" height="14" rx="7" fill="#ddd6fe" stroke="#7c3aed" stroke-width="2" />
            <!-- Thumb pointing left horizontally parallel -->
            <rect x="30" y="86" width="50" height="14" rx="7" fill="#ede9fe" stroke="#7c3aed" stroke-width="2" />
            <!-- Curled other 3 fingers on fist -->
            <circle cx="104" cy="74" r="8" fill="#8b5cf6" />
            <circle cx="104" cy="90" r="8" fill="#7c3aed" />
            <circle cx="104" cy="104" r="7" fill="#6d28d9" />
            <!-- Wrist -->
            <rect x="110" y="78" width="26" height="34" rx="6" fill="#2e1065" />
        """
    },
    "H": {
        "title": "Letter H",
        "desc": "Index and middle fingers extended together horizontally sideways",
        "accent": "#38bdf8",
        "elements": """
            <!-- Fist Base -->
            <rect x="75" y="66" width="50" height="54" rx="16" fill="url(#handGrad)" />
            <!-- Index finger horizontal -->
            <rect x="22" y="64" width="68" height="13" rx="6.5" fill="#bae6fd" stroke="#0284c7" stroke-width="1.5" />
            <!-- Middle finger horizontal right below index -->
            <rect x="22" y="79" width="68" height="13" rx="6.5" fill="#e0f2fe" stroke="#0284c7" stroke-width="1.5" />
            <!-- Thumb tucked across ring finger -->
            <rect x="70" y="93" width="30" height="13" rx="6.5" fill="#7dd3fc" />
            <!-- Wrist -->
            <rect x="114" y="78" width="26" height="34" rx="6" fill="#0c4a6e" />
        """
    },
    "I": {
        "title": "Letter I",
        "desc": "Pinky finger standing straight up; remaining 3 fingers curled into fist",
        "accent": "#f43f5e",
        "elements": """
            <!-- Fist Base -->
            <rect x="70" y="68" width="60" height="58" rx="18" fill="url(#handGrad)" />
            <!-- Pinky finger standing straight up -->
            <rect x="118" y="24" width="13" height="58" rx="6.5" fill="#fecdd3" stroke="#e11d48" stroke-width="2" />
            <!-- Thumb folded across curled fingers -->
            <rect x="68" y="80" width="46" height="17" rx="8.5" fill="#ffe4e6" stroke="#e11d48" stroke-width="1.5" />
            <!-- Curled finger knuckles -->
            <line x1="74" y1="72" x2="114" y2="72" stroke="#fb7185" stroke-width="3" stroke-linecap="round" />
            <!-- Wrist -->
            <rect x="82" y="126" width="36" height="24" rx="6" fill="#4c0519" />
        """
    },
    "J": {
        "title": "Letter J",
        "desc": "Pinky up, tracing a 'J' curved hook motion downward and inward",
        "accent": "#fb923c",
        "elements": """
            <!-- Fist Base -->
            <rect x="70" y="68" width="60" height="58" rx="18" fill="url(#handGrad)" />
            <!-- Pinky finger -->
            <rect x="118" y="28" width="13" height="54" rx="6.5" fill="#fed7aa" stroke="#ea580c" stroke-width="2" />
            <!-- J-shaped swooping motion arrow -->
            <path d="M 124 86 C 124 116, 96 126, 76 112" stroke="#f97316" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-dasharray="4 3" />
            <polygon points="70,110 82,106 80,118" fill="#f97316" />
            <!-- Thumb folded across fingers -->
            <rect x="68" y="80" width="44" height="16" rx="8" fill="#ffedd5" stroke="#ea580c" stroke-width="1.5" />
            <!-- Wrist -->
            <rect x="82" y="126" width="36" height="24" rx="6" fill="#431407" />
        """
    },
    "K": {
        "title": "Letter K",
        "desc": "Index up, middle angled forward, thumb tucked upright between them",
        "accent": "#4ade80",
        "elements": """
            <!-- Fist Base -->
            <rect x="72" y="76" width="56" height="50" rx="16" fill="url(#handGrad)" />
            <!-- Index finger straight UP -->
            <rect x="76" y="20" width="13" height="62" rx="6.5" fill="#bbf7d0" stroke="#16a34a" stroke-width="2" />
            <!-- Middle finger angled forward-right -->
            <rect x="94" y="26" width="13" height="60" rx="6.5" fill="#dcfce7" stroke="#16a34a" stroke-width="2" transform="rotate(22 94 60)" />
            <!-- Thumb upright between the two fingers -->
            <rect x="85" y="52" width="13" height="38" rx="6.5" fill="#f0fdf4" stroke="#15803d" stroke-width="2" />
            <!-- Wrist -->
            <rect x="82" y="126" width="36" height="24" rx="6" fill="#14532d" />
        """
    },
    "L": {
        "title": "Letter L",
        "desc": "Index finger and thumb extended at right angles forming an 'L'",
        "accent": "#06b6d4",
        "elements": """
            <!-- Palm / Fist -->
            <rect x="78" y="70" width="50" height="56" rx="16" fill="url(#handGrad)" />
            <!-- Index pointing straight UP (Vertical stem of L) -->
            <rect x="76" y="18" width="15" height="68" rx="7.5" fill="#cffafe" stroke="#0891b2" stroke-width="2" />
            <!-- Thumb extended horizontally to the left (Horizontal base of L) -->
            <rect x="30" y="82" width="56" height="15" rx="7.5" fill="#e0f2fe" stroke="#0891b2" stroke-width="2" />
            <!-- Curled 3 fingers -->
            <circle cx="106" cy="78" r="8" fill="#0e7490" />
            <circle cx="106" cy="94" r="8" fill="#155e75" />
            <circle cx="106" cy="110" r="7" fill="#164e63" />
            <!-- Wrist -->
            <rect x="84" y="126" width="34" height="24" rx="6" fill="#164e63" />
        """
    },
    "M": {
        "title": "Letter M",
        "desc": "Thumb tucked under 3 fingers (index, middle, ring draped over thumb)",
        "accent": "#e879f9",
        "elements": """
            <!-- Fist Base -->
            <rect x="68" y="65" width="64" height="60" rx="18" fill="url(#handGrad)" />
            <!-- 3 Finger pads draped over the thumb -->
            <rect x="70" y="60" width="15" height="42" rx="7.5" fill="#f5d0fe" stroke="#c026d3" stroke-width="1.5" />
            <rect x="87" y="58" width="15" height="44" rx="7.5" fill="#fae8ff" stroke="#c026d3" stroke-width="1.5" />
            <rect x="104" y="62" width="15" height="40" rx="7.5" fill="#f5d0fe" stroke="#c026d3" stroke-width="1.5" />
            <!-- Pinky curled beside them -->
            <rect x="120" y="75" width="10" height="26" rx="5" fill="#d946ef" />
            <!-- Thumb tip peeking out under the 3 fingers -->
            <ellipse cx="112" cy="104" rx="7" ry="5" fill="#fdf4ff" stroke="#a21caf" stroke-width="1.5" />
            <!-- Wrist -->
            <rect x="80" y="125" width="40" height="25" rx="6" fill="#701a75" />
        """
    },
    "N": {
        "title": "Letter N",
        "desc": "Thumb tucked under 2 fingers (index and middle draped over thumb)",
        "accent": "#ec4899",
        "elements": """
            <!-- Fist Base -->
            <rect x="68" y="65" width="64" height="60" rx="18" fill="url(#handGrad)" />
            <!-- 2 Finger pads draped over thumb -->
            <rect x="74" y="58" width="18" height="44" rx="9" fill="#fbcfe8" stroke="#db2777" stroke-width="1.5" />
            <rect x="94" y="58" width="18" height="44" rx="9" fill="#fce7f3" stroke="#db2777" stroke-width="1.5" />
            <!-- Ring & Pinky curled beside them -->
            <circle cx="118" cy="74" r="8" fill="#be185d" />
            <circle cx="118" cy="90" r="7" fill="#9d174d" />
            <!-- Thumb tip peeking out under the 2 fingers -->
            <ellipse cx="106" cy="103" rx="7" ry="5" fill="#fff1f2" stroke="#be185d" stroke-width="1.5" />
            <!-- Wrist -->
            <rect x="80" y="125" width="40" height="25" rx="6" fill="#831843" />
        """
    },
    "O": {
        "title": "Letter O",
        "desc": "All fingertips and thumb touch together forming an 'O' ring shape",
        "accent": "#38bdf8",
        "elements": """
            <!-- O ring outer shape -->
            <ellipse cx="100" cy="85" rx="34" ry="42" fill="url(#handGrad)" stroke="#0284c7" stroke-width="2.5" />
            <!-- O ring center hole -->
            <ellipse cx="100" cy="85" rx="16" ry="22" fill="#082f49" />
            <!-- Finger segments visible on upper curvature -->
            <path d="M 82 46 C 94 43 106 43 118 46" stroke="#bae6fd" stroke-width="4" stroke-linecap="round" />
            <!-- Thumb curved on bottom -->
            <path d="M 84 124 C 94 126 106 126 116 124" stroke="#7dd3fc" stroke-width="4" stroke-linecap="round" />
            <!-- Wrist -->
            <rect x="84" y="128" width="32" height="22" rx="6" fill="#0c4a6e" />
        """
    },
    "P": {
        "title": "Letter P",
        "desc": "'K' handshape inverted pointing downward; index down, middle horizontal",
        "accent": "#f59e0b",
        "elements": """
            <!-- Fist Base pointing down -->
            <rect x="74" y="45" width="52" height="50" rx="16" fill="url(#handGrad)" />
            <!-- Index finger pointing straight DOWN -->
            <rect x="76" y="80" width="13" height="60" rx="6.5" fill="#fed7aa" stroke="#d97706" stroke-width="2" />
            <!-- Middle finger angled forward-down -->
            <rect x="94" y="78" width="13" height="54" rx="6.5" fill="#fef3c7" stroke="#d97706" stroke-width="2" transform="rotate(-30 94 85)" />
            <!-- Thumb touching middle finger joint -->
            <circle cx="94" cy="88" r="8" fill="#fde68a" stroke="#b45309" stroke-width="1.5" />
            <!-- Wrist coming from above -->
            <rect x="84" y="18" width="32" height="30" rx="6" fill="#78350f" />
        """
    },
    "Q": {
        "title": "Letter Q",
        "desc": "'G' handshape inverted downward; index and thumb pointing down",
        "accent": "#10b981",
        "elements": """
            <!-- Fist Base above -->
            <rect x="70" y="44" width="60" height="50" rx="16" fill="url(#handGrad)" />
            <!-- Index finger pointing straight down -->
            <rect x="78" y="84" width="14" height="54" rx="7" fill="#a7f3d0" stroke="#059669" stroke-width="2" />
            <!-- Thumb pointing down parallel to index -->
            <rect x="98" y="84" width="14" height="48" rx="7" fill="#d1fae5" stroke="#059669" stroke-width="2" />
            <!-- Wrist coming from above -->
            <rect x="82" y="18" width="36" height="28" rx="6" fill="#064e3b" />
        """
    },
    "R": {
        "title": "Letter R",
        "desc": "Index and middle fingers extended upward and crossed together",
        "accent": "#8b5cf6",
        "elements": """
            <!-- Fist Base -->
            <rect x="72" y="76" width="56" height="50" rx="16" fill="url(#handGrad)" />
            <!-- Index Finger -->
            <rect x="80" y="22" width="13" height="64" rx="6.5" fill="#c4b5fd" stroke="#7c3aed" stroke-width="2" transform="rotate(8 86 54)" />
            <!-- Middle Finger crossed over front of index -->
            <rect x="90" y="20" width="13" height="66" rx="6.5" fill="#ede9fe" stroke="#7c3aed" stroke-width="2" transform="rotate(-12 96 53)" />
            <!-- Thumb folded across ring and pinky -->
            <rect x="70" y="90" width="44" height="16" rx="8" fill="#ddd6fe" stroke="#6d28d9" stroke-width="1.5" />
            <!-- Wrist -->
            <rect x="82" y="126" width="36" height="24" rx="6" fill="#3b0764" />
        """
    },
    "S": {
        "title": "Letter S",
        "desc": "Closed fist with thumb wrapped across the front of all 4 fingers",
        "accent": "#eab308",
        "elements": """
            <!-- Fist Base -->
            <rect x="68" y="65" width="64" height="60" rx="20" fill="url(#handGrad)" />
            <!-- 4 Curled finger fronts -->
            <rect x="72" y="66" width="56" height="12" rx="6" fill="#fef08a" />
            <rect x="72" y="80" width="56" height="12" rx="6" fill="#fde047" />
            <rect x="74" y="94" width="54" height="12" rx="6" fill="#eab308" />
            <rect x="76" y="108" width="50" height="10" rx="5" fill="#ca8a04" />
            <!-- Thumb wrapped horizontally ACROSS front of fist -->
            <rect x="64" y="80" width="62" height="18" rx="9" fill="#fef9c3" stroke="#a16207" stroke-width="2.5" />
            <!-- Wrist -->
            <rect x="80" y="125" width="40" height="25" rx="6" fill="#713f12" />
        """
    },
    "T": {
        "title": "Letter T",
        "desc": "Thumb tucked between index and middle fingers of a closed fist",
        "accent": "#0ea5e9",
        "elements": """
            <!-- Fist Base -->
            <rect x="68" y="65" width="64" height="60" rx="20" fill="url(#handGrad)" />
            <!-- Index finger curled over thumb -->
            <rect x="72" y="64" width="22" height="44" rx="11" fill="#bae6fd" stroke="#0284c7" stroke-width="1.5" />
            <!-- Thumb protruding up between index and middle knuckles -->
            <ellipse cx="94" cy="68" rx="8" ry="12" fill="#f0f9ff" stroke="#0369a1" stroke-width="2" />
            <!-- Middle, ring, pinky fingers curled -->
            <rect x="94" y="74" width="34" height="34" rx="10" fill="#38bdf8" />
            <!-- Wrist -->
            <rect x="80" y="125" width="40" height="25" rx="6" fill="#082f49" />
        """
    },
    "U": {
        "title": "Letter U",
        "desc": "Index and middle fingers extended straight up, pressed firmly together",
        "accent": "#6366f1",
        "elements": """
            <!-- Fist Base -->
            <rect x="72" y="76" width="56" height="50" rx="16" fill="url(#handGrad)" />
            <!-- Index & Middle together as a single block -->
            <rect x="82" y="20" width="14" height="64" rx="7" fill="#c7d2fe" stroke="#4338ca" stroke-width="1.5" />
            <rect x="96" y="20" width="14" height="64" rx="7" fill="#e0e7ff" stroke="#4338ca" stroke-width="1.5" />
            <!-- Seam between the two fingers -->
            <line x1="96" y1="22" x2="96" y2="82" stroke="#4338ca" stroke-width="1" />
            <!-- Thumb folded across ring and pinky -->
            <rect x="70" y="90" width="42" height="16" rx="8" fill="#a5b4fc" stroke="#3730a3" stroke-width="1.5" />
            <!-- Wrist -->
            <rect x="82" y="126" width="36" height="24" rx="6" fill="#1e1b4b" />
        """
    },
    "V": {
        "title": "Letter V",
        "desc": "Index and middle fingers extended straight up spread into a 'V' shape",
        "accent": "#14b8a6",
        "elements": """
            <!-- Fist Base -->
            <rect x="72" y="76" width="56" height="50" rx="16" fill="url(#handGrad)" />
            <!-- Index finger angled left -->
            <rect x="76" y="20" width="13" height="64" rx="6.5" fill="#99f6e4" stroke="#0f766e" stroke-width="2" transform="rotate(-15 82 52)" />
            <!-- Middle finger angled right -->
            <rect x="98" y="20" width="13" height="64" rx="6.5" fill="#ccfbf1" stroke="#0f766e" stroke-width="2" transform="rotate(15 104 52)" />
            <!-- Thumb folded across ring and pinky -->
            <rect x="70" y="90" width="42" height="16" rx="8" fill="#5eead4" stroke="#115e59" stroke-width="1.5" />
            <!-- Wrist -->
            <rect x="82" y="126" width="36" height="24" rx="6" fill="#134e4a" />
        """
    },
    "W": {
        "title": "Letter W",
        "desc": "Index, middle, and ring fingers extended and spread upright in a 'W'",
        "accent": "#3b82f6",
        "elements": """
            <!-- Fist Base -->
            <rect x="74" y="78" width="52" height="48" rx="16" fill="url(#handGrad)" />
            <!-- 3 Spread Fingers -->
            <rect x="72" y="22" width="12" height="62" rx="6" fill="#bfdbfe" stroke="#1d4ed8" stroke-width="1.5" transform="rotate(-16 78 53)" />
            <rect x="94" y="18" width="12" height="66" rx="6" fill="#dbeafe" stroke="#1d4ed8" stroke-width="1.5" />
            <rect x="116" y="22" width="12" height="62" rx="6" fill="#bfdbfe" stroke="#1d4ed8" stroke-width="1.5" transform="rotate(16 122 53)" />
            <!-- Thumb pinned over folded pinky -->
            <rect x="80" y="92" width="30" height="15" rx="7.5" fill="#93c5fd" stroke="#1e40af" stroke-width="1.5" />
            <!-- Wrist -->
            <rect x="82" y="126" width="36" height="24" rx="6" fill="#1e3a8a" />
        """
    },
    "X": {
        "title": "Letter X",
        "desc": "Index finger bent into a curved hook; other fingers closed in fist",
        "accent": "#d946ef",
        "elements": """
            <!-- Fist Base -->
            <rect x="68" y="65" width="64" height="60" rx="18" fill="url(#handGrad)" />
            <!-- Hooked Index Finger -->
            <path d="M 80 75 C 80 40, 110 40, 110 56 C 110 65, 100 70, 94 72" stroke="#f0abfc" stroke-width="12" stroke-linecap="round" fill="none" />
            <path d="M 80 75 C 80 40, 110 40, 110 56 C 110 65, 100 70, 94 72" stroke="#c026d3" stroke-width="2" stroke-linecap="round" fill="none" />
            <!-- Thumb pinned across knuckles -->
            <rect x="66" y="86" width="46" height="16" rx="8" fill="#fdf4ff" stroke="#a21caf" stroke-width="2" />
            <!-- Wrist -->
            <rect x="80" y="125" width="40" height="25" rx="6" fill="#701a75" />
        """
    },
    "Y": {
        "title": "Letter Y",
        "desc": "Thumb and pinky extended out to sides (shaka/hang loose shape)",
        "accent": "#f97316",
        "elements": """
            <!-- Fist Center (3 middle fingers closed) -->
            <rect x="74" y="65" width="52" height="58" rx="18" fill="url(#handGrad)" />
            <!-- Thumb extended out to the left -->
            <rect x="25" y="70" width="56" height="16" rx="8" fill="#fed7aa" stroke="#c2410c" stroke-width="2" transform="rotate(-25 53 78)" />
            <!-- Pinky extended out to the right -->
            <rect x="119" y="70" width="56" height="15" rx="7.5" fill="#ffedd5" stroke="#c2410c" stroke-width="2" transform="rotate(25 147 77)" />
            <!-- 3 Curled finger pads in center -->
            <rect x="76" y="68" width="48" height="12" rx="6" fill="#fb923c" />
            <rect x="76" y="82" width="48" height="12" rx="6" fill="#ea580c" />
            <rect x="78" y="96" width="44" height="12" rx="6" fill="#c2410c" />
            <!-- Wrist -->
            <rect x="82" y="125" width="36" height="25" rx="6" fill="#7c2d12" />
        """
    },
    "Z": {
        "title": "Letter Z",
        "desc": "Index finger extended, tracing a 'Z' zigzag path through the air",
        "accent": "#ef4444",
        "elements": """
            <!-- Fist Base -->
            <rect x="70" y="68" width="60" height="58" rx="18" fill="url(#handGrad)" />
            <!-- Index finger pointing straight up -->
            <rect x="76" y="24" width="14" height="58" rx="7" fill="#fecaca" stroke="#dc2626" stroke-width="2" />
            <!-- Zigzag Z path traced in air -->
            <path d="M 40 38 L 80 38 L 40 78 L 80 78" stroke="#ef4444" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke-dasharray="3 3" />
            <polygon points="86,78 78,73 78,83" fill="#ef4444" />
            <!-- Thumb folded over fingers -->
            <rect x="68" y="80" width="46" height="16" rx="8" fill="#fee2e2" stroke="#b91c1c" stroke-width="1.5" />
            <!-- Wrist -->
            <rect x="82" y="126" width="36" height="24" rx="6" fill="#7f1d1d" />
        """
    },
    # ASL NUMBERS 0-9
    "0": {
        "title": "Number 0",
        "desc": "Curved fingers and thumb touching into an oval '0'",
        "accent": "#38bdf8",
        "elements": """
            <ellipse cx="100" cy="85" rx="30" ry="42" fill="url(#handGrad)" stroke="#0284c7" stroke-width="2.5" />
            <ellipse cx="100" cy="85" rx="14" ry="22" fill="#082f49" />
            <rect x="84" y="128" width="32" height="22" rx="6" fill="#0c4a6e" />
        """
    },
    "1": {
        "title": "Number 1",
        "desc": "Index finger pointing up, palm facing inward/forward",
        "accent": "#38bdf8",
        "elements": """
            <rect x="70" y="70" width="60" height="56" rx="18" fill="url(#handGrad)" />
            <rect x="76" y="20" width="15" height="66" rx="7.5" fill="#bae6fd" stroke="#0284c7" stroke-width="2" />
            <rect x="68" y="86" width="46" height="16" rx="8" fill="#7dd3fc" stroke="#0369a1" stroke-width="1.5" />
            <rect x="82" y="126" width="36" height="24" rx="6" fill="#0c4a6e" />
        """
    },
    "2": {
        "title": "Number 2",
        "desc": "Index and middle fingers extended up spread in a 'V'",
        "accent": "#38bdf8",
        "elements": """
            <rect x="72" y="76" width="56" height="50" rx="16" fill="url(#handGrad)" />
            <rect x="78" y="20" width="13" height="64" rx="6.5" fill="#bae6fd" stroke="#0284c7" stroke-width="2" transform="rotate(-12 84 52)" />
            <rect x="96" y="20" width="13" height="64" rx="6.5" fill="#e0f2fe" stroke="#0284c7" stroke-width="2" transform="rotate(12 102 52)" />
            <rect x="70" y="90" width="42" height="16" rx="8" fill="#7dd3fc" stroke="#0369a1" stroke-width="1.5" />
            <rect x="82" y="126" width="36" height="24" rx="6" fill="#0c4a6e" />
        """
    },
    "3": {
        "title": "Number 3",
        "desc": "Thumb, index, and middle fingers extended (classic ASL 3)",
        "accent": "#38bdf8",
        "elements": """
            <rect x="74" y="74" width="52" height="52" rx="16" fill="url(#handGrad)" />
            <!-- Thumb out to left -->
            <rect x="36" y="76" width="44" height="14" rx="7" fill="#bae6fd" stroke="#0284c7" stroke-width="2" transform="rotate(-20 58 83)" />
            <!-- Index up -->
            <rect x="82" y="20" width="13" height="64" rx="6.5" fill="#e0f2fe" stroke="#0284c7" stroke-width="2" transform="rotate(-8 88 52)" />
            <!-- Middle up -->
            <rect x="98" y="20" width="13" height="64" rx="6.5" fill="#bae6fd" stroke="#0284c7" stroke-width="2" transform="rotate(8 104 52)" />
            <!-- Ring & pinky curled -->
            <rect x="96" y="88" width="28" height="18" rx="8" fill="#0284c7" />
            <rect x="82" y="126" width="36" height="24" rx="6" fill="#0c4a6e" />
        """
    },
    "4": {
        "title": "Number 4",
        "desc": "4 fingers straight up, thumb folded across palm",
        "accent": "#38bdf8",
        "elements": """
            <rect x="70" y="75" width="60" height="52" rx="16" fill="url(#handGrad)" />
            <rect x="72" y="22" width="12" height="60" rx="6" fill="#bae6fd" stroke="#0284c7" stroke-width="1.5" />
            <rect x="86" y="18" width="12" height="64" rx="6" fill="#e0f2fe" stroke="#0284c7" stroke-width="1.5" />
            <rect x="100" y="20" width="12" height="62" rx="6" fill="#bae6fd" stroke="#0284c7" stroke-width="1.5" />
            <rect x="114" y="28" width="11" height="54" rx="5.5" fill="#7dd3fc" stroke="#0284c7" stroke-width="1.5" />
            <!-- Thumb folded across palm -->
            <rect x="66" y="94" width="42" height="15" rx="7.5" fill="#e0f2fe" stroke="#0284c7" stroke-width="2" />
            <rect x="82" y="127" width="36" height="23" rx="6" fill="#0c4a6e" />
        """
    },
    "5": {
        "title": "Number 5",
        "desc": "All 5 fingers extended open wide facing forward",
        "accent": "#38bdf8",
        "elements": """
            <rect x="70" y="75" width="60" height="52" rx="16" fill="url(#handGrad)" />
            <!-- Thumb wide to left -->
            <rect x="36" y="72" width="42" height="14" rx="7" fill="#bae6fd" stroke="#0284c7" stroke-width="2" transform="rotate(-35 57 79)" />
            <!-- 4 fingers spread high -->
            <rect x="72" y="22" width="12" height="60" rx="6" fill="#bae6fd" stroke="#0284c7" stroke-width="1.5" transform="rotate(-15 78 52)" />
            <rect x="88" y="18" width="12" height="64" rx="6" fill="#e0f2fe" stroke="#0284c7" stroke-width="1.5" transform="rotate(-5 94 50)" />
            <rect x="104" y="20" width="12" height="62" rx="6" fill="#bae6fd" stroke="#0284c7" stroke-width="1.5" transform="rotate(5 110 51)" />
            <rect x="120" y="28" width="11" height="54" rx="5.5" fill="#7dd3fc" stroke="#0284c7" stroke-width="1.5" transform="rotate(15 125 55)" />
            <rect x="82" y="127" width="36" height="23" rx="6" fill="#0c4a6e" />
        """
    },
    "6": {
        "title": "Number 6",
        "desc": "Thumb and pinky touch tips (3 middle fingers upright)",
        "accent": "#818cf8",
        "elements": """
            <rect x="70" y="75" width="60" height="52" rx="16" fill="url(#handGrad)" />
            <!-- 3 middle fingers up -->
            <rect x="76" y="20" width="12" height="62" rx="6" fill="#c7d2fe" stroke="#4f46e5" stroke-width="1.5" />
            <rect x="92" y="18" width="12" height="64" rx="6" fill="#e0e7ff" stroke="#4f46e5" stroke-width="1.5" />
            <rect x="108" y="22" width="12" height="60" rx="6" fill="#c7d2fe" stroke="#4f46e5" stroke-width="1.5" />
            <!-- Thumb and pinky touching across palm -->
            <path d="M 66 94 Q 90 98 116 88" stroke="#818cf8" stroke-width="6" fill="none" stroke-linecap="round" />
            <circle cx="116" cy="88" r="5" fill="#e0e7ff" />
            <rect x="82" y="127" width="36" height="23" rx="6" fill="#312e81" />
        """
    },
    "7": {
        "title": "Number 7",
        "desc": "Thumb and ring finger touch tips (index, middle, pinky up)",
        "accent": "#818cf8",
        "elements": """
            <rect x="70" y="75" width="60" height="52" rx="16" fill="url(#handGrad)" />
            <rect x="74" y="20" width="12" height="62" rx="6" fill="#c7d2fe" stroke="#4f46e5" stroke-width="1.5" />
            <rect x="90" y="18" width="12" height="64" rx="6" fill="#e0e7ff" stroke="#4f46e5" stroke-width="1.5" />
            <rect x="118" y="26" width="11" height="56" rx="5.5" fill="#a5b4fc" stroke="#4f46e5" stroke-width="1.5" />
            <!-- Thumb and ring touching -->
            <path d="M 66 94 Q 85 96 104 88" stroke="#818cf8" stroke-width="6" fill="none" stroke-linecap="round" />
            <circle cx="104" cy="88" r="5" fill="#e0e7ff" />
            <rect x="82" y="127" width="36" height="23" rx="6" fill="#312e81" />
        """
    },
    "8": {
        "title": "Number 8",
        "desc": "Thumb and middle finger touch tips (index, ring, pinky up)",
        "accent": "#818cf8",
        "elements": """
            <rect x="70" y="75" width="60" height="52" rx="16" fill="url(#handGrad)" />
            <rect x="74" y="20" width="12" height="62" rx="6" fill="#c7d2fe" stroke="#4f46e5" stroke-width="1.5" />
            <rect x="104" y="22" width="12" height="60" rx="6" fill="#c7d2fe" stroke="#4f46e5" stroke-width="1.5" />
            <rect x="118" y="28" width="11" height="54" rx="5.5" fill="#a5b4fc" stroke="#4f46e5" stroke-width="1.5" />
            <!-- Thumb and middle touching -->
            <path d="M 66 94 Q 78 94 90 86" stroke="#818cf8" stroke-width="6" fill="none" stroke-linecap="round" />
            <circle cx="90" cy="86" r="5" fill="#e0e7ff" />
            <rect x="82" y="127" width="36" height="23" rx="6" fill="#312e81" />
        """
    },
    "9": {
        "title": "Number 9",
        "desc": "Thumb and index touch tips in circle (middle, ring, pinky up)",
        "accent": "#818cf8",
        "elements": """
            <rect x="70" y="75" width="60" height="52" rx="16" fill="url(#handGrad)" />
            <rect x="90" y="20" width="12" height="62" rx="6" fill="#c7d2fe" stroke="#4f46e5" stroke-width="1.5" />
            <rect x="104" y="22" width="12" height="60" rx="6" fill="#e0e7ff" stroke="#4f46e5" stroke-width="1.5" />
            <rect x="118" y="28" width="11" height="54" rx="5.5" fill="#a5b4fc" stroke="#4f46e5" stroke-width="1.5" />
            <!-- Thumb and index touch forming circle -->
            <circle cx="74" cy="84" r="14" fill="#312e81" stroke="#818cf8" stroke-width="2.5" />
            <circle cx="74" cy="84" r="6" fill="#0f172a" />
            <rect x="82" y="127" width="36" height="23" rx="6" fill="#312e81" />
        """
    }
}

for label, data in signs.items():
    svg_content = f"""<svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Card Background -->
  <rect width="200" height="160" rx="16" fill="#0f172a" />
  
  <defs>
    <linearGradient id="handGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="{data['accent']}" stopOpacity="0.9" />
      <stop offset="100%" stopColor="#0f172a" stopOpacity="0.95" />
    </linearGradient>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Large Center Watermark Letter/Digit -->
  <text x="100" y="94" fill="{data['accent']}" opacity="0.08" fontSize="84" fontWeight="900" textAnchor="middle" fontFamily="system-ui, sans-serif">
    {label}
  </text>

  <!-- Handshape Vector Diagram -->
  <g filter="url(#softGlow)">
    {data['elements']}
  </g>

  <!-- Top Left Identification Badge -->
  <rect x="12" y="12" width="32" height="24" rx="8" fill="{data['accent']}" fill-opacity="0.15" stroke="{data['accent']}" stroke-width="1.5" />
  <text x="28" y="29" fill="{data['accent']}" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="system-ui, sans-serif">
    {label}
  </text>

  <!-- Bottom Instruction Pill -->
  <rect x="14" y="130" width="172" height="22" rx="11" fill="#1e293b" stroke="{data['accent']}" stroke-opacity="0.2" stroke-width="1" />
  <text x="100" y="145" fill="{data['accent']}" fontSize="10.5" fontWeight="600" textAnchor="middle" fontFamily="system-ui, sans-serif">
    {data['title']} · ASL Sign
  </text>
</svg>
"""
    file_path = out_dir / f"{label}.svg"
    file_path.write_text(svg_content, encoding="utf-8")
    print(f"Generated {file_path}")

print(f"Done generating {len(signs)} sign SVGs.")
