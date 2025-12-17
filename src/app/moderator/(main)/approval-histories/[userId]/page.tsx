import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { moderatorApprovalHistoryDetailOptions } from "@/gql/options/moderator-options";
import { ApprovalHistoryDetailView } from "@/modules/moderator/approval-histories/ui/views/approval-history-detail-view";

interface ApprovalHistoryDetailsPageProps {
  params: Promise<{
    userId: string; // Keep as userId since it's the folder name
  }>;
}

const ApprovalHistoryDetailsPage = async ({ params }: ApprovalHistoryDetailsPageProps) => {
  const { userId: historyId } = await params; // Treat it as historyId
  const queryClient = getQueryClient();

  // Prefetch approval history detail data
  await queryClient.prefetchQuery(moderatorApprovalHistoryDetailOptions(historyId));
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ApprovalHistoryDetailView historyId={historyId} />
    </HydrationBoundary>
  );
};

export default ApprovalHistoryDetailsPage;
