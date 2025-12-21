import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  favoriteTrackMutationOptions,
  playlistFavoriteMutationOptions,
  albumFavoriteMutationOptions,
} from "@/gql/options/client-mutation-options";
import { useProcessTrackEngagementPopularity } from "@/gql/client-mutation-options/popularity-mutation-option";
import { PopularityActionType } from "@/gql/graphql";

export const useFavoriteSearch = () => {
  const queryClient = useQueryClient();
  const { mutate: trackEngagementPopularity } = useProcessTrackEngagementPopularity();

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

      queryClient.invalidateQueries({
        queryKey: ["searchTracks"],
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
      queryClient.invalidateQueries({
        queryKey: ["searchPlaylists"],
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
    favoriteTrack({ trackId: track.id, isAdding }, {
      onSuccess: () => {
        // Track popularity
        trackEngagementPopularity({
          trackId: track.id,
          actionType: isAdding ? PopularityActionType.Favorite : PopularityActionType.Unfavorite,
        });
      },
    });
  };

  const handleFavoritePlaylist = (playlist: { id: string; name: string; checkPlaylistInFavorite: boolean }) => {
    if (!playlist?.id) return;

    const isAdding = !playlist.checkPlaylistInFavorite;
    favoritePlaylist({ playlistId: playlist.id, isAdding });
  };

  // Album favorite mutation
  const { mutate: favoriteAlbum, isPending: isFavoriteAlbumPending } = useMutation({
    ...albumFavoriteMutationOptions,
    onSuccess: (data, variables) => {
      const { isAdding } = variables;
      toast.success(isAdding ? "Album added to favorites!" : "Album removed from favorites!");

      // Invalidate search queries to refresh favorite status
      queryClient.invalidateQueries({
        queryKey: ["search"],
      });
      queryClient.invalidateQueries({
        queryKey: ["searchAlbums"],
      });
    },
    onError: (error) => {
      console.error("Failed to update album favorites:", error);
      toast.error("Failed to update favorites. Please try again.");
    },
  });

  const handleFavoriteAlbum = (album: { id: string; name: string; checkAlbumInFavorite: boolean }) => {
    if (!album?.id) return;

    const isAdding = !album.checkAlbumInFavorite;
    favoriteAlbum({ albumId: album.id, isAdding });
  };

  return {
    handleFavoriteTrack,
    handleFavoritePlaylist,
    handleFavoriteAlbum,
    isFavoriteTrackPending,
    isFavoritePlaylistPending,
    isFavoriteAlbumPending,
  };
};
