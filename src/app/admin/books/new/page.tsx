"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRequireAdmin } from "@/lib/hooks/useRequireAdmin";
import { useCreateBook, type BookFormInput } from "@/lib/hooks/useAdminBooks";
import { BookForm } from "@/components/admin/BookForm";
import { getApiErrorMessage } from "@/lib/errors";

export default function NewBookPage() {
  const { ready } = useRequireAdmin();
  const router = useRouter();
  const createBook = useCreateBook();
  const [error, setError] = useState<string | null>(null);

  if (!ready) return null;

  async function handleSubmit(values: BookFormInput) {
    setError(null);
    try {
      const book = await createBook.mutateAsync(values);
      router.push(`/admin/books/${book.id}`);
    } catch (err) {
      setError(getApiErrorMessage(err, "Não foi possível criar o livro."));
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-brass-dark">Admin</span>
      <h1 className="mt-1 mb-8 font-display text-3xl text-ink">Novo livro</h1>

      <BookForm submitLabel="Criar livro" pending={createBook.isPending} error={error} onSubmit={handleSubmit} />
    </div>
  );
}
