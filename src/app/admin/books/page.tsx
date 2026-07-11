"use client";

import { useState } from "react";
import Link from "next/link";
import { useRequireAdmin } from "@/lib/hooks/useRequireAdmin";
import { useBooks } from "@/lib/hooks/useBooks";
import { useDeactivateBook } from "@/lib/hooks/useAdminBooks";
import { CATEGORY_LABELS } from "@/lib/categories";
import { Price } from "@/components/ui/Price";

export default function AdminBooksPage() {
  const { ready } = useRequireAdmin();
  const [statusFilter, setStatusFilter] = useState<"active" | "inactive">("active");
  const [search, setSearch] = useState("");
  const { data, isLoading } = useBooks({ q: search, active: statusFilter === "active", size: 50 });
  const deactivateBook = useDeactivateBook();

  const books = data?.content ?? [];

  if (!ready) return null;

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-brass-dark">Admin</span>
          <h1 className="mt-1 font-display text-3xl text-ink">Livros</h1>
        </div>
        <Link href="/admin/books/new" className="btn-primary">
          + Novo livro
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <input
          type="search"
          placeholder="Buscar por título ou autor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="field-input max-w-sm"
        />

        <div className="flex border border-ink/20">
          <button
            type="button"
            onClick={() => setStatusFilter("active")}
            className={`px-3 py-1.5 font-mono text-xs uppercase tracking-wide ${statusFilter === "active" ? "bg-forest text-paper" : "text-ink/60"}`}
          >
            Ativos
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("inactive")}
            className={`px-3 py-1.5 font-mono text-xs uppercase tracking-wide ${statusFilter === "inactive" ? "bg-forest text-paper" : "text-ink/60"}`}
          >
            Inativos
          </button>
        </div>
      </div>

      {isLoading && <p className="py-10 text-center text-ink/50">Carregando...</p>}

      {!isLoading && (
        <div className="border border-ink/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/10 bg-paper-dim/50 text-left font-mono text-[11px] uppercase tracking-wide text-ink/50">
                <th className="px-4 py-2 font-normal">Título</th>
                <th className="px-4 py-2 font-normal">Categoria</th>
                <th className="px-4 py-2 font-normal">Preço</th>
                <th className="px-4 py-2 font-normal">Estoque</th>
                <th className="px-4 py-2 font-normal">Status</th>
                <th className="px-4 py-2 font-normal"></th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                  <tr key={book.id} className="border-b border-ink/5 last:border-0">
                    <td className="px-4 py-3">
                      <Link href={`/admin/books/${book.id}`} className="text-ink hover:text-forest">
                        {book.title}
                      </Link>
                      <p className="text-xs text-ink/45">{book.author}</p>
                    </td>
                    <td className="px-4 py-3 text-ink/70">{CATEGORY_LABELS[book.category]}</td>
                    <td className="px-4 py-3"><Price value={book.price} className="font-mono text-ink/70" /></td>
                    <td className="px-4 py-3 font-mono text-ink/70">{book.stockQuantity}</td>
                    <td className="px-4 py-3">
                      <span className={book.active ? "text-forest-dark" : "text-ink/40"}>
                        {book.active ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {book.active && (
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Desativar "${book.title}"? Ele deixa de aparecer no catálogo público.`)) {
                              deactivateBook.mutate(book.id);
                            }
                          }}
                          className="font-mono text-xs uppercase tracking-wide text-ink/40 hover:text-bordeaux"
                        >
                          Desativar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {books.length === 0 && (
            <p className="py-10 text-center text-ink/45">Nenhum livro {statusFilter === "active" ? "ativo" : "inativo"} encontrado.</p>
          )}
        </div>
      )}
    </div>
  );
}
