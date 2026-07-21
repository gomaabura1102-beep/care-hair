import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./features/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        muted: "var(--muted)",
        line: "var(--line)",
        paper: "var(--paper)",
        soft: "var(--soft)",
        green: "var(--primary)",
        sage: "var(--secondary)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent: "var(--accent)"
      },
      borderRadius: {
        brand: "var(--radius-card)"
      },
      boxShadow: {
        brand: "var(--shadow-card)",
        hover: "var(--shadow-hover)"
      },
      maxWidth: {
        site: "1200px"
      }
    }
  },
  plugins: []
};

export default config;
