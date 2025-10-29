"use client";

import { useAudioStore } from "@/store";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useCallback } from "react";

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
  size = "sm" 
}: SimplePlayButtonProps) {
  const {
    currentTrack,
    isPlaying,
    setCurrentTrack,
    togglePlayPause,
    isLoading,
  } = useAudioStore();

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
    lg: "h-12 w-12 p-0",
    full: "h-full w-full p-0"
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
    full: "h-16 w-16"
  };

  return (
    <Button
      variant={isCurrentTrack ? "default" : "ghost"}
      size="sm"
      onClick={handleClick}
      disabled={isLoading && isCurrentTrack}
      className={cn(sizeClasses[size], className)}
      title={isCurrentlyPlaying ? "Pause" : "Play"}
    >
      {isLoading && isCurrentTrack ? (
        <div className={cn("animate-spin rounded-full border-primary border-t-transparent", iconSizes[size])} />
      ) : isCurrentlyPlaying ? (
        <Image
          src={"/pause-button.svg"}
          alt="Ekofy Pause Button"
          width={size === "full" ? 64 : 32}
          height={size === "full" ? 64 : 32}
        />
      ) : (
        <Image
          src={"/play-button.svg"}
          alt="Ekofy Play Button"
          width={size === "full" ? 64 : 32}
          height={size === "full" ? 64 : 32}
        />  
      )}
    </Button>
  );
}