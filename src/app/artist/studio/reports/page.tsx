"use client";

import React from "react";
import { ArtistReportListView } from "@/modules/artist/report";
import { userReportsOptions } from "@/gql/options/user-report-options";
import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { useAuthStore } from "@/store";

const ArtistReportsPage = () => {
  const queryClient = getQueryClient();
  const { user } = useAuthStore();

  // Prefetch the first page of user reports if user is available
  if (user?.userId) {
    void queryClient.prefetchQuery(userReportsOptions(user.userId, 0, 10));
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
        <ArtistReportListView />
      </div>
    </HydrationBoundary>
  );
};

export default ArtistReportsPage;
