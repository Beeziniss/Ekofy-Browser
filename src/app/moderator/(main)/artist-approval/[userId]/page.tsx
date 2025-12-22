import ArtistDetailsView from "@/modules/moderator/artist-approval/ui/views/artist-details-view";

interface ArtistDetailsPageProps {
  params: Promise<{
    userId: string;
  }>;
}

const ArtistDetailsPage = async ({ params }: ArtistDetailsPageProps) => {
  const { userId } = await params;

  return <ArtistDetailsView userId={userId} />;
};

export default ArtistDetailsPage;
