import { ApprovalHistoryDetailView } from "@/modules/moderator/approval-histories/ui/views/approval-history-detail-view";

interface ApprovalHistoryDetailsPageProps {
  params: Promise<{
    userId: string; // Keep as userId since it's the folder name
  }>;
}

const ApprovalHistoryDetailsPage = async ({ params }: ApprovalHistoryDetailsPageProps) => {
  const { userId: historyId } = await params; // Treat it as historyId

  return <ApprovalHistoryDetailView historyId={historyId} />;
};

export default ApprovalHistoryDetailsPage;
