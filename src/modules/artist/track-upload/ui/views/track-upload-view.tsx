import { graphql } from "@/gql";
import TrackUploadSection from "../sections/track-upload-section";

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

export const CategoriesQuery = graphql(`
  query Categories {
    categories {
      items {
        id
        name
      }
    }
  }
`);

export const UserLicenseQuery = graphql(`
  query UserLicense {
    users {
      items {
        id
        fullName
      }
    }
  }
`);

const TrackUploadView = () => {
  return (
    <div className="w-full">
      <h1 className="font-poppins text-3xl font-bold">
        Upload your audio files
      </h1>
      <p className="text-main-white mt-6 mb-10 text-sm">
        For best quality, use WAV, FLAC, AIFF, or ALAC. The maximum file size is
        ??MB.
      </p>

      <TrackUploadSection />
    </div>
  );
};

export default TrackUploadView;
