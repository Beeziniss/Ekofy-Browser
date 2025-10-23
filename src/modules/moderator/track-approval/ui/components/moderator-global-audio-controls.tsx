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
  Music
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
    togglePlayPause,
    seek,
    setVolume,
    toggleMute,
  } = useAudioStore();

  if (!currentTrack) {
    return null;
  }

  const handleSeek = (value: number[]) => {
    const newTime = (value[0] / 100) * duration;
    seek(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-background border-t z-50 mt-6">
      <div className="flex items-center gap-4 p-4">
        {/* Track Info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Avatar className="h-12 w-12 flex-shrink-0">
            <AvatarImage src={currentTrack.coverImage || undefined} alt={currentTrack.name} />
            <AvatarFallback>
              <Music className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-medium truncate">{currentTrack.name}</p>
            <p className="text-sm text-muted-foreground truncate">{currentTrack.artist}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-2 flex-1 max-w-md">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" disabled>
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePlayPause}
              disabled={isLoading}
              className="h-10 w-10 p-0"
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>
            <Button variant="ghost" size="sm" disabled>
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 w-full">
            <span className="text-xs text-muted-foreground w-10 text-right">
              {formatMilliseconds(currentTime)}
            </span>
            <Slider
              value={[progressPercentage]}
              onValueChange={handleSeek}
              max={100}
              step={0.1}
              className="flex-1"
              disabled={!duration || isLoading}
            />
            <span className="text-xs text-muted-foreground w-10">
              {formatMilliseconds(duration)}
            </span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            className="h-8 w-8 p-0"
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
            className="w-24"
          />
          <span className="text-xs text-muted-foreground w-8">
            {Math.round(isMuted ? 0 : volume)}%
          </span>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-xs text-destructive max-w-32 truncate">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}