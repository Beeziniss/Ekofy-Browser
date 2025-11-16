import { headers } from "next/headers";
import { getQueryClient } from "@/providers/get-query-client";
import { playlistOptions } from "@/gql/options/client-options";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import LibraryView from "@/modules/client/library/ui/views/library-view";

const LibraryPage = async () => {
  const queryClient = getQueryClient();
  const userId = (await headers()).get("x-user-id");

  // Prefetch playlists if user is available
  if (userId) {
    void queryClient.prefetchInfiniteQuery(playlistOptions(userId, undefined, 11));
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LibraryView />
    </HydrationBoundary>
  );
};

export default LibraryPage;
