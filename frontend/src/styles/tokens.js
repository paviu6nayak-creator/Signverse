/**
 * SignVerse Design Tokens
 * 
 * Single source of truth for design tokens across SignVerse:
 * - Base: Dark Navy Palette
 * - Accents: Primary Teal (Signal) and Electric Violet (Pulse)
 * - Highlights: Amber Flame (Streak/Warm)
 * - Typography: Space Grotesk (display), Inter (body), JetBrains Mono (figures)
 * - Glassmorphism: Frosted acrylic layers with subtle borders and glow shadows
 */

export const tokens = {
  colors: {
    // Dark Navy Base & Surfaces
    navy: {
      void: "#070B16",         // Ultra-deep space navy background
      base: "#0A0F1E",         // Standard base canvas
      surface: "#11182B",      // Elevated cards
      surface2: "#192238",     // Secondary surface
      surface3: "#222D4A",     // Highest elevated popovers / modals
      border: "rgba(234, 240, 251, 0.08)",
      borderHighlight: "rgba(45, 212, 191, 0.3)",
      glass: "rgba(17, 24, 43, 0.65)",
    },

    // Teal (Signal) - Interactive, Success, Primary Motion
    teal: {
      DEFAULT: "#2DD4BF",
      bright: "#5EEAD4",
      dim: "#14B8A6",
      dark: "#0F766E",
      glow: "rgba(45, 212, 191, 0.35)",
      subtle: "rgba(45, 212, 191, 0.12)",
    },

    // Violet (Pulse) - Energy, Secondary Accent, Gradients
    violet: {
      DEFAULT: "#8B5CF6",
      bright: "#A78BFA",
      dim: "#7C3AED",
      dark: "#5B21B6",
      glow: "rgba(139, 92, 246, 0.35)",
      subtle: "rgba(139, 92, 246, 0.12)",
    },

    // Warm Flame (Streak & Badges)
    flame: {
      DEFAULT: "#F59E0B",
      bright: "#FBBF24",
      deep: "#EF4444",
      glow: "rgba(245, 158, 11, 0.35)",
      subtle: "rgba(245, 158, 11, 0.12)",
    },

    // Ink / Text Scale
    ink: {
      primary: "#EAF0FB",      // High-contrast primary text
      secondary: "#CBD5E1",    // Readable content
      muted: "#8B96AE",        // Secondary metadata
      faint: "#5B6480",        // Placeholder / tertiary
      inverse: "#0A0F1E",      // On teal/bright surfaces
    },
  },

  // Gradients
  gradients: {
    tealViolet: "linear-gradient(135deg, #2DD4BF 0%, #8B5CF6 100%)",
    violetPink: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
    flame: "linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)",
    glassBorder: "linear-gradient(135deg, rgba(45, 212, 191, 0.3) 0%, rgba(139, 92, 246, 0.2) 50%, rgba(255, 255, 255, 0.05) 100%)",
    heroGlow: "radial-gradient(circle at 50% 0%, rgba(45, 212, 191, 0.15) 0%, rgba(139, 92, 246, 0.1) 40%, transparent 70%)",
  },

  // Spacing Scale
  spacing: {
    xs: "0.25rem",   // 4px
    sm: "0.5rem",    // 8px
    md: "1rem",      // 16px
    lg: "1.5rem",    // 24px
    xl: "2rem",      // 32px
    "2xl": "3rem",   // 48px
    "3xl": "4rem",   // 64px
  },

  // Border Radii
  radii: {
    sm: "0.375rem",  // 6px
    md: "0.625rem",  // 10px
    lg: "0.875rem",  // 14px
    xl: "1.125rem",  // 18px
    "2xl": "1.5rem", // 24px
    "3xl": "2rem",   // 32px
    full: "9999px",
  },

  // Shadows & Elevation
  shadows: {
    glass: "0 8px 32px 0 rgba(0, 0, 0, 0.45)",
    glowTeal: "0 0 24px rgba(45, 212, 191, 0.35)",
    glowViolet: "0 0 24px rgba(139, 92, 246, 0.35)",
    glowFlame: "0 0 24px rgba(245, 158, 11, 0.35)",
    innerGlow: "inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
  },

  // Type Scale
  typeScale: {
    displayXl: "font-display text-4xl sm:text-5xl font-bold tracking-tight",
    displayLg: "font-display text-3xl sm:text-4xl font-bold tracking-tight",
    displayMd: "font-display text-2xl sm:text-3xl font-bold",
    displaySm: "font-display text-xl sm:text-2xl font-semibold",
    bodyLg: "font-body text-base sm:text-lg leading-relaxed text-ink-muted",
    bodyMd: "font-body text-sm sm:text-base leading-normal text-ink-muted",
    bodySm: "font-body text-xs sm:text-sm text-ink-muted",
    monoFigures: "font-mono font-bold tabular-nums tracking-tight",
  },

  // Glass Card Presets
  glassCard: {
    base: "relative overflow-hidden rounded-2xl border border-ink/[0.08] bg-surface/65 backdrop-blur-xl shadow-glass transition-all duration-300",
    hover: "hover:border-signal/30 hover:shadow-glow-signal hover:-translate-y-0.5",
    interactive: "focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none",
  },
};

export default tokens;
