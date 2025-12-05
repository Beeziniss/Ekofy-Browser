import ArtistDetailServiceView from "@/modules/client/artist/ui/views/artist-detail-service-view";

interface PageProps {
  params: Promise<{ artistId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { artistId } = await params;
  return <ArtistDetailServiceView artistId={artistId} />;
};

export default Page;
