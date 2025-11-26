"use client";

import { ReportLayout } from "../layouts";
import { ReportDetailSection } from "../sections";

interface ReportDetailViewProps {
  reportId: string;
}

export function ReportDetailView({ reportId }: ReportDetailViewProps) {
  return (
    <ReportLayout
      title="Report Details"
      description="View detailed information about violation reports"
    >
      <ReportDetailSection reportId={reportId} />
    </ReportLayout>
  );
}