"use client"

import { use } from "react";
import { moderatorArtistDetailsQueryOptions } from "@/gql/options/moderator-options";
import { ArtistDetailsView } from "@/modules/moderator/artist-approval/ui/views";
import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface ArtistDetailsPageProps {
  params: Promise<{
    userId: string;
  }>;
}

const ArtistDetailsPage = ({ params }: ArtistDetailsPageProps) => {
  const resolvedParams = use(params);
  const queryClient = getQueryClient();

  // Prefetch artist details
  void queryClient.prefetchQuery(moderatorArtistDetailsQueryOptions(resolvedParams.userId));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ArtistDetailsView userId={resolvedParams.userId} />
    </HydrationBoundary>
  );
};

export default ArtistDetailsPage;