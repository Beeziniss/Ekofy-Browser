/**
 * Utility functions for formatting time durations
 */

/**
 * Convert milliseconds to MM:SS format
 * @param milliseconds - Duration in milliseconds
 * @returns Formatted string in MM:SS format
 */
export const formatDuration = (milliseconds?: number): string => {
  if (!milliseconds || milliseconds <= 0) return "0:00";
  
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Convert seconds to MM:SS format
 * @param seconds - Duration in seconds
 * @returns Formatted string in MM:SS format
 */
export const formatDurationFromSeconds = (seconds?: number): string => {
  if (!seconds || seconds <= 0) return "0:00";
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Get duration display for a track, using audio store if track is currently playing
 * @param trackId - ID of the track
 * @param trackDuration - Duration from track data (in milliseconds)
 * @param currentTrackId - Currently playing track ID
 * @param audioDuration - Duration from audio store (in seconds)
 * @returns Formatted duration string
 */
export const getTrackDurationDisplay = (
  trackId: string,
  trackDuration?: number,
  currentTrackId?: string | null,
  audioDuration?: number
): string => {
  // If this track is currently playing and we have audio duration, use it
  if (trackId === currentTrackId && audioDuration && audioDuration > 0) {
    return formatDurationFromSeconds(audioDuration);
  }
  
  // Otherwise use track duration if available
  if (trackDuration) {
    return formatDuration(trackDuration);
  }
  
  // Default fallback
  return "3:45";
};