import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/providers/get-query-client";
import { pendingRequestsOptions } from "@/gql/options/pending-request-option";
import { PendingRequestLayout } from "@/modules/artist/pending-request/ui/layout/pending-request-layout";
import { PendingRequestListView } from "@/modules/artist/pending-request/ui/view/pending-request-list-view";
import React from "react";

const PendingRequestPage = () => {
  const queryClient = getQueryClient();

  // Prefetch initial pending requests
  void queryClient.prefetchQuery(
    pendingRequestsOptions(0, 20)
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PendingRequestLayout>
        <PendingRequestListView />
      </PendingRequestLayout>
    </HydrationBoundary>
  );
};

export default PendingRequestPage;