import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  isHydrated: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  hydrate: () => void;
}

function applyThemeToDocument(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: "light",
  isHydrated: false,

  setTheme: (theme) => {
    localStorage.setItem("theme", theme);
    applyThemeToDocument(theme);
    set({ theme });
  },

  toggleTheme: () => {
    get().setTheme(get().theme === "dark" ? "light" : "dark");
  },

  // O tema já foi aplicado ao <html> por um script inline antes da
  // hidratação (evita flash de tema errado). Aqui só sincronizamos o
  // estado do Zustand com o que já está no DOM/localStorage.
  hydrate: () => {
    const stored = localStorage.getItem("theme") as Theme | null;
    const theme: Theme =
      stored === "light" || stored === "dark"
        ? stored
        : document.documentElement.classList.contains("dark")
          ? "dark"
          : "light";

    applyThemeToDocument(theme);
    set({ theme, isHydrated: true });
  },
}));
