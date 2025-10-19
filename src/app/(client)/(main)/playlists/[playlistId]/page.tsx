import {
  playlistDetailOptions,
  playlistDetailTrackListOptions,
} from "@/gql/options/client-options";
import PlaylistDetailView from "@/modules/client/playlist/ui/views/playlist-detail-view";
import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface PageProps {
  params: Promise<{ playlistId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { playlistId } = await params;
  const queryClient = getQueryClient();

  // Prefetch both playlist details and track list (both regular and infinite)
  void queryClient.prefetchQuery(playlistDetailOptions(playlistId));
  void queryClient.prefetchQuery(playlistDetailTrackListOptions(playlistId));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PlaylistDetailView playlistId={playlistId} />
    </HydrationBoundary>
  );
};

export default Page;
