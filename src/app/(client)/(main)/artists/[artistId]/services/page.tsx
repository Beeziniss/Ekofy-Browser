import { getQueryClient } from "@/providers/get-query-client";
import { servicePackageOptions } from "@/gql/options/client-options";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import ArtistDetailServiceView from "@/modules/client/artist/ui/views/artist-detail-service-view";

interface PageProps {
  params: Promise<{ artistId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { artistId } = await params;
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(servicePackageOptions(artistId));
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ArtistDetailServiceView artistId={artistId} />
    </HydrationBoundary>
  );
};

export default Page;
