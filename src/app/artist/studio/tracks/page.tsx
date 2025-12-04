import { getQueryClient } from "@/providers/get-query-client";
import { trackListOptions } from "@/gql/options/artist-options";
import TrackView from "@/modules/artist/studio/ui/views/track-view";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const Page = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(trackListOptions);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TrackView />
    </HydrationBoundary>
  );
};

export default Page;
