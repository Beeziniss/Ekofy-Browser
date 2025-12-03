import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import AdminDashboardView from "@/modules/admin/dashboard/ui/views/admin-dashboard-view";
import { SortEnumType } from "@/gql/graphql";
import {
  totalListenersOptions,
  totalArtistsOptions,
  totalTracksOptions,
  invoiceDashboardOptions,
  trackDailyMetricsOptions,
} from "@/gql/options/dashboard-options";

const DashboardPage = async () => {
  const queryClient = getQueryClient();

  // Calculate time range for stream metrics (monthly only)
  const now = new Date();
  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

  // Prefetch stats data (these are fast and used immediately)
  await Promise.all([
    queryClient.prefetchQuery(totalListenersOptions()),
    queryClient.prefetchQuery(totalArtistsOptions()),
    queryClient.prefetchQuery(totalTracksOptions()),
    queryClient.prefetchQuery(trackDailyMetricsOptions({ createdAt: { gte: oneMonthAgo.toISOString() } })),
  ]);

  // Prefetch invoice dashboard - will be visible by default
  await queryClient.prefetchQuery(
    invoiceDashboardOptions(0, 5, undefined, [{ paidAt: SortEnumType.Desc }])
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminDashboardView />
    </HydrationBoundary>
  );
};

export default DashboardPage;

