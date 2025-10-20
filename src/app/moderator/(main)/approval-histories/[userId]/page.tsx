"use client";

import React from "react";
import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { use } from "react";
import { moderatorApprovalHistoryDetailOptions } from "@/gql/options/moderator-options";
import { ApprovalHistoryDetailView } from "@/modules/moderator/approval-histories/ui/views/approval-history-detail-view";

interface ApprovalHistoryDetailsPageProps {
  params: Promise<{
    userId: string;
  }>;
}

const ApprovalHistoryDetailsPage = ({ params }: ApprovalHistoryDetailsPageProps) => {
  const resolvedParams = use(params);
  const queryClient = getQueryClient();

  // Prefetch approval history detail data
  void queryClient.prefetchQuery(
    moderatorApprovalHistoryDetailOptions(resolvedParams.userId)
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ApprovalHistoryDetailView historyId={resolvedParams.userId} />
    </HydrationBoundary>
  );
};

export default ApprovalHistoryDetailsPage;
