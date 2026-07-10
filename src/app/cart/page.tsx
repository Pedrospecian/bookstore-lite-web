"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCart } from "@/lib/hooks/useCart";
import { useAuthStore } from "@/store/auth.store";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { Price } from "@/components/ui/Price";

export default function CartPage() {
  const router = useRouter();
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const isAuthenticated = useAuthStore((s) => Boolean(s.accessToken));
  const { data: cart, isLoading } = useCart();

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace("/login?redirect=/cart");
    }
  }, [isHydrated, isAuthenticated, router]);

  if (!isHydrated || isLoading) {
    return <p className="mx-auto max-w-3xl px-5 py-16 text-center text-ink/50">Carregando carrinho...</p>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="font-display text-3xl text-ink">Seu carrinho</h1>

      {!cart || cart.items.length === 0 ? (
        <div className="mt-10 border border-dashed border-ink/20 py-16 text-center">
          <p className="font-display text-lg text-ink/60">Seu carrinho está vazio.</p>
          <Link href="/" className="btn-primary mt-5 inline-flex">
            Voltar ao catálogo
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-8">
            {cart.items.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-ink/15 pt-6">
            <span className="font-mono text-sm uppercase tracking-wide text-ink/50">Total</span>
            <Price value={cart.total} className="font-mono text-2xl text-forest-dark" />
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <Link href="/" className="btn-secondary">
              Continuar comprando
            </Link>
            <Link href="/checkout" className="btn-primary">
              Finalizar compra
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
