import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import TrackInsightView from "@/modules/artist/tracks/ui/views/track-insight-view";
import { trackInsightOptions } from "@/gql/options/artist-options";

interface PageProps {
  params: Promise<{ trackId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { trackId } = await params;
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trackInsightOptions(trackId));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TrackInsightView trackId={trackId} />
    </HydrationBoundary>
  );
};

export default Page;
