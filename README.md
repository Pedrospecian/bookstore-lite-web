# Alfarrábio - Bookstore Web

Frontend em **Next.js 15 (App Router) + TypeScript + Tailwind CSS**, consumindo a [bookstore-api](../bookstore-api) (Spring Boot). Versão "lite" de um e-commerce de livros originalmente feito com JSP + Servlet.

## Escopo desta fase

✅ Autenticação (login/registro), com refresh automático de token via interceptor do Axios
✅ Catálogo com busca (debounced) e filtro por categoria
✅ Página de detalhe do livro + adicionar ao carrinho
✅ Carrinho (atualizar quantidade, remover item), checkout com endereço e "meus pedidos" (listagem, detalhe e cancelamento)
🔜 Painel admin, contendo CRUD de livros e estoque (próxima fase)

## Rodando localmente

### Pré-requisitos
- Node.js 20+
- A [bookstore-lite-api](../bookstore-lite-api) rodando (ver README do projeto)

### Passos

```bash
npm install
cp .env.local.example .env.local
# ajuste NEXT_PUBLIC_API_URL se a API não estiver em localhost:8080
npm run dev
```

Abre em `http://localhost:3000`.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS
- TanStack Query (cache/estado de servidor)
- Zustand (estado de autenticação, persistido em localStorage)
- Axios (client HTTP com interceptor de refresh token)
