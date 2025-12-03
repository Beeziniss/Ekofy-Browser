import { mutationOptions } from "@tanstack/react-query";
import { execute, executeWithFileUpload } from "../execute";
import {
  ChangeOrderStatusRequestInput,
  CreateRecordingRequestInput,
  CreateTrackRequestInput,
  CreateWorkRequestInput,
  UpdateArtistRequestInput,
  UpdateTrackRequestInput,
} from "../graphql";
import {
  CancelTrackUploadMutation,
  UpdateTrackMetadataMutation,
  UploadTrackMutation,
} from "@/modules/shared/mutations/artist/track-mutation";
import { UpdateArtistProfileMutation } from "@/modules/shared/mutations/artist/user-mutation";
import { SwitchStatusByRequestorMutation } from "@/modules/shared/mutations/client/order-mutation";

export const trackUploadMutationOptions = mutationOptions({
  mutationKey: ["upload-track"],
  mutationFn: async (variables: {
    file: File;
    createTrackRequest: CreateTrackRequestInput;
    createWorkRequest: CreateWorkRequestInput;
    createRecordingRequest: CreateRecordingRequestInput;
    isTesting: boolean;
  }) => await executeWithFileUpload(UploadTrackMutation, variables),
});

export const updateArtistProfileMutationOptions = mutationOptions({
  mutationKey: ["update-artist-profile"],
  mutationFn: async (updateArtistRequest: UpdateArtistRequestInput) =>
    await execute(UpdateArtistProfileMutation, {
      updateArtistRequest,
    }),
});

export const updateTrackMetadataMutationOptions = mutationOptions({
  mutationKey: ["update-track-metadata"],
  mutationFn: async (updateMetadataTrack: UpdateTrackRequestInput) =>
    await execute(UpdateTrackMetadataMutation, {
      updateTrackRequest: updateMetadataTrack,
    }),
});

export const cancelTrackUploadMutationOptions = mutationOptions({
  mutationKey: ["cancel-track-upload"],
  mutationFn: async (variables: { uploadId: string; reasonReject: string; isCancel: boolean }) =>
    await execute(CancelTrackUploadMutation, variables),
});

export const switchStatusByRequestorMutationOptions = mutationOptions({
  mutationKey: ["switch-status-by-requestor"],
  mutationFn: async (request: ChangeOrderStatusRequestInput) =>
    await execute(SwitchStatusByRequestorMutation, { request }),
});
