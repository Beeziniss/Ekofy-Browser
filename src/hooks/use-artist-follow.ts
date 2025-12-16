import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userFollowMutationOptions, userUnfollowMutationOptions } from "@/gql/options/client-mutation-options";
import { toast } from "sonner";
import { ArtistDetailQuery, TrackDetailQuery, PopularityActionType } from "@/gql/graphql";
import { useProcessArtistEngagementPopularity } from "@/gql/client-mutation-options/popularity-mutation-option";

interface UseArtistFollowOptions {
  artistId?: string;
  trackId?: string;
  onSuccess?: (isFollowing: boolean) => void;
}

export const useArtistFollow = ({ artistId, trackId, onSuccess }: UseArtistFollowOptions = {}) => {
  const queryClient = useQueryClient();
  const { mutate: artistEngagementPopularity } = useProcessArtistEngagementPopularity();

  const invalidateAllRelatedQueries = (artistId?: string, trackId?: string) => {
    // Invalidate artist-detail queries
    if (artistId) {
      queryClient.invalidateQueries({
        queryKey: ["artist-detail", artistId],
      });
      queryClient.invalidateQueries({
        queryKey: ["follower", artistId],
      });
      queryClient.invalidateQueries({
        queryKey: ["following", artistId],
      });
    }

    // Invalidate track-detail queries
    if (trackId) {
      queryClient.invalidateQueries({
        queryKey: ["track-detail", trackId],
      });
    }

    // Invalidate all track-detail queries if we don't have a specific trackId
    // This ensures that any track page showing this artist gets updated
    if (!trackId) {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey[0] === "track-detail";
        },
      });
    }

    // Invalidate search artists queries to update follow status in search results
    queryClient.invalidateQueries({
      predicate: (query) => {
        return query.queryKey[0] === "searchArtists";
      },
    });
  };

  const { mutate: followUser, isPending: isFollowPending } = useMutation({
    ...userFollowMutationOptions,
    onMutate: async () => {
      // Cancel any outgoing refetches
      if (artistId) {
        await queryClient.cancelQueries({
          queryKey: ["artist-detail", artistId],
        });
      }
      if (trackId) {
        await queryClient.cancelQueries({
          queryKey: ["track-detail", trackId],
        });
      }

      // Snapshot the previous values
      const previousArtistData = artistId ? queryClient.getQueryData(["artist-detail", artistId]) : null;
      const previousTrackDetail = trackId ? queryClient.getQueryData(["track-detail", trackId]) : null;

      // Optimistic updates for artist-detail query
      if (artistId) {
        queryClient.setQueryData<ArtistDetailQuery>(["artist-detail", artistId], (old) => {
          if (!old?.artists?.items?.[0]?.user?.[0]) return old;

          return {
            ...old,
            artists: {
              ...old.artists,
              items: [
                {
                  ...old.artists.items[0],
                  user: [
                    {
                      ...old.artists.items[0].user[0],
                      checkUserFollowing: true,
                    },
                  ],
                },
                ...(old.artists.items.slice(1) || []),
              ],
            },
          };
        });
      }

      // Optimistic updates for track-detail query
      if (trackId) {
        queryClient.setQueryData<TrackDetailQuery>(["track-detail", trackId], (old) => {
          if (!old?.tracks?.items?.[0]?.mainArtists?.items?.[0]?.user?.[0]) return old;

          return {
            ...old,
            tracks: {
              ...old.tracks,
              items: [
                {
                  ...old.tracks.items[0],
                  mainArtists: {
                    ...old.tracks.items[0].mainArtists,
                    items: [
                      {
                        ...old.tracks.items[0].mainArtists.items[0],
                        user: [
                          {
                            ...old.tracks.items[0].mainArtists.items[0].user[0],
                            checkUserFollowing: true,
                          },
                        ],
                      },
                      ...(old.tracks.items[0].mainArtists.items.slice(1) || []),
                    ],
                  },
                },
                ...(old.tracks.items.slice(1) || []),
              ],
            },
          };
        });
      }

      return { previousArtistData, previousTrackDetail };
    },
    onError: (error, variables, context) => {
      // Rollback optimistic updates
      if (context?.previousArtistData && artistId) {
        queryClient.setQueryData(["artist-detail", artistId], context.previousArtistData);
      }
      if (context?.previousTrackDetail && trackId) {
        queryClient.setQueryData(["track-detail", trackId], context.previousTrackDetail);
      }
      console.error("Failed to follow user:", error);
      toast.error("Failed to follow user. Please try again.");
    },
    onSuccess: () => {
      onSuccess?.(true);
      // Track artist engagement popularity for follow
      if (artistId) {
        artistEngagementPopularity({
          artistId,
          actionType: PopularityActionType.Follow,
        });
      }
    },
    onSettled: () => {
      invalidateAllRelatedQueries(artistId, trackId);
    },
  });

  const { mutate: unfollowUser, isPending: isUnfollowPending } = useMutation({
    ...userUnfollowMutationOptions,
    onMutate: async () => {
      // Cancel any outgoing refetches
      if (artistId) {
        await queryClient.cancelQueries({
          queryKey: ["artist-detail", artistId],
        });
      }
      if (trackId) {
        await queryClient.cancelQueries({
          queryKey: ["track-detail", trackId],
        });
      }

      // Snapshot the previous values
      const previousArtistData = artistId ? queryClient.getQueryData(["artist-detail", artistId]) : null;
      const previousTrackDetail = trackId ? queryClient.getQueryData(["track-detail", trackId]) : null;

      // Optimistic updates for artist-detail query
      if (artistId) {
        queryClient.setQueryData<ArtistDetailQuery>(["artist-detail", artistId], (old) => {
          if (!old?.artists?.items?.[0]?.user?.[0]) return old;

          return {
            ...old,
            artists: {
              ...old.artists,
              items: [
                {
                  ...old.artists.items[0],
                  user: [
                    {
                      ...old.artists.items[0].user[0],
                      checkUserFollowing: false,
                    },
                  ],
                },
                ...(old.artists.items.slice(1) || []),
              ],
            },
          };
        });
      }

      // Optimistic updates for track-detail query
      if (trackId) {
        queryClient.setQueryData<TrackDetailQuery>(["track-detail", trackId], (old) => {
          if (!old?.tracks?.items?.[0]?.mainArtists?.items?.[0]?.user?.[0]) return old;

          return {
            ...old,
            tracks: {
              ...old.tracks,
              items: [
                {
                  ...old.tracks.items[0],
                  mainArtists: {
                    ...old.tracks.items[0].mainArtists,
                    items: [
                      {
                        ...old.tracks.items[0].mainArtists.items[0],
                        user: [
                          {
                            ...old.tracks.items[0].mainArtists.items[0].user[0],
                            checkUserFollowing: false,
                          },
                        ],
                      },
                      ...(old.tracks.items[0].mainArtists.items.slice(1) || []),
                    ],
                  },
                },
                ...(old.tracks.items.slice(1) || []),
              ],
            },
          };
        });
      }

      return { previousArtistData, previousTrackDetail };
    },
    onError: (error, variables, context) => {
      // Rollback optimistic updates
      if (context?.previousArtistData && artistId) {
        queryClient.setQueryData(["artist-detail", artistId], context.previousArtistData);
      }
      if (context?.previousTrackDetail && trackId) {
        queryClient.setQueryData(["track-detail", trackId], context.previousTrackDetail);
      }
      console.error("Failed to unfollow user:", error);
      toast.error("Failed to unfollow user. Please try again.");
    },
    onSuccess: () => {
      onSuccess?.(false);
      // Track artist engagement popularity for unfollow
      if (artistId) {
        artistEngagementPopularity({
          artistId,
          actionType: PopularityActionType.Unfollow,
        });
      }
    },
    onSettled: () => {
      invalidateAllRelatedQueries(artistId, trackId);
    },
  });

  const handleFollowToggle = (userId: string, isCurrentlyFollowing: boolean, artistName?: string) => {
    if (isCurrentlyFollowing) {
      unfollowUser(userId, {
        onSuccess: () => {
          if (artistName) {
            toast.success(`Unfollowed ${artistName}!`);
          }
        },
      });
    } else {
      followUser(userId, {
        onSuccess: () => {
          if (artistName) {
            toast.success(`Now following ${artistName}!`);
          }
        },
      });
    }
  };

  return {
    followUser,
    unfollowUser,
    handleFollowToggle,
    isLoading: isFollowPending || isUnfollowPending,
  };
};
