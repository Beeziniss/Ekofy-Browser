import { mutationOptions } from "@tanstack/react-query";
import { execute, executeWithFileUpload } from "../execute";
import {
  CreateRecordingRequestInput,
  CreateTrackRequestInput,
  CreateWorkRequestInput,
  UpdateArtistRequestInput,
} from "../graphql";
import { UploadTrackMutation } from "@/modules/shared/mutations/artist/track-mutation";
import { UpdateArtistProfileMutation } from "@/modules/shared/mutations/artist/user-mutation";

export const trackUploadMutationOptions = mutationOptions({
  mutationKey: ["upload-track"],
  mutationFn: async (variables: {
    file: File;
    createTrackRequest: CreateTrackRequestInput;
    createWorkRequest: CreateWorkRequestInput;
    createRecordingRequest: CreateRecordingRequestInput;
  }) => await executeWithFileUpload(UploadTrackMutation, variables),
});

export const updateArtistProfileMutationOptions = mutationOptions({
  mutationKey: ["update-artist-profile"],
  mutationFn: async (updateArtistRequest: UpdateArtistRequestInput) =>
    await execute(UpdateArtistProfileMutation, {
      updateArtistRequest,
    }),
});
