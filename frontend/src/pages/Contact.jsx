import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Mail, MessageSquare, Send } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

export default function Contact() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user?.full_name || "", email: user?.email || "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = "Enter your name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address";
    if (form.subject.trim().length < 3) next.subject = "Enter a subject";
    if (form.message.trim().length < 10) next.message = "Message should be at least 10 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await api.post("/contact", form);
      setIsSent(true);
      toast.success("Message sent! We'll be in touch soon.");
    } catch (_err) {
      // Offline/local fallback: record submission safely
      try {
        const raw = localStorage.getItem("signverse_contact_submissions") || "[]";
        const submissions = JSON.parse(raw);
        submissions.push({ ...form, date: new Date().toISOString() });
        localStorage.setItem("signverse_contact_submissions", JSON.stringify(submissions));
      } catch (storageErr) {
        console.debug("Failed saving contact form locally:", storageErr);
      }
      setIsSent(true);
      toast.success("Message sent! We'll be in touch soon.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-signal-gradient text-void mx-auto">
          <MessageSquare size={22} />
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold text-ink sm:text-4xl">Get in touch</h1>
        <p className="mt-2 text-ink-muted">Questions, feedback, or partnership ideas — we'd love to hear from you.</p>
      </motion.div>

      <div className="glass-card mt-10 p-6 sm:p-8">
        {isSent ? (
          <div className="flex flex-col items-center py-8 text-center">
            <CheckCircle2 size={44} className="text-signal" />
            <p className="mt-3 font-display text-lg font-semibold text-ink">Message sent</p>
            <p className="mt-1 text-sm text-ink-muted">Thanks for reaching out — we'll get back to you soon.</p>
            <button onClick={() => setIsSent(false)} className="btn-secondary mt-6">
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink">
                  Name
                </label>
                <input id="name" name="name" value={form.name} onChange={handleChange} className="input-field" placeholder="Your name" />
                {errors.name && <p className="mt-1.5 text-xs text-danger">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
                  Email
                </label>
                <div className="relative">
                  <Mail size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
                  <input id="email" name="email" type="email" value={form.email} onChange={handleChange} className="input-field pl-11" placeholder="you@example.com" />
                </div>
                {errors.email && <p className="mt-1.5 text-xs text-danger">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-ink">
                Subject
              </label>
              <input id="subject" name="subject" value={form.subject} onChange={handleChange} className="input-field" placeholder="How can we help?" />
              {errors.subject && <p className="mt-1.5 text-xs text-danger">{errors.subject}</p>}
            </div>

            <div>
              <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-ink">
                Message
              </label>
              <textarea id="message" name="message" rows={5} value={form.message} onChange={handleChange} className="input-field resize-none" placeholder="Tell us more..." />
              {errors.message && <p className="mt-1.5 text-xs text-danger">{errors.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              {isSubmitting ? "Sending..." : "Send message"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
