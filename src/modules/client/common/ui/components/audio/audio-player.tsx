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
  const tokenRefreshInProgressRef = useRef<boolean>(false);
  const lastTokenRefreshAttemptRef = useRef<number>(0);

  const TOKEN_REFRESH_COOLDOWN = 5000; // 5 seconds cooldown

  // Helper function to safely get current playback state
  const getCurrentPlaybackState = useCallback(() => {
    if (!audioRef.current) {
      return { currentTime: 0, wasPlaying: false };
    }

    return {
      currentTime: audioRef.current.currentTime || 0,
      wasPlaying: !audioRef.current.paused && !audioRef.current.ended,
    };
  }, []);

  const {
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    queue,
    // isRepeating,
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

        // Get signed streaming URL with automatic token refresh on 401
        const streamingUrl = await streamingApi.getSignedStreamingUrlWithRetry(trackId);

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

          hls.on(Hls.Events.ERROR, async (event, data) => {
            console.error("HLS Error:", data);

            // Handle both fatal and non-fatal 401 errors
            const isTokenError =
              data.response?.code === 401 ||
              data.details === "manifestLoadError" ||
              data.details === "fragLoadError" || // Common when token expires mid-stream
              (data.response &&
                typeof data.response.code === "number" &&
                data.response.code >= 400 &&
                data.response.code < 500);

            if (isTokenError) {
              // Check if token refresh is already in progress or in cooldown
              const now = Date.now();
              if (tokenRefreshInProgressRef.current) {
                console.log("Token refresh already in progress, skipping...");
                return;
              }

              if (now - lastTokenRefreshAttemptRef.current < TOKEN_REFRESH_COOLDOWN) {
                console.log("Token refresh cooldown active, skipping...");
                return;
              }

              try {
                console.log("Token expired. Attempting refresh via refreshSignToken...");
                tokenRefreshInProgressRef.current = true;
                lastTokenRefreshAttemptRef.current = now;

                // 1. Capture current playback time to preserve user's position
                const { currentTime: savedTime, wasPlaying } = getCurrentPlaybackState();

                console.log(`Saving playback position: ${savedTime}s, was playing: ${wasPlaying}`);

                // 2. Get the old token from cache
                const oldToken = streamingApi.getCachedToken(trackId);

                if (!oldToken) {
                  throw new Error("No cached token found for refresh");
                }

                // 3. Call refreshSignToken with the old token
                const newToken = await streamingApi.refreshSignToken({
                  trackId,
                  oldToken,
                });

                // 4. Construct the new URL with the refreshed token
                const newStreamingUrl = streamingApi.getStreamingUrl(trackId, newToken);

                console.log("Token refreshed successfully. Reloading source...");

                // 5. Reload the source and seek back to previous position
                hls.loadSource(newStreamingUrl);

                // 6. Once manifest parses, seek to where we left off
                hls.once(Hls.Events.MANIFEST_PARSED, () => {
                  if (audioRef.current) {
                    console.log(`Restoring playback position to: ${savedTime}s`);
                    audioRef.current.currentTime = savedTime;
                    if (wasPlaying) {
                      audioRef.current.play().catch((playError) => {
                        console.error("Failed to resume playback:", playError);
                        setError("Failed to resume playback");
                      });
                    }
                  }
                  setLoading(false);
                });

                return; // Don't set error state, let it retry
              } catch (refreshError) {
                console.error("Failed to refresh streaming token:", refreshError);

                // Fallback: try force refresh as last resort
                try {
                  console.log("Attempting force refresh as fallback...");
                  const { currentTime: fallbackSavedTime, wasPlaying: fallbackWasPlaying } = getCurrentPlaybackState();

                  const newStreamingUrl = await streamingApi.forceRefreshStreamingUrl(trackId);

                  hls.loadSource(newStreamingUrl);

                  hls.once(Hls.Events.MANIFEST_PARSED, () => {
                    if (audioRef.current) {
                      audioRef.current.currentTime = fallbackSavedTime;
                      if (fallbackWasPlaying) {
                        audioRef.current.play().catch((playError) => {
                          console.error("Failed to resume playback after force refresh:", playError);
                        });
                      }
                    }
                    setLoading(false);
                  });

                  return;
                } catch (forceRefreshError) {
                  console.error("Force refresh also failed:", forceRefreshError);
                  setError("Session expired. Please retry.");
                  setLoading(false);
                }
              } finally {
                tokenRefreshInProgressRef.current = false;
              }
            }

            // Handle other fatal errors
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
        } else if (audioRef.current.canPlayType("application/vnd.apple.mpegurl")) {
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
        setError(error instanceof Error ? error.message : "Failed to load track");
        setLoading(false);
      }
    },
    [setLoading, setError, isPlaying, getCurrentPlaybackState],
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
      // Reset token refresh state when track changes
      tokenRefreshInProgressRef.current = false;
      lastTokenRefreshAttemptRef.current = 0;

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
    // TODO: Checkfor repeating logic here
    /* if (isRepeating) {
      // If repeating, restart the same track
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
        return;
      }
    } */

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
