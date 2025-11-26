import { TrackApprovalLayout } from "../layout";
import { TrackApprovalSection } from "../section";

export function TrackApprovalView() {
  return (
    <TrackApprovalLayout title="Track Approval Center" description="Manage track upload requests and approvals">
      <TrackApprovalSection />
    </TrackApprovalLayout>
  );
}
