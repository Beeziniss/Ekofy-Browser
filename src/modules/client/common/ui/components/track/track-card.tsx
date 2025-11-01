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
import { useAudioStore } from "@/store";
import {
  GraphQLTrack,
  convertGraphQLTracksToStore,
} from "@/utils/track-converter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { favoriteTrackMutationOptions } from "@/gql/options/client-mutation-options";

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
}

const TrackCard = React.memo(
  ({
    trackId,
    coverImage,
    trackName,
    artists,
    trackQueue,
    checkTrackInFavorite,
  }: TrackCardProps) => {
    const queryClient = useQueryClient();
    const [isHovered, setIsHovered] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Selective subscriptions - only subscribe to what affects THIS track
    const isCurrentTrack = useAudioStore(
      (state) => state.currentTrack?.id === trackId,
    );
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
    };

    const { mutate: favoriteTrack } = useMutation({
      ...favoriteTrackMutationOptions,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["track-detail", trackId],
        });
        queryClient.invalidateQueries({
          queryKey: ["tracks-home"],
        });
      },
      onError: (error) => {
        console.error("Failed to add track to favorites:", error);
        toast.error("Failed to add track to favorites. Please try again.");
      },
    });

    const handleFavorite = (e: React.MouseEvent) => {
      e.preventDefault();

      if (!trackId) return;

      if (checkTrackInFavorite) {
        favoriteTrack({ trackId, isAdding: false });
        toast.success(`${trackName} removed from favorites!`);
      } else {
        favoriteTrack({ trackId, isAdding: true });
        toast.success(`${trackName} added to favorites!`);
      }
    };

    return (
      <div className="w-full rounded-sm">
        <Link href={`/track/${trackId}`}>
          <div
            className="group relative aspect-square w-full overflow-hidden rounded-sm hover:cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
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
              className="h-full w-full rounded-sm object-cover transition-transform duration-500"
              unoptimized
            />
            <div
              className={`absolute top-0 left-0 size-full bg-[#00000080] ${isHovered || isMenuOpen || (globalIsPlaying && isCurrentTrack) ? "opacity-100" : "opacity-0"}`}
            />
            <div
              className={`absolute top-0 left-0 flex size-full items-center justify-center gap-x-2 transition-opacity duration-200 sm:gap-x-4 md:gap-x-6 lg:gap-x-7 ${isHovered || isMenuOpen || (globalIsPlaying && isCurrentTrack) ? "opacity-100" : "opacity-0"}`}
            >
              <Button
                variant="ghost"
                size="iconMd"
                onClick={handleFavorite}
                className="rounded-full duration-0 hover:brightness-90"
              >
                <Heart
                  className={`size-4 sm:size-5 md:size-6 ${checkTrackInFavorite ? "fill-main-purple text-main-purple" : "text-main-white"}`}
                />
              </Button>

              <Button
                variant="ghost"
                size="iconLg"
                className="text-main-white rounded-full transition-transform duration-0 hover:scale-105 hover:brightness-90"
                onClick={handlePlayPauseClick}
              >
                {/* Show pause button only when this specific track is playing */}
                {isCurrentTrack && globalIsPlaying ? (
                  <Image
                    src={"/pause-button-medium.svg"}
                    alt="Ekofy Pause Button"
                    width={48}
                    height={48}
                    className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12"
                  />
                ) : (
                  <Image
                    src={"/play-button-medium.svg"}
                    alt="Ekofy Play Button"
                    width={48}
                    height={48}
                    className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12"
                  />
                )}
              </Button>

              <DropdownMenu onOpenChange={setIsMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="iconMd"
                    className="text-main-white rounded-full duration-0 hover:brightness-90"
                  >
                    <Ellipsis className="text-main-white size-4 sm:size-5 md:size-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  <DropdownMenuItem onClick={onCopy}>
                    <LinkIcon className="text-main-white mr-2 size-4" />
                    <span className="text-main-white text-sm">Copy link</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ListPlus className="text-main-white mr-2 size-4" />
                    <span className="text-main-white text-sm">
                      Add to playlist
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </Link>

        <div className="mt-2 flex flex-col space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold sm:gap-3 sm:text-sm">
            <Link
              href={`/track/${trackId}`}
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
                    href="#"
                    className="hover:text-main-purple hover:underline"
                  >
                    {artist?.stageName}
                  </Link>
                  {index < artists.length - 1 && ", "}
                </span>
              ))}
          </div>
        </div>
      </div>
    );
  },
);

TrackCard.displayName = "TrackCard";

export default TrackCard;
