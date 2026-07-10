import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Book, BookCategory, Page } from "@/types/api";

interface BookSearchParams {
  q?: string;
  category?: BookCategory;
  page?: number;
  size?: number;
}

export function useBooks(params: BookSearchParams) {
  return useQuery({
    queryKey: ["books", params],
    queryFn: async () => {
      const { data } = await api.get<Page<Book>>("/books", {
        params: {
          q: params.q || undefined,
          category: params.category || undefined,
          page: params.page ?? 0,
          size: params.size ?? 12,
        },
      });
      return data;
    },
  });
}

export function useBook(id: string | undefined) {
  return useQuery({
    queryKey: ["books", id],
    queryFn: async () => {
      const { data } = await api.get<Book>(`/books/${id}`);
      return data;
    },
    enabled: Boolean(id),
  });
}
