import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { moderatorApprovalHistoryDetailOptions } from "@/gql/options/moderator-options";
import { ApprovalHistoryDetailView } from "@/modules/moderator/approval-histories/ui/views/approval-history-detail-view";

interface ApprovalHistoryDetailsPageProps {
  params: Promise<{
    userId: string;
  }>;
}

const ApprovalHistoryDetailsPage = async ({ params }: ApprovalHistoryDetailsPageProps) => {
  const { userId } = await params;
  const queryClient = getQueryClient();

  // Prefetch approval history detail data
  await queryClient.prefetchQuery(moderatorApprovalHistoryDetailOptions(userId));
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ApprovalHistoryDetailView historyId={userId} />
    </HydrationBoundary>
  );
};

export default ApprovalHistoryDetailsPage;
