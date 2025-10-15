import { mutationOptions } from "@tanstack/react-query";
import { execute } from "../execute";
import {
  CreatePlaylistMutation,
  DeletePlaylistMutation,
} from "@/modules/client/library/ui/views/library-view";

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
