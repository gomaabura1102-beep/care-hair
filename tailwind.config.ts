import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./features/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#141612",
        muted: "#6f746d",
        line: "#e8e5de",
        paper: "#ffffff",
        soft: "#f6f4ef",
        green: "#16372f",
        sage: "#dfe8df"
      },
      borderRadius: {
        brand: "8px"
      },
      boxShadow: {
        brand: "0 18px 50px rgba(20, 22, 18, .08)"
      },
      maxWidth: {
        site: "1200px"
      }
    }
  },
  plugins: []
};

export default config;
