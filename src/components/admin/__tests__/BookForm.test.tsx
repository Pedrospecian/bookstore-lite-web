import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BookForm } from "@/components/admin/BookForm";

describe("BookForm", () => {
  it("envia os valores preenchidos via onSubmit", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<BookForm submitLabel="Criar livro" pending={false} error={null} onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText("Título"), "1984");
    await user.type(screen.getByLabelText("Autor"), "George Orwell");
    await user.clear(screen.getByLabelText("Preço (R$)"));
    await user.type(screen.getByLabelText("Preço (R$)"), "39.9");

    await user.click(screen.getByRole("button", { name: "Criar livro" }));

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ title: "1984", author: "George Orwell", price: 39.9, category: "FICTION" })
    );
  });

  it("preenche os campos a partir de initialValues (modo edição)", () => {
    render(
      <BookForm
        initialValues={{ title: "Dom Casmurro", author: "Machado de Assis" }}
        submitLabel="Salvar alterações"
        pending={false}
        error={null}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.getByLabelText("Título")).toHaveValue("Dom Casmurro");
    expect(screen.getByLabelText("Autor")).toHaveValue("Machado de Assis");
  });

  it("exibe a mensagem de erro quando fornecida", () => {
    render(<BookForm submitLabel="Criar livro" pending={false} error="Preço deve ser maior que zero" onSubmit={vi.fn()} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Preço deve ser maior que zero");
  });

  it("desabilita o botão enquanto pending é true", () => {
    render(<BookForm submitLabel="Criar livro" pending={true} error={null} onSubmit={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Salvando..." })).toBeDisabled();
  });
});
