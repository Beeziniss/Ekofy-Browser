import {
  trackCommentsOptions,
  trackDetailOptions,
} from "@/gql/options/client-options";
import TrackDetailView from "@/modules/client/track/ui/views/track-detail-view";
import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface PageProps {
  params: Promise<{ trackId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { trackId } = await params;

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trackDetailOptions(trackId));
  void queryClient.prefetchQuery(trackCommentsOptions(trackId));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TrackDetailView trackId={trackId} />
    </HydrationBoundary>
  );
};

export default Page;
