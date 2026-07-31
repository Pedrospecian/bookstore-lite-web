import type { Config } from "tailwindcss";

// Lê a variável CSS (definida em globals.css para :root e .dark) e monta uma
// cor rgb() válida pro Tailwind, preservando o suporte a modificadores de
// opacidade como `text-ink/70` ou `border-forest/30`.
function withOpacity(variableName: string) {
  return ({ opacityValue }: { opacityValue?: string }) => {
    if (opacityValue !== undefined) {
      return `rgb(var(${variableName}) / ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: withOpacity("--color-ink"),
        forest: {
          DEFAULT: withOpacity("--color-forest"),
          light: withOpacity("--color-forest-light"),
          dark: withOpacity("--color-forest-dark"),
        },
        paper: withOpacity("--color-paper"),
        "paper-dim": withOpacity("--color-paper-dim"),
        brass: {
          DEFAULT: withOpacity("--color-brass"),
          light: withOpacity("--color-brass-light"),
          dark: withOpacity("--color-brass-dark"),
        },
        bordeaux: withOpacity("--color-bordeaux"),
        // Tailwind aceita funções por cor em tempo de execução (é o padrão
        // oficial pra cores baseadas em CSS var + opacidade), mas o tipo
        // bundlado do pacote só modela folhas como `string`. O cast abaixo
        // só ajusta isso pro TypeScript, sem afetar o build/runtime.
      } as unknown as Record<string, string>,
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
