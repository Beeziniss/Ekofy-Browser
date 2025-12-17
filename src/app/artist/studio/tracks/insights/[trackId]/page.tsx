import TrackInsightView from "@/modules/artist/tracks/ui/views/track-insight-view";

interface PageProps {
  params: Promise<{ trackId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { trackId } = await params;

  return <TrackInsightView trackId={trackId} />;
};

export default Page;
