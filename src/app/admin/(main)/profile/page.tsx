"use client"

import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { useAuthStore } from "@/store";
import AdminProfileView from "@/modules/admin/profile/ui/views/admin-profile-view";
import { adminProfileOptions } from "@/gql/options/admin-options";

const ProfilePage = () => {
  const queryClient = getQueryClient();
  const { user } = useAuthStore();

  const userId = user?.userId || ""; // Get user ID from auth context

  void queryClient.prefetchQuery(adminProfileOptions(userId));
  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <AdminProfileView />
      </HydrationBoundary>
    </div>
  )
}

export default ProfilePage
