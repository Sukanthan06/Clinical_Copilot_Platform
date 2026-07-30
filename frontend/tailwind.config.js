/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#EAF0F3",
          100: "#D2DFE5",
          200: "#A8C0CB",
          300: "#7398A8",
          400: "#48738A",
          500: "#2C5468",
          600: "#1C3F52",
          700: "#15303F",
          800: "#0F2A3D",
          900: "#0A1D2A",
          950: "#071620",
        },
        teal: {
          50: "#EBFAF7",
          100: "#CFF2EA",
          200: "#9FE4D6",
          300: "#67CFBB",
          400: "#37B49D",
          500: "#0E9384",
          600: "#0B776C",
          700: "#0A6259",
          800: "#0A4E48",
          900: "#08403C",
        },
        mist: {
          50: "#FBFDFC",
          100: "#F4F7F6",
          200: "#E9EEEC",
          300: "#DCE4E1",
        },
        amber: {
          400: "#F5A623",
          500: "#E0910F",
        },
        critical: {
          400: "#E5484D",
          500: "#D6393E",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      boxShadow: {
        soft: "0 2px 8px rgba(15, 42, 61, 0.06), 0 1px 2px rgba(15, 42, 61, 0.04)",
        card: "0 4px 16px rgba(15, 42, 61, 0.08), 0 1px 3px rgba(15, 42, 61, 0.06)",
        lift: "0 14px 36px rgba(15, 42, 61, 0.12), 0 4px 12px rgba(14, 147, 132, 0.15)",
        glow: "0 0 24px -4px rgba(14, 147, 132, 0.4)",
        glowAmber: "0 0 24px -4px rgba(245, 166, 35, 0.35)",
        glowCritical: "0 0 24px -4px rgba(229, 72, 77, 0.35)",
        glass: "0 8px 32px 0 rgba(15, 42, 61, 0.08)",
      },
      borderRadius: {
        xl2: "1.25rem",
        xl3: "1.75rem",
      },
      keyframes: {
        pulseLine: {
          "0%, 100%": { opacity: 0.35, strokeDashoffset: "0" },
          "50%": { opacity: 1, strokeDashoffset: "-12" },
        },
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(14px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-8px) rotate(1deg)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        ripplePulse: {
          "0%": { transform: "scale(0.95)", opacity: 0.8 },
          "50%": { transform: "scale(1.12)", opacity: 0.4 },
          "100%": { transform: "scale(0.95)", opacity: 0.8 },
        },
        heartbeat: {
          "0%, 100%": { transform: "scale(1)" },
          "14%": { transform: "scale(1.15)" },
          "28%": { transform: "scale(1)" },
          "42%": { transform: "scale(1.08)" },
          "70%": { transform: "scale(1)" },
        },
        gradientBg: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        pulseLine: "pulseLine 2.2s ease-in-out infinite",
        fadeUp: "fadeUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) both",
        fadeIn: "fadeIn 0.3s ease-out both",
        floatSlow: "floatSlow 6s ease-in-out infinite",
        shimmer: "shimmer 2.5s infinite",
        ripplePulse: "ripplePulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        heartbeat: "heartbeat 2.5s ease-in-out infinite",
        gradientBg: "gradientBg 8s ease infinite",
      },
    },
  },
  plugins: [],
};
