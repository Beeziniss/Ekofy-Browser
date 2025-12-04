import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import TrackDetailView from "@/modules/artist/tracks/ui/views/track-detail-view";
import { artistTrackDetailOptions, categoriesOptions } from "@/gql/options/artist-options";

interface PageProps {
  params: Promise<{ trackId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { trackId } = await params;
  const queryClient = getQueryClient();

  // Prefetch both the track details and categories data
  await Promise.all([
    queryClient.prefetchQuery(artistTrackDetailOptions(trackId)),
    queryClient.prefetchQuery(categoriesOptions),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TrackDetailView trackId={trackId} />
    </HydrationBoundary>
  );
};

export default Page;
