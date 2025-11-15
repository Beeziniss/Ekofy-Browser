import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/providers/get-query-client";
import { pendingRequestDetailOptions } from "@/gql/options/pending-request-option";
import { PendingRequestLayout } from "@/modules/artist/pending-request/ui/layout/pending-request-layout";
import { PendingRequestDetailView } from "@/modules/artist/pending-request/ui/view/pending-request-detail-view";
import React from "react";

interface PendingRequestDetailPageProps {
  params: Promise<{
    requestId: string;
  }>;
}

const PendingRequestDetailPage = async ({ params }: PendingRequestDetailPageProps) => {
  const { requestId } = await params;
  const queryClient = getQueryClient();

  // Prefetch request details
  try {
    await queryClient.prefetchQuery(
      pendingRequestDetailOptions(requestId)
    );
  } catch (error) {
    // If prefetch fails, the component will handle the error state
    console.error("Error prefetching request details:", error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PendingRequestLayout>
        <PendingRequestDetailView requestId={requestId} />
      </PendingRequestLayout>
    </HydrationBoundary>
  );
};

export default PendingRequestDetailPage;