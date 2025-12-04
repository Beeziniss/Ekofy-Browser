import {
  AddToPlaylistMutation,
  CreatePlaylistMutation,
  DeletePlaylistMutation,
  FavoriteTrackMutation,
  PlaylistFavoriteMutation,
  RemoveFromPlaylistMutation,
  RequestHubCommentCreateMutation,
  RequestHubCommentDeleteMutation,
  RequestHubCommentUpdateMutation,
  TrackCommentCreateMutation,
  TrackCommentDeleteMutation,
  TrackCommentUpdateMutation,
  UpdateListenerProfileMutation,
  UpdatePlaylistMutation,
  UserFollowMutation,
  UserUnfollowMutation,
} from "@/modules/shared/mutations/client";
import { execute } from "../execute";
import {
  CommentType,
  CreateCommentRequestInput,
  CreateConversationRequestInput,
  CreateDirectRequestInput,
  CreatePaymentCheckoutSessionRequestInput,
  CreateSubscriptionCheckoutSessionRequestInput,
  RedoRequestInput,
  SubmitDeliveryRequestInput,
  UpdateListenerRequestInput,
  ChangeOrderStatusRequestInput,
} from "../graphql";
import { mutationOptions } from "@tanstack/react-query";
import {
  SubscriptionCancelMutation,
  SubscriptionCreateCheckoutSessionMutation,
  SubscriptionResumeMutation,
} from "@/modules/shared/mutations/client/subscription-mutations";
import { parseGraphQLError } from "@/utils/graphql-error-utils";
import { toast } from "sonner";
import {
  AddConversationFromRequestHubMutation,
  AddConversationGeneralMutation,
} from "@/modules/shared/mutations/client/coversation-mutation";
import { ServiceCreateCheckoutSessionMutation } from "@/modules/shared/mutations/client/service-mutation";
import { SendRequestMutation } from "@/modules/shared/mutations/client/request-mutation";
import {
  AcceptRequestByArtistMutation,
  ApproveDeliveryMutation,
  SendRedoRequestMutation,
  SubmitDeliveryMutation,
  SwitchStatusByRequestorMutation,
} from "@/modules/shared/mutations/client/order-mutation";
import { UpsertStreamCountMutation, UpsertTopTrackCountMutation } from "@/modules/shared/mutations/client/job-mutation";

// PLAYLIST MUTATIONS
export const createPlaylistMutationOptions = mutationOptions({
  mutationKey: ["create-playlist"],
  mutationFn: async (newPlaylist: { name: string; isPublic: boolean; coverImage?: string; description: string }) =>
    await execute(CreatePlaylistMutation, {
      createPlaylistRequest: newPlaylist,
    }),
});

export const updatePlaylistMutationOptions = mutationOptions({
  mutationKey: ["update-playlist"],
  mutationFn: async (updatePlaylistRequest: {
    playlistId: string;
    name?: string;
    isPublic?: boolean;
    coverImage?: string;
    description?: string;
  }) => await execute(UpdatePlaylistMutation, { updatePlaylistRequest }),
});

export const deletePlaylistMutationOptions = mutationOptions({
  mutationKey: ["delete-playlist"],
  mutationFn: async (playlistId: string) => await execute(DeletePlaylistMutation, { playlistId }),
});

export const addToPlaylistMutationOptions = mutationOptions({
  mutationKey: ["add-to-playlist"],
  mutationFn: async (addToPlaylistRequest: { playlistId?: string; playlistName?: string; trackId: string }) =>
    await execute(AddToPlaylistMutation, {
      addToPlaylistRequest,
    }),
});

export const removeFromPlaylistMutationOptions = mutationOptions({
  mutationKey: ["remove-from-playlist"],
  mutationFn: async (removeFromPlaylistRequest: { playlistId?: string; playlistName?: string; trackId: string }) =>
    await execute(RemoveFromPlaylistMutation, {
      removeFromPlaylistRequest,
    }),
});

// FAVORITE MUTATIONS
export const favoriteTrackMutationOptions = mutationOptions({
  mutationKey: ["favorite-track"],
  mutationFn: async (favoriteTrackRequest: { trackId: string; isAdding: boolean }) =>
    await execute(FavoriteTrackMutation, {
      trackId: favoriteTrackRequest.trackId,
      isAdding: favoriteTrackRequest.isAdding,
    }),
});

export const playlistFavoriteMutationOptions = mutationOptions({
  mutationKey: ["playlist-favorite"],
  mutationFn: async (input: { playlistId: string; isAdding: boolean }) =>
    await execute(PlaylistFavoriteMutation, { ...input }),
});

// TRACK MUTATIONS
export const createTrackCommentMutationOptions = mutationOptions({
  mutationKey: ["create-track-comment"],
  mutationFn: async (request: CreateCommentRequestInput) => await execute(TrackCommentCreateMutation, { request }),
});

export const updateTrackCommentMutationOptions = mutationOptions({
  mutationKey: ["update-track-comment"],
  mutationFn: async (input: { commentId: string; content: string }) => await execute(TrackCommentUpdateMutation, input),
});

export const deleteTrackCommentMutationOptions = mutationOptions({
  mutationKey: ["delete-track-comment"],
  mutationFn: async (commentId: string) => await execute(TrackCommentDeleteMutation, { commentId }),
});

// REQUEST HUB MUTATIONS
export const createRequestHubCommentMutationOptions = mutationOptions({
  mutationKey: ["create-request-hub-comment"],
  mutationFn: async (input: {
    targetId: string;
    commentType: CommentType;
    content: string;
    parentCommentId?: string;
  }) => await execute(RequestHubCommentCreateMutation, input),
  onError: (error: unknown) => {
    const graphqlError = parseGraphQLError(error, "Cannot create comment");
    toast.error(graphqlError.detail);
  },
});

export const updateRequestHubCommentMutationOptions = mutationOptions({
  mutationKey: ["update-request-hub-comment"],
  mutationFn: async (input: { commentId: string; content: string }) =>
    await execute(RequestHubCommentUpdateMutation, input),
});

export const deleteRequestHubCommentMutationOptions = mutationOptions({
  mutationKey: ["delete-request-hub-comment"],
  mutationFn: async (commentId: string) => await execute(RequestHubCommentDeleteMutation, { commentId }),
});

// USER MUTATIONS
export const userFollowMutationOptions = mutationOptions({
  mutationKey: ["user-follow"],
  mutationFn: async (targetId: string) => await execute(UserFollowMutation, { targetId }),
});

export const userUnfollowMutationOptions = mutationOptions({
  mutationKey: ["user-unfollow"],
  mutationFn: async (targetId: string) => await execute(UserUnfollowMutation, { targetId }),
});

export const updateListenerProfileMutationOptions = mutationOptions({
  mutationKey: ["update-listener-profile"],
  mutationFn: async (updateListenerRequest: UpdateListenerRequestInput) =>
    await execute(UpdateListenerProfileMutation, {
      updateListenerRequest,
    }),
});

// SUBSCRIPTION MUTATIONS
export const subscriptionCreateCheckoutSessionMutationOptions = mutationOptions({
  mutationKey: ["subscription-create-checkout-session"],
  mutationFn: async (createSubscriptionCheckoutSessionInput: CreateSubscriptionCheckoutSessionRequestInput) =>
    await execute(SubscriptionCreateCheckoutSessionMutation, { createSubscriptionCheckoutSessionInput }),
});

export const subscriptionCancelMutationOptions = mutationOptions({
  mutationKey: ["subscription-cancel"],
  mutationFn: async () => await execute(SubscriptionCancelMutation),
});

export const subscriptionResumeMutationOptions = mutationOptions({
  mutationKey: ["subscription-resume"],
  mutationFn: async () => await execute(SubscriptionResumeMutation),
});

// CONVERSATION MUTATIONS
export const addConversationGeneralMutationOptions = mutationOptions({
  mutationKey: ["add-conversation-general"],
  mutationFn: async (otherUserId: string) => await execute(AddConversationGeneralMutation, { otherUserId }),
});

export const addConversationFromRequestHubMutationOptions = mutationOptions({
  mutationKey: ["add-conversation-from-request-hub"],
  mutationFn: async (createConversationRequestInput: CreateConversationRequestInput) =>
    await execute(AddConversationFromRequestHubMutation, { createConversationRequestInput }),
});

// SERVICE MUTATIONS
export const serviceCreateCheckoutSessionMutationOptions = mutationOptions({
  mutationKey: ["service-create-checkout-session"],
  mutationFn: async (createPaymentCheckoutSessionInput: CreatePaymentCheckoutSessionRequestInput) =>
    await execute(ServiceCreateCheckoutSessionMutation, { createPaymentCheckoutSessionInput }),
});

// REQUEST MUTATIONS
export const sendRequestMutationOptions = mutationOptions({
  mutationKey: ["send-request"],
  mutationFn: async (input: { request: CreateDirectRequestInput; isDirect: boolean }) =>
    await execute(SendRequestMutation, { ...input }),
});

// ORDER MUTATIONS
export const acceptRequestByArtistMutationOptions = mutationOptions({
  mutationKey: ["accept-request-by-artist"],
  mutationFn: async (packageOrderId: string) => await execute(AcceptRequestByArtistMutation, { packageOrderId }),
});

export const submitDeliveryMutationOptions = mutationOptions({
  mutationKey: ["submit-delivery"],
  mutationFn: async (request: SubmitDeliveryRequestInput) => await execute(SubmitDeliveryMutation, { request }),
});

export const sendRedoRequestMutationOptions = mutationOptions({
  mutationKey: ["send-redo-request"],
  mutationFn: async (request: RedoRequestInput) => await execute(SendRedoRequestMutation, { request }),
});

export const approveDeliveryMutationOptions = mutationOptions({
  mutationKey: ["approve-delivery"],
  mutationFn: async (packageOrderId: string) => await execute(ApproveDeliveryMutation, { packageOrderId }),
});

export const switchStatusByRequestorMutationOptions = mutationOptions({
  mutationKey: ["switch-status-by-requestor"],
  mutationFn: async (request: ChangeOrderStatusRequestInput) =>
    await execute(SwitchStatusByRequestorMutation, { request }),
});

// JOB MUTATIONS
export const upsertStreamCountMutationOptions = mutationOptions({
  mutationKey: ["upsert-stream-count"],
  mutationFn: async (trackId: string) => await execute(UpsertStreamCountMutation, { trackId }),
});

export const upsertTopTrackCountMutationOptions = mutationOptions({
  mutationKey: ["upsert-top-track-count"],
  mutationFn: async (trackId: string) => await execute(UpsertTopTrackCountMutation, { trackId }),
});
