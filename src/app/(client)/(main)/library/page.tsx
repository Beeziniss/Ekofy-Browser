import { cookies } from "next/headers";
import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import LibraryView from "@/modules/client/library/ui/views/library-view";
import { followerOptions, followingOptions, playlistOptions } from "@/gql/options/client-options";

const LibraryPage = async () => {
  const queryClient = getQueryClient();

  // Get user ID from cookies for server-side prefetching
  const cookieStore = await cookies();
  const authStorage = cookieStore.get("auth-storage")?.value;
  let userId = "";

  if (authStorage) {
    try {
      const decodedValue = decodeURIComponent(authStorage);
      const authData = JSON.parse(decodedValue);
      userId = authData.state?.user?.userId || "";
    } catch (error) {
      console.error("Failed to parse auth storage:", error);
    }
  }

  // Prefetch playlists if user is available
  if (userId) {
    void queryClient.prefetchInfiniteQuery(playlistOptions(userId, undefined, 11));
    void queryClient.prefetchQuery(followerOptions({ userId }));
    void queryClient.prefetchQuery(followingOptions({ userId }));
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LibraryView />
    </HydrationBoundary>
  );
};

export default LibraryPage;
