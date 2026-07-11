"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useOrders } from "@/lib/hooks/useOrders";
import { useAuthStore } from "@/store/auth.store";
import { OrderCard } from "@/components/orders/OrderCard";

export default function OrdersPage() {
  const router = useRouter();
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const isAuthenticated = useAuthStore((s) => Boolean(s.accessToken));
  const [page, setPage] = useState(0);
  const { data, isLoading } = useOrders(page);

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace("/login?redirect=/orders");
    }
  }, [isHydrated, isAuthenticated, router]);

  if (!isHydrated || !isAuthenticated) {
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="font-display text-3xl text-ink">Meus pedidos</h1>

      {isLoading && <p className="mt-10 text-center text-ink/50">Carregando...</p>}

      {data && data.content.length === 0 && (
        <div className="mt-10 border border-dashed border-ink/20 py-16 text-center">
          <p className="font-display text-lg text-ink/60">Você ainda não fez nenhum pedido.</p>
          <Link href="/" className="btn-primary mt-5 inline-flex">
            Ver catálogo
          </Link>
        </div>
      )}

      {data && data.content.length > 0 && (
        <>
          <div className="mt-8 flex flex-col gap-3">
            {data.content.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>

          {data.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4 font-mono text-sm">
              <button
                type="button"
                className="btn-secondary !px-3 !py-1.5"
                disabled={data.first}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                ← Anterior
              </button>
              <span className="text-ink/50">{data.number + 1} / {data.totalPages}</span>
              <button
                type="button"
                className="btn-secondary !px-3 !py-1.5"
                disabled={data.last}
                onClick={() => setPage((p) => p + 1)}
              >
                Próxima →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
