"use client";

import { useAudioStore } from "@/store";
import { streamingApi } from "@/services/streaming-services";
import { useEffect, useRef, useCallback } from "react";
import Hls from "hls.js";
import { getAccessTokenFromLocalStorage } from "@/utils/auth-utils";

const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const lastTrackIdRef = useRef<string | null>(null);
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
  } = useAudioStore();

  // Handle seeking when seekRequested changes
  useEffect(() => {
    if (seekRequested && audioRef.current) {
      const timeInSeconds = currentTime / 1000;
      audioRef.current.currentTime = timeInSeconds;
      resetSeekRequest();
    }
  }, [seekRequested, currentTime, resetSeekRequest]);

  // Load and play track
  const loadTrack = useCallback(
    async (trackId: string) => {
      if (!audioRef.current) return;

      try {
        setLoading(true);
        setError(null);

        // Get signed streaming URL
        const streamingUrl = await streamingApi.getSignedStreamingUrl(trackId);

        // Clean up previous HLS instance
        if (hlsRef.current) {
          hlsRef.current.destroy();
          hlsRef.current = null;
        }

        // Check if HLS is supported
        if (Hls.isSupported()) {
          // Use HLS.js for HLS streaming
          const hls = new Hls({
            maxBufferLength: 30, // Buffer tối đa 30 giây
            maxMaxBufferLength: 60, // Buffer tuyệt đối tối đa 60 giây
            maxBufferSize: 60 * 1000 * 1000, // 60MB buffer
            maxBufferHole: 0.5, // Cho phép hole trong buffer
            highBufferWatchdogPeriod: 3, // Kiểm tra buffer cao mỗi 3s
            nudgeOffset: 0.1, // Offset để tránh stalling
            nudgeMaxRetry: 3, // Số lần retry tối đa
            maxFragLookUpTolerance: 0.25, // Tolerance khi tìm fragment

            // progressive: true,
            enableWorker: true,
            lowLatencyMode: false,
            xhrSetup: (xhr) => {
              const token = getAccessTokenFromLocalStorage();
              xhr.setRequestHeader("Authorization", `Bearer ${token}`);
              xhr.withCredentials = true;
            },
          });

          hlsRef.current = hls;

          hls.loadSource(streamingUrl);
          hls.attachMedia(audioRef.current);

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            setLoading(false);
            if (isPlaying) {
              audioRef.current?.play().catch((error) => {
                console.error("Error playing audio:", error);
                setError("Failed to play audio");
              });
            }
          });

          hls.on(Hls.Events.ERROR, (event, data) => {
            console.error("HLS Error:", data);
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  setError("Network error occurred while loading audio");
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  setError("Media error occurred while playing audio");
                  break;
                default:
                  setError("An error occurred while loading audio");
                  break;
              }
            }
          });
        } else if (
          audioRef.current.canPlayType("application/vnd.apple.mpegurl")
        ) {
          // Native HLS support (Safari)
          audioRef.current.src = streamingUrl;
          setLoading(false);
          if (isPlaying) {
            audioRef.current.play().catch((error) => {
              console.error("Error playing audio:", error);
              setError("Failed to play audio");
            });
          }
        } else {
          setError("HLS streaming is not supported in this browser");
        }
      } catch (error) {
        console.error("Error loading track:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load track",
        );
        setLoading(false);
      }
    },
    [setLoading, setError, isPlaying],
  );

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, setError]);

  // Handle volume changes
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume / 100;
  }, [volume, isMuted]);

  // Load new track when currentTrack changes (but not when just playing/pausing)
  useEffect(() => {
    if (currentTrack?.id && currentTrack.id !== lastTrackIdRef.current) {
      lastTrackIdRef.current = currentTrack.id;
      loadTrack(currentTrack.id);
    }
  }, [currentTrack?.id, loadTrack]);

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
    console.error("Audio element error:", e);
    setError("Failed to play audio file");
    setLoading(false);
  };

  const handleLoadStart = () => {
    setLoading(true);
  };

  const handleCanPlay = () => {
    setLoading(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, []);

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

export default AudioPlayer;
