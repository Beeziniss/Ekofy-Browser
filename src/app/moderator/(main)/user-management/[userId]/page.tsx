import { moderatorUserDetailOptions } from "@/gql/options/moderator-options";
import { ModeratorUserDetailView } from "@/modules/moderator/user-management/ui/views/moderator-user-detail-view";
import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { use } from "react";

interface PageProps {
  params: Promise<{ userId: string }>;
}

export default function ModeratorUserDetailPage({ params }: PageProps) {
  const { userId } = use(params);
    const queryClient = getQueryClient();

  // Prefetch user detail data
  void queryClient.prefetchQuery(moderatorUserDetailOptions(userId));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ModeratorUserDetailView userId={userId} />
    </HydrationBoundary>
  );
}