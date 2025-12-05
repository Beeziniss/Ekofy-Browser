"use client";

import { useAuthStore } from "@/store";
import { ReportLayout } from "../layouts";
import { ReportDetailSection } from "../sections";
import { usePrefetchQuery } from "@tanstack/react-query";
import { userReportDetailOptions } from "@/gql/options/user-report-options";

interface ReportDetailViewProps {
  reportId: string;
}

export function ReportDetailView({ reportId }: ReportDetailViewProps) {
  const { user } = useAuthStore();

  // Prefetch report detail if user is available
  usePrefetchQuery(userReportDetailOptions(reportId, user!.userId));

  return (
    <ReportLayout
      title="Report Details"
      description="View detailed information about violation reports"
      backHref="/profile/reports"
      backLabel="Back to List"
    >
      <ReportDetailSection reportId={reportId} />
    </ReportLayout>
  );
}
