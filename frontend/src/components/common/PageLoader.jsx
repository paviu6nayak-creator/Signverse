import { Hand } from "lucide-react";

export default function PageLoader() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <span className="flex h-14 w-14 animate-pulse-dot items-center justify-center rounded-2xl bg-signal-gradient text-void">
        <Hand size={28} strokeWidth={2.5} />
      </span>
      <p className="text-sm text-ink-muted">Loading SignVerse...</p>
    </div>
  );
}

export function Spinner({ size = 20, className = "" }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.2" />
      <path d="M22 12c0-5.523-4.477-10-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function InlineLoader({ label = "Loading..." }) {
  return (
    <div className="flex items-center justify-center gap-2 py-10 text-sm text-ink-muted">
      <Spinner size={16} />
      {label}
    </div>
  );
}
