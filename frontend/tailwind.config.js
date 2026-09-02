/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // ── Color palette ──────────────────────────────────────────────────────
      colors: {
        // Backgrounds
        canvas:   "#0A0A0A",  // primary background
        surface:  "#111111",  // slightly lifted surface (nav, footers)
        elevated: "#1A1A1A",  // modals, dropdowns

        // Borders
        border:       "#262626",  // default 1px separator
        "border-muted": "#1C1C1C", // extra-subtle dividers

        // Text
        "text-primary":   "#FAFAFA",  // headlines
        "text-secondary": "#A1A1A1",  // sub-labels, captions
        "text-muted":     "#525252",  // placeholders, disabled

        // Accent — electric blue, used SPARINGLY
        accent: {
          DEFAULT: "#4E6EFF",
          hover:   "#3D5BF5",
          muted:   "rgba(78,110,255,0.12)",
        },
      },

      // ── Typography ─────────────────────────────────────────────────────────
      fontFamily: {
        sans:    ["Inter", "system-ui", "-apple-system", "sans-serif"],
        display: ["Space Grotesk", "Inter", "system-ui", "sans-serif"],
        mono:    ["JetBrains Mono", "Fira Code", "monospace"],
        pixel:   ["'Press Start 2P'", "monospace"],
      },
      fontSize: {
        "display-2xl": ["90px", { lineHeight: "1.05", letterSpacing: "-0.04em" }],
        "display-xl":  ["72px", { lineHeight: "1.07", letterSpacing: "-0.03em" }],
        "display-lg":  ["60px", { lineHeight: "1.1",  letterSpacing: "-0.025em" }],
        "display-md":  ["48px", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "display-sm":  ["36px", { lineHeight: "1.2",  letterSpacing: "-0.015em" }],
        "body-lg":     ["18px", { lineHeight: "1.75", letterSpacing: "0" }],
        "body-md":     ["16px", { lineHeight: "1.7",  letterSpacing: "0" }],
        "body-sm":     ["14px", { lineHeight: "1.65", letterSpacing: "0.01em" }],
        "caption":     ["12px", { lineHeight: "1.5",  letterSpacing: "0.08em" }],
      },

      // ── Spacing extras ─────────────────────────────────────────────────────
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
        "section": "7rem",
      },

      // ── Borders ────────────────────────────────────────────────────────────
      borderWidth: { DEFAULT: "1px" },
      borderColor: { DEFAULT: "#262626" },
      borderRadius: {
        "sm": "4px",
        "md": "6px",
        "lg": "10px",
      },

      // ── Animation ──────────────────────────────────────────────────────────
      transitionTimingFunction: {
        "precise": "cubic-bezier(0.2, 0, 0, 1)",
      },
      transitionDuration: {
        "200": "200ms",
        "300": "300ms",
      },
      keyframes: {
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s cubic-bezier(0.2,0,0,1) both",
        "fade-in": "fade-in 0.3s cubic-bezier(0.2,0,0,1) both",
      },

      // ── Backdrop blur ──────────────────────────────────────────────────────
      backdropBlur: { nav: "12px" },
    },
  },
  plugins: [],
};
