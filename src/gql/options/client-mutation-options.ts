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
  CreateSubscriptionCheckoutSessionRequestInput,
  UpdateListenerRequestInput,
} from "../graphql";
import { mutationOptions } from "@tanstack/react-query";
import { SubscriptionCreateCheckoutSessionMutation } from "@/modules/shared/mutations/client/subscription-mutations";

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
