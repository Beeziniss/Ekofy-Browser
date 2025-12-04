import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import TrackDetailView from "@/modules/client/track/ui/views/track-detail-view";
import { trackCommentsOptions, trackDetailOptions } from "@/gql/options/client-options";

interface PageProps {
  params: Promise<{ trackId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { trackId } = await params;

  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery(trackDetailOptions(trackId)),
    queryClient.prefetchQuery(trackCommentsOptions(trackId)),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TrackDetailView trackId={trackId} />
    </HydrationBoundary>
  );
};

export default Page;
