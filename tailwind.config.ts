import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#121621",
        panel: "#f4f7fb",
        paper: "#ffffff",
        moss: "#2f6f5e",
        coral: "#d85a3a",
        gold: "#b88714",
        cobalt: "#245fbc",
        violet: "#7057a3",
        line: "#ded7c8"
      },
      boxShadow: {
        calm: "0 18px 50px rgba(33, 37, 47, 0.12)",
        focus: "0 24px 70px rgba(18, 22, 33, 0.24)"
      }
    }
  },
  plugins: []
};

export default config;
