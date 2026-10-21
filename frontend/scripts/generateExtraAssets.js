import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.resolve(__dirname, "../public/signs/asl");

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function makeSvg(key, label, handshapeDesc, badgeText, color = "#38bdf8") {
  return `<svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Card Background -->
  <rect width="200" height="160" rx="16" fill="#0f172a" />
  
  <defs>
    <linearGradient id="grad-${key}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="${color}" stopOpacity="0.9" />
      <stop offset="100%" stopColor="#0f172a" stopOpacity="0.95" />
    </linearGradient>
    <filter id="glow-${key}" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Large Center Watermark -->
  <text x="100" y="94" fill="${color}" opacity="0.07" fontSize="${badgeText.length > 2 ? 48 : 80}" fontWeight="900" textAnchor="middle" fontFamily="system-ui, sans-serif">
    ${badgeText}
  </text>

  <!-- Handshape Vector Diagram -->
  <g filter="url(#glow-${key})">
    <ellipse cx="100" cy="80" rx="28" ry="36" fill="url(#grad-${key})" stroke="${color}" stroke-width="2" />
    <circle cx="100" cy="74" r="14" fill="#082f49" />
    <path d="M85 96 C85 75, 115 75, 115 96 Z" fill="${color}" fill-opacity="0.3" />
    <rect x="86" y="116" width="28" height="18" rx="6" fill="#0c4a6e" />
  </g>

  <!-- Top Left Identification Badge -->
  <rect x="12" y="12" width="${badgeText.length > 2 ? 46 : 32}" height="24" rx="8" fill="${color}" fill-opacity="0.15" stroke="${color}" stroke-width="1.5" />
  <text x="${badgeText.length > 2 ? 35 : 28}" y="29" fill="${color}" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="system-ui, sans-serif">
    ${badgeText}
  </text>

  <!-- Bottom Instruction Pill -->
  <rect x="10" y="130" width="180" height="22" rx="11" fill="#1e293b" stroke="${color}" stroke-opacity="0.25" stroke-width="1" />
  <text x="100" y="145" fill="${color}" fontSize="10" fontWeight="600" textAnchor="middle" fontFamily="system-ui, sans-serif">
    ${label.length > 26 ? label.slice(0, 25) + '…' : label} · ${handshapeDesc}
  </text>
</svg>`;
}

const numbersToGenerate = [
  { key: "10", label: "Number 10", desc: "Thumb up fist wag", badge: "10" },
  { key: "11", label: "Number 11", desc: "Flick index finger twice", badge: "11" },
  { key: "12", label: "Number 12", desc: "Flick index+middle twice", badge: "12" },
  { key: "13", label: "Number 13", desc: "Flap 2 fingers on thumb", badge: "13" },
  { key: "14", label: "Number 14", desc: "Flap 4 fingers folded thumb", badge: "14" },
  { key: "15", label: "Number 15", desc: "Flap 4 fingers open thumb", badge: "15" },
  { key: "16", label: "Number 16", desc: "10 hand twist to 6", badge: "16" },
  { key: "17", label: "Number 17", desc: "10 hand twist to 7", badge: "17" },
  { key: "18", label: "Number 18", desc: "10 hand twist to 8", badge: "18" },
  { key: "19", label: "Number 19", desc: "10 hand twist to 9", badge: "19" },
  { key: "20", label: "Number 20", desc: "G-beak pinch tapping", badge: "20" },
  { key: "21", label: "Number 21", desc: "L-shape thumb twitch", badge: "21" },
  { key: "22", label: "Number 22", desc: "2-hand bounce outward", badge: "22" },
  { key: "25", label: "Number 25", desc: "Sign 2 then 5", badge: "25" },
  { key: "30", label: "Number 30", desc: "Sign 3 then 0", badge: "30" },
  { key: "33", label: "Number 33", desc: "3-hand bounce outward", badge: "33" },
  { key: "40", label: "Number 40", desc: "Sign 4 then 0", badge: "40" },
  { key: "42", label: "Number 42", desc: "Sign 4 then 2", badge: "42" },
  { key: "50", label: "Number 50", desc: "Sign 5 then 0", badge: "50" },
  { key: "55", label: "Number 55", desc: "5-hand bounce outward", badge: "55" },
  { key: "60", label: "Number 60", desc: "Sign 6 then 0", badge: "60" },
  { key: "64", label: "Number 64", desc: "Sign 6 then 4", badge: "64" },
  { key: "70", label: "Number 70", desc: "Sign 7 then 0", badge: "70" },
  { key: "77", label: "Number 77", desc: "7-hand bounce outward", badge: "77" },
  { key: "80", label: "Number 80", desc: "Sign 8 then 0", badge: "80" },
  { key: "88", label: "Number 88", desc: "8-hand bounce outward", badge: "88" },
  { key: "90", label: "Number 90", desc: "Sign 9 then 0", badge: "90" },
  { key: "99", label: "Number 99", desc: "9-hand bounce outward", badge: "99" },
  { key: "100", label: "Number 100", desc: "1 pull into C shape", badge: "100" },
  { key: "125", label: "Number 125", desc: "100 + 2 + 5 combo", badge: "125" },
  { key: "340", label: "Number 340", desc: "300 + 40 combo", badge: "340" },
  { key: "500", label: "Number 500", desc: "5 pull into C shape", badge: "500" },
  { key: "750", label: "Number 750", desc: "700 + 50 combo", badge: "750" },
  { key: "1000", label: "Number 1000", desc: "1 bent M onto palm", badge: "1K" },
];

const wordsToGenerate = [
  { key: "hello", label: "Hello", desc: "Salute wave from temple", badge: "👋", color: "#06b6d4" },
  { key: "thank_you", label: "Thank You", desc: "Fingertips chin forward", badge: "🙏", color: "#8b5cf6" },
  { key: "please", label: "Please", desc: "Circular rub on chest", badge: "🤝", color: "#10b981" },
  { key: "sorry", label: "Sorry", desc: "A-fist circular chest rub", badge: "❤️", color: "#f59e0b" },
  { key: "yes", label: "Yes", desc: "Nodding S-fist", badge: "✓", color: "#10b981" },
  { key: "no", label: "No", desc: "Snap index/middle to thumb", badge: "✕", color: "#ef4444" },
  { key: "help", label: "Help", desc: "Thumbs-up on flat palm", badge: "🆘", color: "#0ea5e9" },
  { key: "water", label: "Water", desc: "W-hand tap on chin", badge: "💧", color: "#38bdf8" },
  { key: "food", label: "Food", desc: "Fingertips tap on lips", badge: "🍎", color: "#f97316" },
  { key: "family", label: "Family", desc: "F-hands circling around", badge: "👨‍👩‍👧", color: "#a855f7" },
  { key: "friend", label: "Friend", desc: "Interlocking index fingers", badge: "👫", color: "#ec4899" },
  { key: "home", label: "Home", desc: "Flat O touch cheek to ear", badge: "🏠", color: "#14b8a6" },
  { key: "school", label: "School", desc: "Clap flat palms twice", badge: "🏫", color: "#6366f1" },
  { key: "love", label: "Love", desc: "Cross arms over chest / ILY", badge: "🤟", color: "#f43f5e" },
  { key: "good", label: "Good", desc: "Fingertips chin to palm", badge: "👍", color: "#22c55e" },
  { key: "bad", label: "Bad", desc: "Fingertips chin turn down", badge: "👎", color: "#e11d48" },
  { key: "eat", label: "Eat", desc: "Flat O fingertips into mouth", badge: "🍽️", color: "#ea580c" },
  { key: "drink", label: "Drink", desc: "C-hand tip back like cup", badge: "🥤", color: "#0284c7" },
  { key: "stop", label: "Stop", desc: "Chop edge of palm onto base", badge: "🛑", color: "#dc2626" },
  { key: "go", label: "Go", desc: "Index fingers roll forward", badge: "➡️", color: "#16a34a" },
  { key: "name", label: "Name", desc: "Tap H-fingers crosswise", badge: "🏷️", color: "#8b5cf6" },
  { key: "time", label: "Time", desc: "Tap wrist like watch", badge: "⏱️", color: "#d97706" },
  { key: "bathroom", label: "Bathroom", desc: "T-hand shaking side to side", badge: "🚻", color: "#0284c7" },
  { key: "doctor", label: "Doctor", desc: "Bent M taps pulse wrist", badge: "🩺", color: "#059669" },
  { key: "happy", label: "Happy", desc: "Open palms brush up chest", badge: "😊", color: "#eab308" },
  { key: "tired", label: "Tired", desc: "Bent hands roll down chest", badge: "🥱", color: "#64748b" },
  { key: "today", label: "Today", desc: "Y-hands bounce down twice", badge: "📅", color: "#2563eb" },
  { key: "tomorrow", label: "Tomorrow", desc: "Thumb flick forward from jaw", badge: "🌅", color: "#7c3aed" },
  { key: "yesterday", label: "Yesterday", desc: "A-thumb stroke back jaw", badge: "⏪", color: "#9333ea" },
  { key: "see_you_later", label: "See You Later", desc: "V from eye to L-flick", badge: "👋", color: "#06b6d4" },
  { key: "excuse_me", label: "Excuse Me", desc: "Fingertips brush palm twice", badge: "🙏", color: "#f59e0b" },
  { key: "take_care", label: "Take Care", desc: "Two K-hands tap together", badge: "🤝", color: "#10b981" },
  { key: "welcome", label: "Welcome", desc: "Open palm sweeps inward", badge: "✨", color: "#38bdf8" },
  { key: "mom", label: "Mom", desc: "5-hand thumb taps chin twice", badge: "👩", color: "#f43f5e" },
  { key: "dad", label: "Dad", desc: "5-hand thumb taps forehead twice", badge: "👨", color: "#3b82f6" },
  { key: "more", label: "More", desc: "Flat-O hands tap fingertips together", badge: "➕", color: "#10b981" },
  { key: "finished", label: "Finished", desc: "Open 5 hands flick outward palms down", badge: "🏁", color: "#a855f7" },
  { key: "sad", label: "Sad", desc: "Open fingers draw down face slowly", badge: "😢", color: "#64748b" },
];

let count = 0;
for (const item of [...numbersToGenerate, ...wordsToGenerate]) {
  const filePath = path.join(outDir, `${item.key}.svg`);
  const content = makeSvg(item.key, item.label, item.desc, item.badge, item.color || "#38bdf8");
  fs.writeFileSync(filePath, content, "utf-8");
  count++;
}

console.log(`Generated ${count} reference SVG assets in ${outDir}`);
