import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { categoriesChannelOptions } from "@/gql/options/client-options";
import { CategoryType } from "@/gql/graphql";
import ChannelsView from "@/modules/client/channels/ui/views/channels-view";

const Page = async () => {
  const queryClient = getQueryClient();

  // Prefetch both Genres and Mood categories
  await Promise.all([
    queryClient.prefetchQuery(categoriesChannelOptions(CategoryType.Genre, 50)),
    queryClient.prefetchQuery(categoriesChannelOptions(CategoryType.Mood, 50)),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ChannelsView />
    </HydrationBoundary>
  );
};

export default Page;
