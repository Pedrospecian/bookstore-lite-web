"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useRequireAdmin } from "@/lib/hooks/useRequireAdmin";
import { useBook } from "@/lib/hooks/useBooks";
import { useUpdateBook, type BookFormInput } from "@/lib/hooks/useAdminBooks";
import { BookForm } from "@/components/admin/BookForm";
import { StockAdjustmentForm } from "@/components/admin/StockAdjustmentForm";
import { getApiErrorMessage } from "@/lib/errors";

export default function EditBookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { ready } = useRequireAdmin();
  const router = useRouter();
  const { data: book, isLoading } = useBook(id);
  const updateBook = useUpdateBook(id);
  const [error, setError] = useState<string | null>(null);

  if (!ready) return null;

  async function handleSubmit(values: BookFormInput) {
    setError(null);
    try {
      await updateBook.mutateAsync(values);
      router.push("/admin/books");
    } catch (err) {
      setError(getApiErrorMessage(err, "Não foi possível salvar as alterações."));
    }
  }

  if (isLoading || !book) {
    return <p className="mx-auto max-w-2xl px-5 py-16 text-center text-ink/50">Carregando...</p>;
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-brass-dark">Admin</span>
      <h1 className="mt-1 mb-8 font-display text-3xl text-ink">Editar livro</h1>

      <BookForm
        initialValues={{
          title: book.title,
          author: book.author,
          publisher: book.publisher ?? "",
          category: book.category,
          isbn: book.isbn ?? "",
          price: book.price,
          coverUrl: book.coverUrl ?? "",
          synopsis: book.synopsis ?? "",
        }}
        submitLabel="Salvar alterações"
        pending={updateBook.isPending}
        error={error}
        onSubmit={handleSubmit}
      />

      <div className="mt-10">
        <StockAdjustmentForm bookId={book.id} currentStock={book.stockQuantity} />
      </div>
    </div>
  );
}
