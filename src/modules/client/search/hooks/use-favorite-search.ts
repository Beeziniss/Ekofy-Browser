import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { favoriteTrackMutationOptions, playlistFavoriteMutationOptions } from "@/gql/options/client-mutation-options";

export const useFavoriteSearch = () => {
  const queryClient = useQueryClient();

  // Track favorite mutation
  const { mutate: favoriteTrack, isPending: isFavoriteTrackPending } = useMutation({
    ...favoriteTrackMutationOptions,
    onSuccess: (data, variables) => {
      const { isAdding } = variables;
      toast.success(isAdding ? "Track added to favorites!" : "Track removed from favorites!");

      // Invalidate search queries to refresh favorite status
      queryClient.invalidateQueries({
        queryKey: ["search"],
      });
    },
    onError: (error) => {
      console.error("Failed to update track favorites:", error);
      toast.error("Failed to update favorites. Please try again.");
    },
  });

  // Playlist favorite mutation
  const { mutate: favoritePlaylist, isPending: isFavoritePlaylistPending } = useMutation({
    ...playlistFavoriteMutationOptions,
    onSuccess: (data, variables) => {
      const { isAdding } = variables;
      toast.success(isAdding ? "Playlist added to favorites!" : "Playlist removed from favorites!");

      // Invalidate search queries to refresh favorite status
      queryClient.invalidateQueries({
        queryKey: ["search"],
      });
    },
    onError: (error) => {
      console.error("Failed to update playlist favorites:", error);
      toast.error("Failed to update favorites. Please try again.");
    },
  });

  const handleFavoriteTrack = (track: { id: string; name: string; checkTrackInFavorite: boolean }) => {
    if (!track?.id) return;

    const isAdding = !track.checkTrackInFavorite;
    favoriteTrack({ trackId: track.id, isAdding });
  };

  const handleFavoritePlaylist = (playlist: { id: string; name: string; checkPlaylistInFavorite: boolean }) => {
    if (!playlist?.id) return;

    const isAdding = !playlist.checkPlaylistInFavorite;
    favoritePlaylist({ playlistId: playlist.id, isAdding });
  };

  return {
    handleFavoriteTrack,
    handleFavoritePlaylist,
    isFavoriteTrackPending,
    isFavoritePlaylistPending,
  };
};
