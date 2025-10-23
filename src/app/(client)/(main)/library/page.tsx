import { cookies } from "next/headers";
import { playlistOptions } from "@/gql/options/client-options";
import LibraryView from "@/modules/client/library/ui/views/library-view";
import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

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
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LibraryView />
    </HydrationBoundary>
  );
};

export default LibraryPage;
