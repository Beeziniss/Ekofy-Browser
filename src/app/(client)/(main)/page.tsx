import { getQueryClient } from "@/providers/get-query-client";
import HomeView from "@/modules/client/home/ui/views/home-view";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { trackListHomeOptions, categoriesChannelOptions } from "@/gql/options/client-options";
import { CategoryType } from "@/gql/graphql";

export default function Home() {
  const queryClient = getQueryClient();

  // Prefetch all queries for the home page sections
  void queryClient.prefetchQuery(trackListHomeOptions); // New releases
  void queryClient.prefetchQuery(categoriesChannelOptions(CategoryType.Genre, 12)); // Top categories

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeView />
    </HydrationBoundary>
  );
}
