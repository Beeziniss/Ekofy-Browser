import { getQueryClient } from "@/providers/get-query-client";
import HomeView from "@/modules/client/home/ui/views/home-view";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
  trackListHomeOptions,
  categoriesChannelOptions,
  trackFavoriteOptions,
  playlistsFavoriteOptions,
} from "@/gql/options/client-options";
import { CategoryType } from "@/gql/graphql";

export default function Home() {
  const queryClient = getQueryClient();

  // Prefetch all queries for the home page sections
  void queryClient.prefetchQuery(trackListHomeOptions); // New releases
  void queryClient.prefetchQuery(categoriesChannelOptions(CategoryType.Genre, 12)); // Top categories
  void queryClient.prefetchQuery(playlistsFavoriteOptions(12)); // Playlists you'll love
  void queryClient.prefetchQuery(trackFavoriteOptions(12)); // Tracks you love

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeView />
    </HydrationBoundary>
  );
}
