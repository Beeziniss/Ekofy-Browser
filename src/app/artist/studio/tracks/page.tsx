import TrackView from "@/modules/artist/studio/ui/views/track-view";
import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React from "react";

const Page = () => {
  // TODO: prefetch data later
  const queryClient = getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TrackView />
    </HydrationBoundary>
  );
};

export default Page;
