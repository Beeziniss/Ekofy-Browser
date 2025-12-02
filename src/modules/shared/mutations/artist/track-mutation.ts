import { graphql } from "@/gql";

export const UploadTrackMutation = graphql(`
  mutation UploadTrack(
    $file: Upload!
    $createTrackRequest: CreateTrackRequestInput!
    $createWorkRequest: CreateWorkRequestInput!
    $createRecordingRequest: CreateRecordingRequestInput!
    $isTesting: Boolean!
  ) {
    uploadTrack(
      file: $file
      createTrackRequest: $createTrackRequest
      createWorkRequest: $createWorkRequest
      createRecordingRequest: $createRecordingRequest
      isTesting: $isTesting
    )
  }
`);

export const UpdateTrackMetadataMutation = graphql(`
  mutation UpdateTrackMetadata($updateTrackRequest: UpdateTrackRequestInput!) {
    updateMetadataTrack(updateTrackRequest: $updateTrackRequest)
  }
`);

export const CancelTrackUploadMutation = graphql(`
  mutation CancelTrackUpload($uploadId: String!, $reasonReject: String!, $isCancel: Boolean!) {
    rejectTrackUploadRequest(isCancled: $isCancel, reasonReject: $reasonReject, uploadId: $uploadId)
  }
`);
