import ArtistAlbumView from "@/modules/client/artist/ui/views/artist-album-view";

interface PageProps {
  params: Promise<{ artistId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { artistId } = await params;
  return <ArtistAlbumView artistId={artistId} />;
};

export default Page;
