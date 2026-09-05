/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Brand palette — deep blue + vivid teal accent
        brand: {
          50: "hsl(220, 100%, 97%)",
          100: "hsl(220, 95%, 93%)",
          200: "hsl(220, 90%, 85%)",
          300: "hsl(220, 85%, 74%)",
          400: "hsl(220, 80%, 62%)",
          500: "hsl(220, 75%, 52%)",
          600: "hsl(220, 78%, 42%)",
          700: "hsl(220, 80%, 34%)",
          800: "hsl(220, 82%, 26%)",
          900: "hsl(220, 85%, 18%)",
          950: "hsl(220, 88%, 12%)",
        },
        accent: {
          50: "hsl(178, 100%, 95%)",
          100: "hsl(178, 95%, 88%)",
          200: "hsl(178, 90%, 75%)",
          300: "hsl(178, 85%, 60%)",
          400: "hsl(178, 80%, 46%)",
          500: "hsl(178, 85%, 38%)",
          600: "hsl(178, 88%, 30%)",
        },
        // Semantic surface tokens for dark mode support
        surface: {
          primary: "hsl(var(--surface-primary))",
          secondary: "hsl(var(--surface-secondary))",
          tertiary: "hsl(var(--surface-tertiary))",
          inverse: "hsl(var(--surface-inverse))",
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
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-down": "slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        shimmer: "shimmer 2s linear infinite",
        "bounce-soft": "bounceSoft 1s ease-in-out infinite",
        "pulse-ring": "pulseRing 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        bounceSoft: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.8)", opacity: "1" },
          "100%": { transform: "scale(2)", opacity: "0" },
        },
      },
      backgroundImage: {
        "gradient-brand":
          "linear-gradient(135deg, hsl(220, 78%, 42%) 0%, hsl(178, 85%, 38%) 100%)",
        "gradient-radial-brand":
          "radial-gradient(ellipse at top, hsl(220, 75%, 52%) 0%, hsl(220, 88%, 12%) 100%)",
        "shimmer-gradient":
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
      },
      boxShadow: {
        glow: "0 0 20px hsla(220, 75%, 52%, 0.4)",
        "glow-accent": "0 0 20px hsla(178, 85%, 38%, 0.4)",
        "card-hover": "0 20px 60px -10px rgba(0,0,0,0.3)",
      },
    },
  },
  plugins: [],
};

module.exports = tailwindConfig;
