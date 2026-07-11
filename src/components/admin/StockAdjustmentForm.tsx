"use client";

import { useState } from "react";
import { useAdjustStock } from "@/lib/hooks/useAdminBooks";
import { getApiErrorMessage } from "@/lib/errors";

export function StockAdjustmentForm({ bookId, currentStock }: { bookId: string; currentStock: number }) {
  const adjustStock = useAdjustStock(bookId);
  const [type, setType] = useState<"IN" | "OUT">("IN");
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);
    try {
      const updated = await adjustStock.mutateAsync({ type, quantity, note: note || undefined });
      setFeedback({ kind: "success", text: `Estoque atualizado: ${updated.stockQuantity} unidades.` });
      setQuantity(1);
      setNote("");
    } catch (err) {
      setFeedback({ kind: "error", text: getApiErrorMessage(err, "Não foi possível movimentar o estoque.") });
    }
  }

  return (
    <div className="border border-ink/15 p-4">
      <h2 className="mb-1 font-mono text-xs uppercase tracking-[0.12em] text-ink/50">Movimentar estoque</h2>
      <p className="mb-4 text-sm text-ink/60">Estoque atual: <strong className="text-ink">{currentStock}</strong> unidades</p>

      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="movement-type" className="field-label">Tipo</label>
          <select
            id="movement-type"
            value={type}
            onChange={(e) => setType(e.target.value as "IN" | "OUT")}
            className="field-input"
          >
            <option value="IN">Entrada</option>
            <option value="OUT">Saída</option>
          </select>
        </div>

        <div>
          <label htmlFor="movement-quantity" className="field-label">Quantidade</label>
          <input
            id="movement-quantity"
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="field-input w-28"
          />
        </div>

        <div className="flex-1 basis-48">
          <label htmlFor="movement-note" className="field-label">Observação (opcional)</label>
          <input
            id="movement-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ex: reposição do fornecedor"
            className="field-input"
          />
        </div>

        <button type="submit" disabled={adjustStock.isPending} className="btn-primary">
          {adjustStock.isPending ? "Salvando..." : "Aplicar"}
        </button>
      </form>

      {feedback && (
        <p className={`mt-3 text-sm ${feedback.kind === "success" ? "text-forest-dark" : "text-bordeaux"}`} role="status">
          {feedback.text}
        </p>
      )}
    </div>
  );
}
