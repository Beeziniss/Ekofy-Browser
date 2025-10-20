"use client";

import { ApprovalHistoryDetailLayout } from "../layouts/approval-history-detail-layout";
import { ApprovalHistoryDetailSection } from "../section";

interface ApprovalHistoryDetailViewProps {
  historyId: string;
}

export function ApprovalHistoryDetailView({ historyId }: ApprovalHistoryDetailViewProps) {
  return (
    <ApprovalHistoryDetailLayout
      title="Approval History Detail"
      description="View detailed information about this approval record"
    >
      <ApprovalHistoryDetailSection historyId={historyId} />
    </ApprovalHistoryDetailLayout>
  );
}