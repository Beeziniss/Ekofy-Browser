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
    seekRequested,
    currentTime,
    setCurrentTime,
    setDuration,
    setLoading,
    setError,
    resetSeekRequest,
    pause,
  } = useAudioStore();

  // Get audio URL for current track
  const { data: audioUrl, isLoading: isLoadingUrl, error: urlError } = useQuery({
    ...moderatorTrackOriginalFileOptions(currentTrack?.id || ""),
    enabled: !!currentTrack?.id,
  });

  // Debug logging
  useEffect(() => {
    if (currentTrack?.id) {
      console.log("ModeratorGlobalAudioPlayer - Current track:", {
        id: currentTrack.id,
        name: currentTrack.name,
        audioUrl,
        isLoadingUrl,
        urlError
      });
    }
  }, [currentTrack?.id, currentTrack?.name, audioUrl, isLoadingUrl, urlError]);

  // Handle seeking when seekRequested changes
  useEffect(() => {
    if (seekRequested && audioRef.current) {
      const timeInSeconds = currentTime / 1000;
      audioRef.current.currentTime = timeInSeconds;
      resetSeekRequest();
    }
  }, [seekRequested, currentTime, resetSeekRequest]);

  // Load track - simplified and more reliable version
  const loadTrack = useCallback(
    async (trackId: string, url: string) => {
      if (!audioRef.current || loadingRef.current) return;

      try {
        loadingRef.current = true;
        setLoading(true);
        setError(null);

        const audio = audioRef.current;
        
        // Stop current playback
        audio.pause();
        
        // Clear any previous source
        if (audio.src) {
          audio.removeAttribute('src');
          audio.load();
        }
        
        // Set new source
        audio.src = url;
        audio.load();
        
        // Wait for audio to be ready using events
        const handleCanPlayThrough = () => {
          if (loadingRef.current) {
            console.log("Audio can play through:", url);
            setLoading(false);
            loadingRef.current = false;
            
            // Try to play if should be playing
            if (isPlaying && audioRef.current) {
              audioRef.current.play().catch((error) => {
                console.error("Error playing audio:", error);
                setError("Failed to play audio");
              });
            }
            
            // Remove event listener
            audio.removeEventListener('canplaythrough', handleCanPlayThrough);
          }
        };

        const handleLoadError = () => {
          if (loadingRef.current) {
            console.error("Error loading audio:", url);
            setError("Failed to load audio file");
            setLoading(false);
            loadingRef.current = false;
            audio.removeEventListener('canplaythrough', handleCanPlayThrough);
            audio.removeEventListener('error', handleLoadError);
          }
        };

        // Add event listeners
        audio.addEventListener('canplaythrough', handleCanPlayThrough);
        audio.addEventListener('error', handleLoadError);
        
        // Fallback timeout in case events don't fire
        setTimeout(() => {
          if (loadingRef.current) {
            console.log("Audio load timeout, assuming ready:", url);
            setLoading(false);
            loadingRef.current = false;
            audio.removeEventListener('canplaythrough', handleCanPlayThrough);
            audio.removeEventListener('error', handleLoadError);
          }
        }, 3000); // 3 second timeout
        
      } catch (error) {
        console.error("Error loading track:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load track",
        );
        setLoading(false);
        loadingRef.current = false;
      }
    },
    [setLoading, setError, isPlaying],
  );

  // Handle play/pause - improved with better error handling
  useEffect(() => {
    if (!audioRef.current || loadingRef.current) return;

    const audio = audioRef.current;
    
    if (isPlaying) {
      // Only play if audio has a source and is ready
      if (audio.src && audio.readyState >= 2) {
        audio.play().catch((error) => {
          console.error("Error playing audio:", error);
          setError("Failed to play audio");
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, setError]);

  // Handle volume changes
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume / 100;
  }, [volume, isMuted]);

  // Handle URL error
  useEffect(() => {
    if (urlError) {
      console.error("Error fetching audio URL:", urlError);
      setError("Failed to fetch audio URL");
      setLoading(false);
      loadingRef.current = false;
    }
  }, [urlError, setError, setLoading]);

  // Load new track when currentTrack changes (but not when just playing/pausing)
  useEffect(() => {
    if (currentTrack?.id && currentTrack.id !== lastTrackIdRef.current) {
      if (audioUrl) {
        console.log("Loading new track:", { trackId: currentTrack.id, audioUrl });
        lastTrackIdRef.current = currentTrack.id;
        loadTrack(currentTrack.id, audioUrl);
      } else if (!isLoadingUrl && !urlError) {
        // Audio URL is not available and not loading, show error
        console.warn("No audio URL available for track:", currentTrack.id);
        setError("Audio file not available");
        lastTrackIdRef.current = currentTrack.id;
      }
    }
  }, [currentTrack?.id, audioUrl, loadTrack, isLoadingUrl, urlError, setError]);

  // Handle loading state from URL query
  useEffect(() => {
    if (currentTrack?.id) {
      setLoading(isLoadingUrl);
    }
  }, [isLoadingUrl, currentTrack?.id, setLoading]);

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
    pause();
  };

  const handleError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    const target = e.target as HTMLAudioElement;
    console.error("Audio element error:", {
      error: target.error,
      networkState: target.networkState,
      readyState: target.readyState,
      src: target.src
    });
    
    // More specific error messages
    let errorMessage = "Failed to play audio file";
    if (target.error) {
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
    }
    
    setError(errorMessage);
    setLoading(false);
    loadingRef.current = false;
  };

  const handleLoadStart = () => {
    if (!loadingRef.current) {
      setLoading(true);
    }
  };

  const handleCanPlay = () => {
    if (loadingRef.current) {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    const audioElement = audioRef.current;
    return () => {
      if (audioElement) {
        loadingRef.current = false;
        audioElement.pause();
        audioElement.src = '';
        audioElement.load();
      }
    };
  }, []);

  if (!currentTrack) {
    return null;
  }

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