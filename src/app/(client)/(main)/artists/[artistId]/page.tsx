import ArtistDetailView from "@/modules/client/artist/ui/views/artist-detail-view";

interface PageProps {
  params: Promise<{ artistId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { artistId } = await params;
  return <ArtistDetailView artistId={artistId} />;
};

export default Page;
