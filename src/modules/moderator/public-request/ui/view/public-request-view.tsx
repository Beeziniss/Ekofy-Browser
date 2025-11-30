import { PublicRequestLayout } from "../layout/public-request-layout";
import { PublicRequestSection } from "../section/public-request-section";

export function PublicRequestView() {
  return (
    <PublicRequestLayout title="Public Requests" description="Manage and moderate public requests">
      <PublicRequestSection />
    </PublicRequestLayout>
  );
}
