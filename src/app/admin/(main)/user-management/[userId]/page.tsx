"use client";

import { use } from "react";
import { adminUserDetailOptions } from "@/gql/options/admin-options";
import { AdminUserDetailView } from "@/modules/admin/user-management/ui/views";
import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface UserDetailPageProps {
  params: Promise<{ userId: string }>;
}

const UserDetailPage = ({ params }: UserDetailPageProps) => {
  const { userId } = use(params);
  const queryClient = getQueryClient();

  // Prefetch user details
  void queryClient.prefetchQuery(adminUserDetailOptions(userId));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminUserDetailView userId={userId} />
    </HydrationBoundary>
  );
};

export default UserDetailPage;
