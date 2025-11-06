"use client";

import { useAudioStore } from "@/store";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { useCallback } from "react";
import { Play, Pause } from "lucide-react";

interface SimplePlayButtonProps {
  trackId: string;
  trackName: string;
  trackArtist: string;
  trackCoverImage?: string | null;
  uploadId?: string; // For track approval context
  className?: string;
  size?: "sm" | "md" | "lg" | "full";
}

export function SimplePlayButton({
  trackId,
  trackName,
  trackArtist,
  trackCoverImage,
  uploadId, // Add this to the destructuring
  className,
  size = "sm",
}: SimplePlayButtonProps) {
  const { currentTrack, isPlaying, setCurrentTrack, togglePlayPause, isLoading } = useAudioStore();

  // Use uploadId if available, otherwise fall back to trackId
  const audioTrackId = uploadId || trackId;
  const isCurrentTrack = currentTrack?.id === audioTrackId;
  const isCurrentlyPlaying = isCurrentTrack && isPlaying;

  const handleClick = useCallback(() => {
    if (isCurrentTrack) {
      // If it's the current track, toggle play/pause
      togglePlayPause();
    } else {
      // If it's a different track, set as current track
      setCurrentTrack({
        id: trackId, // Use actual trackId for identification
        name: trackName,
        artist: trackArtist,
        coverImage: trackCoverImage || undefined,
        uploadId: uploadId, // Store uploadId for audio loading
      });
      // Audio player will auto-play when ready
    }
  }, [isCurrentTrack, togglePlayPause, setCurrentTrack, trackId, trackName, trackArtist, trackCoverImage, uploadId]);

  const sizeClasses = {
    sm: "h-8 w-8 p-0",
    md: "h-10 w-10 p-0", 
    lg: "h-14 w-14 p-0",
    full: "h-full w-full p-0",
  };

  const iconSizes = {
    sm: "h-5 w-5",
    md: "h-6 w-6",
    lg: "h-10 w-10",
    full: "h-12 w-12",
  };

  const backgroundClasses = {
    sm: "bg-white/50 hover:bg-white/70 backdrop-blur-sm border border-black/20",
    md: "bg-white/50 hover:bg-white/70 backdrop-blur-sm border border-black/20",
    lg: "bg-white/60 hover:bg-white/80 backdrop-blur-md border border-black/30 shadow-lg",
    full: "bg-white/60 hover:bg-white/80 backdrop-blur-md border border-black/30 shadow-lg",
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={isLoading && isCurrentTrack}
      className={cn(
        sizeClasses[size], 
        backgroundClasses[size],
        "text-white hover:text-white rounded-full transition-all duration-200",
        isCurrentTrack && "ring-2 ring-white/50",
        className
      )}
      title={isCurrentlyPlaying ? "Pause" : "Play"}
    >
      {isLoading && isCurrentTrack ? (
        <div className={cn("border-primary animate-spin rounded-full border-t-transparent", iconSizes[size])} />
      ) : isCurrentlyPlaying ? (
        <Pause className={cn(iconSizes[size], "text-black")} />
      ) : (
        <Play className={cn(iconSizes[size], "text-black")} />
      )}
    </Button>
  );
}
