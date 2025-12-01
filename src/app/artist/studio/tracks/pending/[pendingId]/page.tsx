import { Suspense } from "react";
import { PendingRequestDetailSection } from "@/modules/artist/studio/ui/sections/pending-requests/pending-request-detail-section";
import MainLoader from "@/components/main-loader";

interface PendingRequestDetailPageProps {
  params: Promise<{ pendingId: string }>;
}

const PendingRequestDetailPage = async ({ params }: PendingRequestDetailPageProps) => {
  const { pendingId } = await params;

  return (
    <Suspense fallback={<MainLoader />}>
      <PendingRequestDetailSection uploadId={pendingId} />
    </Suspense>
  );
};

export default PendingRequestDetailPage;
