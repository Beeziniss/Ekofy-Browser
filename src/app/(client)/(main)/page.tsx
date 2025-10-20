import { getQueryClient } from "@/providers/get-query-client";
import HomeView from "@/modules/client/home/ui/views/home-view";
import { trackListHomeOptions } from "@/gql/options/client-options";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default function Home() {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trackListHomeOptions);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeView />
    </HydrationBoundary>
  );
}
