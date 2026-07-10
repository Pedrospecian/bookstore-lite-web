import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";

describe("OrderStatusBadge", () => {
  it("exibe 'Confirmado' para status PLACED", () => {
    render(<OrderStatusBadge status="PLACED" />);
    expect(screen.getByText("Confirmado")).toBeInTheDocument();
  });

  it("exibe 'Cancelado' para status CANCELED", () => {
    render(<OrderStatusBadge status="CANCELED" />);
    expect(screen.getByText("Cancelado")).toBeInTheDocument();
  });
});
