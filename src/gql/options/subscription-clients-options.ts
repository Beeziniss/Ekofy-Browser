import { queryOptions } from "@tanstack/react-query";
import { execute } from "@/gql/execute";
import { SUBSCRIPTION_PLANS_QUERIES, SUBSCRIPTION_QUERIES } from "@/modules/shared/queries/admin/subcription-queries";
import { COUPON_QUERIES, ENTITLEMENT_QUERIES } from "@/modules/shared/queries/client/plans-queries";
import { SubscriptionTier } from "@/gql/graphql";

export const subscriptionsPremiumQueryOptions = (skip: number = 0, take: number = 10) =>
  queryOptions({
    queryKey: ["subscriptions-premium", { skip, take }],
    queryFn: async () => {
      const response = await execute(SUBSCRIPTION_QUERIES, {
        skip,
        take,
        where: {
          tier: { eq: SubscriptionTier.Premium },
        },
      });
      return response;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

export const subscriptionsProQueryOptions = (skip: number = 0, take: number = 10) =>
  queryOptions({
    queryKey: ["subscriptions-pro", { skip, take }],
    queryFn: async () => {
      const response = await execute(SUBSCRIPTION_QUERIES, {
        skip,
        take,
        where: {
          tier: { eq: SubscriptionTier.Pro },
        },
      });
      return response;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

// Get all public subscription plans
export const allPublicSubscriptionPlansQueryOptions = () =>
  queryOptions({
    queryKey: ["all-public-subscription-plans"],
    queryFn: async () => {
      const response = await execute(SUBSCRIPTION_PLANS_QUERIES, {
        skip: 0,
        take: 10,
        where: {},
      });
      return response;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

// Get subscription plans for specific subscription ID (Premium)
export const premiumSubscriptionPlansQueryOptions = (subscriptionId: string) =>
  queryOptions({
    queryKey: ["premium-subscription-plans", subscriptionId],
    queryFn: async () => {
      const response = await execute(SUBSCRIPTION_PLANS_QUERIES, {
        skip: 0,
        take: 10,
        where: {
          subscriptionId: { eq: subscriptionId },
        },
      });
      return response;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

// Get subscription plans for specific subscription ID (Pro)
export const proSubscriptionPlansQueryOptions = (subscriptionId: string) =>
  queryOptions({
    queryKey: ["pro-subscription-plans", subscriptionId],
    queryFn: async () => {
      const response = await execute(SUBSCRIPTION_PLANS_QUERIES, {
        skip: 0,
        take: 10,
        where: {
          subscriptionId: { eq: subscriptionId },
        },
      });
      return response;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

// Get key features for premium subscription
export const listenerPremiumEntitlementsQueryOptions = () =>
  queryOptions({
    queryKey: ["premium-entitlements"],
    queryFn: async () => {
      const response = await execute(ENTITLEMENT_QUERIES, {
        where: {
          subscriptionOverrides: {
            some: { subscriptionCode: { eq: "listener_premium" } },
          },
          isActive: { eq: true },
        },
      });
      return response;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

export const artistProEntitlementsQueryOptions = () =>
  queryOptions({
    queryKey: ["pro-entitlements"],
    queryFn: async () => {
      const response = await execute(ENTITLEMENT_QUERIES, {
        where: {
          subscriptionOverrides: {
            some: { subscriptionCode: { eq: "artist_pro" } },
          },
          isActive: { eq: true },
        },
      });
      return response;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

// Get available coupons for pricing calculation
export const availableCouponsQueryLISTENER10FOREVEROptions = () =>
  queryOptions({
    queryKey: ["available-coupons"],
    queryFn: async () => {
      const response = await execute(COUPON_QUERIES, {
        where: {
          code: { eq: "LISTENER10FOREVER" },
        },
      });
      return response;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

export const availableCouponsQueryARTIST20FOREVEROptions = () =>
  queryOptions({
    queryKey: ["available-coupons-artist"],
    queryFn: async () => {
      const response = await execute(COUPON_QUERIES, {
        where: {
          code: { eq: "ARTIST20FOREVER" },
        },
      });
      return response;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
