"use client";

import { 
  PendingTrackUploadRequestsListDocument,
  PendingTrackUploadRequestsDetailDocument,
  OriginalFileTrackUploadRequestDocument
} from "@/gql/graphql";
import { TrackApprovalLayout } from "../layout";
import { TrackApprovalSection } from "../section";
import { ModeratorGlobalAudioControls, ModeratorGlobalAudioPlayer } from "../components";

// Re-export the existing GraphQL documents for track approval
export const PendingTrackUploadRequestsQuery = PendingTrackUploadRequestsListDocument;
export const PendingTrackUploadRequestDetailQuery = PendingTrackUploadRequestsDetailDocument; 
export const OriginalFileTrackUploadRequestQuery = OriginalFileTrackUploadRequestDocument;

export function TrackApprovalView() {
  return (
    <TrackApprovalLayout
      title="Track Approval Center"
      description="Manage track upload requests and approvals"
    >
      <TrackApprovalSection />
    </TrackApprovalLayout>
  );
}