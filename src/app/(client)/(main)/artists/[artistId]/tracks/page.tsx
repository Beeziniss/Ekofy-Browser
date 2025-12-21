import ArtistTrackView from "@/modules/client/artist/ui/views/artist-track-view";

interface PageProps {
  params: Promise<{ artistId: string }>;
}
const Page = async ({ params }: PageProps) => {
  const { artistId } = await params;
  return <ArtistTrackView artistId={artistId} />;
};

export default Page;
