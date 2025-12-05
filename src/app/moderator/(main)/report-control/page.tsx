import { reportsOptions } from "@/gql/options/report-options";
import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ReportListView } from "@/modules/moderator/report-control/ui/view/report-list-view";

const ReportControlPage = async () => {
  const queryClient = getQueryClient();

  // Prefetch the first page of reports
  await queryClient.prefetchQuery(reportsOptions(0, 10));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ReportListView />
    </HydrationBoundary>
  );
};

export default ReportControlPage;
