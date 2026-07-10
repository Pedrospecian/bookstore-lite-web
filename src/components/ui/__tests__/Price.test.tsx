import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Price } from "@/components/ui/Price";

describe("Price", () => {
  it("formata o valor em BRL", () => {
    render(<Price value={34.9} />);
    expect(screen.getByText("R$ 34,90")).toBeInTheDocument();
  });

  it("formata valores inteiros com centavos", () => {
    render(<Price value={100} />);
    expect(screen.getByText("R$ 100,00")).toBeInTheDocument();
  });
});
