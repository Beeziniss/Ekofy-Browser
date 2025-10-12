"use client";

import { useQuery } from "@tanstack/react-query";
import { listenerProfileOptions, userActiveSubscriptionOptions } from "@/gql/options/client-options";
import { useAuthStore } from "@/store";
import { format } from "date-fns";

export function useClientProfile() {
  const { user } = useAuthStore();
  const userId = user?.userId || "";
  const listenerQuery = useQuery(listenerProfileOptions(userId));
  const subscriptionQuery = useQuery(userActiveSubscriptionOptions(userId));

  const listener = listenerQuery.data;

  const personal = {
    displayName: listener?.displayName || "",
    email: listener?.email || "",
    birthDate: listener?.user?.birthDate
      ? (() => {
          try {
            return format(new Date(listener.user.birthDate as unknown as string), "yyyy-MM-dd");
          } catch {
            return undefined;
          }
        })()
      : undefined,
    gender: listener?.user?.gender || undefined,
  } as const;

  const account = {
    createdAt: listener?.createdAt
      ? (() => {
          try {
            return format(new Date(listener.createdAt as unknown as string), "yyyy-MM-dd");
          } catch {
            return undefined;
          }
        })()
      : undefined,
    // Prefer subscription tier if active; fall back to verification heuristic
    membershipStatus:
      (subscriptionQuery.data?.isActive && subscriptionQuery.data.subscription?.tier) ||
      (listener?.isVerified ? "PREMIUM" : "FREE"),
  } as const;

  return { ...listenerQuery, personal, account };
}
