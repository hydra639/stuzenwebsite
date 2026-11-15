/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#081A33",
          900: "#0B2142",
          800: "#102A56",
          700: "#173B70",
          600: "#1E4C8A",
          500: "#2B5F9E",
        },
        royal: {
          800: "#1E40AF",
          700: "#1D4ED8",
          600: "#2563EB",
          500: "#3B82F6",
          400: "#60A5FA",
          300: "#93C5FD",
          200: "#BFDBFE",
          100: "#DBEAFE",
          50: "#EFF6FF",
        },
        electric: "#3B82F6",
        ink: "#172B4D",
        muted: "#64748B",
        mist: "#F5F8FC",
        ice: "#EAF2FF",
        line: "#E2E8F0",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        display: ["Manrope", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        brand: ["Orbitron", "Oxanium", "sans-serif"],
      },
      maxWidth: {
        "8xl": "88rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(16, 42, 86, 0.04), 0 10px 30px -12px rgba(16, 42, 86, 0.10)",
        lift: "0 24px 60px -28px rgba(16, 42, 86, 0.35)",
        nav: "0 1px 0 rgba(226, 232, 240, 1), 0 12px 30px -24px rgba(16, 42, 86, 0.30)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-node": {
          "0%, 100%": { opacity: "0.45", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.35)" },
        },
        "draw-line": {
          "0%": { strokeDashoffset: "600" },
          "100%": { strokeDashoffset: "0" },
        },
        "marquee": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
        "float-slow": "float-slow 7s ease-in-out infinite",
        "pulse-node": "pulse-node 3.2s ease-in-out infinite",
        "draw-line": "draw-line 2.4s ease-out both",
        marquee: "marquee 32s linear infinite",
      },
    },
  },
  plugins: [],
};
