"use client";

import Link from "next/link";
import { useState } from "react";
import type { CartItemView } from "@/types/api";
import { Price } from "@/components/ui/Price";
import { useUpdateCartItem, useRemoveCartItem } from "@/lib/hooks/useCart";

export function CartItemRow({ item }: { item: CartItemView }) {
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const [quantity, setQuantity] = useState(item.quantity);

  const pending = updateItem.isPending || removeItem.isPending;

  function commitQuantity(next: number) {
    const clamped = Math.max(1, Math.min(item.availableStock, next));
    setQuantity(clamped);
    if (clamped !== item.quantity) {
      updateItem.mutate({ itemId: item.id, quantity: clamped });
    }
  }

  return (
    <div className="flex items-center gap-4 border-b border-ink/10 py-4">
      <Link href={`/books/${item.bookId}`} className="flex-1 font-display text-base text-ink hover:text-forest">
        {item.title}
      </Link>

      <div className="flex items-center gap-2">
        <input
          type="number"
          min={1}
          max={item.availableStock}
          value={quantity}
          disabled={pending}
          onChange={(e) => setQuantity(Number(e.target.value))}
          onBlur={(e) => commitQuantity(Number(e.target.value))}
          className="field-input w-16 text-center"
          aria-label={`Quantidade de ${item.title}`}
        />
      </div>

      <Price value={item.subtotal} className="w-24 text-right font-mono text-sm text-ink/80" />

      <button
        type="button"
        onClick={() => removeItem.mutate(item.id)}
        disabled={pending}
        className="font-mono text-xs uppercase tracking-wide text-ink/40 transition-colors hover:text-bordeaux"
      >
        Remover
      </button>
    </div>
  );
}
