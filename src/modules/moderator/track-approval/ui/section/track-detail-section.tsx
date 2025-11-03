"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { moderatorUserCreatedByOptions } from "@/gql/options/moderator-options";
import { useApproveTrackWithFeedback, useRejectTrackWithFeedback } from "@/gql/client-mutation-options/moderator-mutation";
import { TrackUploadRequest } from "@/types/approval-track";
import {
  TrackInfoCard,
  ArtistsContributorsCard,
  WorkRecordingDetailsCard,
  LegalDocumentsCard,
  TrackDetailSidebar,
  ApproveTrackDialog,
  RejectTrackDialog
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
  const { data: createdByUser, isLoading: isLoadingUser } = useQuery(
    moderatorUserCreatedByOptions(track.createdBy)
  );

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
        reasonReject 
      });
      toast.success("Track rejected successfully");
      router.push("/moderator/track-approval");
    } catch (error) {
      toast.error("Failed to reject track");
      console.error("Failed to reject track:", error);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => router.push("/moderator/track-approval")}
          >
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
        <div className="lg:col-span-2 space-y-6">
          {/* Track Information */}
          <TrackInfoCard 
            track={track} 
            createdByUser={createdByUser}
            isLoadingUser={isLoadingUser}
          />

          {/* Artists & Contributors */}
          <ArtistsContributorsCard track={track} />

          {/* Work & Recording Details */}
          <WorkRecordingDetailsCard track={track} />

          {/* Legal Documents */}
          <div id="legal-documents">
            <LegalDocumentsCard track={track} />
          </div>

          {/* Action Buttons */}
          <div className="bg-black/90 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-center gap-3">
              <Button 
                variant="outline"
                className="px-8 py-3 h-12 text-red-400 border-red-400 hover:bg-red-400/10 bg-transparent"
                onClick={() => setRejectDialogOpen(true)}
                disabled={approveMutation.isPending || rejectMutation.isPending}
              >
                <XCircle className="mr-2 h-5 w-5" />
                {rejectMutation.isPending ? "Rejecting..." : "Reject Track"}
              </Button>
              <Button 
                className="px-8 py-3 h-12 bg-green-600 hover:bg-green-700 text-white"
                onClick={() => setApproveDialogOpen(true)}
                disabled={approveMutation.isPending || rejectMutation.isPending}
              >
                <CheckCircle className="mr-2 h-5 w-5" />
                {approveMutation.isPending ? "Approving..." : "Approve"}
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <TrackDetailSidebar 
            track={track} 
            onDownloadOriginal={onDownloadOriginal}
            createdByUser={createdByUser}
            isLoadingUser={isLoadingUser}
          />
        </div>
      </div>

      {/* Approve Dialog */}
      <ApproveTrackDialog
        open={approveDialogOpen}
        onOpenChange={setApproveDialogOpen}
        trackName={track.track.name}
        artistName={track.mainArtists?.items?.map(artist => artist.stageName).join(", ") || "Unknown Artist"}
        onConfirm={handleApproveConfirm}
        isLoading={approveMutation.isPending}
      />

      {/* Reject Dialog */}
      <RejectTrackDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        trackName={track.track.name}
        artistName={track.mainArtists?.items?.map(artist => artist.stageName).join(", ") || "Unknown Artist"}
        onConfirm={handleRejectConfirm}
        isLoading={rejectMutation.isPending}
      />
    </div>
  );
}