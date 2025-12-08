import RecommendedTracksView from "@/modules/client/track/ui/views/recommended-tracks-view";

interface PageProps {
  params: Promise<{ trackId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { trackId } = await params;

  return <RecommendedTracksView trackId={trackId} />;
};

export default Page;
