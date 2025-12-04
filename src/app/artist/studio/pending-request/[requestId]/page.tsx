import { getQueryClient } from "@/providers/get-query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { pendingRequestDetailOptions } from "@/gql/options/pending-request-option";
import { PendingRequestLayout } from "@/modules/artist/pending-request/ui/layout/pending-request-layout";
import { PendingRequestDetailView } from "@/modules/artist/pending-request/ui/view/pending-request-detail-view";

interface PendingRequestDetailPageProps {
  params: Promise<{
    requestId: string;
  }>;
}

const PendingRequestDetailPage = async ({ params }: PendingRequestDetailPageProps) => {
  const { requestId } = await params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(pendingRequestDetailOptions(requestId));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PendingRequestLayout>
        <PendingRequestDetailView requestId={requestId} />
      </PendingRequestLayout>
    </HydrationBoundary>
  );
};

export default PendingRequestDetailPage;
