import { trackListOptions } from "@/gql/options/artist-options";
import TrackView from "@/modules/artist/studio/ui/views/track-view";
import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React from "react";

const Page = () => {
  // TODO: prefetch data later
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trackListOptions);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TrackView />
    </HydrationBoundary>
  );
};

export default Page;
