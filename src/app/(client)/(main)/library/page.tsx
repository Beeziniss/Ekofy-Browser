import { playlistOptions } from "@/gql/options/client-options";
import LibraryView from "@/modules/client/library/ui/views/library-view";
import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const LibraryPage = () => {
  const queryClient = getQueryClient();

  void queryClient.prefetchInfiniteQuery(playlistOptions);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LibraryView />
    </HydrationBoundary>
  );
};

export default LibraryPage;
