"use client";

import { useParams } from "next/navigation";
import { TrackDetailView } from "@/modules/moderator/track-approval/ui/views";

export default function TrackDetailPage() {
  const params = useParams();
  const trackId = params.trackId as string;

  return <TrackDetailView trackId={trackId} />;
}
