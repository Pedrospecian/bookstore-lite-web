import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CategoryFilter } from "@/components/catalog/CategoryFilter";

describe("CategoryFilter", () => {
  it("renderiza 'Todas' e todas as categorias", () => {
    render(<CategoryFilter selected={null} onChange={vi.fn()} />);
    expect(screen.getByText("Todas")).toBeInTheDocument();
    expect(screen.getByText("Ficção")).toBeInTheDocument();
    expect(screen.getByText("Terror")).toBeInTheDocument();
  });

  it("chama onChange com a categoria clicada", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<CategoryFilter selected={null} onChange={handleChange} />);

    await user.click(screen.getByText("Romance"));

    expect(handleChange).toHaveBeenCalledWith("ROMANCE");
  });

  it("chama onChange com null ao clicar novamente na categoria já selecionada", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<CategoryFilter selected="ROMANCE" onChange={handleChange} />);

    await user.click(screen.getByText("Romance"));

    expect(handleChange).toHaveBeenCalledWith(null);
  });

  it("marca o botão selecionado com data-active", () => {
    render(<CategoryFilter selected="HORROR" onChange={vi.fn()} />);
    expect(screen.getByText("Terror")).toHaveAttribute("data-active", "true");
    expect(screen.getByText("Romance")).toHaveAttribute("data-active", "false");
  });
});
