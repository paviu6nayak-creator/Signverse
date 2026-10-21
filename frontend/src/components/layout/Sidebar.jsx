import { Award, LayoutDashboard, LineChart, Shield, User } from "lucide-react";
import { NavLink } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const LINKS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/progress", label: "Progress", icon: LineChart },
  { to: "/profile", label: "Profile", icon: User },
];

export default function Sidebar() {
  const { isAdmin } = useAuth();

  return (
    <aside className="hidden w-60 shrink-0 lg:block">
      <div className="sticky top-24 flex flex-col gap-1">
        {LINKS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive ? "bg-signal/10 text-signal" : "text-ink-muted hover:bg-ink/5 hover:text-ink"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}

        {isAdmin && (
          <>
            <div className="my-2 h-px bg-ink/10" />
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive ? "bg-pulse/10 text-pulse" : "text-ink-muted hover:bg-ink/5 hover:text-ink"
                }`
              }
            >
              <Shield size={18} />
              Admin Panel
            </NavLink>
          </>
        )}

        <div className="mt-4 rounded-xl2 border border-warm/20 bg-warm/5 p-4">
          <div className="flex items-center gap-2 text-warm">
            <Award size={16} />
            <span className="text-xs font-semibold uppercase tracking-wide">Keep it up</span>
          </div>
          <p className="mt-1.5 text-xs text-ink-muted">Practice daily to build your streak and unlock achievements.</p>
        </div>
      </div>
    </aside>
  );
}
