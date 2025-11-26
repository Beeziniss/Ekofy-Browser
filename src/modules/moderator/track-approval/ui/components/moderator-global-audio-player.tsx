"use client";

import { useAudioStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { moderatorTrackOriginalFileOptions } from "@/gql/options/moderator-options";
import { useEffect, useRef, useCallback } from "react";

const ModeratorGlobalAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const lastTrackIdRef = useRef<string | null>(null);
  const loadingRef = useRef<boolean>(false);
  const {
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    queue,
    currentIndex,
    seekRequested,
    currentTime,
    setCurrentTime,
    setDuration,
    skipToNext,
    setLoading,
    setError,
    resetSeekRequest,
    pause,
    autoPlayWhenReady,
  } = useAudioStore();

  // Get moderator original file URL for current track using GraphQL
  const { data: moderatorAudioUrl, isLoading: isLoadingModeratorUrl } = useQuery({
    ...moderatorTrackOriginalFileOptions(currentTrack?.uploadId || ""),
    enabled: !!currentTrack?.uploadId,
  });

  // Handle seeking when seekRequested changes
  useEffect(() => {
    if (seekRequested && audioRef.current) {
      const timeInSeconds = currentTime / 1000;
      audioRef.current.currentTime = timeInSeconds;
      resetSeekRequest();
    }
  }, [seekRequested, currentTime, resetSeekRequest]);

  // Load and play track - simplified for direct file URLs only (GraphQL response)
  const loadTrack = useCallback(
    async (trackId: string, audioUrl: string) => {
      if (!audioRef.current || loadingRef.current) return;

      try {
        loadingRef.current = true;
        setLoading(true);
        setError(null);

        const audio = audioRef.current;
        // Abort any current play request first
        try {
          audio.pause();
          // Small delay to ensure pause completes
          await new Promise((resolve) => setTimeout(resolve, 50));
        } catch {
          // Ignore pause errors
        }

        // Clear any previous source
        if (audio.src) {
          audio.removeAttribute("src");
          audio.load();
          // Small delay to ensure load completes
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
        // Set new source (direct file URL from GraphQL)
        audio.src = audioUrl;
        audio.load();
        // Wait for audio to be ready
        const handleCanPlayThrough = () => {
          if (loadingRef.current && audioRef.current) {
            console.log("Audio ready to play:", audioUrl);
            setLoading(false);
            loadingRef.current = false;

            // Remove event listener first
            audio.removeEventListener("canplaythrough", handleCanPlayThrough);

            // Auto-start playing the new track after successful load
            if (currentTrack?.id === trackId) {
              setTimeout(() => {
                if (audioRef.current && audioRef.current.src === audioUrl) {
                  // Set playing state first, then play audio
                  autoPlayWhenReady();
                  audioRef.current.play().catch((error) => {
                    console.error("Error playing audio:", error);
                    if (!error.message.includes("interrupted") && !error.message.includes("aborted")) {
                      setError("Failed to play audio");
                    }
                  });
                }
              }, 100);
            }
          }
        };

        const handleLoadError = () => {
          if (loadingRef.current) {
            console.error("Error loading audio:", audioUrl);
            setError("Failed to load audio file");
            setLoading(false);
            loadingRef.current = false;
            audio.removeEventListener("canplaythrough", handleCanPlayThrough);
            audio.removeEventListener("error", handleLoadError);
          }
        };

        // Add event listeners
        audio.addEventListener("canplaythrough", handleCanPlayThrough);
        audio.addEventListener("error", handleLoadError);

        // Fallback timeout
        setTimeout(() => {
          if (loadingRef.current) {
            console.log("Audio load timeout, assuming ready:", audioUrl);
            setLoading(false);
            loadingRef.current = false;
            audio.removeEventListener("canplaythrough", handleCanPlayThrough);
            audio.removeEventListener("error", handleLoadError);
          }
        }, 3000);
      } catch (error) {
        console.error("Error loading track from GraphQL:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load track from GraphQL ORIGINAL_FILE_TRACK_UPLOAD_REQUEST_QUERY",
        );
        setLoading(false);
        loadingRef.current = false;
      }
    },
    [setLoading, setError, currentTrack?.id, autoPlayWhenReady],
  );

  // Handle play/pause - improved to prevent interrupted errors
  useEffect(() => {
    if (!audioRef.current || loadingRef.current) return;

    const audio = audioRef.current;
    if (isPlaying) {
      // Only play if audio has a source and is ready
      if (audio.src && audio.readyState >= 2) {
        // Add small delay to prevent interrupt conflicts
        setTimeout(() => {
          if (audioRef.current && audioRef.current.src && !loadingRef.current) {
            audioRef.current.play().catch((error) => {
              console.error("Error playing audio:", error);
              // Only set error if it's not an abort error from track switching
              if (!error.message.includes("interrupted") && !error.message.includes("aborted")) {
                setError("Failed to play audio");
              }
            });
          }
        }, 50);
      }
    } else {
      // Pause immediately
      try {
        audio.pause();
      } catch (error) {
        // Ignore pause errors
        console.log("Pause error (ignored):", error);
      }
    }
  }, [isPlaying, setError]);

  // Handle volume changes
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume / 100;
  }, [volume, isMuted]);

  // Load new track when currentTrack changes and audio URL is available
  useEffect(() => {
    if (currentTrack?.id && currentTrack?.uploadId && moderatorAudioUrl) {
      // Load track if it's a new track OR if we don't have audio loaded yet
      if (currentTrack.id !== lastTrackIdRef.current || !audioRef.current?.src) {
        // Stop any current playback first to prevent "interrupted" error
        if (audioRef.current && lastTrackIdRef.current) {
          try {
            audioRef.current.pause();
          } catch {
            // Ignore pause errors
          }
        }
        lastTrackIdRef.current = currentTrack.id;
        loadTrack(currentTrack.id, moderatorAudioUrl);
      }
    } else if (!currentTrack?.id && lastTrackIdRef.current) {
      // Clear audio when no track is selected
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.removeAttribute("src");
          audioRef.current.load();
        } catch {
          // Ignore errors during cleanup
        }
      }
      lastTrackIdRef.current = null;
      setError(null);
      setLoading(false);
      loadingRef.current = false;
    }
  }, [currentTrack?.id, currentTrack?.uploadId, moderatorAudioUrl, loadTrack, setError, setLoading]);

  // Set loading state when fetching moderator URL from GraphQL
  useEffect(() => {
    if (currentTrack?.uploadId) {
      setLoading(isLoadingModeratorUrl);
    }
  }, [isLoadingModeratorUrl, currentTrack?.uploadId, setLoading]);

  // Audio event handlers
  const handleTimeUpdate = () => {
    if (audioRef.current && !seekRequested) {
      setCurrentTime(audioRef.current.currentTime * 1000); // Convert to milliseconds
    }
  };

  const handleDurationChange = () => {
    if (audioRef.current && audioRef.current.duration) {
      setDuration(audioRef.current.duration * 1000); // Convert to milliseconds
    }
  };

  const handleEnded = () => {
    // Auto skip to next track when current track ends
    if (queue.length > 0 && currentIndex < queue.length - 1) {
      skipToNext();
    } else {
      pause();
    }
  };

  const handleError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    const target = e.target as HTMLAudioElement;
    // Only log and set error if there's actually a track selected
    if (currentTrack?.id) {
      console.error("Audio element error for track:", currentTrack.id, {
        error: target.error,
        networkState: target.networkState,
        readyState: target.readyState,
        src: target.src,
      });

      if (target.error) {
        let errorMessage = "Failed to play audio file";
        switch (target.error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMessage = "Audio playback was aborted";
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            errorMessage = "Network error occurred while loading audio";
            break;
          case MediaError.MEDIA_ERR_DECODE:
            errorMessage = "Audio file format not supported";
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = "Audio source not supported";
            break;
        }
        setError(errorMessage);
      } else {
        setError("Failed to play audio file");
      }
    }
    setLoading(false);
    loadingRef.current = false;
  };

  const handleLoadStart = () => {
    // Only set loading if there's a valid track
    if (currentTrack?.id) {
      setLoading(true);
    }
  };

  const handleCanPlay = () => {
    // Only clear loading if there's a valid track
    if (currentTrack?.id && loadingRef.current) {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  // Cleanup on unmount or page change
  useEffect(() => {
    const audioElement = audioRef.current;
    return () => {
      if (audioElement) {
        loadingRef.current = false;
        try {
          audioElement.pause();
          audioElement.removeAttribute("src");
          audioElement.load();
        } catch {
          // Ignore cleanup errors
        }
      }
      // Reset states
      setError(null);
      setLoading(false);
    };
  }, [setError, setLoading]);

  return (
    <audio
      ref={audioRef}
      onTimeUpdate={handleTimeUpdate}
      onDurationChange={handleDurationChange}
      onEnded={handleEnded}
      onError={handleError}
      onLoadStart={handleLoadStart}
      onCanPlay={handleCanPlay}
      preload="none"
      style={{ display: "none" }}
    />
  );
};

export default ModeratorGlobalAudioPlayer;
