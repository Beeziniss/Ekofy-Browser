import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import TrackInsightView from "@/modules/artist/tracks/ui/views/track-insight-view";
import { trackInsightOptions, trackInsightAnalyticsOptions } from "@/gql/options/artist-options";

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

  // Prefetch both the basic track insight and analytics data
  void queryClient.prefetchQuery(trackInsightOptions(trackId));
  void queryClient.prefetchQuery(trackInsightAnalyticsOptions(trackId, dateFrom, dateTo));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TrackInsightView trackId={trackId} />
    </HydrationBoundary>
  );
};

export default Page;
