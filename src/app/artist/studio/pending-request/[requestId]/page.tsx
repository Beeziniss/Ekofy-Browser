import { PendingRequestLayout } from "@/modules/artist/pending-request/ui/layout/pending-request-layout";
import { PendingRequestDetailView } from "@/modules/artist/pending-request/ui/view/pending-request-detail-view";

interface PendingRequestDetailPageProps {
  params: Promise<{
    requestId: string;
  }>;
}

const PendingRequestDetailPage = async ({ params }: PendingRequestDetailPageProps) => {
  const { requestId } = await params;
  return (
    <PendingRequestLayout>
      <PendingRequestDetailView requestId={requestId} />
    </PendingRequestLayout>
  );
};

export default PendingRequestDetailPage;
