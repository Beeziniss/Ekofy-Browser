"use client";

import React, { use } from "react";
import { ReportDetailView } from "@/modules/moderator/report-control/ui/view/report-detail-view";
import { reportDetailOptions } from "@/gql/options/report-options";
import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface ReportDetailPageProps {
  params: Promise<{
    reportId: string;
  }>;
}

const ReportDetailPage = ({ params }: ReportDetailPageProps) => {
  const resolvedParams = use(params);
  const queryClient = getQueryClient();

  // Prefetch report detail
  void queryClient.prefetchQuery(reportDetailOptions(resolvedParams.reportId));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
        <ReportDetailView reportId={resolvedParams.reportId} />
      </div>
    </HydrationBoundary>
  );
};

export default ReportDetailPage;
