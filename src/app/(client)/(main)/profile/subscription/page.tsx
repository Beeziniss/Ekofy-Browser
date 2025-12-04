import {
  listenerPremiumEntitlementsQueryOptions,
  subscriptionsPremiumQueryOptions,
} from "@/gql/options/subscription-clients-options";
import ProfileSubscriptionView from "@/modules/client/profile/ui/views/profile-subscription-view";
import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const Page = async () => {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery(subscriptionsPremiumQueryOptions()),
    queryClient.prefetchQuery(listenerPremiumEntitlementsQueryOptions()),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileSubscriptionView />
    </HydrationBoundary>
  );
};

export default Page;
