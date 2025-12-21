"use client";

import { useQuery } from "@tanstack/react-query";
import { entitlementsQueryOptions } from "@/gql/options/entitlements-options";

export function useEntitlementDetail(entitlementId: string) {
  const { data, isLoading, refetch } = useQuery({
    ...entitlementsQueryOptions(0, 1, { id: { eq: entitlementId } }),
  });

  const entitlement = data?.items?.[0] || null;

  return {
    entitlement,
    isLoading,
    refetch,
  };
}

