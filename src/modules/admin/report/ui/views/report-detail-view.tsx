"use client";

import { ReportDetailLayout } from "../layouts/report-detail-layout";
import { ReportDetailHeaderSection } from "../sections/report-detail-header-section";
import { ReportDetailInfoSection } from "../sections/report-detail-info-section";
import { ReportDetailSidebarSection } from "../sections/report-detail-sidebar-section";
import { useQuery } from "@tanstack/react-query";
import { reportDetailOptions } from "@/gql/options/report-options";
import { notFound } from "next/navigation";
import MainLoader from "@/components/main-loader";

interface ReportDetailViewProps {
  reportId: string;
}

export function ReportDetailView({ reportId }: ReportDetailViewProps) {
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
    <ReportDetailLayout
      header={<ReportDetailHeaderSection report={report} />}
      mainContent={<ReportDetailInfoSection report={report} />}
      sidebar={<ReportDetailSidebarSection report={report} />}
    />
  );
}
