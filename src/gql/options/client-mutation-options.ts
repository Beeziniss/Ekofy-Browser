import { mutationOptions } from "@tanstack/react-query";
import { execute } from "../execute";
import {
  CreatePlaylistMutation,
  DeletePlaylistMutation,
} from "@/modules/client/library/ui/views/library-view";
import {
  AddToPlaylistMutation,
  RemoveFromPlaylistMutation,
} from "@/modules/client/playlist/ui/views/playlist-detail-view";
import { UpdateProfileMutation } from "@/modules/client/profile/ui/views/queries";

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
      addToPlaylistRequest,
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
  }) =>
    await execute(UpdateProfileMutation, {
      updateListenerRequest,
      // API requires both args; pass empty object for artist as a no-op.
      updateArtistRequest: {},
    }),
});
