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
        lift: "0 12px 32px rgba(15, 42, 61, 0.14), 0 2px 6px rgba(15, 42, 61, 0.08)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        pulseLine: {
          "0%, 100%": { opacity: 0.35 },
          "50%": { opacity: 1 },
        },
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        pulseLine: "pulseLine 2.2s ease-in-out infinite",
        fadeUp: "fadeUp 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};
