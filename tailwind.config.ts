import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff4f6",
          100: "#fde4e9",
          500: "#F9C8D0",
          600: "#d98495",
          700: "#a85066"
        },
        blush: "#F9C8D0",
        peach: "#FFBE98",
        lavender: "#C9B8E8",
        mint: "#A8D8C8",
        gold: "#E8C97A",
        cream: "#FDF6EC",
        charcoal: "#2D2D2D",
        "soft-black": "#1A1A2E",
        ink: "#2D2D2D"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(45, 45, 45, 0.1)",
        art: "0 24px 70px rgba(217, 132, 149, 0.22)"
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-dm-sans)", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
