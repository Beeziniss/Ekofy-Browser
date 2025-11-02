"use client";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { listenerProfileOptions, userActiveSubscriptionOptions } from "@/gql/options/client-options";
import { useAuthStore } from "@/store";
import { format } from "date-fns";

export function useClientProfile() {
  const { user, isAuthenticated } = useAuthStore();
  const userId = user?.userId || "";
  const enabled = !!userId && !!isAuthenticated;

  const listenerQuery = useSuspenseQuery(listenerProfileOptions(userId, enabled));

  const subscriptionQuery = useQuery({
    ...userActiveSubscriptionOptions(userId),
    retry: 0,
    enabled,
  }) as {
    data: {
      isActive?: boolean;
      subscription?: { tier?: string };
    } | null;
    isError?: boolean;
  };

  const listener = listenerQuery.data;

  const firstUser = Array.isArray(listener?.user) ? listener?.user[0] : undefined;
  const personal = {
    displayName: listener?.displayName || "",
    email: listener?.email || "",
    birthDate: firstUser?.birthDate
      ? (() => {
          try {
            return format(new Date(firstUser.birthDate as unknown as string), "yyyy-MM-dd");
          } catch {
            return undefined;
          }
        })()
      : undefined,
    gender: firstUser?.gender || undefined,
  } as const;

  const account = {
    createdAt: listener?.createdAt
      ? (() => {
          try {
            return format(new Date(listener.createdAt as unknown as string), "dd-MM-yyyy");
          } catch {
            return undefined;
          }
        })()
      : undefined,
    // Prefer subscription tier if active; fall back to verification heuristic
    membershipStatus:
      (subscriptionQuery?.data?.isActive && subscriptionQuery.data.subscription?.tier) ||
      (listener?.isVerified ? "PREMIUM" : "FREE"),
  } as const;

  return { ...listenerQuery, personal, account };
}
