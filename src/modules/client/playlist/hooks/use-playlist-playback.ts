"use client";

import { useQuery } from "@tanstack/react-query";
import { playlistDetailTrackListOptions } from "@/gql/options/client-options";
import { useAudioStore, Track } from "@/store";
import { toast } from "sonner";

export const usePlaylistPlayback = (playlistId: string) => {
  const {
    isPlaying: globalIsPlaying,
    currentPlaylistId,
    togglePlayPause,
    play,
    setPlaylist,
  } = useAudioStore();

  // Only fetch track data when we need it (lazy loading for performance)
  const { data: trackListData, refetch: fetchTracks } = useQuery({
    ...playlistDetailTrackListOptions(playlistId),
    // enabled: false, // Don't fetch automatically - only when user clicks play
  });

  const playlistTracks = trackListData?.playlists?.items?.[0]?.tracks?.items;

  // Check if THIS specific playlist is currently playing
  const isPlaylistCurrentlyPlaying = currentPlaylistId === playlistId;

  // Convert playlist tracks to Track format for the store
  const convertToTrackFormat = (
    tracks: Array<{
      id: string;
      name?: string | null;
      coverImage?: string | null;
      mainArtistsAsync?: {
        items?: Array<{
          stageName?: string | null;
        } | null> | null;
      } | null;
    } | null>,
  ): Track[] => {
    return tracks
      .filter((track) => track != null)
      .map((track) => ({
        id: track.id,
        name: track.name || "Unknown Track",
        artist:
          track.mainArtistsAsync?.items
            ?.map((a) => a?.stageName)
            .filter(Boolean)
            .join(", ") || "Unknown Artist",
        coverImage: track.coverImage || "",
      }));
  };

  // Handle play/pause click for playlist
  const handlePlayPause = async () => {
    // If a track from this playlist is currently playing, toggle play/pause
    if (isPlaylistCurrentlyPlaying) {
      togglePlayPause();
      return;
    }

    // If we don't have track data yet, fetch it
    if (!playlistTracks) {
      try {
        const result = await fetchTracks();
        const tracks = result.data?.playlists?.items?.[0]?.tracks?.items;

        if (!tracks || tracks.length === 0) {
          toast.error("This playlist is empty");
          return;
        }

        // Play the first track from the playlist and set the entire playlist as queue
        const tracksForQueue = convertToTrackFormat(tracks);

        if (tracksForQueue.length > 0) {
          setPlaylist(tracksForQueue, playlistId);
          play();
        }
      } catch (error) {
        toast.error("Failed to load playlist tracks");
        console.error("Error fetching playlist tracks:", error);
      }
    } else {
      // We already have the data, use it
      if (playlistTracks.length === 0) {
        toast.error("This playlist is empty");
        return;
      }

      const tracksForQueue = convertToTrackFormat(playlistTracks);

      if (tracksForQueue.length > 0) {
        setPlaylist(tracksForQueue, playlistId);
        play();
      }
    }
  };

  return {
    isPlaylistCurrentlyPlaying,
    isPlaying: globalIsPlaying,
    playlistTracks,
    handlePlayPause,
  };
};
