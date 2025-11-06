"use client";

import { useQuery } from "@tanstack/react-query";
import { moderatorApprovalHistoryDetailOptions } from "@/gql/options/moderator-options";
import { ApprovalHistoryBasicInfo } from "../component/approval-history-basic-info";
import { ApprovalHistoryApproverInfo } from "../component/approval-history-approver-info";
import { ApprovalHistorySnapshotInfo } from "../component/approval-history-snapshot-info";

interface ApprovalHistoryDetailSectionProps {
  historyId: string;
}

export function ApprovalHistoryDetailSection({ historyId }: ApprovalHistoryDetailSectionProps) {
  const { data: history, isLoading, error } = useQuery(moderatorApprovalHistoryDetailOptions(historyId));

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (error || !history) {
    return (
      <div className="flex h-32 items-center justify-center">
        <p className="text-destructive">Error loading approval history details</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ApprovalHistoryBasicInfo history={history} />
        <ApprovalHistoryApproverInfo approvedBy={history.approvedBy} />
      </div>

      <ApprovalHistorySnapshotInfo snapshot={history.snapshot} />
    </div>
  );
}
