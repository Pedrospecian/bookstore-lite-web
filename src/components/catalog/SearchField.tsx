"use client";

import { useEffect, useState } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function SearchField({ value, onChange }: Props) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (draft !== value) onChange(draft);
    }, 350);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  return (
    <input
      type="search"
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      placeholder="Buscar por título ou autor..."
      className="field-input max-w-md"
      aria-label="Buscar livros"
    />
  );
}
