"use client";

import { useState } from "react";
import { useBooks } from "@/lib/hooks/useBooks";
import { BookCard } from "@/components/catalog/BookCard";
import { CategoryFilter } from "@/components/catalog/CategoryFilter";
import { SearchField } from "@/components/catalog/SearchField";
import type { BookCategory } from "@/types/api";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<BookCategory | null>(null);
  const [page, setPage] = useState(0);

  const { data, isLoading, isError } = useBooks({ q: search, category: category ?? undefined, page });

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="mb-10 border-b border-ink/10 pb-8">
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-brass-dark">Catálogo</span>
        <h1 className="mt-2 font-display text-4xl italic text-ink">Um bom livro começa pela lombada.</h1>
        <p className="mt-3 max-w-xl text-ink/60">
          Busque por título ou autor, ou navegue pelas estantes por categoria.
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-5">
        <SearchField
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(0);
          }}
        />
        <CategoryFilter
          selected={category}
          onChange={(c) => {
            setCategory(c);
            setPage(0);
          }}
        />
      </div>

      {isLoading && <p className="py-16 text-center text-ink/50">Carregando o acervo...</p>}

      {isError && (
        <p className="py-16 text-center text-bordeaux">
          Não foi possível carregar o catálogo agora. Tente novamente em instantes.
        </p>
      )}

      {data && data.content.length === 0 && (
        <div className="border border-dashed border-ink/20 py-16 text-center">
          <p className="font-display text-lg text-ink/60">Nenhum livro encontrado por aqui.</p>
          <p className="mt-1 text-sm text-ink/40">Tente outro termo de busca ou outra categoria.</p>
        </div>
      )}

      {data && data.content.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {data.content.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          {data.totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-4 font-mono text-sm">
              <button
                type="button"
                className="btn-secondary !px-3 !py-1.5"
                disabled={data.first}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                ← Anterior
              </button>
              <span className="text-ink/50">
                {data.number + 1} / {data.totalPages}
              </span>
              <button
                type="button"
                className="btn-secondary !px-3 !py-1.5"
                disabled={data.last}
                onClick={() => setPage((p) => p + 1)}
              >
                Próxima →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
