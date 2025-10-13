"use client";

import { Suspense } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Track, useAudioStore } from "@/store";
import { Skeleton } from "@/components/ui/skeleton";
import { TrackDetailQuery } from "@/gql/graphql";
import { HeartIcon, PlayIcon } from "lucide-react";
import { formatPlayCount } from "@/utils/format-number";

interface TrackSectionProps {
  data: TrackDetailQuery;
  trackId: string;
}

const TrackSection = ({ data, trackId }: TrackSectionProps) => {
  return (
    <Suspense fallback={<TrackSectionSkeleton />}>
      <TrackSectionSuspense data={data} trackId={trackId} />
    </Suspense>
  );
};

const TrackSectionSkeleton = () => {
  return (
    <div className="bg-main-card-bg flex flex-row gap-x-8 p-8">
      <Skeleton className="size-70 rounded-md" />
      <div className="flex flex-col gap-y-2">
        <Skeleton className="h-10 w-72 rounded-full" />
        <Skeleton className="h-7 w-32 rounded-full" />

        <Skeleton className="mt-auto h-16 w-16 rounded-full" />
      </div>
    </div>
  );
};

// TODO: Check for track-card.tsx for code and fix to apply approriate changes in future
const TrackSectionSuspense = ({ data, trackId }: TrackSectionProps) => {
  const {
    currentTrack,
    isPlaying: globalIsPlaying,
    setCurrentTrack,
    togglePlayPause,
    play,
  } = useAudioStore();

  // Check if this is the currently playing track
  const isCurrentTrack = currentTrack?.id === trackId;

  // Convert to Track format for the store
  const trackData: Track = {
    id: trackId,
    title: data?.tracks?.items?.[0]?.name || "Unknown Track",
    artist:
      data?.tracks?.items?.[0]?.artist
        ?.map((a) => a?.stageName)
        .filter(Boolean)
        .join(", ") || "Unknown Artist",
    coverImage: data?.tracks?.items?.[0]?.coverImage || "",
  };

  // Handle play/pause click
  const handlePlayPauseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isCurrentTrack) {
      // If it's the current track, toggle play/pause
      togglePlayPause();
    } else {
      // If it's a different track, set as current track and play
      setCurrentTrack(trackData);
      play();
    }
  };

  return (
    <div className="bg-main-card-bg flex flex-row gap-x-8 p-8">
      <Image
        src={data.tracks?.items?.[0]?.coverImage || ""}
        alt="Cover"
        width={280}
        height={280}
        className="size-70 rounded-md object-cover"
      />

      <div className="flex flex-col">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-main-white text-4xl font-bold">
            {data.tracks?.items?.[0]?.name}
          </h1>
          <p className="text-lg font-semibold">
            {data.tracks?.items?.[0].artist[0]?.stageName}
          </p>

          <div className="bg-main-dark-bg-1 flex w-fit items-center gap-x-3 rounded-sm border-white/30 px-2 py-1">
            <div className="flex items-center gap-x-1.5">
              <PlayIcon className="text-main-white size-4" />
              <span className="text-main-white text-sm">
                {formatPlayCount(data.tracks?.items?.[0]?.streamCount || 0)}
              </span>
            </div>

            <div className="flex items-center gap-x-1.5">
              <HeartIcon className="text-main-white size-4" />
              <span className="text-main-white text-sm">
                {formatPlayCount(data.tracks?.items?.[0]?.favoriteCount || 0)}
              </span>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="iconXl"
          className="text-main-white mt-auto duration-0 hover:brightness-90"
          onClick={handlePlayPauseClick}
        >
          {currentTrack && currentTrack.id === trackId && globalIsPlaying ? (
            <Image
              src={"/pause-button-large.svg"}
              alt="Ekofy Pause Button"
              width={64}
              height={64}
            />
          ) : (
            <Image
              src={"/play-button-large.svg"}
              alt="Ekofy Play Button"
              width={64}
              height={64}
            />
          )}
        </Button>
      </div>
    </div>
  );
};

export default TrackSection;
