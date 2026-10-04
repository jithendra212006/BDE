import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#08090D",
        surface: {
          50: "#1E2235",
          100: "#171A29",
          200: "#121420",
          300: "#0D0E17",
          card: "#11131F",
          hover: "#181B2C",
          border: "#1E2337",
          "border-light": "#2A304C",
        },
        brand: {
          50: "#FFF1F2",
          100: "#FFE4E6",
          500: "#EF4444",
          600: "#E50914", // Signature OTT Red
          700: "#B80610",
          glow: "rgba(229, 9, 20, 0.25)",
        },
        accent: {
          cyan: "#06B6D4",
          emerald: "#10B981",
          amber: "#F59E0B",
          violet: "#8B5CF6",
          blue: "#3B82F6",
          rose: "#F43F5E",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        "glow-red": "0 0 20px -5px rgba(229, 9, 20, 0.3)",
        "glow-cyan": "0 0 20px -5px rgba(6, 182, 212, 0.3)",
        "card": "0 4px 20px -2px rgba(0, 0, 0, 0.5)",
        "subtle": "0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.3)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "ping-slow": "ping 3s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
    },
  },
  plugins: [],
};
export default config;

