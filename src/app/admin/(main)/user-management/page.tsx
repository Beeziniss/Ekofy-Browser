"use client";

import { adminUsersQueryOptions } from "@/gql/options/admin-options";
import { AdminUserManagement } from "@/modules/admin/user-management/ui/views";
import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const UserManagementPage = () => {
  const queryClient = getQueryClient();

  // Prefetch the first page of users
  void queryClient.prefetchQuery(adminUsersQueryOptions(1, 10, ""));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminUserManagement />
    </HydrationBoundary>
  );
};

export default UserManagementPage;
