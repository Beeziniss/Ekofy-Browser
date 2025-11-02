"use client";

import React from "react";
import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { moderatorApprovalHistoriesOptions } from "@/gql/options/moderator-options";
import { ApprovalHistoriesView } from "@/modules/moderator/approval-histories/ui/views/approval-histories-view";

const ApprovalHistoriesPage = () => {
  const queryClient = getQueryClient();

  // Prefetch initial data
  void queryClient.prefetchQuery(moderatorApprovalHistoriesOptions(1, 10, ""));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ApprovalHistoriesView />
    </HydrationBoundary>
  );
};

export default ApprovalHistoriesPage;
