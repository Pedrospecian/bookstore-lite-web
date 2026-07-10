import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddressForm, type AddressFormValues } from "@/components/cart/AddressForm";

const EMPTY: AddressFormValues = {
  street: "", number: "", complement: "", neighborhood: "", city: "", state: "", zipCode: "",
};

describe("AddressForm", () => {
  it("chama onChange com o campo atualizado ao digitar", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<AddressForm values={EMPTY} onChange={handleChange} />);
    await user.type(screen.getByLabelText("Rua"), "A");

    expect(handleChange).toHaveBeenCalledWith({ ...EMPTY, street: "A" });
  });

  it("lista as 27 unidades federativas no select de estado", () => {
    render(<AddressForm values={EMPTY} onChange={vi.fn()} />);
    const select = screen.getByLabelText("Estado") as HTMLSelectElement;
    // 27 UFs + a opção desabilitada "UF"
    expect(select.options.length).toBe(28);
  });
});
