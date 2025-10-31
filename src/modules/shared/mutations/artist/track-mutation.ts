import { graphql } from "@/gql";

export const UploadTrackMutation = graphql(`
  mutation UploadTrack(
    $file: Upload!
    $createTrackRequest: CreateTrackRequestInput!
    $createWorkRequest: CreateWorkRequestInput!
    $createRecordingRequest: CreateRecordingRequestInput!
  ) {
    uploadTrack(
      file: $file
      createTrackRequest: $createTrackRequest
      createWorkRequest: $createWorkRequest
      createRecordingRequest: $createRecordingRequest
    )
  }
`);
