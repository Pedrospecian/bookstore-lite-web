"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLogin } from "@/lib/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/errors";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await login.mutateAsync({ email, password });
      router.push(searchParams.get("redirect") || "/");
    } catch (err) {
      setError(getApiErrorMessage(err, "E-mail ou senha inválidos."));
    }
  }

  return (
    <div className="mx-auto max-w-sm px-5 py-16">
      <h1 className="font-display text-3xl text-ink">Entrar</h1>
      <p className="mt-2 text-sm text-ink/60">Acesse sua conta pra ver seus pedidos e finalizar compras.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
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
        </div>

        {error && <p className="text-sm text-bordeaux" role="alert">{error}</p>}

        <button type="submit" disabled={login.isPending} className="btn-primary mt-2">
          {login.isPending ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink/60">
        Ainda não tem conta?{" "}
        <Link href="/register" className="text-forest underline underline-offset-2">
          Criar conta
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
