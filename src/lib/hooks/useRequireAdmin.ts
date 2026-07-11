"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export function useRequireAdmin() {
  const router = useRouter();
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!isHydrated) return;

    if (!user) {
      router.replace("/login?redirect=/admin/books");
      return;
    }

    if (user.role !== "ADMIN") {
      router.replace("/");
    }
  }, [isHydrated, user, router]);

  const ready = isHydrated && Boolean(user) && user?.role === "ADMIN";
  return { ready, isHydrated };
}
