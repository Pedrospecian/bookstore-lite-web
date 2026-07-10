import Link from "next/link";
import Image from "next/image";
import type { Book } from "@/types/api";
import { CATEGORY_LABELS, CATEGORY_SPINE_COLOR } from "@/lib/categories";
import { Price } from "@/components/ui/Price";

export function BookCard({ book }: { book: Book }) {
  const spineColor = CATEGORY_SPINE_COLOR[book.category];
  const outOfStock = book.stockQuantity === 0;

  return (
    <Link
      href={`/books/${book.id}`}
      className="group flex gap-3 border border-ink/10 bg-paper-dim/40 p-3 transition-colors hover:border-forest/40 hover:bg-paper-dim"
    >
      {/* Lombada — barra vertical colorida por categoria, como numa estante */}
      <div
        className="w-2 shrink-0 self-stretch"
        style={{ backgroundColor: spineColor }}
        aria-hidden="true"
      />

      <div className="flex flex-1 flex-col gap-2 overflow-hidden">
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-paper-dim">
          {book.coverUrl ? (
            <Image
              src={book.coverUrl}
              alt={`Capa de ${book.title}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 45vw, 200px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center px-3 text-center font-display text-sm text-ink/40">
              {book.title}
            </div>
          )}
          {outOfStock && (
            <span className="absolute right-2 top-2 bg-ink/85 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-paper">
              Esgotado
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink/45">
            {CATEGORY_LABELS[book.category]}
          </span>
          <h3 className="line-clamp-2 font-display text-base leading-snug text-ink">{book.title}</h3>
          <p className="text-sm text-ink/60">{book.author}</p>
          <Price value={book.price} className="mt-auto pt-1 font-mono text-sm text-forest-dark" />
        </div>
      </div>
    </Link>
  );
}
