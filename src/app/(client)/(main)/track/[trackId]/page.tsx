import TrackDetailView from "@/modules/client/track/ui/views/track-detail-view";

interface PageProps {
  params: Promise<{ trackId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { trackId } = await params;

  return <TrackDetailView trackId={trackId} />;
};

export default Page;
