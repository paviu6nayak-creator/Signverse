/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Design tokens are CSS variables (see src/index.css) so the whole
        // palette flips between dark/light mode without per-component
        // dark: variants. Signal/Pulse/Warm accents stay fixed across both
        // modes — only the void/surface/ink neutrals adapt.
        void: "rgb(var(--c-void) / <alpha-value>)",
        surface: "rgb(var(--c-surface) / <alpha-value>)",
        "surface-2": "rgb(var(--c-surface-2) / <alpha-value>)",
        "surface-3": "rgb(var(--c-surface-3) / <alpha-value>)",
        signal: {
          DEFAULT: "#2DD4BF",
          dim: "#1F9E8F",
          bright: "#5EEAD4",
        },
        pulse: {
          DEFAULT: "#8B5CF6",
          dim: "#6D3FD1",
          bright: "#A78BFA",
        },
        warm: {
          DEFAULT: "#FBBF24",
          dim: "#D99A0F",
        },
        ink: {
          DEFAULT: "rgb(var(--c-ink) / <alpha-value>)",
          muted: "rgb(var(--c-ink-muted) / <alpha-value>)",
          faint: "rgb(var(--c-ink-faint) / <alpha-value>)",
        },
        danger: "#F87171",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        "aurora": "radial-gradient(60% 50% at 20% 0%, rgba(45,212,191,0.14) 0%, rgba(10,15,30,0) 60%), radial-gradient(50% 40% at 85% 15%, rgba(139,92,246,0.14) 0%, rgba(10,15,30,0) 60%)",
        "signal-gradient": "linear-gradient(135deg, #2DD4BF 0%, #8B5CF6 100%)",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0,0,0,0.35)",
        "glow-signal": "0 0 24px rgba(45,212,191,0.35)",
        "glow-pulse": "0 0 24px rgba(139,92,246,0.35)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "draw-line": {
          "0%": { strokeDashoffset: 1 },
          "100%": { strokeDashoffset: 0 },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: 0.6, transform: "scale(1)" },
          "50%": { opacity: 1, transform: "scale(1.25)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out forwards",
        "pulse-dot": "pulse-dot 1.8s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
