import { Camera, KeyRound, Save, User } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

import { Card } from "../components/common/Card";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Spinner } from "../components/common/PageLoader";
import { useAuth } from "../context/AuthContext";
import api, { getErrorMessage } from "../utils/api";

function ProfileDetailsForm() {
  const { user, updateUserLocally } = useAuth();
  const [form, setForm] = useState({
    full_name: user?.full_name || "",
    bio: user?.bio || "",
    preferred_language: user?.preferred_language || "ASL",
    daily_goal_minutes: user?.daily_goal_minutes || 15,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "daily_goal_minutes" ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { data } = await api.put("/users/me", form);
      updateUserLocally(data);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="full_name" className="mb-1.5 block text-sm font-medium text-ink">
          Full name
        </label>
        <input id="full_name" name="full_name" value={form.full_name} onChange={handleChange} className="input-field" />
      </div>
      <div>
        <label htmlFor="bio" className="mb-1.5 block text-sm font-medium text-ink">
          Bio
        </label>
        <textarea id="bio" name="bio" rows={3} value={form.bio} onChange={handleChange} className="input-field resize-none" placeholder="Tell us a bit about yourself..." maxLength={300} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="preferred_language" className="mb-1.5 block text-sm font-medium text-ink">
            Preferred sign language
          </label>
          <select id="preferred_language" name="preferred_language" value={form.preferred_language} onChange={handleChange} className="input-field">
            <option value="ASL">American Sign Language (ASL)</option>
            <option value="BSL">British Sign Language (BSL)</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="daily_goal_minutes" className="mb-1.5 block text-sm font-medium text-ink">
            Daily goal (minutes)
          </label>
          <input
            id="daily_goal_minutes"
            name="daily_goal_minutes"
            type="number"
            min={5}
            max={180}
            value={form.daily_goal_minutes}
            onChange={handleChange}
            className="input-field"
          />
        </div>
      </div>
      <button type="submit" disabled={isSaving} className="btn-primary">
        {isSaving ? <Spinner size={16} /> : <Save size={16} />}
        Save changes
      </button>
    </form>
  );
}

function ChangePasswordForm() {
  const [form, setForm] = useState({ current_password: "", new_password: "" });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.new_password.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    setIsSaving(true);
    try {
      await api.post("/users/me/change-password", form);
      toast.success("Password updated");
      setForm({ current_password: "", new_password: "" });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="current_password" className="mb-1.5 block text-sm font-medium text-ink">
          Current password
        </label>
        <input
          id="current_password"
          type="password"
          value={form.current_password}
          onChange={(e) => setForm((prev) => ({ ...prev, current_password: e.target.value }))}
          className="input-field"
        />
      </div>
      <div>
        <label htmlFor="new_password" className="mb-1.5 block text-sm font-medium text-ink">
          New password
        </label>
        <input
          id="new_password"
          type="password"
          value={form.new_password}
          onChange={(e) => setForm((prev) => ({ ...prev, new_password: e.target.value }))}
          className="input-field"
        />
      </div>
      <button type="submit" disabled={isSaving} className="btn-secondary">
        {isSaving ? <Spinner size={16} /> : <KeyRound size={16} />}
        Update password
      </button>
    </form>
  );
}

export default function UserProfile() {
  const { user, updateUserLocally } = useAuth();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    try {
      const { data } = await api.post("/users/me/avatar", formData, { headers: { "Content-Type": "multipart/form-data" } });
      updateUserLocally(data);
      toast.success("Profile picture updated");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  return (
    <DashboardLayout title="Profile" subtitle="Manage your account details and preferences.">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="flex flex-col items-center text-center lg:col-span-1">
          <div className="relative">
            <span className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-signal-gradient text-2xl font-bold text-void">
              {user?.avatar_url ? <img src={user.avatar_url} alt="" className="h-full w-full object-cover" /> : user?.full_name?.[0]?.toUpperCase()}
            </span>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-ink shadow-glass hover:bg-surface-3"
              aria-label="Change profile picture"
            >
              {isUploading ? <Spinner size={14} /> : <Camera size={15} />}
            </button>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleAvatarChange} className="hidden" />
          </div>
          <h2 className="mt-4 font-display text-lg font-semibold text-ink">{user?.full_name}</h2>
          <p className="text-sm text-ink-muted">@{user?.username}</p>
          <p className="mt-1 text-xs text-ink-faint">{user?.email}</p>

          <div className="mt-6 grid w-full grid-cols-3 gap-2 text-center">
            <div>
              <p className="stat-number text-lg text-ink">{user?.level}</p>
              <p className="text-[11px] text-ink-muted">Level</p>
            </div>
            <div>
              <p className="stat-number text-lg text-ink">{user?.total_xp}</p>
              <p className="text-[11px] text-ink-muted">XP</p>
            </div>
            <div>
              <p className="stat-number text-lg text-ink">{user?.current_streak}</p>
              <p className="text-[11px] text-ink-muted">Streak</p>
            </div>
          </div>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <div className="mb-4 flex items-center gap-2">
              <User size={18} className="text-signal" />
              <h3 className="font-display font-semibold text-ink">Profile details</h3>
            </div>
            <ProfileDetailsForm />
          </Card>

          <Card>
            <div className="mb-4 flex items-center gap-2">
              <KeyRound size={18} className="text-pulse" />
              <h3 className="font-display font-semibold text-ink">Password</h3>
            </div>
            <ChangePasswordForm />
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
