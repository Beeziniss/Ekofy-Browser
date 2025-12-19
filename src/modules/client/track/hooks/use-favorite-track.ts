import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { favoriteTrackMutationOptions } from "@/gql/options/client-mutation-options";
import { TrackDetailQuery, PopularityActionType } from "@/gql/graphql";
import { useProcessTrackEngagementPopularity } from "@/gql/client-mutation-options/popularity-mutation-option";

export const useFavoriteTrack = () => {
  const queryClient = useQueryClient();
  const { mutate: trackEngagementPopularity } = useProcessTrackEngagementPopularity();

  const { mutate: favoriteTrack, ...rest } = useMutation({
    ...favoriteTrackMutationOptions,
    onMutate: async ({ trackId, isAdding }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["track-detail", trackId],
      });

      // Snapshot the previous value
      const previousTrackDetail = queryClient.getQueryData(["track-detail", trackId]);

      // Optimistically update the cache
      queryClient.setQueryData<TrackDetailQuery>(["track-detail", trackId], (old) => {
        if (!old?.tracks?.items?.[0]) return old;

        return {
          ...old,
          tracks: {
            ...old.tracks,
            items: [
              {
                ...old.tracks.items[0],
                checkTrackInFavorite: isAdding,
                favoriteCount: isAdding
                  ? (old.tracks.items[0].favoriteCount || 0) + 1
                  : Math.max(0, (old.tracks.items[0].favoriteCount || 0) - 1),
              },
              ...(old.tracks.items.slice(1) || []),
            ],
          },
        };
      });

      // Also update tracks-home cache if it exists
      queryClient.setQueryData(["tracks-home"], (old: unknown) => {
        if (!old || typeof old !== "object") return old;
        const tracksData = old as {
          tracks?: {
            items?: Array<{
              id: string;
              checkTrackInFavorite: boolean;
              favoriteCount: number;
            }>;
          };
        };

        if (!tracksData?.tracks?.items) return old;

        return {
          ...tracksData,
          tracks: {
            ...tracksData.tracks,
            items: tracksData.tracks.items.map((track) =>
              track.id === trackId
                ? {
                    ...track,
                    checkTrackInFavorite: isAdding,
                    favoriteCount: isAdding
                      ? (track.favoriteCount || 0) + 1
                      : Math.max(0, (track.favoriteCount || 0) - 1),
                  }
                : track,
            ),
          },
        };
      });

      // Return a context object with the snapshotted value
      return { previousTrackDetail };
    },
    onError: (error, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTrackDetail) {
        queryClient.setQueryData(["track-detail", variables.trackId], context.previousTrackDetail);
      }
      console.error("Failed to update favorites:", error);
      toast.error("Failed to update favorites. Please try again.");
    },
    onSettled: (data, error, variables) => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({
        queryKey: ["track-detail", variables.trackId],
      });
      queryClient.invalidateQueries({
        queryKey: ["tracks-home"],
      });
      queryClient.invalidateQueries({
        queryKey: ["track-favorite"],
      });
      queryClient.invalidateQueries({
        queryKey: ["track-semantic"],
      });
      queryClient.invalidateQueries({
        queryKey: ["top-tracks"],
      });
    },
  });

  const handleFavorite = (trackDetail: { id: string; name: string; checkTrackInFavorite: boolean }) => {
    if (!trackDetail?.id) return;

    const isAdding = !trackDetail.checkTrackInFavorite;
    favoriteTrack(
      { trackId: trackDetail.id, isAdding },
      {
        onSuccess: () => {
          // Show success message after server confirms
          toast.success(
            isAdding ? `${trackDetail.name} added to favorites!` : `${trackDetail.name} removed from favorites!`,
          );
          // Track popularity
          trackEngagementPopularity({
            trackId: trackDetail.id,
            actionType: isAdding ? PopularityActionType.Favorite : PopularityActionType.Unfavorite,
          });
        },
      },
    );
  };

  return {
    favoriteTrack,
    handleFavorite,
    ...rest,
  };
};
