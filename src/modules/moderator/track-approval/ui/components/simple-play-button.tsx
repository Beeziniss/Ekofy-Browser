"use client";

import { useAudioStore } from "@/store";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useCallback, useRef, useEffect } from "react";

interface SimplePlayButtonProps {
  trackId: string;
  trackName: string;
  trackArtist: string;
  trackCoverImage?: string | null;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function SimplePlayButton({ 
  trackId, 
  trackName, 
  trackArtist, 
  trackCoverImage, 
  className,
  size = "sm" 
}: SimplePlayButtonProps) {
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const {
    currentTrack,
    isPlaying,
    setCurrentTrack,
    togglePlayPause,
    isLoading,
  } = useAudioStore();

  const isCurrentTrack = currentTrack?.id === trackId;
  const isCurrentlyPlaying = isCurrentTrack && isPlaying;

  const handleClick = useCallback(() => {
    // Debounce clicks to prevent multiple rapid calls
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    
    clickTimeoutRef.current = setTimeout(() => {
      if (isCurrentTrack) {
        // If it's the current track, toggle play/pause
        togglePlayPause();
      } else {
        // If it's a different track, set as current and it will auto-play
        setCurrentTrack({
          id: trackId,
          name: trackName,
          artist: trackArtist,
          coverImage: trackCoverImage || undefined,
        });
      }
    }, 100); // 100ms debounce
  }, [isCurrentTrack, togglePlayPause, setCurrentTrack, trackId, trackName, trackArtist, trackCoverImage]);

  const sizeClasses = {
    sm: "h-8 w-8 p-0",
    md: "h-10 w-10 p-0", 
    lg: "h-12 w-12 p-0"
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

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
          width={32}
          height={32}
        />
      ) : (
        <Image
          src={"/play-button.svg"}
          alt="Ekofy Play Button"
          width={32}
          height={32}
        />  
      )}
    </Button>
  );
}