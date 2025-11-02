import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArtistQuery, TrackDetailQuery } from "@/gql/graphql";
import { formatNumber } from "@/utils/format-number";
import {
  CopyIcon,
  EllipsisIcon,
  HeartIcon,
  ListPlusIcon,
  UserIcon,
} from "lucide-react";
import { Suspense, useState } from "react";
import PlaylistAddModal from "@/modules/client/playlist/ui/components/playlist-add-modal";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import {
  favoriteTrackMutationOptions,
  userFollowMutationOptions,
  userUnfollowMutationOptions,
} from "@/gql/options/client-mutation-options";
import { getUserInitials } from "@/utils/format-shorten-name";
import Link from "next/link";

interface TrackOwnerSectionProps {
  data: TrackDetailQuery;
  artistData?: ArtistQuery;
}

const TrackOwnerSection = ({ data, artistData }: TrackOwnerSectionProps) => {
  return (
    <Suspense fallback={<TrackOwnerSectionSkeleton />}>
      <TrackOwnerSectionSuspense data={data} artistData={artistData} />
    </Suspense>
  );
};

const TrackOwnerSectionSkeleton = () => {
  return <div>Loading...</div>;
};

const TrackOwnerSectionSuspense = ({
  data,
  artistData,
}: TrackOwnerSectionProps) => {
  const queryClient = useQueryClient();
  const trackDetail = data.tracks?.items?.[0];
  const trackDetailArtist = trackDetail?.mainArtists?.items?.[0];
  const [addToPlaylistModalOpen, setAddToPlaylistModalOpen] = useState(false);

  const { mutate: favoriteTrack } = useMutation({
    ...favoriteTrackMutationOptions,
    onMutate: async ({ trackId, isAdding }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["track-detail", trackId],
      });

      // Snapshot the previous value
      const previousTrackDetail = queryClient.getQueryData([
        "track-detail",
        trackId,
      ]);

      // Optimistically update the cache
      queryClient.setQueryData<TrackDetailQuery>(
        ["track-detail", trackId],
        (old) => {
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
        },
      );

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
        queryClient.setQueryData(
          ["track-detail", variables.trackId],
          context.previousTrackDetail,
        );
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
    },
  });

  const { mutate: followUser } = useMutation({
    ...userFollowMutationOptions,
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["track-detail", trackDetail?.id],
      });

      // Snapshot the previous value
      const previousTrackDetail = queryClient.getQueryData([
        "track-detail",
        trackDetail?.id,
      ]);

      // Optimistically update the cache
      queryClient.setQueryData<TrackDetailQuery>(
        ["track-detail", trackDetail?.id],
        (old) => {
          if (!old?.tracks?.items?.[0]?.mainArtists?.items?.[0]?.user?.[0])
            return old;

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
        },
      );

      return { previousTrackDetail };
    },
    onError: (error, variables, context) => {
      if (context?.previousTrackDetail) {
        queryClient.setQueryData(
          ["track-detail", trackDetail?.id],
          context.previousTrackDetail,
        );
      }
      console.error("Failed to follow user:", error);
      toast.error("Failed to follow user. Please try again.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["track-detail", trackDetail?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["artist", trackDetailArtist?.userId],
      });
    },
  });

  const { mutate: unfollowUser } = useMutation({
    ...userUnfollowMutationOptions,
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["track-detail", trackDetail?.id],
      });

      // Snapshot the previous value
      const previousTrackDetail = queryClient.getQueryData([
        "track-detail",
        trackDetail?.id,
      ]);

      // Optimistically update the cache
      queryClient.setQueryData<TrackDetailQuery>(
        ["track-detail", trackDetail?.id],
        (old) => {
          if (!old?.tracks?.items?.[0]?.mainArtists?.items?.[0]?.user?.[0])
            return old;

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
        },
      );

      return { previousTrackDetail };
    },
    onError: (error, variables, context) => {
      if (context?.previousTrackDetail) {
        queryClient.setQueryData(
          ["track-detail", trackDetail?.id],
          context.previousTrackDetail,
        );
      }
      console.error("Failed to unfollow user:", error);
      toast.error("Failed to unfollow user. Please try again.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["track-detail", trackDetail?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["artist", trackDetailArtist?.userId],
      });
    },
  });

  const trackData = data.tracks?.items?.[0];

  const handleCopyLink = () => {
    if (trackDetail?.id) {
      const url = `${window.location.origin}/track/${trackDetail.id}`;
      navigator.clipboard.writeText(url);
      toast.success("Copied!");
    }
  };

  const handleFavorite = () => {
    if (!trackDetail?.id) return;

    const isAdding = !trackDetail.checkTrackInFavorite;
    favoriteTrack(
      { trackId: trackDetail.id, isAdding },
      {
        onSuccess: () => {
          // Show success message after server confirms
          toast.success(
            isAdding
              ? `${trackDetail.name} added to favorites!`
              : `${trackDetail.name} removed from favorites!`,
          );
        },
      },
    );
  };

  const handleFollowToggle = () => {
    if (!trackDetailArtist?.userId) return;

    const isCurrentlyFollowing = trackDetailArtist?.user[0]?.checkUserFollowing;

    if (isCurrentlyFollowing) {
      unfollowUser(trackDetailArtist.userId, {
        onSuccess: () => {
          toast.success(`Unfollowed ${trackDetailArtist.stageName}!`);
        },
      });
    } else {
      followUser(trackDetailArtist.userId, {
        onSuccess: () => {
          toast.success(`Now following ${trackDetailArtist.stageName}!`);
        },
      });
    }
  };

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-x-3">
        <Avatar className="size-16">
          <AvatarImage
            src={
              trackDetail?.mainArtists?.items?.[0].avatarImage ||
              "https://github.com/shadcn.png"
            }
          />
          <AvatarFallback>
            {getUserInitials(
              trackDetail?.mainArtists?.items?.[0]?.stageName || "",
            )}
          </AvatarFallback>
        </Avatar>

        <div className="flex items-center gap-x-6">
          <div className="flex flex-col gap-y-1">
            <Link
              href={`/artists/${trackData?.mainArtistIds?.[0]}`}
              className="text-main-white hover:text-main-purple text-sm font-bold transition-colors"
            >
              {data.tracks?.items?.[0]?.mainArtists?.items?.[0]?.stageName ||
                "Unknown Artist"}
            </Link>
            <span className="text-main-grey-dark-1 flex items-center gap-x-1 text-sm">
              <UserIcon className="inline-block size-5" />{" "}
              {trackData?.mainArtists?.items?.[0]?.followerCount || 0} followers
            </span>
          </div>
          {artistData &&
          artistData.artists?.items?.[0]?.userId ===
            trackDetailArtist?.userId ? null : (
            <Button
              variant={
                trackDetailArtist?.user[0]?.checkUserFollowing
                  ? "reaction"
                  : "default"
              }
              className="px-10 py-2 text-sm font-bold"
              onClick={handleFollowToggle}
            >
              {trackDetailArtist?.user[0]?.checkUserFollowing
                ? "Following"
                : "Follow"}
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-x-4">
        <Button
          variant="reaction"
          className="group text-sm font-bold"
          onClick={handleFavorite}
        >
          <HeartIcon
            className={cn(
              `group-hover:text-main-grey group-hover:fill-main-grey inline-block size-4`,
              trackDetail?.checkTrackInFavorite
                ? "fill-main-purple text-main-purple"
                : "text-main-white fill-main-white",
            )}
          />
          <span className="text-main-grey">
            {formatNumber(trackData?.favoriteCount || 0)}
          </span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="reaction" className="group text-sm font-bold">
              <EllipsisIcon className="inline-block size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="bottom" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleCopyLink}>
                <CopyIcon className="text-main-white mr-2 size-4" />
                <span className="text-main-white text-base">Copy link</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setAddToPlaylistModalOpen(true)}>
                <ListPlusIcon className="text-main-white mr-2 size-4" />
                <span className="text-main-white text-base">
                  Add to playlist
                </span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {trackDetail?.id && (
        <PlaylistAddModal
          open={addToPlaylistModalOpen}
          onOpenChange={setAddToPlaylistModalOpen}
          trackId={trackDetail.id}
        />
      )}
    </div>
  );
};

export default TrackOwnerSection;
