"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { moderatorUserCreatedByOptions } from "@/gql/options/moderator-options";
import {
  useApproveTrackWithFeedback,
  useRejectTrackWithFeedback,
} from "@/gql/client-mutation-options/moderator-mutation";
import { TrackUploadRequest } from "@/types/approval-track";
import {
  TrackInfoCard,
  TrackCategoriesCard,
  ArtistsContributorsCard,
  WorkRecordingDetailsCard,
  LegalDocumentsCard,
  TrackDetailSidebar,
  ApproveTrackDialog,
  RejectTrackDialog,
} from "../components";
import { toast } from "sonner";

interface TrackDetailSectionProps {
  track: TrackUploadRequest;
  onDownloadOriginal: () => void;
}

export function TrackDetailSection({ track, onDownloadOriginal }: TrackDetailSectionProps) {
  const router = useRouter();

  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  // Fetch user information by createdBy ID using query options
  const { data: createdByUser, isLoading: isLoadingUser } = useQuery(moderatorUserCreatedByOptions(track.createdBy));

  // Use mutation hooks with built-in success/error handling
  const approveMutation = useApproveTrackWithFeedback();
  const rejectMutation = useRejectTrackWithFeedback();

  const handleApproveConfirm = async () => {
    try {
      await approveMutation.mutateAsync(track.id);
      toast.success("Track approved successfully");
      router.push("/moderator/track-approval");
    } catch (error) {
      toast.error("Failed to approve track");
      console.error("Failed to approve track:", error);
    }
  };

  const handleRejectConfirm = async (reasonReject: string) => {
    try {
      await rejectMutation.mutateAsync({
        uploadId: track.id,
        reasonReject,
      });
      toast.success("Track rejected successfully");
      router.push("/moderator/track-approval");
    } catch (error) {
      toast.error("Failed to reject track");
      console.error("Failed to reject track:", error);
    }
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/moderator/track-approval")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to List
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Track Review</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Track Information */}
          <TrackInfoCard track={track} createdByUser={createdByUser} isLoadingUser={isLoadingUser} />

          {/* Track Categories with Tags */}
          <TrackCategoriesCard categoryIds={track.track.categoryIds || []} tags={track.track.tags || []} />

          {/* Artists & Contributors */}
          <ArtistsContributorsCard track={track} />

          {/* Work & Recording Details */}
          <WorkRecordingDetailsCard track={track} />

          {/* Legal Documents */}
          <div id="legal-documents">
            <LegalDocumentsCard track={track} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <TrackDetailSidebar
            onDownloadOriginal={onDownloadOriginal}
            onApprove={() => setApproveDialogOpen(true)}
            onReject={() => setRejectDialogOpen(true)}
            isApproving={approveMutation.isPending}
            isRejecting={rejectMutation.isPending}
          />
        </div>
      </div>

      {/* Approve Dialog */}
      <ApproveTrackDialog
        open={approveDialogOpen}
        onOpenChange={setApproveDialogOpen}
        trackName={track.track.name}
        artistName={track.mainArtists?.items?.map((artist) => artist.stageName).join(", ") || "Unknown Artist"}
        onConfirm={handleApproveConfirm}
        isLoading={approveMutation.isPending}
      />

      {/* Reject Dialog */}
      <RejectTrackDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        trackName={track.track.name}
        artistName={track.mainArtists?.items?.map((artist) => artist.stageName).join(", ") || "Unknown Artist"}
        onConfirm={handleRejectConfirm}
        isLoading={rejectMutation.isPending}
      />
    </div>
  );
}
