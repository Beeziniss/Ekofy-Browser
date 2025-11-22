"use client";

import React from "react";
import { ReportListView } from "@/modules/moderator/report-control/ui/view/report-list-view";
import { reportsOptions } from "@/gql/options/report-options";
import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const ReportControlPage = () => {
  const queryClient = getQueryClient();

  // Prefetch the first page of reports
  void queryClient.prefetchQuery(reportsOptions(0, 10));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
        <ReportListView />
      </div>
    </HydrationBoundary>
  );
};

export default ReportControlPage;
