import { motion } from "framer-motion";
import { CheckCircle2, Eye, EyeOff, KeyRound, Lock } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import { Spinner } from "../components/common/PageLoader";
import { getErrorMessage } from "../context/AuthContext";
import api from "../utils/api";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      setError("At least 8 characters, including a letter and a number");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      await api.post("/auth/reset-password", { token, new_password: password });
      setIsDone(true);
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <p className="text-ink-muted">This reset link is missing or invalid.</p>
        <Link to="/forgot-password" className="btn-primary mt-4">
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[85vh] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-signal-gradient text-void">
            <KeyRound size={22} strokeWidth={2.5} />
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold text-ink">Set a new password</h1>
        </div>

        <div className="glass-card p-6">
          {isDone ? (
            <div className="flex flex-col items-center py-4 text-center">
              <CheckCircle2 size={40} className="text-signal" />
              <p className="mt-3 font-medium text-ink">Password updated</p>
              <p className="mt-1 text-sm text-ink-muted">Redirecting you to log in...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink">
                  New password
                </label>
                <div className="relative">
                  <Lock size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-11 pr-11"
                    placeholder="At least 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
              </div>
              <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
                {isSubmitting ? <Spinner size={18} /> : "Reset password"}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
