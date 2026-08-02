"use client";

import { useEffect, useRef } from "react";
import { useCepLookup } from "@/lib/hooks/useCepLookup";

export interface AddressFormValues {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

interface Props {
  values: AddressFormValues;
  onChange: (values: AddressFormValues) => void;
}

const BRAZILIAN_STATES = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

function formatCep(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
}

export function AddressForm({ values, onChange }: Props) {
  const numberInputRef = useRef<HTMLInputElement>(null);
  const lastAppliedCep = useRef<string | null>(null);

  const { data: cepAddress, isFetching: isLookingUpCep, isError: cepNotFound } = useCepLookup(values.zipCode);

  function set<K extends keyof AddressFormValues>(key: K, value: AddressFormValues[K]) {
    onChange({ ...values, [key]: value });
  }

  // Assim que o ViaCEP retorna um endereço válido, preenche rua/bairro/
  // cidade/estado automaticamente e joga o foco pro campo "Número".
  useEffect(() => {
    if (!cepAddress || lastAppliedCep.current === cepAddress.cep) return;

    lastAppliedCep.current = cepAddress.cep;
    onChange({
      ...values,
      street: cepAddress.logradouro || values.street,
      neighborhood: cepAddress.bairro || values.neighborhood,
      city: cepAddress.localidade,
      state: cepAddress.uf,
    });
    numberInputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cepAddress]);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <label htmlFor="street" className="field-label">Rua</label>
        <input id="street" required value={values.street} onChange={(e) => set("street", e.target.value)} className="field-input" />
      </div>

      <div>
        <label htmlFor="number" className="field-label">Número</label>
        <input id="number" ref={numberInputRef} required value={values.number} onChange={(e) => set("number", e.target.value)} className="field-input" />
      </div>

      <div>
        <label htmlFor="complement" className="field-label">Complemento</label>
        <input id="complement" value={values.complement} onChange={(e) => set("complement", e.target.value)} className="field-input" />
      </div>

      <div className="col-span-2">
        <label htmlFor="neighborhood" className="field-label">Bairro</label>
        <input id="neighborhood" required value={values.neighborhood} onChange={(e) => set("neighborhood", e.target.value)} className="field-input" />
      </div>

      <div>
        <label htmlFor="city" className="field-label">Cidade</label>
        <input id="city" required value={values.city} onChange={(e) => set("city", e.target.value)} className="field-input" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="state" className="field-label">Estado</label>
          <select id="state" required value={values.state} onChange={(e) => set("state", e.target.value)} className="field-input">
            <option value="" disabled>UF</option>
            {BRAZILIAN_STATES.map((uf) => (
              <option key={uf} value={uf}>{uf}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="zipCode" className="field-label">CEP</label>
          <input
            id="zipCode"
            required
            inputMode="numeric"
            placeholder="00000-000"
            value={values.zipCode}
            onChange={(e) => set("zipCode", formatCep(e.target.value))}
            className="field-input"
            aria-describedby="zipCode-hint"
          />
          <p id="zipCode-hint" className="mt-1 h-4 font-mono text-[11px] text-ink/50">
            {isLookingUpCep && "Buscando endereço..."}
            {!isLookingUpCep && cepNotFound && (
              <span className="text-bordeaux">CEP não encontrado.</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
