import { mutationOptions } from "@tanstack/react-query";
import { execute } from "../execute";
import {
  CreatePlaylistMutation,
  DeletePlaylistMutation,
} from "@/modules/client/library/ui/views/library-view";
import {
  AddToPlaylistMutation,
  RemoveFromPlaylistMutation,
  UpdatePlaylistMutation,
} from "@/modules/client/playlist/ui/views/playlist-detail-view";
import { CommentType, UserGender } from "../graphql";
import { UpdateListenerProfileMutation } from "@/modules/client/profile/ui/views/queries";
import { FavoriteTrackMutation } from "@/modules/client/track/ui/views/track-detail-view";
import {
  CreateTrackCommentMutation,
  TrackCommentDeleteMutation,
  TrackCommentUpdateMutation,
} from "@/modules/client/track/ui/views/track-detail-view";

export const createPlaylistMutationOptions = mutationOptions({
  mutationKey: ["create-playlist"],
  mutationFn: async (newPlaylist: {
    name: string;
    isPublic: boolean;
    coverImage?: string;
    description: string;
  }) =>
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
  mutationFn: async (playlistId: string) =>
    await execute(DeletePlaylistMutation, { playlistId }),
});

export const addToPlaylistMutationOptions = mutationOptions({
  mutationKey: ["add-to-playlist"],
  mutationFn: async (addToPlaylistRequest: {
    playlistId?: string;
    playlistName?: string;
    trackId: string;
  }) =>
    await execute(AddToPlaylistMutation, {
      addToPlaylistRequest,
    }),
});

export const favoriteTrackMutationOptions = mutationOptions({
  mutationKey: ["favorite-track"],
  mutationFn: async (favoriteTrackRequest: {
    trackId: string;
    isAdding: boolean;
  }) =>
    await execute(FavoriteTrackMutation, {
      trackId: favoriteTrackRequest.trackId,
      isAdding: favoriteTrackRequest.isAdding,
    }),
});

export const removeFromPlaylistMutationOptions = mutationOptions({
  mutationKey: ["remove-from-playlist"],
  mutationFn: async (removeFromPlaylistRequest: {
    playlistId?: string;
    playlistName?: string;
    trackId: string;
  }) =>
    await execute(RemoveFromPlaylistMutation, {
      removeFromPlaylistRequest,
    }),
});

export const updateListenerProfileMutationOptions = mutationOptions({
  mutationKey: ["update-listener-profile"],
  mutationFn: async (updateListenerRequest: {
    displayName?: string;
    email?: string;
    avatarImage?: string;
    bannerImage?: string;
    fullName?: string;
    phoneNumber?: string;
    // Newly supported fields
    birthDate?: string; // ISO 8601 string e.g. 1990-01-01T00:00:00.000Z
    gender?: UserGender;
  }) =>
    await execute(UpdateListenerProfileMutation, {
      updateListenerRequest,
    }),
});

export const createTrackCommentMutationOptions = mutationOptions({
  mutationKey: ["create-track-comment"],
  mutationFn: async (input: {
    targetId: string;
    commentType: CommentType;
    content: string;
    parentCommentId?: string;
  }) => await execute(CreateTrackCommentMutation, input),
});

export const updateTrackCommentMutationOptions = mutationOptions({
  mutationKey: ["update-track-comment"],
  mutationFn: async (input: { commentId: string; content: string }) =>
    await execute(TrackCommentUpdateMutation, input),
});

export const deleteTrackCommentMutationOptions = mutationOptions({
  mutationKey: ["delete-track-comment"],
  mutationFn: async (commentId: string) =>
    await execute(TrackCommentDeleteMutation, { commentId }),
});
