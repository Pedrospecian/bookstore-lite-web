import Link from "next/link";
import type { Order } from "@/types/api";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { Price } from "@/components/ui/Price";

export function OrderCard({ order }: { order: Order }) {
  const date = new Date(order.createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <Link
      href={`/orders/${order.id}`}
      className="flex items-center justify-between gap-4 border border-ink/10 bg-paper-dim/30 p-4 transition-colors hover:border-forest/40"
    >
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wide text-ink/45">Pedido de {date}</p>
        <p className="mt-1 font-display text-base text-ink">
          {itemCount} {itemCount === 1 ? "item" : "itens"}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <Price value={order.totalAmount} className="font-mono text-sm text-ink/80" />
        <OrderStatusBadge status={order.status} />
      </div>
    </Link>
  );
}
