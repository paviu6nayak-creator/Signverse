import { motion } from "framer-motion";
import { AtSign, Eye, EyeOff, Hand, Lock, Mail, UserPlus } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { Spinner } from "../components/common/PageLoader";
import { getErrorMessage, useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ full_name: "", username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") {
      // Automatically strip leading "@" symbol if entered or pasted
      const stripped = value.startsWith("@") ? value.replace(/^@+/, "") : value;
      setForm((prev) => ({ ...prev, [name]: stripped }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const errors = {};
    if (form.full_name.trim().length < 2) errors.full_name = "Enter your full name";

    const cleanUsername = form.username.trim().replace(/^@+/, "");
    // Allow uppercase & lowercase letters, numbers, underscores, and dots (3-30 chars)
    if (!/^[a-zA-Z0-9_.]{3,30}$/.test(cleanUsername)) {
      errors.username = "3-30 characters: letters, numbers, underscores, dots only";
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) errors.email = "Enter a valid email address";
    if (form.password.length < 8) errors.password = "At least 8 characters";
    else if (!/\d/.test(form.password) || !/[a-zA-Z]/.test(form.password)) {
      errors.password = "Must include at least one letter and one number";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const payload = {
        full_name: form.full_name.trim(),
        username: form.username.trim().replace(/^@+/, "").toLowerCase(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      };
      await register(payload);
      navigate("/home", { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[85vh] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-signal-gradient text-void">
            <Hand size={24} strokeWidth={2.5} />
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold text-ink">Create your account</h1>
          <p className="mt-1 text-sm text-ink-muted">Start learning sign language for free — no credit card needed.</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card space-y-4 p-6" noValidate>
          <div>
            <label htmlFor="full_name" className="mb-1.5 block text-sm font-medium text-ink">
              Full name
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              autoComplete="name"
              value={form.full_name}
              onChange={handleChange}
              className="input-field"
              placeholder="Jordan Lee"
            />
            {fieldErrors.full_name && <p className="mt-1.5 text-xs text-danger">{fieldErrors.full_name}</p>}
          </div>

          <div>
            <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-ink">
              Username
            </label>
            <div className="relative">
              <AtSign size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={form.username}
                onChange={handleChange}
                className="input-field pl-11"
                placeholder="jordanlee"
              />
            </div>
            {fieldErrors.username && <p className="mt-1.5 text-xs text-danger">{fieldErrors.username}</p>}
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
              Email
            </label>
            <div className="relative">
              <Mail size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                className="input-field pl-11"
                placeholder="you@example.com"
              />
            </div>
            {fieldErrors.email && <p className="mt-1.5 text-xs text-danger">{fieldErrors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink">
              Password
            </label>
            <div className="relative">
              <Lock size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
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
            {fieldErrors.password && <p className="mt-1.5 text-xs text-danger">{fieldErrors.password}</p>}
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? <Spinner size={18} /> : <UserPlus size={18} />}
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>

          <p className="text-center text-xs text-ink-faint">
            By signing up, you agree to learn at your own pace and have fun doing it.
          </p>
        </form>

        <p className="mt-6 text-center text-sm text-ink-muted">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-signal hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
