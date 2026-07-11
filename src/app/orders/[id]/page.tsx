"use client";

import { use, useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useOrder, useCancelOrder } from "@/lib/hooks/useOrders";
import { useAuthStore } from "@/store/auth.store";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { Price } from "@/components/ui/Price";
import { getApiErrorMessage } from "@/lib/errors";

function OrderDetail({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const justPlaced = searchParams.get("justPlaced") === "1";

  const { data: order, isLoading } = useOrder(id);
  const cancelOrder = useCancelOrder();
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  async function handleCancel() {
    setError(null);
    try {
      await cancelOrder.mutateAsync(id);
      setConfirming(false);
    } catch (err) {
      setError(getApiErrorMessage(err, "Não foi possível cancelar o pedido."));
    }
  }

  if (isLoading || !order) {
    return <p className="mx-auto max-w-2xl px-5 py-16 text-center text-ink/50">Carregando pedido...</p>;
  }

  const date = new Date(order.createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      {justPlaced && order.status === "PLACED" && (
        <div className="mb-6 border border-forest/30 bg-forest/5 px-4 py-3 text-sm text-forest-dark">
          Pedido confirmado! Você pode acompanhar o status por aqui.
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wide text-ink/45">Pedido feito em {date}</p>
          <h1 className="mt-1 font-display text-2xl text-ink">
            Pedido #{order.id.slice(0, 8)}
          </h1>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="mt-8 border border-ink/10">
        <h2 className="border-b border-ink/10 bg-paper-dim/50 px-4 py-2 font-mono text-[11px] uppercase tracking-wide text-ink/50">
          Itens
        </h2>
        <ul>
          {order.items.map((item, idx) => (
            <li key={idx} className="flex items-center justify-between gap-4 border-ink/5 px-4 py-3 [&:not(:last-child)]:border-b">
              <span className="text-sm text-ink">{item.quantity}× {item.title}</span>
              <Price value={item.subtotal} className="font-mono text-sm text-ink/70" />
            </li>
          ))}
        </ul>
        <div className="flex justify-between border-t border-ink/15 px-4 py-3 font-mono text-base text-ink">
          <span>Total</span>
          <Price value={order.totalAmount} />
        </div>
      </div>

      <div className="mt-6 border border-ink/10 p-4">
        <h2 className="mb-2 font-mono text-[11px] uppercase tracking-wide text-ink/50">Endereço de entrega</h2>
        <p className="text-sm text-ink/75">
          {order.address.street}, {order.address.number}
          {order.address.complement ? ` — ${order.address.complement}` : ""}
          <br />
          {order.address.neighborhood} — {order.address.city}/{order.address.state}
          <br />
          CEP {order.address.zipCode}
        </p>
      </div>

      {error && <p className="mt-4 text-sm text-bordeaux" role="alert">{error}</p>}

      {order.status === "PLACED" && (
        <div className="mt-8">
          {!confirming ? (
            <button type="button" onClick={() => setConfirming(true)} className="btn-secondary">
              Cancelar pedido
            </button>
          ) : (
            <div className="flex items-center gap-3 border border-bordeaux/30 bg-bordeaux/5 p-4">
              <p className="flex-1 text-sm text-ink/75">
                Tem certeza? O estoque dos livros será restaurado e essa ação não pode ser desfeita.
              </p>
              <button type="button" onClick={() => setConfirming(false)} className="btn-secondary !py-1.5">
                Voltar
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={cancelOrder.isPending}
                className="inline-flex items-center justify-center bg-bordeaux px-4 py-1.5 text-sm text-paper transition-colors hover:bg-bordeaux/90 disabled:opacity-50"
              >
                {cancelOrder.isPending ? "Cancelando..." : "Confirmar cancelamento"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const isAuthenticated = useAuthStore((s) => Boolean(s.accessToken));

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace(`/login?redirect=/orders/${id}`);
    }
  }, [isHydrated, isAuthenticated, router, id]);

  if (!isHydrated || !isAuthenticated) {
    return null;
  }

  return (
    <Suspense fallback={<p className="mx-auto max-w-2xl px-5 py-16 text-center text-ink/50">Carregando...</p>}>
      <OrderDetail id={id} />
    </Suspense>
  );
}
