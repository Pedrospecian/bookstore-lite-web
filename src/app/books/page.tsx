"use client";

import { use, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useBook } from "@/lib/hooks/useBooks";
import { useAddToCart } from "@/lib/hooks/useCart";
import { useAuthStore } from "@/store/auth.store";
import { CATEGORY_LABELS, CATEGORY_SPINE_COLOR } from "@/lib/categories";
import { Price } from "@/components/ui/Price";
import { getApiErrorMessage } from "@/lib/errors";

export default function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: book, isLoading, isError } = useBook(id);
  const addToCart = useAddToCart();
  const isAuthenticated = useAuthStore((s) => Boolean(s.accessToken));

  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  if (isLoading) {
    return <p className="mx-auto max-w-4xl px-5 py-16 text-center text-ink/50">Carregando...</p>;
  }

  if (isError || !book) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-16 text-center">
        <p className="font-display text-lg text-ink/60">Livro não encontrado.</p>
      </div>
    );
  }

  const spineColor = CATEGORY_SPINE_COLOR[book.category];
  const outOfStock = book.stockQuantity === 0;

  async function handleAddToCart() {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/books/${id}`);
      return;
    }

    setFeedback(null);
    try {
      await addToCart.mutateAsync({ bookId: book!.id, quantity });
      setFeedback({ type: "success", message: `${quantity} unidade(s) adicionada(s) ao carrinho.` });
    } catch (error) {
      setFeedback({ type: "error", message: getApiErrorMessage(error) });
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <div className="grid gap-10 sm:grid-cols-[220px_1fr]">
        <div className="flex gap-3">
          <div className="w-3 shrink-0 self-stretch" style={{ backgroundColor: spineColor }} aria-hidden="true" />
          <div className="relative aspect-[2/3] flex-1 overflow-hidden bg-paper-dim">
            {book.coverUrl ? (
              <Image src={book.coverUrl} alt={`Capa de ${book.title}`} fill className="object-cover" sizes="220px" />
            ) : (
              <div className="flex h-full w-full items-center justify-center px-3 text-center font-display text-base text-ink/40">
                {book.title}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink/45">
              {CATEGORY_LABELS[book.category]}
            </span>
            <h1 className="mt-1 font-display text-3xl text-ink">{book.title}</h1>
            <p className="mt-1 text-ink/60">{book.author}{book.publisher ? ` · ${book.publisher}` : ""}</p>
          </div>

          <Price value={book.price} className="font-mono text-2xl text-forest-dark" />

          {book.synopsis && <p className="max-w-prose leading-relaxed text-ink/75">{book.synopsis}</p>}

          <div className="mt-2 flex items-center gap-3 font-mono text-xs uppercase tracking-wide text-ink/50">
            {outOfStock ? (
              <span className="text-bordeaux">Esgotado</span>
            ) : (
              <span>{book.stockQuantity} em estoque</span>
            )}
            {book.isbn && <span>· ISBN {book.isbn}</span>}
          </div>

          {!outOfStock && (
            <div className="mt-4 flex items-center gap-3">
              <label htmlFor="quantity" className="field-label !mb-0">
                Qtd.
              </label>
              <input
                id="quantity"
                type="number"
                min={1}
                max={book.stockQuantity}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(book.stockQuantity, Number(e.target.value))))}
                className="field-input w-20"
              />
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={addToCart.isPending}
                className="btn-primary"
              >
                {addToCart.isPending ? "Adicionando..." : "Adicionar ao carrinho"}
              </button>
            </div>
          )}

          {feedback && (
            <p className={feedback.type === "success" ? "text-forest-dark" : "text-bordeaux"} role="status">
              {feedback.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
