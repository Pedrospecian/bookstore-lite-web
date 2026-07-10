"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRegister } from "@/lib/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/errors";

export default function RegisterPage() {
  const router = useRouter();
  const register = useRegister();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await register.mutateAsync({ name, email, password });
      router.push("/");
    } catch (err) {
      setError(getApiErrorMessage(err, "Não foi possível criar sua conta."));
    }
  }

  return (
    <div className="mx-auto max-w-sm px-5 py-16">
      <h1 className="font-display text-3xl text-ink">Criar conta</h1>
      <p className="mt-2 text-sm text-ink/60">Leva menos de um minuto.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <div>
          <label htmlFor="name" className="field-label">Nome</label>
          <input id="name" required value={name} onChange={(e) => setName(e.target.value)} className="field-input" />
        </div>

        <div>
          <label htmlFor="email" className="field-label">E-mail</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field-input"
          />
        </div>

        <div>
          <label htmlFor="password" className="field-label">Senha</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field-input"
          />
          <p className="mt-1.5 text-xs text-ink/40">Mínimo 8 caracteres, com ao menos 1 maiúscula e 1 número.</p>
        </div>

        {error && <p className="text-sm text-bordeaux" role="alert">{error}</p>}

        <button type="submit" disabled={register.isPending} className="btn-primary mt-2">
          {register.isPending ? "Criando conta..." : "Criar conta"}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink/60">
        Já tem conta?{" "}
        <Link href="/login" className="text-forest underline underline-offset-2">
          Entrar
        </Link>
      </p>
    </div>
  );
}
