import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { moderatorUsersQueryOptions } from "@/gql/options/moderator-options";
import { UserManagementModerator } from "@/modules/moderator/user-management/ui/views/moderator-user-management-view";

const ModeratorUserManagementPage = async () => {
  const queryClient = getQueryClient();

  // Prefetch the first page of users
  await queryClient.prefetchQuery(moderatorUsersQueryOptions(1, 10, ""));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserManagementModerator />
    </HydrationBoundary>
  );
};

export default ModeratorUserManagementPage;
