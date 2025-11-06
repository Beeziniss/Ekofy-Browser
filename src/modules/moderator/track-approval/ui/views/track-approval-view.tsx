"use client";

// import {
//   PendingTrackUploadRequestsListDocument,
//   PendingTrackUploadRequestByIdDocument,
//   OriginalFileTrackUploadRequestDocument
// } from "@/gql/graphql";
import { TrackApprovalLayout } from "../layout";
import { TrackApprovalSection } from "../section";

// // Re-export the existing GraphQL documents for track approval
// export const PendingTrackUploadRequestsQuery = PendingTrackUploadRequestsListDocument;
// export const PendingTrackUploadRequestDetailQuery = PendingTrackUploadRequestByIdDocument;
// export const OriginalFileTrackUploadRequestQuery = OriginalFileTrackUploadRequestDocument;

export function TrackApprovalView() {
  return (
    <TrackApprovalLayout title="Track Approval Center" description="Manage track upload requests and approvals">
      <TrackApprovalSection />
    </TrackApprovalLayout>
  );
}
