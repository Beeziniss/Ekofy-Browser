"use client";

import { useState } from "react";
import { ProcessReportDialog } from "../components/process-report-dialog";
import { ReportDetailLayout } from "../layout/report-detail-layout";
import { ReportDetailHeaderSection } from "../section/report-detail-header-section";
import { ReportDetailInfoSection } from "../section/report-detail-info-section";
import { ReportDetailSidebarSection } from "../section/report-detail-sidebar-section";
import { useQuery } from "@tanstack/react-query";
import { reportDetailOptions } from "@/gql/options/report-options";
import { notFound } from "next/navigation";
import MainLoader from "@/components/main-loader";

interface ReportDetailViewProps {
  reportId: string;
}

export function ReportDetailView({ reportId }: ReportDetailViewProps) {
  const [processDialogOpen, setProcessDialogOpen] = useState(false);

  // Fetch report detail on client-side with authentication
  const { data: report, isLoading, isError } = useQuery(reportDetailOptions(reportId));

  // Loading state
  if (isLoading) {
    return <MainLoader />;
  }

  // Error or not found
  if (isError || !report) {
    notFound();
  }

  return (
    <>
      <ReportDetailLayout
        header={
          <ReportDetailHeaderSection
            report={report}
            onProcessClick={() => setProcessDialogOpen(true)}
          />
        }
        mainContent={<ReportDetailInfoSection report={report} />}
        sidebar={<ReportDetailSidebarSection report={report} />}
      />

      {/* Process Report Dialog */}
      <ProcessReportDialog
        reportId={report.id}
        open={processDialogOpen}
        onOpenChange={setProcessDialogOpen}
      />
    </>
  );
}
