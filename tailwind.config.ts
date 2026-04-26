import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./store/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "sx-green": "var(--green-primary)",
        "sx-green-deep": "var(--green-deep)",
        "sx-gold": "var(--gold)",
        "sx-bg": "var(--bg-base)",
        "sx-elevated": "var(--bg-elevated)",
        "sx-text": "var(--text-primary)",
        "sx-dim": "var(--text-dim)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Orbitron", "sans-serif"],
        mono: ["var(--font-mono)", "Share Tech Mono", "monospace"],
        body: ["var(--font-body)", "Rajdhani", "sans-serif"],
      },
      boxShadow: {
        "glow-green": "var(--glow-green)",
        "glow-gold": "var(--glow-gold)",
      },
      borderRadius: {
        sx: "var(--r-md)",
        "sx-lg": "var(--r-lg)",
      },
    },
  },
  plugins: [],
};

export default config;
