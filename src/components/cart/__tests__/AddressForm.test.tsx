import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AddressForm, type AddressFormValues } from "@/components/cart/AddressForm";

const EMPTY: AddressFormValues = {
  street: "", number: "", complement: "", neighborhood: "", city: "", state: "", zipCode: "",
};

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

// Wrapper que mantém estado de verdade, igual ao uso real em checkout/page.tsx.
// Necessário pros testes que digitam várias teclas em sequência num campo
// controlado (senão cada tecla "reseta" pro valor inicial da prop).
function StatefulAddressForm({ initial = EMPTY, onChange }: { initial?: AddressFormValues; onChange?: (v: AddressFormValues) => void }) {
  const [values, setValues] = useState(initial);
  return (
    <AddressForm
      values={values}
      onChange={(v) => {
        setValues(v);
        onChange?.(v);
      }}
    />
  );
}

describe("AddressForm", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("chama onChange com o campo atualizado ao digitar", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    renderWithQueryClient(<AddressForm values={EMPTY} onChange={handleChange} />);
    await user.type(screen.getByLabelText("Rua"), "A");

    expect(handleChange).toHaveBeenCalledWith({ ...EMPTY, street: "A" });
  });

  it("lista as 27 unidades federativas no select de estado", () => {
    renderWithQueryClient(<AddressForm values={EMPTY} onChange={vi.fn()} />);
    const select = screen.getByLabelText("Estado") as HTMLSelectElement;
    // 27 UFs + a opção desabilitada "UF"
    expect(select.options.length).toBe(28);
  });

  it("formata o CEP digitado como 00000-000", async () => {
    const user = userEvent.setup();

    renderWithQueryClient(<StatefulAddressForm />);
    await user.type(screen.getByLabelText("CEP"), "01001000");

    expect(screen.getByLabelText("CEP")).toHaveValue("01001-000");
  });

  it("busca o endereço no ViaCEP e preenche os campos ao completar o CEP", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        cep: "01001-000",
        logradouro: "Praça da Sé",
        bairro: "Sé",
        localidade: "São Paulo",
        uf: "SP",
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    renderWithQueryClient(<StatefulAddressForm />);
    await userEvent.setup().type(screen.getByLabelText("CEP"), "01001000");

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("https://viacep.com.br/ws/01001000/json/");
    });
    await waitFor(() => {
      expect(screen.getByLabelText("Rua")).toHaveValue("Praça da Sé");
    });
    expect(screen.getByLabelText("Bairro")).toHaveValue("Sé");
    expect(screen.getByLabelText("Cidade")).toHaveValue("São Paulo");
    expect(screen.getByLabelText("Estado")).toHaveValue("SP");
  });

  it("mostra aviso quando o CEP não é encontrado", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ erro: true }) })
    );

    renderWithQueryClient(<StatefulAddressForm />);
    await userEvent.setup().type(screen.getByLabelText("CEP"), "00000000");

    expect(await screen.findByText("CEP não encontrado.")).toBeInTheDocument();
  });
});
