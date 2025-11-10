"use client";

import { useCallback } from "react";
import { useAuthStore } from "@/store";
import {
  saveCheckoutSession,
  getCheckoutSession,
  clearCheckoutSession,
  CheckoutSessionData,
} from "@/app/actions/checkout-session";

export function useCheckoutSession() {
  const { user } = useAuthStore();

  const saveSession = useCallback(
    async (data: { url: string; sessionId: string; transactionId?: string }) => {
      if (!user?.userId) {
        throw new Error("User not authenticated");
      }

      return await saveCheckoutSession({
        ...data,
        userId: user.userId,
      });
    },
    [user?.userId],
  );

  const getSession = useCallback(async (): Promise<CheckoutSessionData | null> => {
    if (!user?.userId) {
      return null;
    }

    return await getCheckoutSession(user.userId);
  }, [user?.userId]);

  const clearSession = useCallback(async () => {
    return await clearCheckoutSession();
  }, []);

  return {
    saveSession,
    getSession,
    clearSession,
  };
}
