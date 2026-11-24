import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        midnight: {
          DEFAULT: "#050d1f",
          surface: "#0a1628",
          card: "#0f1f3d",
          border: "#1e3a5f",
        },
        brand: {
          DEFAULT: "#1d4ed8",
          light: "#3b82f6",
          glow: "#2563eb",
        },
        accent: {
          DEFAULT: "#facc15",
          bright: "#fde047",
          muted: "#ca8a04",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 60px rgba(37, 99, 235, 0.35)",
        "glow-yellow": "0 0 40px rgba(250, 204, 21, 0.2)",
        card: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
      },
      backgroundImage: {
        "dark-mesh":
          "radial-gradient(at 20% 10%, rgba(37, 99, 235, 0.25) 0, transparent 45%), radial-gradient(at 80% 0%, rgba(250, 204, 21, 0.08) 0, transparent 40%), radial-gradient(at 50% 100%, rgba(29, 78, 216, 0.2) 0, transparent 50%)",
      },
    },
  },
  plugins: [],
};

export default config;