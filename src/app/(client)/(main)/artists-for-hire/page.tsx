import { getQueryClient } from "@/providers/get-query-client";
import { artistListOptions } from "@/gql/options/client-options";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import ArtistHireView from "@/modules/client/artist/ui/views/artist-hire-view";

const Page = () => {
  const queryClient = getQueryClient();

  void queryClient.prefetchInfiniteQuery(artistListOptions(9));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ArtistHireView />
    </HydrationBoundary>
  );
};

export default Page;
