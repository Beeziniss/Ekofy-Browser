import { queryOptions } from "@tanstack/react-query";
import { execute } from "@/gql/execute";
import { 
  SUBSCRIPTION_QUERIES, 
  SUBSCRIPTION_DETAIL_QUERIES,
  SUBSCRIPTION_PLANS_QUERIES 
} from "@/modules/shared/queries/admin/subcription-queries";
import type { 
  SubscriptionsResponse, 
  SubscriptionPlansResponse 
} from "@/types";

// Query options for fetching subscriptions list
export const subscriptionsQueryOptions = (
  skip: number = 0,
  take: number = 10,
  searchTerm: string = ""
) => {
  return queryOptions({
    queryKey: ["subscriptions", { skip, take, searchTerm }],
    queryFn: async () => {
      const where = searchTerm 
        ? { name: { contains: searchTerm } }
        : {};

      const result = await execute(SUBSCRIPTION_QUERIES, {
        skip,
        take,
        where,
      });

      return result as SubscriptionsResponse;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Query options for fetching subscription detail
export const subscriptionDetailQueryOptions = (subscriptionId: string) => {
  return queryOptions({
    queryKey: ["subscription", "detail", subscriptionId],
    queryFn: async () => {
      const result = await execute(SUBSCRIPTION_DETAIL_QUERIES, {
        where: { id: { eq: subscriptionId } },
      });

      return result;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!subscriptionId,
  });
};

// Query options for fetching subscription plans
export const subscriptionPlansQueryOptions = (
  skip: number = 0,
  take: number = 10,
  subscriptionId?: string,
  searchTerm: string = ""
) => {
  return queryOptions({
    queryKey: ["subscriptionPlans", { skip, take, subscriptionId, searchTerm }],
    queryFn: async () => {
      const where: Record<string, unknown> = {};

      if (subscriptionId) {
        where.subscriptionId = { eq: subscriptionId };
      }

      if (searchTerm) {
        where.stripeProductName = { contains: searchTerm };
      }

      const result = await execute(SUBSCRIPTION_PLANS_QUERIES, {
        skip,
        take,
        where,
      });

      return result as SubscriptionPlansResponse;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Query options for fetching subscription plan detail
export const subscriptionPlanDetailQueryOptions = (planId: string) => {
  return queryOptions({
    queryKey: ["subscriptionPlan", "detail", planId],
    queryFn: async () => {
      const result = await execute(SUBSCRIPTION_PLANS_QUERIES, {
        skip: 0,
        take: 1,
        where: { id: { eq: planId } },
      });

      return result as SubscriptionPlansResponse;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!planId,
  });
};

// Query options for fetching all subscriptions (for dropdown/select components)
export const allSubscriptionsQueryOptions = () => {
  return queryOptions({
    queryKey: ["subscriptions", "all"],
    queryFn: async () => {
      const result = await execute(SUBSCRIPTION_QUERIES, {
        skip: 0,
        take: 100, // Get all subscriptions
        where: {},
      });

      return result as SubscriptionsResponse;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};