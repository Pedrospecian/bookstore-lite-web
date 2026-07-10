"use client";

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

export function AddressForm({ values, onChange }: Props) {
  function set<K extends keyof AddressFormValues>(key: K, value: AddressFormValues[K]) {
    onChange({ ...values, [key]: value });
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <label htmlFor="street" className="field-label">Rua</label>
        <input id="street" required value={values.street} onChange={(e) => set("street", e.target.value)} className="field-input" />
      </div>

      <div>
        <label htmlFor="number" className="field-label">Número</label>
        <input id="number" required value={values.number} onChange={(e) => set("number", e.target.value)} className="field-input" />
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
            placeholder="00000-000"
            value={values.zipCode}
            onChange={(e) => set("zipCode", e.target.value)}
            className="field-input"
          />
        </div>
      </div>
    </div>
  );
}
