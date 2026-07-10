import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#141914",
        forest: {
          DEFAULT: "#1F3A2E",
          light: "#2C4E3D",
          dark: "#122720",
        },
        paper: "#F2EFE4",
        "paper-dim": "#E8E3D3",
        brass: {
          DEFAULT: "#C9A24B",
          light: "#E0C078",
          dark: "#9C7A32",
        },
        bordeaux: "#6E2130",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        card: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
