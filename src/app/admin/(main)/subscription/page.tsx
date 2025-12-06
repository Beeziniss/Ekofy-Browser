import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { AdminSubscriptionList } from "@/modules/admin/subscription/ui/view";
import { subscriptionsQueryOptions } from "@/gql/options/subscription-options";

const SubscriptionPage = async () => {
  const queryClient = getQueryClient();

  // Prefetch the first page of subscriptions
  await queryClient.prefetchQuery(subscriptionsQueryOptions(0, 10, ""));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminSubscriptionList />
    </HydrationBoundary>
  );
};

export default SubscriptionPage;
