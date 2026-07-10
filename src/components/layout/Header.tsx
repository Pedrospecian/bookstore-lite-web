"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { useCart } from "@/lib/hooks/useCart";

export function Header() {
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const logout = useAuthStore((s) => s.logout);
  const { data: cart } = useCart();

  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return (
    <header className="border-b border-ink/10 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-display text-2xl tracking-tight text-forest">Alfarrábio</span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.15em] text-ink/40 sm:inline">
            Livraria
          </span>
        </Link>

        <nav className="flex items-center gap-5 font-body text-sm">
          {!isHydrated ? null : user ? (
            <>
              <Link href="/orders" className="text-ink/70 transition-colors hover:text-forest">
                Meus pedidos
              </Link>
              {user.role === "ADMIN" && (
                <Link href="/admin/books" className="text-ink/70 transition-colors hover:text-forest">
                  Admin
                </Link>
              )}
              <Link
                href="/cart"
                className="relative text-ink/70 transition-colors hover:text-forest"
                aria-label={`Carrinho, ${itemCount} ${itemCount === 1 ? "item" : "itens"}`}
              >
                Carrinho
                {itemCount > 0 && (
                  <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center bg-brass px-1 font-mono text-[11px] text-ink">
                    {itemCount}
                  </span>
                )}
              </Link>
              <button type="button" onClick={logout} className="text-ink/50 transition-colors hover:text-bordeaux">
                Sair
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-ink/70 transition-colors hover:text-forest">
                Entrar
              </Link>
              <Link href="/register" className="btn-primary !py-1.5 !px-4 text-xs">
                Criar conta
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
