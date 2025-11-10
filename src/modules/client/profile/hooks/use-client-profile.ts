"use client";

import { format } from "date-fns";
import { useAuthStore } from "@/store";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { listenerProfileOptions, userActiveSubscriptionOptions } from "@/gql/options/client-options";

export function useClientProfile() {
  const { user, isAuthenticated } = useAuthStore();
  const userId = user?.userId || "";
  const enabled = !!userId && !!isAuthenticated;

  const { data: listenerData } = useSuspenseQuery(listenerProfileOptions(userId, enabled));

  const subscriptionQuery = useQuery({
    ...userActiveSubscriptionOptions(userId),
    retry: 0,
    enabled,
  });

  const firstUser = Array.isArray(listenerData?.user) ? listenerData?.user[0] : undefined;
  const personal = {
    displayName: listenerData?.displayName || "",
    email: listenerData?.email || "",
    birthDate: firstUser?.birthDate ? format(new Date(firstUser.birthDate), "yyyy-MM-dd") : undefined,
    gender: firstUser?.gender || undefined,
  };

  const account = {
    createdAt: format(new Date(listenerData?.createdAt), "dd-MM-yyyy"),
    // Prefer subscription tier if active; fall back to verification heuristic
    membershipStatus: subscriptionQuery?.data?.subscription[0].name ?? "Free",
  };

  return { ...listenerData, personal, account };
}
