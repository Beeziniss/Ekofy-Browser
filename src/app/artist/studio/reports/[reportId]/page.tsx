"use client";

import React, { use } from "react";
import { ArtistReportDetailView } from "@/modules/artist/report";
import { userReportDetailOptions } from "@/gql/options/user-report-options";
import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { useAuthStore } from "@/store";

interface ArtistReportDetailPageProps {
  params: Promise<{
    reportId: string;
  }>;
}

const ArtistReportDetailPage = ({ params }: ArtistReportDetailPageProps) => {
  const resolvedParams = use(params);
  const queryClient = getQueryClient();
  const { user } = useAuthStore();

  // Prefetch report detail if user is available
  if (user?.userId) {
    void queryClient.prefetchQuery(
      userReportDetailOptions(resolvedParams.reportId, user.userId)
    );
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
        <ArtistReportDetailView reportId={resolvedParams.reportId} />
      </div>
    </HydrationBoundary>
  );
};

export default ArtistReportDetailPage;
