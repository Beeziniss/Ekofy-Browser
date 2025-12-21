import ArtistPLaylistView from "@/modules/client/artist/ui/views/artist-playlist-view";

interface PageProps {
  params: Promise<{ artistId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { artistId } = await params;

  return <ArtistPLaylistView artistId={artistId} />;
};

export default Page;
