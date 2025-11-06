"use client";

import { useAudioStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Play,
  Pause,
  // SkipBack,
  // SkipForward,
  Volume2,
  VolumeX,
  Music,
  // Shuffle,
  // Repeat
} from "lucide-react";
import { formatMilliseconds } from "@/utils/format-milliseconds";

export function ModeratorGlobalAudioControls() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isLoading,
    error,
    // queue,
    // currentIndex,
    // isShuffling,
    // isRepeating,
    togglePlayPause,
    seek,
    setVolume,
    toggleMute,
    // skipToNext,
    // skipToPrevious,
    // toggleShuffle,
    // toggleRepeat,
  } = useAudioStore();

  const handleSeek = (value: number[]) => {
    const newTime = (value[0] / 100) * duration;
    seek(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  // const hasNextTrack = queue.length > 0 && currentIndex < queue.length - 1;
  // const hasPrevTrack = queue.length > 0 && currentIndex > 0;

  return (
    <div className="sticky right-0 bottom-0 left-0 z-50 mt-auto">
      <section className="flex h-14 items-center gap-x-4 overflow-hidden bg-[#303030] px-3 py-2 text-white shadow-2xl">
        {/* Control Button */}
        <div className="flex-shrink-0">
          <Button
            variant="ghost"
            size="lg"
            onClick={togglePlayPause}
            disabled={isLoading || !currentTrack}
            className="h-8 w-8 rounded-full bg-white p-0 text-black hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
            ) : isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="ml-0.5 h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Progress Bar Section */}
        <div className="flex max-w-[70%] min-w-0 flex-1 items-center gap-2">
          <span className="hidden w-8 flex-shrink-0 text-right text-xs text-gray-300 sm:block">
            {formatMilliseconds(currentTime)}
          </span>
          <Slider
            value={[progressPercentage]}
            onValueChange={handleSeek}
            max={100}
            step={0.1}
            className="flex-1 [&_[role=slider]]:border-white [&_[role=slider]]:bg-white"
            disabled={!duration || isLoading || !currentTrack}
          />
          <span className="hidden w-8 flex-shrink-0 text-xs text-gray-300 sm:block">
            {formatMilliseconds(duration)}
          </span>
        </div>

        {/* Volume Control */}
        <div className="hidden w-24 items-center gap-1 lg:flex">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            className="h-6 w-6 flex-shrink-0 p-0 hover:bg-gray-600"
          >
            {isMuted || volume === 0 ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume]}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
            className="flex-1 [&_[role=slider]]:border-white [&_[role=slider]]:bg-white"
          />
        </div>

        {/* Track Info */}
        <div className="flex max-w-[100px] min-w-0 flex-shrink-0 items-center gap-2 sm:max-w-[140px] lg:max-w-[180px]">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={currentTrack?.coverImage || undefined} alt={currentTrack?.name || "No track"} />
            <AvatarFallback className="bg-gray-600">
              <Music className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="hidden min-w-0 flex-1 md:block">
            <p className="truncate text-xs font-medium">{currentTrack?.name || "No track selected"}</p>
            <p className="truncate text-xs text-gray-300">{currentTrack?.artist || "Select a track"}</p>
          </div>
        </div>

        {/* Error State */}
        {error && <div className="hidden max-w-12 flex-shrink-0 truncate text-xs text-red-400 xl:block">{error}</div>}
      </section>
    </div>
  );
}
