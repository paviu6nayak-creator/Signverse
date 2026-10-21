import { BarChart3, BookOpen, Shield, Trash2, UploadCloud, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import toast from "react-hot-toast";

import { Card, EmptyState } from "../components/common/Card";
import DashboardLayout from "../components/layout/DashboardLayout";
import { InlineLoader, Spinner } from "../components/common/PageLoader";
import api, { getErrorMessage } from "../utils/api";

const TABS = [
  { key: "overview", label: "Overview", icon: BarChart3 },
  { key: "users", label: "Users", icon: Users },
  { key: "lessons", label: "Lessons", icon: BookOpen },
  { key: "datasets", label: "Datasets", icon: UploadCloud },
];

function OverviewTab() {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/analytics/overview")
      .then(({ data }) => setAnalytics(data))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <InlineLoader label="Loading analytics..." />;
  if (!analytics) return null;

  const signupData = analytics.signups_last_30_days.map((d) => ({
    date: new Date(d.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    signups: d.count,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {[
          ["Total users", analytics.total_users],
          ["Active (30d)", analytics.active_users_30d],
          ["Lessons", analytics.total_lessons],
          ["Quizzes", analytics.total_quizzes],
          ["Practice sessions", analytics.total_practice_sessions],
          ["Quiz attempts", analytics.total_quiz_attempts],
        ].map(([label, value]) => (
          <Card key={label} className="!p-4 text-center">
            <p className="stat-number text-xl text-ink">{value}</p>
            <p className="text-xs text-ink-muted">{label}</p>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="font-display font-semibold text-ink">Signups — last 30 days</h3>
        <div className="mt-4 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={signupData}>
              <XAxis dataKey="date" stroke="rgb(139 150 174)" fontSize={11} tickLine={false} axisLine={false} interval={4} />
              <YAxis stroke="rgb(139 150 174)" fontSize={12} tickLine={false} axisLine={false} width={30} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "rgb(19 27 46)", border: "1px solid rgba(234,240,251,0.1)", borderRadius: 12, fontSize: 12 }} cursor={{ fill: "rgba(139,92,246,0.08)" }} />
              <Bar dataKey="signups" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <h3 className="font-display font-semibold text-ink">Most-practiced categories</h3>
        <div className="mt-4 space-y-2">
          {analytics.popular_categories.length === 0 ? (
            <p className="text-sm text-ink-muted">No practice data yet.</p>
          ) : (
            analytics.popular_categories.map((cat) => (
              <div key={cat.category} className="flex items-center justify-between rounded-lg bg-ink/5 px-4 py-2.5 text-sm">
                <span className="capitalize text-ink">{cat.category.replace("_", " ")}</span>
                <span className="font-mono text-ink-muted">{cat.attempts} attempts</span>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

function UsersTab() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadUsers = () => {
    setIsLoading(true);
    api
      .get("/admin/users", { params: search ? { search } : {} })
      .then(({ data }) => setUsers(data))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    const timeout = setTimeout(loadUsers, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const toggleActive = async (userId) => {
    try {
      const { data } = await api.patch(`/admin/users/${userId}/toggle-active`);
      setUsers((prev) => prev.map((u) => (u.id === userId ? data : u)));
      toast.success(data.is_active ? "User reactivated" : "User deactivated");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const changeRole = async (userId, role) => {
    try {
      const { data } = await api.patch(`/admin/users/${userId}/role`, null, { params: { role } });
      setUsers((prev) => prev.map((u) => (u.id === userId ? data : u)));
      toast.success(`Role updated to ${role}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <Card>
      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, username, or email..." className="input-field mb-4" />

      {isLoading ? (
        <InlineLoader label="Loading users..." />
      ) : users.length === 0 ? (
        <EmptyState icon={Users} title="No users found" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-ink-faint">
                <th className="pb-3">User</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Level</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/[0.06]">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="py-3">
                    <p className="font-medium text-ink">{u.full_name}</p>
                    <p className="text-xs text-ink-muted">{u.email}</p>
                  </td>
                  <td className="py-3 capitalize text-ink-muted">{u.role}</td>
                  <td className="py-3">
                    <span className={`badge !py-0.5 ${u.is_active === false ? "text-danger" : "text-signal"}`}>
                      {u.is_active === false ? "Deactivated" : "Active"}
                    </span>
                  </td>
                  <td className="py-3 text-ink-muted">{u.level}</td>
                  <td className="py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => changeRole(u.id, u.role === "admin" ? "user" : "admin")} className="btn-ghost !px-3 !py-1.5 text-xs">
                        Make {u.role === "admin" ? "user" : "admin"}
                      </button>
                      <button onClick={() => toggleActive(u.id)} className="btn-ghost !px-3 !py-1.5 text-xs text-danger">
                        {u.is_active === false ? "Reactivate" : "Deactivate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

function LessonsTab() {
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({ title: "", category: "alphabet", difficulty: "beginner", sign_label: "", description: "", xp_reward: 10 });
  const [isCreating, setIsCreating] = useState(false);

  const loadLessons = () => {
    setIsLoading(true);
    api
      .get("/lessons")
      .then(({ data }) => setLessons(data))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setIsLoading(false));
  };

  useEffect(loadLessons, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      await api.post("/admin/lessons", form);
      toast.success("Lesson created");
      setForm({ title: "", category: "alphabet", difficulty: "beginner", sign_label: "", description: "", xp_reward: 10 });
      loadLessons();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (lessonId) => {
    try {
      await api.delete(`/admin/lessons/${lessonId}`);
      setLessons((prev) => prev.filter((l) => l.id !== lessonId));
      toast.success("Lesson deleted");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="mb-4 font-display font-semibold text-ink">Add a new lesson</h3>
        <form onSubmit={handleCreate} className="grid gap-3 sm:grid-cols-2">
          <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" />
          <input required placeholder="Sign label (e.g. A, 5, hello)" value={form.sign_label} onChange={(e) => setForm({ ...form, sign_label: e.target.value })} className="input-field" />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
            <option value="alphabet">Alphabet</option>
            <option value="numbers">Numbers</option>
            <option value="greetings">Greetings</option>
            <option value="common_words">Common Words</option>
            <option value="daily_conversation">Daily Conversation</option>
          </select>
          <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className="input-field">
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <input
            type="number"
            min={5}
            max={100}
            value={form.xp_reward}
            onChange={(e) => setForm({ ...form, xp_reward: Number(e.target.value) })}
            className="input-field"
            placeholder="XP reward"
          />
          <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field sm:col-span-2" />
          <button type="submit" disabled={isCreating} className="btn-primary sm:col-span-2">
            {isCreating ? <Spinner size={16} /> : "Add lesson"}
          </button>
        </form>
      </Card>

      <Card>
        <h3 className="mb-4 font-display font-semibold text-ink">All lessons ({lessons.length})</h3>
        {isLoading ? (
          <InlineLoader label="Loading lessons..." />
        ) : lessons.length === 0 ? (
          <EmptyState icon={BookOpen} title="No lessons yet" />
        ) : (
          <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="flex items-center justify-between rounded-xl bg-ink/5 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-ink">{lesson.title}</p>
                  <p className="text-xs text-ink-muted capitalize">
                    {lesson.category.replace("_", " ")} · {lesson.difficulty}
                  </p>
                </div>
                <button onClick={() => handleDelete(lesson.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-danger/10 hover:text-danger" aria-label="Delete lesson">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function DatasetsTab() {
  const [isUploading, setIsUploading] = useState(false);
  const [lastUpload, setLastUpload] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    try {
      const { data } = await api.post("/admin/datasets/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
      setLastUpload(data);
      toast.success("Dataset uploaded");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  return (
    <Card>
      <div className="flex items-center gap-2">
        <UploadCloud size={18} className="text-signal" />
        <h3 className="font-display font-semibold text-ink">Upload training dataset</h3>
      </div>
      <p className="mt-2 text-sm text-ink-muted">
        Upload a labeled landmark CSV (as produced by <code className="font-mono">ai-model/data_collection.py</code>) to extend
        the training dataset used by <code className="font-mono">train_model.py</code>.
      </p>

      <label className="btn-secondary mt-5 inline-flex w-fit cursor-pointer">
        {isUploading ? <Spinner size={16} /> : <UploadCloud size={16} />}
        {isUploading ? "Uploading..." : "Choose CSV file"}
        <input type="file" accept=".csv" onChange={handleUpload} className="hidden" disabled={isUploading} />
      </label>

      {lastUpload && (
        <div className="mt-4 rounded-xl bg-signal/5 p-4 text-sm">
          <p className="font-medium text-ink">{lastUpload.filename}</p>
          <p className="text-ink-muted">{(lastUpload.size_bytes / 1024).toFixed(1)} KB uploaded</p>
        </div>
      )}
    </Card>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <DashboardLayout
      title="Admin Panel"
      subtitle="Manage users, content, and datasets."
      actions={
        <span className="badge">
          <Shield size={14} className="text-pulse" />
          Admin access
        </span>
      }
    >
      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === key ? "bg-pulse text-void" : "bg-ink/5 text-ink-muted hover:text-ink"
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && <OverviewTab />}
      {activeTab === "users" && <UsersTab />}
      {activeTab === "lessons" && <LessonsTab />}
      {activeTab === "datasets" && <DatasetsTab />}
    </DashboardLayout>
  );
}
