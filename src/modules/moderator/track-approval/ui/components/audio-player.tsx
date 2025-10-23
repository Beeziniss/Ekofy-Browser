"use client";

import { useQuery } from "@tanstack/react-query";
import { moderatorTrackOriginalFileOptions } from "@/gql/options/moderator-options";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { AudioPlayerProps } from "@/types/approval-track";
import { Play, Pause, Loader2, Volume2, VolumeX, SkipBack, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAudioStore } from "@/store";
import { formatMilliseconds } from "@/utils/format-milliseconds";
import { useEffect } from "react";

export function AudioPlayer({ trackId, className }: AudioPlayerProps) {
  const { data: audioUrl, isLoading: isLoadingUrl } = useQuery(
    moderatorTrackOriginalFileOptions(trackId)
  );

  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isLoading,
    error,
    setCurrentTrack,
    togglePlayPause,
    setVolume,
    toggleMute,
    seek,
  } = useAudioStore();

  // Check if this track is currently playing
  const isCurrentTrack = currentTrack?.id === trackId;

  useEffect(() => {
    // If we have audio URL and this becomes the current track, no additional setup needed
    // The global audio player will handle the playback
  }, [audioUrl, isCurrentTrack]);

  const handlePlayPause = () => {
    if (!audioUrl) return;

    if (isCurrentTrack) {
      // If this track is already current, just toggle play/pause
      togglePlayPause();
    } else {
      // Set this as the current track (this will automatically start playing if isPlaying is true)
      setCurrentTrack({
        id: trackId,
        name: `Track ${trackId}`,
        artist: "Unknown Artist"
      });
      if (!isPlaying) {
        togglePlayPause();
      }
    }
  };

  const handleSeek = (value: number[]) => {
    if (isCurrentTrack && duration > 0) {
      const newTime = (value[0] / 100) * duration;
      seek(newTime);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  const currentProgress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const displayCurrentTime = isCurrentTrack ? currentTime : 0;
  const displayDuration = isCurrentTrack ? duration : 0;

  if (isLoadingUrl) {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <Button variant="ghost" size="sm" disabled>
          <Loader2 className="h-4 w-4 animate-spin" />
        </Button>
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (!audioUrl) {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <Button variant="ghost" size="sm" disabled>
          <Play className="h-4 w-4 text-muted-foreground" />
        </Button>
        <span className="text-sm text-muted-foreground">Audio not available</span>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center space-x-4 p-4 bg-muted/30 rounded-lg", className)}>
      {/* Playback Controls */}
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          disabled
          className="h-8 w-8 p-0 opacity-50"
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePlayPause}
          disabled={isLoading}
          className={cn(
            "h-10 w-10 p-0 rounded-full",
            isCurrentTrack && isPlaying && "bg-primary text-primary-foreground hover:bg-primary/90",
            error && "text-destructive"
          )}
          title={error || "Play/Pause"}
        >
          {isLoading && isCurrentTrack ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (isCurrentTrack && isPlaying) ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          disabled
          className="h-8 w-8 p-0 opacity-50"
        >
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="flex-1 space-y-2">
        <Slider
          value={[currentProgress]}
          onValueChange={handleSeek}
          max={100}
          step={0.1}
          className={cn(
            "w-full",
            !isCurrentTrack && "opacity-50 cursor-not-allowed"
          )}
          disabled={!isCurrentTrack || duration === 0}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatMilliseconds(displayCurrentTime)}</span>
          <span>{formatMilliseconds(displayDuration)}</span>
        </div>
      </div>

      {/* Volume Control */}
      <div className="flex items-center space-x-2 min-w-[120px]">
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
          className="w-20"
        />
        <span className="text-xs text-muted-foreground w-8 text-right">
          {Math.round(isMuted ? 0 : volume)}%
        </span>
      </div>

      {error && (
        <div className="text-xs text-destructive max-w-[100px] truncate">
          {error}
        </div>
      )}
    </div>
  );
}