import { moderatorArtistDetailsQueryOptions } from "@/gql/options/moderator-options";
import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import ArtistDetailsView from "@/modules/moderator/artist-approval/ui/views/artist-details-view";

interface ArtistDetailsPageProps {
  params: Promise<{
    userId: string;
  }>;
}

const ArtistDetailsPage = async ({ params }: ArtistDetailsPageProps) => {
  const resolvedParams = await params;
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
