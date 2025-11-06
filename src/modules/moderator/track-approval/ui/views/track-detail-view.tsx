"use client";

import { useQuery } from "@tanstack/react-query";
import { moderatorTrackDetailOptions, moderatorTrackOriginalFileOptions } from "@/gql/options/moderator-options";
import { TrackDetailViewProps } from "@/types/approval-track";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { TrackDetailLayout } from "../layout";
import { TrackDetailSection } from "../section";

export function TrackDetailView({ uploadId }: TrackDetailViewProps) {
  const router = useRouter();

  const { data: track, isLoading, error } = useQuery(moderatorTrackDetailOptions(uploadId));

  const { data: originalFileUrl } = useQuery(moderatorTrackOriginalFileOptions(uploadId));

  const handleDownloadOriginal = () => {
    if (originalFileUrl) {
      const link = document.createElement("a");
      link.href = originalFileUrl;
      link.download = `${track?.track.name || "track"}_original.mp3`;
      link.click();
    }
  };

  if (isLoading) {
    return (
      <TrackDetailLayout>
        <div className="container mx-auto space-y-6 p-6">
          <div className="flex items-center gap-4">
            <div className="bg-muted h-8 w-8 animate-pulse rounded" />
            <div className="bg-muted h-8 w-48 animate-pulse rounded" />
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="bg-muted h-96 animate-pulse rounded-lg" />
              <div className="bg-muted h-64 animate-pulse rounded-lg" />
            </div>
            <div className="space-y-4">
              <div className="bg-muted h-32 animate-pulse rounded-lg" />
              <div className="bg-muted h-48 animate-pulse rounded-lg" />
            </div>
          </div>
        </div>
      </TrackDetailLayout>
    );
  }

  if (error || !track) {
    return (
      <TrackDetailLayout>
        <div className="container mx-auto p-6">
          <div className="border-destructive/20 bg-destructive/10 rounded-lg border p-4">
            <p className="text-destructive">Failed to load track details. Please try again.</p>
            <Button variant="outline" onClick={() => router.push("/moderator/track-approval")} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Track Approval
            </Button>
          </div>
        </div>
      </TrackDetailLayout>
    );
  }

  return (
    <TrackDetailLayout>
      <TrackDetailSection track={track} onDownloadOriginal={handleDownloadOriginal} />
    </TrackDetailLayout>
  );
}
