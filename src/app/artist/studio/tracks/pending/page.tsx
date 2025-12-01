import { Suspense } from "react";
import PendingRequestsSection from "@/modules/artist/studio/ui/sections/pending-requests/pending-requests-section";
import MainLoader from "@/components/main-loader";

const PendingRequestsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<MainLoader />}>
        <PendingRequestsSection />
      </Suspense>
    </div>
  );
};

export default PendingRequestsPage;
