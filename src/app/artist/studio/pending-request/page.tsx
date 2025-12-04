import { getQueryClient } from "@/providers/get-query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { pendingRequestsOptions } from "@/gql/options/pending-request-option";
import { PendingRequestLayout } from "@/modules/artist/pending-request/ui/layout/pending-request-layout";
import { PendingRequestListView } from "@/modules/artist/pending-request/ui/view/pending-request-list-view";

const PendingRequestPage = async () => {
  const queryClient = getQueryClient();

  // Prefetch initial pending requests
  await queryClient.prefetchQuery(pendingRequestsOptions(0, 20));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PendingRequestLayout>
        <PendingRequestListView />
      </PendingRequestLayout>
    </HydrationBoundary>
  );
};

export default PendingRequestPage;
