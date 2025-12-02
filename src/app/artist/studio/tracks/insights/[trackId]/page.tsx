import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import TrackInsightView from "@/modules/artist/tracks/ui/views/track-insight-view";
import {
  trackInsightOptions,
  trackInsightFavoriteCountOptions,
  trackInsightFavCountOptions,
} from "@/gql/options/artist-options";

interface PageProps {
  params: Promise<{ trackId: string }>;
  searchParams: Promise<{
    timeRange?: string;
    dateFrom?: string;
    dateTo?: string;
  }>;
}

const Page = async ({ params, searchParams }: PageProps) => {
  const { trackId } = await params;
  const { dateFrom, dateTo } = await searchParams;
  const queryClient = getQueryClient();

  // Prefetch all track insight queries
  void queryClient.prefetchQuery(trackInsightOptions(trackId));
  void queryClient.prefetchQuery(trackInsightFavCountOptions(trackId, dateFrom, dateTo));
  void queryClient.prefetchQuery(trackInsightFavoriteCountOptions(trackId, dateFrom, dateTo));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TrackInsightView trackId={trackId} />
    </HydrationBoundary>
  );
};

export default Page;
