import { getQueryClient } from "@/providers/get-query-client";
import HomeView from "@/modules/client/home/ui/views/home-view";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { trackListHomeOptions, categoriesChannelOptions, playlistsHomeOptions } from "@/gql/options/client-options";
import { CategoryType } from "@/gql/graphql";

const Home = async () => {
  const queryClient = getQueryClient();

  // Prefetch all queries for the home page sections
  await Promise.all([
    queryClient.prefetchQuery(trackListHomeOptions), // New releases
    queryClient.prefetchQuery(categoriesChannelOptions(CategoryType.Genre, 12)), // Top categories
    queryClient.prefetchQuery(playlistsHomeOptions), // Playlists you'll love
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeView />
    </HydrationBoundary>
  );
};

export default Home;
