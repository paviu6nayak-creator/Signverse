import { motion } from "framer-motion";
import { ArrowRight, CalendarCheck, Camera, Flame, GraduationCap, PuzzleIcon, Type, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { InlineLoader } from "../components/common/PageLoader";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const QUICK_ACTIONS = [
  { to: "/learn/alphabet", icon: GraduationCap, label: "Continue lessons", accent: "signal" },
  { to: "/daily-practice", icon: CalendarCheck, label: "Daily practice", accent: "pulse" },
  { to: "/live-translation", icon: Camera, label: "Live translation", accent: "warm" },
  { to: "/quiz", icon: PuzzleIcon, label: "Take a quiz", accent: "signal" },
  { to: "/sign-to-text", icon: Type, label: "Sign to text", accent: "pulse" },
  { to: "/text-to-speech", icon: Volume2, label: "Text to speech", accent: "warm" },
];

const ACCENT_CLASSES = {
  signal: "bg-signal/10 text-signal",
  pulse: "bg-pulse/10 text-pulse",
  warm: "bg-warm/10 text-warm",
};

export default function Home() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get("/progress/dashboard")
      .then(({ data }) => setStats(data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">
            Welcome back, {user?.full_name?.split(" ")[0] || user?.username || "Learner"} 👋
          </h1>
          <p className="mt-1.5 text-ink-muted">Ready to keep building your sign language skills?</p>
        </div>
        <div className="glass-card flex items-center gap-3 px-5 py-3">
          <Flame className="text-warm" size={22} />
          <div>
            <p className="stat-number text-xl text-ink">{user?.current_streak ?? 0} days</p>
            <p className="text-xs text-ink-muted">Current streak</p>
          </div>
        </div>
      </motion.div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {QUICK_ACTIONS.map((action, index) => (
          <motion.div key={action.to} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.05 }}>
            <Link to={action.to} className="glass-card glass-card-hover flex h-full flex-col items-center gap-3 p-5 text-center">
              <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${ACCENT_CLASSES[action.accent]}`}>
                <action.icon size={22} />
              </span>
              <span className="text-sm font-medium text-ink">{action.label}</span>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="glass-card p-6 lg:col-span-2">
          <h3 className="font-display font-semibold text-ink">Your progress this week</h3>
          {isLoading ? (
            <InlineLoader label="Loading your stats..." />
          ) : stats ? (
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <p className="stat-number text-2xl text-ink">{stats.lessons_completed}</p>
                <p className="text-xs text-ink-muted">Lessons done</p>
              </div>
              <div>
                <p className="stat-number text-2xl text-ink">{stats.average_accuracy}%</p>
                <p className="text-xs text-ink-muted">Avg. accuracy</p>
              </div>
              <div>
                <p className="stat-number text-2xl text-ink">{stats.quizzes_taken}</p>
                <p className="text-xs text-ink-muted">Quizzes taken</p>
              </div>
              <div>
                <p className="stat-number text-2xl text-ink">{stats.total_xp}</p>
                <p className="text-xs text-ink-muted">Total XP</p>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-ink-muted">Complete a lesson to see your stats here.</p>
          )}
          <Link to="/dashboard" className="btn-ghost mt-5 text-sm">
            View full dashboard
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="glass-card p-6">
          <h3 className="font-display font-semibold text-ink">Suggested next step</h3>
          <p className="mt-2 text-sm text-ink-muted">
            {stats?.lessons_completed ? "Keep the momentum going with today's practice set." : "New here? Start with the alphabet — it's the foundation for everything else."}
          </p>
          <Link to={stats?.lessons_completed ? "/daily-practice" : "/learn/alphabet"} className="btn-primary mt-4 w-full">
            {stats?.lessons_completed ? "Go to daily practice" : "Start the alphabet"}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
