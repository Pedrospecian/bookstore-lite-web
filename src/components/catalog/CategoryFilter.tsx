"use client";

import type { BookCategory } from "@/types/api";
import { ALL_CATEGORIES, CATEGORY_LABELS } from "@/lib/categories";

interface Props {
  selected: BookCategory | null;
  onChange: (category: BookCategory | null) => void;
}

export function CategoryFilter({ selected, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoria">
      <button
        type="button"
        className="spine-tag"
        data-active={selected === null}
        onClick={() => onChange(null)}
      >
        Todas
      </button>
      {ALL_CATEGORIES.map((category) => (
        <button
          key={category}
          type="button"
          className="spine-tag"
          data-active={selected === category}
          onClick={() => onChange(selected === category ? null : category)}
        >
          {CATEGORY_LABELS[category]}
        </button>
      ))}
    </div>
  );
}
