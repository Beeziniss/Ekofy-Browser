"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { execute } from "@/gql/execute";
import { 
  ApproveTrackUploadRequestMutation, 
  RejectTrackUploadRequestMutation 
} from "../queries/track-approval-queries";
import { TrackUploadRequest } from "@/types/approval-track";
import {
  TrackInfoCard,
  ArtistsContributorsCard,
  WorkRecordingDetailsCard,
  LegalDocumentsCard,
  TrackDetailSidebar
} from "../components";
import { toast } from "sonner";

interface TrackDetailSectionProps {
  track: TrackUploadRequest;
  onDownloadOriginal: () => void;
}

export function TrackDetailSection({ track, onDownloadOriginal }: TrackDetailSectionProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

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

  const handleApprove = async () => {
    try {
      await approveMutation.mutateAsync(track.id);
    } catch {
      // Error handled in onError callback
    }
  };

  const handleReject = async () => {
    try {
      await rejectMutation.mutateAsync({ 
        uploadId: track.id, 
        reasonReject: "Rejected by moderator after detailed review" 
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
          <h1 className="text-2xl font-bold">Track Review</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleReject}
            disabled={rejectMutation.isPending}
            className="text-red-600 hover:text-red-700"
          >
            <XCircle className="mr-2 h-4 w-4" />
            {rejectMutation.isPending ? "Rejecting..." : "Reject"}
          </Button>
          <Button
            onClick={handleApprove}
            disabled={approveMutation.isPending}
            className="text-green-600 hover:text-green-700"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            {approveMutation.isPending ? "Approving..." : "Approve"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Track Information */}
          <TrackInfoCard track={track} />

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
            track={track} 
            onDownloadOriginal={onDownloadOriginal}
          />
        </div>
      </div>
    </div>
  );
}