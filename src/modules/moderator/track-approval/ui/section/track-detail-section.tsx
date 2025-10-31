"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { execute } from "@/gql/execute";
import { 
  ApproveTrackUploadRequestMutation, 
  RejectTrackUploadRequestMutation,
  QUERY_USER_CREATED_BY 
} from "../queries/track-approval-queries";
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
  const queryClient = useQueryClient();
  
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  // Fetch user information by createdBy ID
  const { data: createdByUser, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user-created-by", track.createdBy],
    queryFn: async () => {
      const result = await execute(QUERY_USER_CREATED_BY, {
        where: {
          id: {
            eq: track.createdBy
          }
        }
      });
      return result?.users?.items?.[0] || null;
    },
    enabled: !!track.createdBy
  });

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: async (uploadId: string) => {
      return await execute(ApproveTrackUploadRequestMutation, { uploadId });
    },
    onSuccess: () => {
      toast.success("Track approved successfully");
      queryClient.invalidateQueries({ queryKey: ["moderator-pending-tracks"] });
      router.push("/moderator/track-approval");
    },
    onError: (error) => {
      toast.error("Failed to approve track");
      console.error("Failed to approve track:", error);
    }
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: async ({ uploadId, reasonReject }: { uploadId: string; reasonReject: string }) => {
      return await execute(RejectTrackUploadRequestMutation, { uploadId, reasonReject });
    },
    onSuccess: () => {
      toast.success("Track rejected successfully");
      queryClient.invalidateQueries({ queryKey: ["moderator-pending-tracks"] });
      router.push("/moderator/track-approval");
    },
    onError: (error) => {
      toast.error("Failed to reject track");
      console.error("Failed to reject track:", error);
    }
  });

  const handleApproveConfirm = async () => {
    try {
      await approveMutation.mutateAsync(track.id);
    } catch {
      // Error handled in onError callback
    }
  };

  const handleRejectConfirm = async (reasonReject: string) => {
    try {
      await rejectMutation.mutateAsync({ 
        uploadId: track.id, 
        reasonReject 
      });
    } catch {
      // Error handled in onError callback
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