/* import { cookies } from "next/headers";
import { getQueryClient } from "@/providers/get-query-client";
import { playlistOptions } from "@/gql/options/client-options";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import LibraryView from "@/modules/client/library/ui/views/library-view"; */

const LibraryPage = async () => {
  /* const queryClient = getQueryClient();

  const cookiess = await cookies();
  const authStorage = cookiess.get("auth-storage")?.value;
  const userId = authStorage ? JSON.parse(decodeURIComponent(authStorage)).state.user?.userId : null;

  if (userId) {
    void queryClient.prefetchInfiniteQuery(playlistOptions(userId, undefined, 11));
  } */

  /* <HydrationBoundary state={dehydrate(queryClient)}>
      <LibraryView />
    </HydrationBoundary> */

  return <div>test</div>;
};

export default LibraryPage;
