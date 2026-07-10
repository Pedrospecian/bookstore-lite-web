"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/hooks/useCart";
import { useCheckout } from "@/lib/hooks/useOrders";
import { useAuthStore } from "@/store/auth.store";
import { AddressForm, type AddressFormValues } from "@/components/cart/AddressForm";
import { Price } from "@/components/ui/Price";
import { getApiErrorMessage } from "@/lib/errors";

const EMPTY_ADDRESS: AddressFormValues = {
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  zipCode: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const isAuthenticated = useAuthStore((s) => Boolean(s.accessToken));
  const { data: cart, isLoading } = useCart();
  const checkout = useCheckout();

  const [address, setAddress] = useState<AddressFormValues>(EMPTY_ADDRESS);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace("/login?redirect=/checkout");
    }
  }, [isHydrated, isAuthenticated, router]);

  useEffect(() => {
    if (!isLoading && cart && cart.items.length === 0) {
      router.replace("/cart");
    }
  }, [isLoading, cart, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const order = await checkout.mutateAsync({
        ...address,
        complement: address.complement || undefined,
      });
      router.push(`/orders/${order.id}?justPlaced=1`);
    } catch (err) {
      setError(getApiErrorMessage(err, "Não foi possível concluir o pedido."));
    }
  }

  if (!isHydrated || isLoading || !cart || cart.items.length === 0) {
    return <p className="mx-auto max-w-3xl px-5 py-16 text-center text-ink/50">Carregando...</p>;
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="font-display text-3xl text-ink">Finalizar compra</h1>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-10 sm:grid-cols-[1fr_260px]">
        <div>
          <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.12em] text-ink/50">Endereço de entrega</h2>
          <AddressForm values={address} onChange={setAddress} />
        </div>

        <div className="h-fit border border-ink/15 bg-paper-dim/40 p-5">
          <h2 className="mb-3 font-mono text-xs uppercase tracking-[0.12em] text-ink/50">Resumo</h2>
          <ul className="flex flex-col gap-1.5 text-sm text-ink/70">
            {cart.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-2">
                <span className="truncate">{item.quantity}× {item.title}</span>
                <Price value={item.subtotal} />
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-ink/15 pt-3 font-mono text-base text-ink">
            <span>Total</span>
            <Price value={cart.total} />
          </div>

          {error && <p className="mt-4 text-sm text-bordeaux" role="alert">{error}</p>}

          <button type="submit" disabled={checkout.isPending} className="btn-primary mt-5 w-full">
            {checkout.isPending ? "Confirmando..." : "Confirmar pedido"}
          </button>
        </div>
      </form>
    </div>
  );
}
