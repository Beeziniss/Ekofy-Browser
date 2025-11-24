import { listenerOptions, orderPackageOptions } from "@/gql/options/client-options";
import ActivityConversationView from "@/modules/client/activities/ui/views/activity-conversation-view";
import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface PageProps {
  params: Promise<{ userId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { userId } = await params;
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(orderPackageOptions({ userId, skip: 0, take: 10 }));
  void queryClient.prefetchQuery(listenerOptions(userId, userId));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ActivityConversationView userId={userId} />
    </HydrationBoundary>
  );
};

export default Page;
