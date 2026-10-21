import { AnimatePresence, motion } from "framer-motion";
import { Hand, LayoutDashboard, LogOut, Menu, Moon, Sun, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const NAV_LINKS = [
  { to: "/learn", label: "Learn" },
  { to: "/live-translation", label: "Live Translation" },
  { to: "/daily-practice", label: "Practice" },
  { to: "/quiz", label: "Quiz" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-ink/[0.06] bg-void/70 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-signal-gradient text-void">
            <Hand size={20} strokeWidth={2.5} />
          </span>
          SignVerse
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive ? "bg-ink/[0.06] text-ink" : "text-ink-muted hover:text-ink"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-ink/[0.06] hover:text-ink"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link to="/dashboard" className="btn-ghost">
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <Link to="/profile" className="flex items-center gap-2 rounded-full border border-ink/10 py-1.5 pl-1.5 pr-3 text-sm font-medium hover:bg-ink/5" id="nav-user-profile">
                <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-signal-gradient text-xs font-bold text-void">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    (user?.full_name?.[0] || user?.username?.[0] || user?.email?.[0] || "U").toUpperCase()
                  )}
                </span>
                <span className="font-semibold text-ink">
                  {user?.full_name?.split(" ")[0] || user?.username || user?.email?.split("@")[0] || "Learner"}
                </span>
              </Link>
              <button onClick={handleLogout} aria-label="Log out" className="flex h-10 w-10 items-center justify-center rounded-full text-ink-muted hover:bg-ink/[0.06] hover:text-danger">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-ghost">
                Log in
              </Link>
              <Link to="/register" className="btn-primary !px-5 !py-2.5 text-sm">
                Get Started
              </Link>
            </div>
          )}
        </div>

        <button className="text-ink md:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <Menu size={24} />
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-void/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex items-center justify-between px-4 py-3">
              <span className="font-display text-lg font-bold">SignVerse</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="text-ink">
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col gap-1 px-4 py-4">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-3 text-base font-medium text-ink-muted hover:bg-ink/5 hover:text-ink"
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="my-3 h-px bg-ink/10" />
              {isAuthenticated ? (
                <>
                  <NavLink to="/dashboard" onClick={() => setMobileOpen(false)} className="rounded-xl px-4 py-3 text-base font-medium text-ink-muted hover:bg-ink/5 hover:text-ink">
                    Dashboard
                  </NavLink>
                  <NavLink to="/profile" onClick={() => setMobileOpen(false)} className="rounded-xl px-4 py-3 text-base font-medium text-ink-muted hover:bg-ink/5 hover:text-ink">
                    Profile
                  </NavLink>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      handleLogout();
                    }}
                    className="rounded-xl px-4 py-3 text-left text-base font-medium text-danger hover:bg-danger/10"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 px-4 pt-2">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary w-full">
                    Log in
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary w-full">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
