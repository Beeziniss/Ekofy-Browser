import { mutationOptions } from "@tanstack/react-query";
import { executeWithFileUpload } from "../execute";
import { CreateRecordingRequestInput, CreateTrackRequestInput, CreateWorkRequestInput } from "../graphql";
import { UploadTrackMutation } from "@/modules/shared/mutations/artist/track-mutation";

export const trackUploadMutationOptions = mutationOptions({
  mutationKey: ["upload-track"],
  mutationFn: async (variables: {
    file: File;
    createTrackRequest: CreateTrackRequestInput;
    createWorkRequest: CreateWorkRequestInput;
    createRecordingRequest: CreateRecordingRequestInput;
  }) => await executeWithFileUpload(UploadTrackMutation, variables),
});
