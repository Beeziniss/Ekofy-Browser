"use client";

import { useAudioStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Music,
  Shuffle,
  Repeat
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
    queue,
    currentIndex,
    isShuffling,
    isRepeating,
    togglePlayPause,
    seek,
    setVolume,
    toggleMute,
    skipToNext,
    skipToPrevious,
    toggleShuffle,
    toggleRepeat,
  } = useAudioStore();

  const handleSeek = (value: number[]) => {
    const newTime = (value[0] / 100) * duration;
    seek(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  const hasNextTrack = queue.length > 0 && currentIndex < queue.length - 1;
  const hasPrevTrack = queue.length > 0 && currentIndex > 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 transition-[margin-left] duration-200 ease-linear ml-0 lg:ml-64 group-has-data-[collapsible=icon]/sidebar-wrapper:lg:ml-12">
      <section className="flex h-14 items-center gap-x-6 bg-[#303030] px-6 py-3 text-white shadow-2xl">
        {/* Controls Section */}
        <div className="flex-1 flex items-center gap-6 max-w-4xl mx-auto">
          {/* Control Buttons */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleShuffle}
              disabled={!currentTrack}
              className={`h-8 w-8 p-0 hover:bg-gray-600 disabled:opacity-50 ${isShuffling ? 'text-green-400' : 'text-gray-300'}`}
            >
              <Shuffle className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={skipToPrevious}
              disabled={!hasPrevTrack || !currentTrack}
              className="h-8 w-8 p-0 hover:bg-gray-600 disabled:opacity-50"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="lg"
              onClick={togglePlayPause}
              disabled={isLoading || !currentTrack}
              className="h-10 w-10 p-0 bg-white text-black hover:bg-gray-200 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
              ) : isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 ml-0.5" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={skipToNext}
              disabled={!hasNextTrack || !currentTrack}
              className="h-8 w-8 p-0 hover:bg-gray-600 disabled:opacity-50"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleRepeat}
              disabled={!currentTrack}
              className={`h-8 w-8 p-0 hover:bg-gray-600 disabled:opacity-50 ${isRepeating ? 'text-green-400' : 'text-gray-300'}`}
            >
              <Repeat className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-xs text-gray-300 w-12 text-right flex-shrink-0">
              {formatMilliseconds(currentTime)}
            </span>
            <Slider
              value={[progressPercentage]}
              onValueChange={handleSeek}
              max={100}
              step={0.1}
              className="flex-1 [&_[role=slider]]:bg-white [&_[role=slider]]:border-white"
              disabled={!duration || isLoading || !currentTrack}
            />
            <span className="text-xs text-gray-300 w-12 flex-shrink-0">
              {formatMilliseconds(duration)}
            </span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2 w-32">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            className="h-8 w-8 p-0 hover:bg-gray-600"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume]}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
            className="flex-1 [&_[role=slider]]:bg-white [&_[role=slider]]:border-white"
          />
        </div>

        {/* Track Info */}
        <div className="flex items-center justify-end gap-3 min-w-0">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src={currentTrack?.coverImage || undefined} alt={currentTrack?.name || "No track"} />
            <AvatarFallback className="bg-gray-600">
              <Music className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="font-medium truncate text-sm">
              {currentTrack?.name || "No track selected"}
            </p>
            <p className="text-xs text-gray-300 truncate">
              {currentTrack?.artist || "Select a track to play"}
            </p>
          </div>
        </div>
        {/* Error State */}
        {error && (
          <div className="text-xs text-red-400 max-w-40 truncate ml-4">
            {error}
          </div>
        )}
      </section>
    </div>
  );
}