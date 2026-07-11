"use client";

import { useState } from "react";
import type { BookFormInput } from "@/lib/hooks/useAdminBooks";
import { ALL_CATEGORIES, CATEGORY_LABELS } from "@/lib/categories";

interface Props {
  initialValues?: Partial<BookFormInput>;
  submitLabel: string;
  pending: boolean;
  error: string | null;
  onSubmit: (values: BookFormInput) => void;
}

const EMPTY: BookFormInput = {
  title: "",
  author: "",
  publisher: "",
  category: "FICTION",
  isbn: "",
  price: 0,
  coverUrl: "",
  synopsis: "",
};

export function BookForm({ initialValues, submitLabel, pending, error, onSubmit }: Props) {
  const [values, setValues] = useState<BookFormInput>({ ...EMPTY, ...initialValues });

  function set<K extends keyof BookFormInput>(key: K, value: BookFormInput[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(values);
      }}
      className="flex flex-col gap-4"
    >
      <div>
        <label htmlFor="title" className="field-label">Título</label>
        <input id="title" required value={values.title} onChange={(e) => set("title", e.target.value)} className="field-input" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="author" className="field-label">Autor</label>
          <input id="author" required value={values.author} onChange={(e) => set("author", e.target.value)} className="field-input" />
        </div>
        <div>
          <label htmlFor="publisher" className="field-label">Editora</label>
          <input id="publisher" value={values.publisher} onChange={(e) => set("publisher", e.target.value)} className="field-input" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="field-label">Categoria</label>
          <select
            id="category"
            required
            value={values.category}
            onChange={(e) => set("category", e.target.value as BookFormInput["category"])}
            className="field-input"
          >
            {ALL_CATEGORIES.map((c) => (
              <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="isbn" className="field-label">ISBN</label>
          <input id="isbn" value={values.isbn} onChange={(e) => set("isbn", e.target.value)} className="field-input" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="field-label">Preço (R$)</label>
          <input
            id="price"
            type="number"
            min={0.01}
            step="0.01"
            required
            value={values.price}
            onChange={(e) => set("price", Number(e.target.value))}
            className="field-input"
          />
        </div>
        <div>
          <label htmlFor="coverUrl" className="field-label">URL da capa</label>
          <input id="coverUrl" value={values.coverUrl} onChange={(e) => set("coverUrl", e.target.value)} className="field-input" />
        </div>
      </div>

      <div>
        <label htmlFor="synopsis" className="field-label">Sinopse</label>
        <textarea
          id="synopsis"
          rows={4}
          value={values.synopsis}
          onChange={(e) => set("synopsis", e.target.value)}
          className="field-input resize-none"
        />
      </div>

      {error && <p className="text-sm text-bordeaux" role="alert">{error}</p>}

      <button type="submit" disabled={pending} className="btn-primary mt-2 self-start">
        {pending ? "Salvando..." : submitLabel}
      </button>
    </form>
  );
}
