import { ApprovalHistoriesLayout } from "../layouts/approval-histories-layout";
import { ApprovalHistoriesSection } from "../section";

export function ApprovalHistoriesView() {
  return (
    <ApprovalHistoriesLayout title="Approval Histories" description="View and manage approval history records">
      <ApprovalHistoriesSection />
    </ApprovalHistoriesLayout>
  );
}
