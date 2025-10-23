"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { moderatorTrackOriginalFileOptions } from "@/gql/options/moderator-options";
import { Button } from "@/components/ui/button";
import { AudioPlayerProps, AudioPlayerState } from "@/types/approval-track";
import { Play, Pause, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function AudioPlayer({ trackId }: AudioPlayerProps) {
  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    isLoading: false,
    currentTime: 0,
    duration: 0,
    error: null,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { data: audioUrl, isLoading: isLoadingUrl } = useQuery(
    moderatorTrackOriginalFileOptions(trackId)
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setState(prev => ({
        ...prev,
        currentTime: audio.currentTime,
      }));
    };

    const handleDurationChange = () => {
      setState(prev => ({
        ...prev,
        duration: audio.duration,
      }));
    };

    const handleEnded = () => {
      setState(prev => ({
        ...prev,
        isPlaying: false,
        currentTime: 0,
      }));
    };

    const handleError = () => {
      setState(prev => ({
        ...prev,
        isPlaying: false,
        error: "Failed to load audio",
      }));
    };

    const handleLoadStart = () => {
      setState(prev => ({
        ...prev,
        isLoading: true,
      }));
    };

    const handleCanPlay = () => {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: null,
      }));
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("canplay", handleCanPlay);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, [audioUrl]);

  const togglePlayPause = async () => {
    if (!audioRef.current || !audioUrl) return;

    const audio = audioRef.current;

    if (state.isPlaying) {
      audio.pause();
      setState(prev => ({ ...prev, isPlaying: false }));
    } else {
      try {
        await audio.play();
        setState(prev => ({ ...prev, isPlaying: true }));
      } catch {
        setState(prev => ({
          ...prev,
          error: "Failed to play audio",
          isPlaying: false,
        }));
      }
    }
  };

  if (isLoadingUrl) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }

  if (!audioUrl) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <Play className="h-4 w-4 text-muted-foreground" />
      </Button>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={togglePlayPause}
        disabled={state.isLoading}
        className={cn(
          "h-8 w-8 p-0",
          state.error && "text-destructive"
        )}
        title={state.error || "Play/Pause"}
      >
        {state.isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : state.isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        className="hidden"
      />

      {/* Progress indicator (optional) */}
      {state.duration > 0 && (
        <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{
              width: `${(state.currentTime / state.duration) * 100}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}