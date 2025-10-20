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
import { UpdateListenerProfileMutation } from "@/modules/client/profile/ui/views/queries";
import type { UserGender } from "@/gql/graphql";

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

export const removeFromPlaylistMutationOptions = mutationOptions({
  mutationKey: ["remove-from-playlist"],
  mutationFn: async (addToPlaylistRequest: {
    playlistId?: string;
    playlistName?: string;
    trackId: string;
  }) =>
    await execute(RemoveFromPlaylistMutation, {
      removeFromPlaylistRequest: addToPlaylistRequest,
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
