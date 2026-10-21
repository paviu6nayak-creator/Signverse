import { AlertTriangle, Award, Flame, RefreshCw, Sparkles, Target, TrendingUp } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import toast from "react-hot-toast";

import { Card, EmptyState, ProgressBar, StatCard } from "../components/common/Card";
import DashboardLayout from "../components/layout/DashboardLayout";
import { InlineLoader } from "../components/common/PageLoader";
import { useAuth } from "../context/AuthContext";
import api, { getErrorMessage } from "../utils/api";

const CATEGORY_LABELS = {
  alphabet: "Alphabet",
  numbers: "Numbers",
  greetings: "Greetings & Words",
  common_words: "Common Words",
  daily_conversation: "Daily Conversation",
};

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [weeklyActivity, setWeeklyActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardData = useCallback(() => {
    setIsLoading(true);
    setError(null);
    Promise.all([api.get("/progress/dashboard"), api.get("/progress/weekly-activity")])
      .then(([statsRes, activityRes]) => {
        setStats(statsRes.data);
        setWeeklyActivity(activityRes.data || []);
      })
      .catch((err) => {
        setError(err);
        toast.error(getErrorMessage(err));
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  if (isLoading) {
    return (
      <DashboardLayout title="Dashboard">
        <InlineLoader label="Loading your dashboard..." />
      </DashboardLayout>
    );
  }

  if (error && !stats) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="mx-auto max-w-md rounded-2xl border border-danger/20 bg-danger/5 p-8 text-center my-12">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-danger/10 text-danger mb-4">
            <AlertTriangle size={24} />
          </span>
          <h3 className="font-display text-lg font-bold text-ink">Unable to load dashboard data</h3>
          <p className="mt-2 text-sm text-ink-muted">
            The server could not be reached. Please check your network or try again.
          </p>
          <button onClick={loadDashboardData} className="btn-primary mt-6 inline-flex items-center gap-2">
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const chartData = weeklyActivity.map((point) => ({
    date: new Date(point.date).toLocaleDateString(undefined, { weekday: "short" }),
    minutes: point.minutes_practiced,
  }));

  return (
    <DashboardLayout title={`Hey, ${user?.full_name?.split(" ")[0]}`} subtitle="Here's how your learning is going.">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={Sparkles} label="Lessons completed" value={stats?.lessons_completed ?? 0} accent="signal" />
        <StatCard icon={Target} label="Avg. accuracy" value={stats?.average_accuracy ?? 0} suffix="%" accent="pulse" />
        <StatCard icon={Flame} label="Current streak" value={stats?.current_streak ?? 0} suffix=" days" accent="warm" />
        <StatCard icon={TrendingUp} label="Total XP" value={stats?.total_xp ?? 0} accent="signal" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="font-display font-semibold text-ink">Practice minutes this week</h3>
          <div className="mt-4 h-56">
            {chartData.some((d) => d.minutes > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="date" stroke="rgb(139 150 174)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgb(139 150 174)" fontSize={12} tickLine={false} axisLine={false} width={30} />
                  <Tooltip
                    contentStyle={{ background: "rgb(19 27 46)", border: "1px solid rgba(234,240,251,0.1)", borderRadius: 12, fontSize: 12 }}
                    cursor={{ fill: "rgba(45,212,191,0.08)" }}
                  />
                  <Bar dataKey="minutes" fill="#2DD4BF" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-ink-muted">
                Practice this week to see your activity chart light up.
              </div>
            )}
          </div>
        </Card>

        <Card>
          <h3 className="font-display font-semibold text-ink">Level {stats.level}</h3>
          <p className="mt-1 text-sm text-ink-muted">{stats.total_xp} XP earned</p>
          <ProgressBar value={(stats.total_xp % 100)} className="mt-4" />
          <p className="mt-2 text-xs text-ink-faint">{100 - (stats.total_xp % 100)} XP to level {stats.level + 1}</p>

          <div className="mt-6 flex items-center justify-between text-sm">
            <span className="text-ink-muted">Longest streak</span>
            <span className="font-mono text-ink">{stats.longest_streak} days</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-ink-muted">Quizzes taken</span>
            <span className="font-mono text-ink">{stats.quizzes_taken}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-ink-muted">Avg. quiz score</span>
            <span className="font-mono text-ink">{stats.average_quiz_score}%</span>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="font-display font-semibold text-ink">Progress by category</h3>
          <div className="mt-4 space-y-4">
            {stats.category_breakdown.length === 0 ? (
              <p className="text-sm text-ink-muted">No lessons published yet.</p>
            ) : (
              stats.category_breakdown.map((cat) => (
                <div key={cat.category}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="text-ink">{CATEGORY_LABELS[cat.category] || cat.category}</span>
                    <span className="font-mono text-ink-muted">
                      {cat.completed_lessons}/{cat.total_lessons}
                    </span>
                  </div>
                  <ProgressBar value={cat.percentage} accent="pulse" />
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <h3 className="font-display font-semibold text-ink">Recent achievements</h3>
          {stats.recent_achievements.length === 0 ? (
            <EmptyState icon={Award} title="No badges yet" description="Complete lessons and build a streak to earn your first badge." />
          ) : (
            <div className="mt-4 space-y-3">
              {stats.recent_achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-3 rounded-xl bg-warm/5 p-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-warm/15 text-warm">
                    <Award size={16} />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink">{achievement.title}</p>
                    <p className="text-xs text-ink-muted">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
