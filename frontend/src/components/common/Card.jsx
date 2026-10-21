export function Card({ children, className = "", hover = false, as: Component = "div", ...props }) {
  return (
    <Component className={`glass-card p-6 ${hover ? "glass-card-hover" : ""} ${className}`} {...props}>
      {children}
    </Component>
  );
}

export function StatCard({ icon: Icon, label, value, accent = "signal", suffix = "" }) {
  const accentClasses = {
    signal: "bg-signal/10 text-signal",
    pulse: "bg-pulse/10 text-pulse",
    warm: "bg-warm/10 text-warm",
  };

  return (
    <Card className="flex items-center gap-4">
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${accentClasses[accent]}`}>
        <Icon size={22} />
      </span>
      <div className="min-w-0">
        <p className="stat-number text-2xl text-ink">
          {value}
          {suffix && <span className="text-base text-ink-muted">{suffix}</span>}
        </p>
        <p className="truncate text-sm text-ink-muted">{label}</p>
      </div>
    </Card>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <Card className="flex flex-col items-center py-16 text-center">
      {Icon && (
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink/5 text-ink-muted">
          <Icon size={26} />
        </span>
      )}
      <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-ink-muted">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </Card>
  );
}

export function ProgressBar({ value = 0, accent = "signal", className = "" }) {
  const accentClasses = { signal: "bg-signal", pulse: "bg-pulse", warm: "bg-warm" };
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-ink/10 ${className}`}>
      <div
        className={`h-full rounded-full ${accentClasses[accent]} transition-all duration-700 ease-out`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
