import { moderatorUsersQueryOptions } from "@/gql/options/moderator-options";
import { UserManagementModerator } from "@/modules/moderator/user-management/ui/views/moderator-user-management-view";
import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default function ModeratorUserManagementPage() {
  const queryClient = getQueryClient();

  // Prefetch the first page of users
  void queryClient.prefetchQuery(moderatorUsersQueryOptions(1, 10, ""));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserManagementModerator />
    </HydrationBoundary>
  );
}
