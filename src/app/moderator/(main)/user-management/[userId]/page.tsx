import { moderatorUserDetailOptions } from "@/gql/options/moderator-options";
import { ModeratorUserDetailView } from "@/modules/moderator/user-management/ui/views/moderator-user-detail-view";
import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface PageProps {
  params: Promise<{ userId: string }>;
}

const ModeratorUserDetailPage = async ({ params }: PageProps) => {
  const { userId } = await params;
  const queryClient = getQueryClient();

  // Prefetch user detail data
  await queryClient.prefetchQuery(moderatorUserDetailOptions(userId));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ModeratorUserDetailView userId={userId} />
    </HydrationBoundary>
  );
};

export default ModeratorUserDetailPage;
