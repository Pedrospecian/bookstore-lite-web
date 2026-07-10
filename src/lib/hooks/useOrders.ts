import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Order, Page } from "@/types/api";

interface CheckoutInput {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export function useCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CheckoutInput) => {
      const { data } = await api.post<Order>("/orders", input);
      return data;
    },
    onSuccess: () => {
      // O checkout esvazia o carrinho e afeta o estoque dos livros comprados
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
}

export function useOrders(page = 0) {
  return useQuery({
    queryKey: ["orders", page],
    queryFn: async () => {
      const { data } = await api.get<Page<Order>>("/orders", {
        params: { page, size: 10, sort: "createdAt,desc" },
      });
      return data;
    },
  });
}

export function useOrder(id: string | undefined) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: async () => {
      const { data } = await api.get<Order>(`/orders/${id}`);
      return data;
    },
    enabled: Boolean(id),
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const { data } = await api.post<Order>(`/orders/${orderId}/cancel`);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["orders", data.id], data);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
}
