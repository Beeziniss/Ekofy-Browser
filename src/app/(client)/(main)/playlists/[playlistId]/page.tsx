import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import PlaylistDetailView from "@/modules/client/playlist/ui/views/playlist-detail-view";
import { playlistDetailOptions, playlistDetailTrackListOptions } from "@/gql/options/client-options";

interface PageProps {
  params: Promise<{ playlistId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { playlistId } = await params;
  const queryClient = getQueryClient();

  // Prefetch both playlist details and track list (both regular and infinite)
  await Promise.all([
    queryClient.prefetchQuery(playlistDetailOptions(playlistId)),
    queryClient.prefetchQuery(playlistDetailTrackListOptions(playlistId)),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PlaylistDetailView playlistId={playlistId} />
    </HydrationBoundary>
  );
};

export default Page;
