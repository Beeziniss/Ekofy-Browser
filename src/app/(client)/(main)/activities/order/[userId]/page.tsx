import { getQueryClient } from "@/providers/get-query-client";
import { orderPackageOptions } from "@/gql/options/client-options";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import ActivityOrderView from "@/modules/client/activities/ui/views/activity-order-view";

interface PageProps {
  params: Promise<{ userId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { userId } = await params;
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(orderPackageOptions({ currentUserId: userId, skip: 0, take: 10, isArtist: false }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ActivityOrderView userId={userId} />
    </HydrationBoundary>
  );
};

export default Page;
