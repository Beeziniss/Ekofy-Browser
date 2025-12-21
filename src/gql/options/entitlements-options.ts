import { execute } from '@/gql/execute';
import { ENTITLEMENTS_QUERIES, SubscriptionOverridesQuery } from "@/modules/shared/queries/admin/entitlements-queries";
import { EntitlementFilterInput, EntitlementsListQuery, EntitlementSortInput } from '@/gql/graphql';

type Entitlement = NonNullable<
  NonNullable<EntitlementsListQuery["entitlements"]>["items"]
>[number];

export const entitlementsQueryOptions = (
  skip: number, 
  take: number, 
  where?: EntitlementFilterInput, 
  order?: EntitlementSortInput[]
) => ({
  queryKey: ["entitlements", skip, take, where, order],
  queryFn: async () => {
    const result = await execute(ENTITLEMENTS_QUERIES, { skip, take, where, order });
    return result.entitlements || {
      items: [],
      pageInfo: { hasNextPage: false, hasPreviousPage: false },
      totalCount: 0,
    };
  },
  staleTime: 5 * 60 * 1000, // 5 minutes
});

export const subscriptionOverridesQueryOptions = () => ({
  queryKey: ["subscription-overrides"],
  queryFn: async () => {
    const result = await execute(SubscriptionOverridesQuery);
    return result.subscriptions?.items || [];
  },
  staleTime: 10 * 60 * 1000, // 10 minutes
});

// Helper functions for entitlement filtering
export const getActiveEntitlements = (entitlements: Entitlement[]) => {
  return entitlements.filter((e) => e.isActive);
};

export const getInactiveEntitlements = (entitlements: Entitlement[]) => {
  return entitlements.filter((e) => !e.isActive);
};

export const searchEntitlements = (entitlements: Entitlement[], searchTerm: string) => {
  const lowerSearchTerm = searchTerm.toLowerCase();
  return entitlements.filter(
    (e) =>
      e.name.toLowerCase().includes(lowerSearchTerm) ||
      e.code.toLowerCase().includes(lowerSearchTerm) ||
      e.description?.toLowerCase().includes(lowerSearchTerm)
  );
};

