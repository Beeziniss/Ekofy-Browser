"use client";

import { useAudioStore, Track } from "@/store";
import { toast } from "sonner";

export const useTrackPlayback = (trackId: string, trackData?: {
  id: string;
  name?: string | null;
  coverImage?: string | null;
  mainArtists?: {
    items?: Array<{
      stageName?: string | null;
    } | null> | null;
  } | null;
}) => {
  const {
    isPlaying: globalIsPlaying,
    currentTrack,
    togglePlayPause,
    setCurrentTrack,
    play,
  } = useAudioStore();

  // Check if THIS specific track is currently playing
  const isTrackCurrentlyPlaying = currentTrack?.id === trackId;

  // Convert track data to Track format for the store
  const convertToTrackFormat = (track: typeof trackData): Track => {
    if (!track) {
      throw new Error("Track data is required");
    }

    return {
      id: track.id,
      name: track.name || "Unknown Track",
      artist:
        track.mainArtists?.items
          ?.map((a) => a?.stageName)
          .filter(Boolean)
          .join(", ") || "Unknown Artist",
      coverImage: track.coverImage || "",
    };
  };

  // Handle play/pause click for track
  const handlePlayPause = async () => {
    // If this track is currently playing, toggle play/pause
    if (isTrackCurrentlyPlaying) {
      togglePlayPause();
      return;
    }

    // If we have track data, play this track
    if (trackData) {
      try {
        const trackForPlayer = convertToTrackFormat(trackData);
        setCurrentTrack(trackForPlayer);
        play();
      } catch (error) {
        toast.error("Failed to play track");
        console.error("Error playing track:", error);
      }
    } else {
      toast.error("Track data not available");
    }
  };

  return {
    isTrackCurrentlyPlaying,
    isPlaying: globalIsPlaying,
    handlePlayPause,
  };
};