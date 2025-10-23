import { mutationOptions } from "@tanstack/react-query";
import { executeWithFileUpload } from "../execute";
import { UploadTrackMutation } from "@/modules/artist/track-upload/ui/views/track-upload-view";
import {
  CreateRecordingRequestInput,
  CreateTrackRequestInput,
  CreateWorkRequestInput,
} from "../graphql";

export const trackUploadMutationOptions = mutationOptions({
  mutationKey: ["upload-track"],
  mutationFn: async (variables: {
    file: File;
    createTrackRequest: CreateTrackRequestInput;
    createWorkRequest: CreateWorkRequestInput;
    createRecordingRequest: CreateRecordingRequestInput;
  }) => await executeWithFileUpload(UploadTrackMutation, variables),
});
