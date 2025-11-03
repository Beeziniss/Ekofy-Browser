"use client";

import { subscriptionsQueryOptions } from "@/gql/options/subscription-options";
import { AdminSubscriptionList } from "@/modules/admin/subscription/ui/view";
import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const SubscriptionPage = () => {
  const queryClient = getQueryClient();

  // Prefetch the first page of subscriptions
  void queryClient.prefetchQuery(subscriptionsQueryOptions(0, 10, ""));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminSubscriptionList />
    </HydrationBoundary>
  );
};

export default SubscriptionPage;
