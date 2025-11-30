"use client";

import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { useAuthStore } from "@/store";
import AdminDashboardView from "@/modules/admin/dashboard/ui/views/admin-dashboard-view";
import { adminProfileOptions } from "@/gql/options/admin-options";

const DashboardPage = () => {
  const queryClient = getQueryClient();
  const { user, isAuthenticated } = useAuthStore();

  const userId = user?.userId;

  // Prefetch user data for dashboard
  if (isAuthenticated && userId) {
    void queryClient.prefetchQuery(adminProfileOptions(userId));
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminDashboardView />
    </HydrationBoundary>
  );
};

export default DashboardPage;
