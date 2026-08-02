import { useQuery } from "@tanstack/react-query";

export interface CepAddress {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}

interface ViaCepResponse extends CepAddress {
  erro?: boolean;
}

function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

// ViaCEP é um serviço público e gratuito (sem autenticação) que consulta a
// base de CEPs dos Correios. Por ser uma API externa e sem necessidade de
// token, chamamos direto via fetch, sem passar pela instância `api`
// (que aponta pro nosso backend e injeta Authorization).
async function fetchCepAddress(cep: string): Promise<CepAddress> {
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

  if (!response.ok) {
    throw new Error("Não foi possível consultar o CEP.");
  }

  const data = (await response.json()) as ViaCepResponse;

  if (data.erro) {
    throw new Error("CEP não encontrado.");
  }

  return data;
}

/**
 * Consulta o endereço correspondente a um CEP assim que ele tiver os 8
 * dígitos necessários. Fica "enabled: false" (não dispara) enquanto o CEP
 * estiver incompleto.
 */
export function useCepLookup(cep: string) {
  const digits = onlyDigits(cep);

  return useQuery({
    queryKey: ["cep", digits],
    queryFn: () => fetchCepAddress(digits),
    enabled: digits.length === 8,
    retry: false,
    staleTime: 1000 * 60 * 30, // 30min: CEP praticamente não muda
  });
}
