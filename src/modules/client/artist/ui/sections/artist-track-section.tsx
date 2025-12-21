"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Heart, Play, Pause, Ellipsis, LinkIcon, ListPlus, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueryClient, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store";
import { useAudioStore } from "@/store/stores/audio-store";
import { formatDistanceToNow } from "date-fns";
import { WarningAuthDialog } from "@/modules/shared/ui/components/warning-auth-dialog";
import PlaylistAddModal from "@/modules/client/playlist/ui/components/playlist-add-modal";
import { useFavoriteTrack } from "@/modules/client/track/hooks/use-favorite-track";
import {
  useProcessTrackEngagementPopularity,
  useProcessTrackDiscoveryPopularity,
  useProcessArtistDiscoveryPopularity,
} from "@/gql/client-mutation-options/popularity-mutation-option";
import { PopularityActionType, TrackInfiniteQuery } from "@/gql/graphql";
import { GraphQLTrack, convertGraphQLTracksToStore } from "@/utils/track-converter";
import { trackInfiniteOptions } from "@/gql/options/client-options";
import { artistGetDataOptions } from "@/gql/options/artist-options";
import InfiniteScroll from "@/modules/shared/ui/components/infinite-scroll";

interface ArtistTrackSectionProps {
  artistId: string;
}

const ArtistTrackSection = ({ artistId }: ArtistTrackSectionProps) => {
  // Fetch artist data to get userId
  const { data: artistData, isLoading: isArtistLoading } = useQuery(artistGetDataOptions(artistId));

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery(
    trackInfiniteOptions(artistData?.userId || "", 10),
  );

  // Flatten all tracks from all pages
  const allTracks = useMemo(() => data?.pages.flatMap((page) => page.tracks?.items || []) || [], [data]);

  if (isLoading || isArtistLoading) {
    return (
      <div className="flex h-full items-center justify-center py-12">
        <Loader2 className="text-main-purple h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!allTracks.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-main-grey text-lg">No tracks available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {allTracks.map((track) => (
        <TrackItem key={track.id} track={track} allTracks={allTracks} />
      ))}
      <InfiniteScroll
        hasNextPage={hasNextPage ?? false}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
};

type Track = NonNullable<NonNullable<TrackInfiniteQuery["tracks"]>["items"]>[number];

interface TrackItemProps {
  track: Track;
  allTracks: Track[];
}

const TrackItem = React.memo(({ track, allTracks }: TrackItemProps) => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authDialogAction, setAuthDialogAction] = useState<"play" | "favorite" | "playlist">("play");
  const [addToPlaylistModalOpen, setAddToPlaylistModalOpen] = useState(false);
  const { mutate: trackEngagementPopularity } = useProcessTrackEngagementPopularity();
  const { mutate: trackDiscoveryPopularity } = useProcessTrackDiscoveryPopularity();
  const { mutate: artistDiscoveryPopularity } = useProcessArtistDiscoveryPopularity();
  const { handleFavorite } = useFavoriteTrack();

  // Audio store selectors
  const isCurrentTrack = useAudioStore((state) => state.currentTrack?.id === track.id);
  const globalIsPlaying = useAudioStore((state) => state.isPlaying);
  const setCurrentTrack = useAudioStore((state) => state.setCurrentTrack);
  const togglePlayPause = useAudioStore((state) => state.togglePlayPause);
  const play = useAudioStore((state) => state.play);
  const setQueue = useAudioStore((state) => state.setQueue);
  const skipToTrack = useAudioStore((state) => state.skipToTrack);

  const trackData = React.useMemo(
    () => ({
      id: track.id,
      name: track.name || "Unknown Track",
      artist:
        track.mainArtists?.items
          ?.map((a) => a?.stageName)
          .filter(Boolean)
          .join(", ") || "Unknown Artist",
      coverImage: track.coverImage || undefined,
    }),
    [track],
  );

  const handlePlayPauseClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!isAuthenticated) {
        setAuthDialogAction("play");
        setShowAuthDialog(true);
        return;
      }

      if (isCurrentTrack) {
        togglePlayPause();
      } else {
        if (allTracks && allTracks.length > 0) {
          const queueTracks = convertGraphQLTracksToStore(allTracks as GraphQLTrack[]);
          setQueue(queueTracks);
          const trackIndex = queueTracks.findIndex((t) => t.id === track.id);
          if (trackIndex !== -1) {
            setTimeout(() => skipToTrack(trackIndex), 0);
          }
        } else {
          setCurrentTrack(trackData);
        }
        play();
      }
    },
    [
      isAuthenticated,
      isCurrentTrack,
      togglePlayPause,
      allTracks,
      setQueue,
      track.id,
      skipToTrack,
      setCurrentTrack,
      trackData,
      play,
    ],
  );

  const onCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.origin + `/track/${track.id}`);
    toast.info("Track link copied!");
    trackEngagementPopularity({
      trackId: track.id,
      actionType: PopularityActionType.Share,
    });
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!track.id || !track.name) return;

    if (!isAuthenticated) {
      setAuthDialogAction("favorite");
      setShowAuthDialog(true);
      return;
    }

    handleFavorite({
      id: track.id,
      name: track.name,
      checkTrackInFavorite: track.checkTrackInFavorite,
    });

    // Invalidate artist tracks query
    queryClient.invalidateQueries({
      queryKey: ["tracks-infinite"],
    });
  };

  const handleTrackAddPopularity = () => {
    trackDiscoveryPopularity({
      trackId: track.id,
      actionType: PopularityActionType.Search,
    });
  };

  const handleArtistAddPopularity = () => {
    const firstArtist = track.mainArtists?.items?.[0];
    if (firstArtist?.id) {
      artistDiscoveryPopularity({
        artistId: firstArtist.id,
        actionType: PopularityActionType.Search,
      });
    }
  };

  const formatCount = (count: number | null) => {
    if (!count) return "0";
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const timeAgo = track.createdAt ? formatDistanceToNow(new Date(track.createdAt), { addSuffix: true }) : "";

  return (
    <div className="bg-main-dark-bg hover:bg-main-dark-bg/80 group relative flex gap-4 rounded-lg p-4 transition-colors">
      {/* Track Image and Play Button */}
      <div className="relative shrink-0">
        <Link href={`/track/${track.id}`} onClick={handleTrackAddPopularity}>
          <Image
            src={
              track.coverImage ||
              "https://www.onlandscape.co.uk/wp-content/uploads/2012/01/IMG_6347-square-vertorama.jpg"
            }
            alt={track.name || "Track"}
            width={120}
            height={120}
            className="size-[120px] rounded object-cover"
            unoptimized
          />
        </Link>
        <Button
          onClick={handlePlayPauseClick}
          className="bg-main-purple hover:bg-main-purple/90 absolute top-1/2 left-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-full p-0 opacity-0 transition-opacity group-hover:opacity-100"
        >
          {isCurrentTrack && globalIsPlaying ? (
            <Pause className="size-7 fill-white text-white" />
          ) : (
            <Play className="size-7 fill-white text-white" />
          )}
        </Button>
      </div>

      {/* Track Info */}
      <div className="flex flex-1 flex-col justify-between">
        {/* Top Section - Artist, Title, Time */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              {track.mainArtists?.items?.[0] && (
                <Link
                  href={`/artists/${track.mainArtists.items[0].id}/tracks`}
                  onClick={handleArtistAddPopularity}
                  className="text-main-grey hover:text-main-white text-sm transition-colors"
                >
                  {track.mainArtists.items[0].stageName}
                </Link>
              )}
            </div>
            <Link
              href={`/track/${track.id}`}
              onClick={handleTrackAddPopularity}
              className={`hover:text-main-purple text-lg font-semibold transition-colors ${
                isCurrentTrack && globalIsPlaying ? "text-main-purple" : "text-white"
              }`}
            >
              {track.name}
            </Link>
          </div>
          <span className="text-main-grey text-sm">{timeAgo}</span>
        </div>

        {/* Bottom Section - Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleFavoriteClick}
              variant="ghost"
              size="sm"
              className="text-main-grey hover:text-main-white flex items-center gap-1 p-0"
            >
              <Heart className={`size-4 ${track.checkTrackInFavorite ? "fill-main-purple text-main-purple" : ""}`} />
              <span className="text-xs">{track.favoriteCount}</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-main-grey hover:text-main-white p-0">
                  <Ellipsis className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="start" className="w-48">
                <DropdownMenuItem onClick={onCopy}>
                  <LinkIcon className="text-main-white mr-2 size-4" />
                  <span className="text-main-white text-sm">Copy link</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    if (!isAuthenticated) {
                      setAuthDialogAction("playlist");
                      setShowAuthDialog(true);
                      return;
                    }
                    setAddToPlaylistModalOpen(true);
                  }}
                >
                  <ListPlus className="text-main-white mr-2 size-4" />
                  <span className="text-main-white text-sm">Add to playlist</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="text-main-grey flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <Play className="size-3" />
              <span>{formatCount(track.streamCount)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Authentication Warning Dialog */}
      <WarningAuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        action={authDialogAction}
        trackName={track.name || undefined}
      />

      {/* Add to Playlist Modal */}
      {isAuthenticated && track.id && (
        <PlaylistAddModal open={addToPlaylistModalOpen} onOpenChange={setAddToPlaylistModalOpen} trackId={track.id} />
      )}
    </div>
  );
});

TrackItem.displayName = "TrackItem";

export default ArtistTrackSection;
