"use client";

import { moderatorArtistsQueryOptions } from "@/gql/options/moderator-options";
import { ArtistApprovalView } from "@/modules/moderator/artist-approval/ui/views";
import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const ArtistApprovalPage = () => {
  const queryClient = getQueryClient();

  // Prefetch the first page of artists
  void queryClient.prefetchQuery(moderatorArtistsQueryOptions(0, 10, ""));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ArtistApprovalView />
    </HydrationBoundary>
  );
};

export default ArtistApprovalPage;
