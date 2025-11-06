import { getQueryClient } from "@/providers/get-query-client";
import HomeView from "@/modules/client/home/ui/views/home-view";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { playlistsHomeOptions, trackListHomeOptions } from "@/gql/options/client-options";

export default function Home() {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(playlistsHomeOptions);
  void queryClient.prefetchQuery(trackListHomeOptions);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeView />
    </HydrationBoundary>
  );
}
