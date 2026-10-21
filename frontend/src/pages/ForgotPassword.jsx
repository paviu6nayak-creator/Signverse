import { motion } from "framer-motion";
import { CheckCircle2, Mail, SendHorizontal } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { Spinner } from "../components/common/PageLoader";
import { getErrorMessage } from "../context/AuthContext";
import api from "../utils/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email address");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setIsSent(true);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[85vh] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-signal-gradient text-void">
            <Mail size={22} strokeWidth={2.5} />
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold text-ink">Reset your password</h1>
          <p className="mt-1 text-sm text-ink-muted">Enter your email and we'll send you a reset link.</p>
        </div>

        <div className="glass-card p-6">
          {isSent ? (
            <div className="flex flex-col items-center py-4 text-center">
              <CheckCircle2 size={40} className="text-signal" />
              <p className="mt-3 font-medium text-ink">Check your inbox</p>
              <p className="mt-1 text-sm text-ink-muted">
                If <strong className="text-ink">{email}</strong> is registered, a reset link is on its way.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="you@example.com"
                />
                {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
              </div>
              <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
                {isSubmitting ? <Spinner size={18} /> : <SendHorizontal size={18} />}
                {isSubmitting ? "Sending..." : "Send reset link"}
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-ink-muted">
          Remembered it?{" "}
          <Link to="/login" className="font-medium text-signal hover:underline">
            Back to log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
