import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { moderatorArtistDetailsQueryOptions } from "@/gql/options/moderator-options";
import ArtistDetailsView from "@/modules/moderator/artist-approval/ui/views/artist-details-view";

interface ArtistDetailsPageProps {
  params: Promise<{
    userId: string;
  }>;
}

const ArtistDetailsPage = async ({ params }: ArtistDetailsPageProps) => {
  const { userId } = await params;
  const queryClient = getQueryClient();

  // Prefetch artist details
  await queryClient.prefetchQuery(moderatorArtistDetailsQueryOptions(userId));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ArtistDetailsView userId={userId} />
    </HydrationBoundary>
  );
};

export default ArtistDetailsPage;
