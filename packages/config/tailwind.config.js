/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Brand palette — Rose-400 primary (#FB7185)
        brand: {
          50:  "#FFF1F2",
          100: "#FFE4E6",
          200: "#FECDD3",
          300: "#FDA4AF",
          400: "#FB7185", // Primary accent
          500: "#F43F5E",
          600: "#E11D48", // Primary dark / hover
          700: "#BE123C",
          800: "#9F1239",
          900: "#881337",
          950: "#4C0519",
        },
        // Secondary palette — Indigo-400 (#818CF8)
        accent: {
          50:  "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8", // Secondary accent
          500: "#6366F1",
          600: "#4F46E5", // Secondary dark / hover
          700: "#4338CA",
          800: "#3730A3",
          900: "#312E81",
        },
        // Couple-mode specific accents
        couple: {
          userA: "#FB7185", // Rose (User 1)
          userB: "#818CF8", // Indigo (User 2)
        },
        // Semantic surface tokens
        surface: {
          primary:   "hsl(var(--surface-primary))",
          secondary: "hsl(var(--surface-secondary))",
          tertiary:  "hsl(var(--surface-tertiary))",
          inverse:   "hsl(var(--surface-inverse))",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      animation: {
        "fade-in":      "fadeIn 0.3s ease-in-out",
        "slide-up":     "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-down":   "slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in":     "scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        shimmer:        "shimmer 2s linear infinite",
        "bounce-soft":  "bounceSoft 1s ease-in-out infinite",
        "pulse-ring":   "pulseRing 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite",
        "pulse-soft":   "pulseSoft 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%":   { opacity: "0", transform: "translateY(-16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%":   { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        bounceSoft: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-6px)" },
        },
        pulseRing: {
          "0%":   { transform: "scale(0.8)", opacity: "1" },
          "100%": { transform: "scale(2)",   opacity: "0" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.65" },
        },
      },
      backgroundImage: {
        "gradient-brand":
          "linear-gradient(135deg, #FB7185 0%, #818CF8 100%)",
        "gradient-pastel":
          "linear-gradient(135deg, #FFF1F2 0%, #EEF2FF 100%)",
        "gradient-warm":
          "linear-gradient(135deg, #FB7185 0%, #F43F5E 100%)",
        "shimmer-gradient":
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)",
      },
      boxShadow: {
        xs:           "0 1px 2px 0 rgba(0, 0, 0, 0.04)",
        glow:         "0 0 20px rgba(251, 113, 133, 0.35)",
        "glow-accent": "0 0 20px rgba(129, 140, 248, 0.35)",
        "card-hover": "0 12px 32px -4px rgba(63, 51, 85, 0.08)",
        pastel:       "0 4px 20px -2px rgba(251, 113, 133, 0.08)",
      },
    },
  },
  plugins: [],
};

module.exports = tailwindConfig;
