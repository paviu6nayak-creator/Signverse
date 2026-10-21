import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Camera,
  Captions,
  Gamepad2,
  LineChart,
  Sparkles,
  Type,
  Volume2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import HandSkeleton from "../components/common/HandSkeleton";
import { useAuth } from "../context/AuthContext";

const PIPELINE_WORD = "HELLO";

const FEATURES = [
  {
    icon: Sparkles,
    title: "Structured Lessons",
    description: "Progress from the alphabet and numbers through greetings and full daily conversation, at your own pace.",
    accent: "signal",
  },
  {
    icon: Camera,
    title: "Live Camera Translation",
    description: "Sign in front of your webcam and watch your hand shapes turn into text in real time, powered by MediaPipe.",
    accent: "pulse",
  },
  {
    icon: Volume2,
    title: "Text to Speech",
    description: "Every recognized sentence can be spoken aloud instantly, so you can communicate out loud too.",
    accent: "warm",
  },
  {
    icon: Gamepad2,
    title: "Practice & Quizzes",
    description: "Reinforce what you've learned with interactive drills and timed quizzes that adapt to your level.",
    accent: "signal",
  },
  {
    icon: LineChart,
    title: "Progress Tracking",
    description: "See your accuracy, streaks, and completed lessons on a dashboard built to keep you motivated.",
    accent: "pulse",
  },
  {
    icon: Award,
    title: "Achievements",
    description: "Unlock badges as you hit milestones — from your first lesson to a 30-day streak.",
    accent: "warm",
  },
];

const PIPELINE_STEPS = [
  { icon: Camera, label: "Live Camera" },
  { icon: Sparkles, label: "Detected Sign" },
  { icon: Type, label: "Text" },
  { icon: Volume2, label: "Speech" },
];

const ACCENT_CLASSES = {
  signal: "bg-signal/10 text-signal",
  pulse: "bg-pulse/10 text-pulse",
  warm: "bg-warm/10 text-warm",
};

function HeroHud() {
  const [letterIndex, setLetterIndex] = useState(0);
  const [confidence, setConfidence] = useState(72);

  useEffect(() => {
    const interval = setInterval(() => {
      setLetterIndex((prev) => (prev + 1) % (PIPELINE_WORD.length + 2));
      setConfidence(88 + Math.round(Math.random() * 10));
    }, 1100);
    return () => clearInterval(interval);
  }, []);

  const revealed = PIPELINE_WORD.slice(0, Math.min(letterIndex + 1, PIPELINE_WORD.length));
  const currentLetter = PIPELINE_WORD[Math.min(letterIndex, PIPELINE_WORD.length - 1)];

  return (
    <div className="glass-card w-full max-w-xs space-y-4 p-5">
      <div className="flex items-center justify-between text-xs font-medium text-ink-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-signal" />
          LIVE DETECTION
        </span>
        <span className="font-mono">{confidence}%</span>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-ink/5 px-4 py-3">
        <span className="text-xs text-ink-muted">Detected sign</span>
        <span className="font-mono text-lg font-semibold text-signal">{currentLetter}</span>
      </div>

      <div className="rounded-xl bg-ink/5 px-4 py-3">
        <span className="text-xs text-ink-muted">Text</span>
        <p className="mt-1 font-mono text-lg font-semibold text-ink">
          {revealed}
          <span className="animate-pulse-dot text-signal">|</span>
        </p>
      </div>

      <div className="flex items-center gap-2 rounded-xl bg-pulse/10 px-4 py-3 text-pulse">
        <Volume2 size={16} />
        <span className="text-xs font-medium">Speaking "{revealed || "..."}"</span>
      </div>
    </div>
  );
}

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="badge">
              <Sparkles size={14} className="text-signal" />
              AI-powered sign language learning
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-ink sm:text-5xl lg:text-6xl">
              Learn sign language. <span className="gradient-text">Translate it live.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-ink-muted">
              SignVerse teaches you sign language from your first letter to full conversations, then lets you
              practice with real-time AI that reads your hands through your webcam.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={isAuthenticated ? "/home" : "/register"} className="btn-primary">
                {isAuthenticated ? "Go to your dashboard" : "Start learning free"}
                <ArrowRight size={18} />
              </Link>
              <Link to="/live-translation" className="btn-secondary">
                <Camera size={18} />
                Try live translation
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-ink-muted">
              <span><strong className="text-ink">45+</strong> lessons</span>
              <span><strong className="text-ink">A–Z</strong>, numbers &amp; words</span>
              <span><strong className="text-ink">Real-time</strong> AI recognition</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative flex items-center justify-center gap-6"
          >
            <div className="glass-card flex h-80 w-full max-w-xs items-center justify-center p-6 sm:h-96">
              <HandSkeleton className="h-full w-full" />
            </div>
            <div className="hidden sm:block">
              <HeroHud />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pipeline */}
      <section className="border-y border-ink/[0.06] bg-surface/40 py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium uppercase tracking-wide text-ink-muted">How live translation works</p>
          <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
            {PIPELINE_STEPS.map((step, index) => (
              <div key={step.label} className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-2">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-signal-gradient text-void">
                    <step.icon size={24} />
                  </span>
                  <span className="text-sm font-medium text-ink">{step.label}</span>
                </div>
                {index < PIPELINE_STEPS.length - 1 && <ArrowRight size={20} className="hidden text-ink-faint sm:block" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">Everything you need to become fluent</h2>
          <p className="mt-3 text-ink-muted">From your first sign to real conversations, SignVerse guides every step.</p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
              className="glass-card glass-card-hover p-6"
            >
              <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${ACCENT_CLASSES[feature.accent]}`}>
                <feature.icon size={22} />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-ink">{feature.title}</h3>
              <p className="mt-2 text-sm text-ink-muted">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="glass-card flex flex-col items-center gap-6 p-10 text-center sm:p-14">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-signal-gradient text-void">
            <Captions size={26} />
          </span>
          <h2 className="font-display text-3xl font-bold text-ink">Ready to start signing?</h2>
          <p className="max-w-md text-ink-muted">Create a free account and get your first lesson recommendation in under a minute.</p>
          <Link to={isAuthenticated ? "/learn" : "/register"} className="btn-primary">
            {isAuthenticated ? "Continue learning" : "Create your free account"}
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
