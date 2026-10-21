/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import api, { getErrorMessage } from "../utils/api";

const AuthContext = createContext(null);

const TOKEN_KEY = "signverse_access_token";
const REFRESH_KEY = "signverse_refresh_token";
const USER_KEY = "signverse_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem(USER_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  // On mount, verify any cached token is still valid and refresh the user profile.
  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const { data } = await api.get("/auth/me");
        setUser(data);
        localStorage.setItem(USER_KEY, JSON.stringify(data));
      } catch (err) {
        // Only force logout if the server explicitly rejected the token (401 Unauthorized)
        if (err.response?.status === 401) {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(REFRESH_KEY);
          localStorage.removeItem(USER_KEY);
          setUser(null);
        } else {
          // Backend unreachable or network error: retain cached user session
          try {
            const cached = localStorage.getItem(USER_KEY);
            if (cached) {
              setUser(JSON.parse(cached));
            }
          } catch {
            // ignore parse error
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    bootstrap();
  }, []);

  const persistSession = (data) => {
    localStorage.setItem(TOKEN_KEY, data.access_token);
    localStorage.setItem(REFRESH_KEY, data.refresh_token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setUser(data.user);
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    persistSession(data);
    toast.success(`Welcome to SignVerse, ${data.user.full_name.split(" ")[0]}!`);
    return data.user;
  };

  const login = async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    persistSession(data);
    toast.success(`Welcome back, ${data.user.full_name.split(" ")[0]}!`);
    return data.user;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore — we clear local state regardless
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    toast.success("You've been logged out");
  };

  const refreshProfile = async () => {
    const { data } = await api.get("/auth/me");
    setUser(data);
    localStorage.setItem(USER_KEY, JSON.stringify(data));
    return data;
  };

  const updateUserLocally = (partial) => {
    setUser((prev) => {
      const next = { ...prev, ...partial };
      localStorage.setItem(USER_KEY, JSON.stringify(next));
      return next;
    });
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "admin",
      isLoading,
      login,
      register,
      logout,
      refreshProfile,
      updateUserLocally,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

export { getErrorMessage };
