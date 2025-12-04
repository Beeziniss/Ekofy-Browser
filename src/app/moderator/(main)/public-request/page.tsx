import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { PublicRequestView } from "@/modules/moderator/public-request/ui/view/public-request-view";
import { moderatorPublicRequestsQueryOptions } from "@/gql/options/moderator-public-request-query-options";

const PublicRequestPage = async () => {
  const queryClient = getQueryClient();

  // Prefetch the first page of public requests
  await queryClient.prefetchQuery(moderatorPublicRequestsQueryOptions(0, 10, null, null));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PublicRequestView />
    </HydrationBoundary>
  );
};

export default PublicRequestPage;
