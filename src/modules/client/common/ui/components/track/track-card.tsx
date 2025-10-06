"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, Heart, LinkIcon, ListPlus } from "lucide-react";
import { useAudioStore, Track } from "@/store";
import {
  GraphQLTrack,
  convertGraphQLTracksToStore,
} from "@/utils/track-converter";

type ArtistInfo = {
  id: string;
  stageName: string;
};

interface TrackCardProps {
  trackId: string;
  coverImage?: string;
  trackName?: string;
  artists?: (ArtistInfo | null)[];
  trackQueue?: GraphQLTrack[];
}

const TrackCard = ({
  trackId,
  coverImage,
  trackName,
  artists,
  trackQueue,
}: TrackCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Audio store integration
  const {
    currentTrack,
    isPlaying: globalIsPlaying,
    setCurrentTrack,
    togglePlayPause,
    play,
    setQueue,
  } = useAudioStore();

  // Check if this is the currently playing track
  const isCurrentTrack = currentTrack?.id === trackId;

  // Convert to Track format for the store
  const trackData: Track = {
    id: trackId,
    title: trackName || "Unknown Track",
    artist:
      artists
        ?.map((a) => a?.stageName)
        .filter(Boolean)
        .join(", ") || "Unknown Artist",
    coverImage: coverImage,
  };

  // Handle play/pause click
  const handlePlayPauseClick = () => {
    if (isCurrentTrack) {
      // If it's the current track, toggle play/pause
      togglePlayPause();
    } else {
      // If it's a different track, set as current track and play
      setCurrentTrack(trackData);
      if (trackQueue) {
        setQueue(convertGraphQLTracksToStore(trackQueue));
      }
      play();
    }
  };

  // TODO: Change this to appropriate link
  const onCopy = () => {
    navigator.clipboard.writeText("Hehe");
    toast.info("Link copied to clipboard");
  };

  return (
    <div className="max-w-70 rounded-sm">
      <div
        className="group relative size-70 overflow-hidden rounded-sm hover:cursor-pointer"
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
          className={`rounded-sm object-cover transition-transform duration-500`}
          unoptimized
        />
        <div
          className={`absolute top-0 left-0 size-full bg-[#00000080] ${isHovered || isMenuOpen ? "opacity-100" : "opacity-0"}`}
        />
        <div
          className={`absolute top-0 left-0 flex size-full items-center justify-center gap-x-7 transition-opacity duration-200 ${isHovered || isMenuOpen ? "opacity-100" : "opacity-0"}`}
        >
          <Button
            variant="ghost"
            size="iconMd"
            onClick={() => setIsLiked(!isLiked)}
            className="text-main-white rounded-full duration-0 hover:brightness-90"
          >
            <Heart
              className={`size-6 ${isLiked ? "fill-main-purple text-main-purple" : "text-main-white"}`}
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
              />
            ) : (
              <Image
                src={"/play-button-medium.svg"}
                alt="Ekofy Play Button"
                width={48}
                height={48}
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
                <Ellipsis className="text-main-white size-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuItem onClick={onCopy}>
                <LinkIcon className="text-main-white mr-2 size-4" />
                <span className="text-main-white text-sm">Copy link</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ListPlus className="text-main-white mr-2 size-4" />
                <span className="text-main-white text-sm">Add to playlist</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-2 flex flex-col">
        <div className="flex items-center gap-3 text-sm font-bold">
          <Link
            href={"#"}
            className={`hover:text-main-purple line-clamp-1 ${
              isCurrentTrack && globalIsPlaying ? "text-main-purple" : ""
            }`}
          >
            {trackName}
          </Link>
          {/* Now Playing Indicator */}
          {isCurrentTrack && globalIsPlaying && (
            <div className="flex items-center gap-0.5">
              <div className="bg-main-purple h-2 w-0.5 animate-pulse rounded-full" />
              <div
                className="bg-main-purple h-3 w-0.5 animate-pulse rounded-full"
                style={{ animationDelay: "0.1s" }}
              />
              <div
                className="bg-main-purple h-2 w-0.5 animate-pulse rounded-full"
                style={{ animationDelay: "0.2s" }}
              />
            </div>
          )}
        </div>

        <div className="text-main-grey line-clamp-1 text-sm">
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
};

export default TrackCard;
