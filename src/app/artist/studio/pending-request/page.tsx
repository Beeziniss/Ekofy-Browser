import { PendingRequestLayout } from "@/modules/artist/pending-request/ui/layout/pending-request-layout";
import { PendingRequestListView } from "@/modules/artist/pending-request/ui/view/pending-request-list-view";

const PendingRequestPage = async () => {
  return (
    <PendingRequestLayout>
      <PendingRequestListView />
    </PendingRequestLayout>
  );
};

export default PendingRequestPage;
