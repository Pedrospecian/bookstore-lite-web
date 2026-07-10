import type { BookCategory } from "@/types/api";

export const CATEGORY_LABELS: Record<BookCategory, string> = {
  FICTION: "Ficção",
  ROMANCE: "Romance",
  HORROR: "Terror",
  THRILLER: "Suspense",
  EDUCATION: "Não-ficção",
  MANUAL: "Manuais",
  BIOGRAPHY: "Biografia",
  OTHER: "Outros",
};

// Cor de "lombada" por categoria — usada nos cartões do catálogo e no filtro
export const CATEGORY_SPINE_COLOR: Record<BookCategory, string> = {
  FICTION: "#6E2130",
  ROMANCE: "#9C3D5C",
  HORROR: "#1F2421",
  THRILLER: "#3A3F1F",
  EDUCATION: "#1F3A2E",
  MANUAL: "#3A5A6E",
  BIOGRAPHY: "#7A5A2E",
  OTHER: "#4A4438",
};

export const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as BookCategory[];
