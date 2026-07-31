import { AxiosError } from "axios";
import type { ApiErrorBody } from "@/types/api";

export function getApiErrorMessage(error: unknown, fallback = "Algo deu errado. Tente novamente mais tarde."): string {
  if (error instanceof AxiosError) {
    const body = error.response?.data as ApiErrorBody | undefined;
    if (body?.errors) {
      const firstError = Object.values(body.errors)[0];
      if (firstError) return firstError;
    }
    if (body?.message) return body.message;
  }
  return fallback;
}
