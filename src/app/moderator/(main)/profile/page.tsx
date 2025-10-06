"use client"

import { moderatorProfileOptions } from "@/gql/options/moderator-options";
import ModeratorProfileView from "@/modules/moderator/profile/ui/views/moderator-profile-view";
import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { useAuthStore } from "@/store";

const ProfilePage = () => {
  const queryClient = getQueryClient();
  const { user } = useAuthStore();

  const userId = user?.userId || ""; // Get user ID from auth context

  void queryClient.prefetchQuery(moderatorProfileOptions(userId));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ModeratorProfileView />
    </HydrationBoundary>
  );
};

export default ProfilePage;

