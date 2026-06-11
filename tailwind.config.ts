import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        arena: {
          background: "#0B0506",
          surface: "#18090B",
          elevated: "#240D10",
          border: "#3A151B",
          red: "#FF1E3C",
          redDark: "#B80F27",
          redLight: "#FF5A6E",
          gold: "#FFB000",
          text: "#FFF7F8",
          textMuted: "#D9A7AF",
          muted: "#7A4A52",
          success: "#20C997",
          danger: "#FF3B30"
        }
      },
      fontFamily: {
        sans: ["Inter", "Geist", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
} satisfies Config;
