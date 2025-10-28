"use client";

import { useParams } from "next/navigation";
import { TrackDetailView } from "@/modules/moderator/track-approval/ui/views";

export default function TrackDetailPage() {
  const params = useParams();
  const uploadId = params.trackId as string; // Route parameter is still trackId but it's actually uploadId

  return <TrackDetailView uploadId={uploadId} />;
}
