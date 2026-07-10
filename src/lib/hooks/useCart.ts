import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import type { Cart } from "@/types/api";

export function useCart() {
  const isAuthenticated = useAuthStore((s) => Boolean(s.accessToken));

  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const { data } = await api.get<Cart>("/cart");
      return data;
    },
    enabled: isAuthenticated,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookId, quantity }: { bookId: string; quantity: number }) => {
      const { data } = await api.post<Cart>("/cart/items", { bookId, quantity });
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["cart"], data);
    },
  });
}
