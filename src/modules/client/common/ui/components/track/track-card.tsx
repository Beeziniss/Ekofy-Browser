"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useCallback, useState } from "react";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, Heart, LinkIcon, ListPlus } from "lucide-react";
import { useAudioStore, useAuthStore } from "@/store";
import { GraphQLTrack, convertGraphQLTracksToStore } from "@/utils/track-converter";
import { WarningAuthDialog } from "@/modules/shared/ui/components/warning-auth-dialog";
import { PauseButtonMedium, PlayButtonMediumRounded } from "@/assets/icons";
import PlaylistAddModal from "@/modules/client/playlist/ui/components/playlist-add-modal";
import {
  useProcessTrackDiscoveryPopularity,
  useProcessTrackEngagementPopularity,
  useProcessArtistDiscoveryPopularity,
} from "@/gql/client-mutation-options/popularity-mutation-option";
import { PopularityActionType } from "@/gql/graphql";
import { useFavoriteTrack } from "@/modules/client/track/hooks/use-favorite-track";

type ArtistInfo = {
  id: string;
  stageName: string;
};

interface TrackCardProps {
  trackId: string;
  coverImage?: string;
  trackName?: string;
  artists: (ArtistInfo | null)[];
  trackQueue?: GraphQLTrack[];
  checkTrackInFavorite?: boolean;
  isExplicit?: boolean;
}

const TrackCard = React.memo(
  ({ trackId, coverImage, trackName, artists, trackQueue, checkTrackInFavorite, isExplicit }: TrackCardProps) => {
    const { isAuthenticated } = useAuthStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showAuthDialog, setShowAuthDialog] = useState(false);
    const [authDialogAction, setAuthDialogAction] = useState<"play" | "favorite" | "playlist">("play");
    const [addToPlaylistModalOpen, setAddToPlaylistModalOpen] = useState(false);
    const { mutate: trackEngagementPopularity } = useProcessTrackEngagementPopularity();
    const { mutate: trackDiscoveryPopularity } = useProcessTrackDiscoveryPopularity();
    const { mutate: artistDiscoveryPopularity } = useProcessArtistDiscoveryPopularity();
    const { handleFavorite: handleFavoriteTrack } = useFavoriteTrack();

    // Selective subscriptions - only subscribe to what affects THIS track
    const isCurrentTrack = useAudioStore((state) => state.currentTrack?.id === trackId);
    const globalIsPlaying = useAudioStore((state) => state.isPlaying);
    const setCurrentTrack = useAudioStore((state) => state.setCurrentTrack);
    const togglePlayPause = useAudioStore((state) => state.togglePlayPause);
    const play = useAudioStore((state) => state.play);
    const setQueue = useAudioStore((state) => state.setQueue);
    const skipToTrack = useAudioStore((state) => state.skipToTrack);

    // Memoize the track data to prevent recreation on every render
    const trackData = React.useMemo(
      () => ({
        id: trackId,
        name: trackName || "Unknown Track",
        artist:
          artists
            ?.map((a) => a?.stageName)
            .filter(Boolean)
            .join(", ") || "Unknown Artist",
        coverImage: coverImage,
      }),
      [trackId, trackName, artists, coverImage],
    );

    // Memoize handlers
    const handlePlayPauseClick = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();

        // Check if user is authenticated
        if (!isAuthenticated) {
          setAuthDialogAction("play");
          setShowAuthDialog(true);
          return;
        }

        if (isCurrentTrack) {
          togglePlayPause();
        } else {
          if (trackQueue && trackQueue.length > 0) {
            const queueTracks = convertGraphQLTracksToStore(trackQueue);
            setQueue(queueTracks);
            const trackIndex = queueTracks.findIndex((t) => t.id === trackId);
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
        trackQueue,
        setQueue,
        trackId,
        skipToTrack,
        setCurrentTrack,
        trackData,
        play,
      ],
    );

    const onCopy = (e: React.MouseEvent) => {
      e.stopPropagation();

      navigator.clipboard.writeText(window.location.href + `track/${trackId}`);
      toast.info("Copied!");
      // Track popularity for share action
      trackEngagementPopularity({
        trackId: trackId,
        actionType: PopularityActionType.Share,
      });
    };

    const handleFavorite = (e: React.MouseEvent) => {
      e.preventDefault();

      if (!trackId || !trackName) return;

      // Check if user is authenticated
      if (!isAuthenticated) {
        setAuthDialogAction("favorite");
        setShowAuthDialog(true);
        return;
      }

      handleFavoriteTrack({
        id: trackId,
        name: trackName,
        checkTrackInFavorite: checkTrackInFavorite || false,
      });
    };

    const handleTrackAddPopularity = () => {
      trackDiscoveryPopularity({
        trackId: trackId,
        actionType: PopularityActionType.Search,
      });
    };

    const handleArtistAddPopularity = () => {
      artistDiscoveryPopularity({
        artistId: artists[0]?.id || "",
        actionType: PopularityActionType.Search,
      });
    };
    return (
      <div className="w-full rounded-sm">
        <Link
          href={`/track/${trackId}`}
          onClick={handleTrackAddPopularity}
          className={`group relative flex aspect-square w-full cursor-pointer items-center justify-center rounded-md transition-opacity after:absolute after:inset-0 after:rounded-md after:bg-black after:content-[''] hover:after:opacity-20 ${isMenuOpen ? "after:opacity-20" : "after:opacity-0"}`}
        >
          <Image
            src={
              coverImage
                ? coverImage
                : "https://www.onlandscape.co.uk/wp-content/uploads/2012/01/IMG_6347-square-vertorama.jpg"
            }
            alt="Track Name"
            width={280}
            height={280}
            className="aspect-square h-full w-full rounded-md object-cover"
            unoptimized
          />

          {isExplicit && (
            <div
              className={
                "bg-main-purple absolute right-2 bottom-2 flex size-8 items-center justify-center rounded-md text-base font-semibold"
              }
            >
              E
            </div>
          )}

          <div className="absolute bottom-2 left-2 flex items-center gap-x-2">
            <Button
              onClick={handlePlayPauseClick}
              className={`bg-main-white hover:bg-main-white z-10 flex size-12 items-center justify-center rounded-full transition-opacity ${
                isCurrentTrack && globalIsPlaying
                  ? "opacity-100"
                  : `group-hover:opacity-100 ${isMenuOpen ? "opacity-100" : "opacity-0"}`
              }`}
            >
              {/* Show pause button only when this specific track is playing */}
              {isCurrentTrack && globalIsPlaying ? (
                <PauseButtonMedium className="size-8 sm:size-10 md:size-12" />
              ) : (
                <PlayButtonMediumRounded className="size-8 sm:size-10 md:size-12" />
              )}
            </Button>

            <Button
              onClick={handleFavorite}
              className={`bg-main-white hover:bg-main-white z-10 flex size-12 items-center justify-center rounded-full transition-opacity group-hover:opacity-100 ${isMenuOpen ? "opacity-100" : "opacity-0"}`}
            >
              <Heart
                className={`size-5 ${checkTrackInFavorite ? "text-main-purple fill-main-purple" : "text-main-dark-bg"}`}
              />
            </Button>

            <DropdownMenu onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  className={`bg-main-white hover:bg-main-white z-10 flex size-12 items-center justify-center rounded-full transition-opacity group-hover:opacity-100 ${isMenuOpen ? "opacity-100" : "opacity-0"}`}
                >
                  <Ellipsis className="text-main-dark-bg size-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start" className="w-48">
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
        </Link>

        <div className="mt-2 flex flex-col space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold sm:gap-3 sm:text-sm">
            <Link
              href={`/track/${trackId}`}
              onClick={handleTrackAddPopularity}
              className={`hover:text-main-purple line-clamp-1 ${
                isCurrentTrack && globalIsPlaying ? "text-main-purple" : ""
              }`}
            >
              {trackName}
            </Link>
            {/* Now Playing Indicator */}
            {isCurrentTrack && globalIsPlaying && (
              <div className="flex items-center gap-0.5">
                <div className="bg-main-purple h-1.5 w-0.5 animate-pulse rounded-full sm:h-2" />
                <div
                  className="bg-main-purple h-2.5 w-0.5 animate-pulse rounded-full sm:h-3"
                  style={{ animationDelay: "0.1s" }}
                />
                <div
                  className="bg-main-purple h-1.5 w-0.5 animate-pulse rounded-full sm:h-2"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            )}
          </div>

          <div className="text-main-grey line-clamp-1 text-xs sm:text-sm">
            {artists &&
              artists.length > 0 &&
              artists.map((artist, index) => (
                <span key={index}>
                  <Link
                    href={`/artists/${artist?.id}/tracks`}
                    onClick={handleArtistAddPopularity}
                    className="hover:text-main-purple hover:underline"
                  >
                    {artist?.stageName}
                  </Link>
                  {index < artists.length - 1 && ", "}
                </span>
              ))}
          </div>
        </div>

        {/* Authentication Warning Dialog */}
        <WarningAuthDialog
          open={showAuthDialog}
          onOpenChange={setShowAuthDialog}
          action={authDialogAction}
          trackName={trackName}
        />

        {/* Add to Playlist Modal */}
        {isAuthenticated && trackId && (
          <PlaylistAddModal open={addToPlaylistModalOpen} onOpenChange={setAddToPlaylistModalOpen} trackId={trackId} />
        )}
      </div>
    );
  },
);

TrackCard.displayName = "TrackCard";

export default TrackCard;
