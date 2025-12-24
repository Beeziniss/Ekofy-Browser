'use client';

import { useQuery } from '@tanstack/react-query';
import {
  subscriptionsPremiumQueryOptions,
  premiumSubscriptionPlansQueryOptions,
  listenerPremiumEntitlementsQueryOptions,
} from '@/gql/options/subscription-clients-options';

export const useLandingSubscription = () => {
  // Fetch Premium subscription
  const {
    data: subscriptionData,
    isLoading: subscriptionLoading,
    error: subscriptionError,
  } = useQuery(subscriptionsPremiumQueryOptions());

  const subscription = subscriptionData?.subscriptions?.items?.[0];
  const subscriptionId = subscription?.id;
  const subscriptionCode = subscription?.code;

  // Fetch Premium plan details
  const {
    data: planData,
    isLoading: planLoading,
    error: planError,
  } = useQuery({
    ...premiumSubscriptionPlansQueryOptions(subscriptionId || ''),
    enabled: !!subscriptionId,
  });

  // Fetch Premium features/entitlements
  const {
    data: featuresData,
    isLoading: featuresLoading,
    error: featuresError,
  } = useQuery({
    ...(subscriptionCode
      ? listenerPremiumEntitlementsQueryOptions(subscriptionCode)
      : { queryKey: [], queryFn: async () => ({ entitlements: { items: [] } }) }),
    enabled: !!subscriptionCode,
  });

  const plan = planData?.subscriptionPlans?.items?.[0];
  const features = featuresData?.entitlements?.items?.map((item) => item.name) || [];

  return {
    subscription,
    plan,
    features,
    isLoading: subscriptionLoading || planLoading || featuresLoading,
    error: subscriptionError || planError || featuresError,
  };
};
