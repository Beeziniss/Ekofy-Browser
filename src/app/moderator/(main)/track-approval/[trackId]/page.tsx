import { TrackDetailView } from "@/modules/moderator/track-approval/ui/views";

interface TrackDetailPageProps {
  params: Promise<{
    trackId: string; // Keep as trackId since it's the folder name
  }>;
}

const TrackDetailPage = async ({ params }: TrackDetailPageProps) => {
  const { trackId } = await params;
  const uploadId = trackId; // Route parameter is still trackId but it's actually uploadId
  return <TrackDetailView uploadId={uploadId} />;
};

export default TrackDetailPage;
