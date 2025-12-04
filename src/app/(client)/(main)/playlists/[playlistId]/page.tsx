import PlaylistDetailView from "@/modules/client/playlist/ui/views/playlist-detail-view";

interface PageProps {
  params: Promise<{ playlistId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { playlistId } = await params;

  return <PlaylistDetailView playlistId={playlistId} />;
};

export default Page;
