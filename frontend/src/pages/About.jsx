import { motion } from "framer-motion";
import {
  Award,
  BookOpen,
  CheckCircle2,
  Database,
  ExternalLink,
  GraduationCap,
  Heart,
  Lock,
  Scale,
  ScanEye,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

const MISSION_PILLARS = [
  {
    icon: Heart,
    title: "Universal Accessibility",
    description:
      "Over 70 million Deaf and hard-of-hearing individuals worldwide use sign language as their primary language, yet fewer than 10% of hearing family members become fluent. SignVerse makes ASL education free, welcoming, and accessible to anyone with a standard browser and webcam.",
  },
  {
    icon: Scale,
    title: "Linguistic Authenticity",
    description:
      "Sign languages are complete natural languages with their own complex phonology, grammar, and syntax — not direct word-for-word codes for spoken English. Every sign, sequence rule, and spatial anchor in SignVerse is cross-referenced with established Deaf linguistic research.",
  },
  {
    icon: Lock,
    title: "Zero-Data Visual Privacy",
    description:
      "Camera video never leaves your device. MediaPipe executes client-side WebAssembly inside your browser to extract 21 mathematical joint coordinates, meaning your personal video feed is never uploaded, recorded, or transmitted to any server.",
  },
  {
    icon: ScanEye,
    title: "Active Kinesthetic Coaching",
    description:
      "Traditional video courses offer passive watching without correction. SignVerse computes 3D joint flexion angles and thumb abduction in real-time, highlighting exact mistakes in red and correct postures in green, requiring a sustained 1-second hold to pass.",
  },
];

const DATA_SOURCES = [
  {
    title: "ASLU / Lifeprint (Dr. William Vicars)",
    category: "Linguistic Authority & Handshapes",
    url: "https://www.lifeprint.com",
    description:
      "Our primary gold-standard reference for ASL grammar, finger spelling, handshape taxonomy (e.g. thumb positioning on numbers 6, 7, 8, 9), and compound digit sequencing (e.g., sideways hops for double digits 22, 55, 66).",
    verifiedItems: "A–Z alphabet, Numbers 0–1000, Core Greetings, Family, and Food vocabulary",
  },
  {
    title: "Handspeak & Gallaudet Linguistic Materials",
    category: "Spatial Grammar & Contextual Variations",
    url: "https://www.handspeak.com",
    description:
      "Referenced for anatomical body anchor locations (forehead, cheek, chin, chest, neutral space) and motion paths (arcs, taps, flicks) to ensure signs align with authentic visual-spatial grammar.",
    verifiedItems: "Body anchor zones, directionality, and conversational phrases",
  },
  {
    title: "Google MediaPipe 3D Landmark Topology",
    category: "Computer Vision & Biomechanics",
    url: "https://developers.google.com/mediapipe/solutions/vision/hand_landmarker",
    description:
      "Anatomical hand model tracking 21 3D landmarks (wrist, MCP, PIP, DIP, tip across five digits). Landmarks are normalized relative to wrist origin and physical palm scale for lighting- and distance-invariant matching.",
    verifiedItems: "21 3D joint points with sub-millimeter geometric scale normalization",
  },
  {
    title: "SignVerse Held-Out Benchmark Dataset",
    category: "Model Validation & Stress Testing",
    url: "/model-report",
    description:
      "Held-out test set of 5,000 multi-user landmark frames evaluated across varied lighting, skin tones, hand sizes, and camera angles to assess precision, recall, and confusion rates without synthetic bias.",
    verifiedItems: "Independent evaluation with 100% transparent class confusion metrics",
  },
];

const TRANSPARENCY_STATS = [
  { label: "Canonical Handshapes", value: "37" },
  { label: "Curated Lessons", value: "178" },
  { label: "Verified Letters & Digits", value: "37" },
  { label: "Anatomical Landmarks", value: "21 Joints" },
];

export default function About() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      {/* 1. HERO HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <span className="badge mx-auto w-fit">
          <Sparkles size={14} className="text-signal" />
          Mission & Academic Foundations
        </span>
        <h1 className="mt-5 font-display text-4xl font-bold text-ink sm:text-5xl">
          Making American Sign Language <span className="gradient-text">accessible to everyone</span>
        </h1>
        <p className="mx-auto mt-5 max-w-3xl text-lg text-ink-muted leading-relaxed">
          SignVerse merges computer vision, spaced-repetition cognitive science, and established Deaf linguistic
          scholarship into an interactive, privacy-first learning platform. We empower hearing and Deaf communities
          to connect through authentic, expressive communication.
        </p>
      </motion.div>

      {/* Transparency Stats Bar */}
      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {TRANSPARENCY_STATS.map((stat) => (
          <div key={stat.label} className="glass-card p-4 text-center">
            <span className="font-display text-2xl font-bold text-signal sm:text-3xl">
              {stat.value}
            </span>
            <p className="mt-1 text-xs text-ink-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* 2. MISSION & CORE PILLARS */}
      <div className="mt-16">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">Our Guiding Pillars</h2>
          <p className="mt-2 text-sm text-ink-muted">
            The pedagogical and architectural principles behind every feature in SignVerse.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {MISSION_PILLARS.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="glass-card flex flex-col justify-between p-6 sm:p-7"
            >
              <div>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-signal/15 text-signal">
                  <pillar.icon size={22} />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-ink">{pillar.title}</h3>
                <p className="mt-2.5 text-sm text-ink-muted leading-relaxed">{pillar.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3. LINGUISTIC CITATIONS & DATA SOURCES */}
      <div className="glass-card mt-16 p-6 sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 pb-4">
          <div className="flex items-center gap-3">
            <Database className="text-signal" size={24} />
            <div>
              <h2 className="font-display text-xl font-bold text-ink">Curriculum & Data Sources</h2>
              <p className="text-xs text-ink-muted">
                Transparent attribution of our linguistic references, datasets, and vision topologies.
              </p>
            </div>
          </div>
          <span className="rounded-full bg-signal/10 px-3 py-1 text-xs font-semibold text-signal flex items-center gap-1.5">
            <ShieldCheck size={14} /> Peer-Referenced
          </span>
        </div>

        <div className="mt-6 space-y-5">
          {DATA_SOURCES.map((source) => (
            <div
              key={source.title}
              className="flex flex-col rounded-xl border border-ink/10 bg-ink/[0.03] p-5 transition hover:border-signal/30"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-base font-bold text-ink">{source.title}</h3>
                  <span className="rounded-md bg-ink/10 px-2 py-0.5 text-[11px] font-medium text-ink-muted">
                    {source.category}
                  </span>
                </div>
                {source.url.startsWith("http") ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-semibold text-signal hover:underline"
                  >
                    Visit Source <ExternalLink size={12} />
                  </a>
                ) : (
                  <Link
                    to={source.url}
                    className="flex items-center gap-1 text-xs font-semibold text-signal hover:underline"
                  >
                    View Report <ExternalLink size={12} />
                  </Link>
                )}
              </div>

              <p className="mt-2.5 text-sm text-ink-muted leading-relaxed">{source.description}</p>

              <div className="mt-3.5 flex items-center gap-2 rounded-lg bg-ink/[0.04] px-3 py-2 text-xs text-ink-muted">
                <CheckCircle2 size={14} className="shrink-0 text-emerald-400" />
                <span>
                  <strong className="text-ink">Curriculum Coverage:</strong> {source.verifiedItems}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. OPEN AUDIT & LINGUISTIC HONESTY */}
      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Card 1: Handshape Verification Library */}
        <div className="glass-card flex flex-col justify-between p-6 sm:p-7">
          <div>
            <div className="flex items-center gap-2.5">
              <BookOpen className="text-sky-400" size={22} />
              <h3 className="font-display text-lg font-bold text-ink">Handshape Catalog</h3>
            </div>
            <p className="mt-3 text-sm text-ink-muted leading-relaxed">
              Explore all 37 parametric handshapes driving our visual engine. Every shape articulates distinct
              finger extensions, thumb placements, and palm planes with explicit citations to Dr. Bill Vicars'
              Lifeprint ASL dictionary.
            </p>
          </div>
          <Link
            to="/dev/handshapes"
            className="btn-secondary mt-6 flex items-center justify-center gap-2 !py-2.5 text-xs font-semibold"
          >
            Inspect Handshapes Library <ExternalLink size={14} />
          </Link>
        </div>

        {/* Card 2: AI Model Evaluation & Limitations */}
        <div className="glass-card flex flex-col justify-between p-6 sm:p-7">
          <div>
            <div className="flex items-center gap-2.5">
              <Award className="text-emerald-400" size={22} />
              <h3 className="font-display text-lg font-bold text-ink">Model Evaluation & Limitations</h3>
            </div>
            <p className="mt-3 text-sm text-ink-muted leading-relaxed">
              We practice full transparency regarding machine learning accuracy. Inspect our held-out test
              evaluation with confusion matrices, per-class F1 metrics, and known limitations (such as motion-dependent
              signs and finger occlusion).
            </p>
          </div>
          <Link
            to="/model-report"
            className="btn-secondary mt-6 flex items-center justify-center gap-2 !py-2.5 text-xs font-semibold"
          >
            Review Model Evaluation <ExternalLink size={14} />
          </Link>
        </div>
      </div>

      {/* 5. CALL TO ACTION */}
      <div className="glass-card mt-16 p-8 text-center sm:p-12">
        <GraduationCap className="mx-auto text-signal" size={38} />
        <h2 className="mt-4 font-display text-2xl font-bold text-ink sm:text-3xl">
          Begin Learning American Sign Language Today
        </h2>
        <p className="mx-auto mt-2.5 max-w-xl text-sm text-ink-muted">
          Join free today to access all 178 interactive lessons, real-time camera posture feedback, and adaptive
          spaced-repetition practice sessions.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link to="/learn" className="btn-primary !py-2.5 text-sm font-semibold">
            Explore Lessons Catalog
          </Link>
          <Link to="/daily-practice" className="btn-secondary !py-2.5 text-sm font-semibold">
            Start Daily Practice
          </Link>
        </div>
      </div>
    </div>
  );
}
