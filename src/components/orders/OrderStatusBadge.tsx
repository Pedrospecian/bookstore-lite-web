import type { OrderStatus } from "@/types/api";

const STYLES: Record<OrderStatus, string> = {
  PLACED: "bg-forest/10 text-forest-dark border-forest/30",
  CANCELED: "bg-bordeaux/10 text-bordeaux border-bordeaux/30",
};

const LABELS: Record<OrderStatus, string> = {
  PLACED: "Confirmado",
  CANCELED: "Cancelado",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-flex items-center border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide ${STYLES[status]}`}>
      {LABELS[status]}
    </span>
  );
}
