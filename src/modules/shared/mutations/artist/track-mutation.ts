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
