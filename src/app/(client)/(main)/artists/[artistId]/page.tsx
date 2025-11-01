import { artistOptions } from "@/gql/options/client-options";
import ArtistDetailView from "@/modules/client/artist/ui/views/artist-detail-view";
import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface PageProps {
  params: Promise<{ artistId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { artistId } = await params;

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(artistOptions(artistId));
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ArtistDetailView artistId={artistId} />
    </HydrationBoundary>
  );
};

export default Page;
