import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { moderatorApprovalHistoriesOptions } from "@/gql/options/moderator-options";
import { ApprovalHistoriesView } from "@/modules/moderator/approval-histories/ui/views/approval-histories-view";

const ApprovalHistoriesPage = async () => {
  const queryClient = getQueryClient();

  // Prefetch initial data with default filters
  await queryClient.prefetchQuery(moderatorApprovalHistoriesOptions(1, 10, "", "ALL", "ALL"));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ApprovalHistoriesView />
    </HydrationBoundary>
  );
};

export default ApprovalHistoriesPage;
