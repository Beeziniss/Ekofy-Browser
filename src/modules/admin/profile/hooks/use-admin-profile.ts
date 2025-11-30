"use client";

import { useAuthStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { adminProfileOptions } from "@/gql/options/admin-options";

export function useAdminProfile() {
  const { user, isAuthenticated } = useAuthStore();
  const userId = user?.userId || "";
  const enabled = !!userId && !!isAuthenticated;

  const query = useQuery({
    ...adminProfileOptions(userId),
    enabled,
  });

  return {
    ...query,
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
