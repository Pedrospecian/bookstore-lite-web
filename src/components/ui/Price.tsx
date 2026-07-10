export function Price({ value, className }: { value: number; className?: string }) {
  const formatted = value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  return <span className={className}>{formatted}</span>;
}
