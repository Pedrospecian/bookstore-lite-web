import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Book, BookCategory } from "@/types/api";

export interface BookFormInput {
  title: string;
  author: string;
  publisher: string;
  category: BookCategory;
  isbn: string;
  price: number;
  coverUrl: string;
  synopsis: string;
}

function invalidateBooks(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ["books"] });
}

export function useCreateBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: BookFormInput) => {
      const { data } = await api.post<Book>("/books", input);
      return data;
    },
    onSuccess: () => invalidateBooks(queryClient),
  });
}

export function useUpdateBook(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: BookFormInput) => {
      const { data } = await api.put<Book>(`/books/${id}`, input);
      return data;
    },
    onSuccess: () => invalidateBooks(queryClient),
  });
}

export function useDeactivateBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/books/${id}`);
    },
    onSuccess: () => invalidateBooks(queryClient),
  });
}

export function useAdjustStock(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { type: "IN" | "OUT"; quantity: number; note?: string }) => {
      const { data } = await api.post<Book>(`/books/${id}/stock`, input);
      return data;
    },
    onSuccess: () => invalidateBooks(queryClient),
  });
}
