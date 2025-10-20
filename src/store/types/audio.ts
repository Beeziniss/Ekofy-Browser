export interface Track {
  id: string;
  name: string;
  artist: string;
  coverImage?: string;
  duration?: number;
}

export interface AudioState {
  // Current track info
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  previousVolume: number;

  // Queue management
  queue: Track[];
  currentIndex: number;

  // Current playlist context
  currentPlaylistId: string | null;

  // Playback controls
  isShuffling: boolean;
  isRepeating: boolean;

  // Loading states
  isLoading: boolean;
  error: string | null;

  // Seek state
  seekRequested: boolean;
}

export interface AudioActions {
  // Track control
  setCurrentTrack: (track: Track) => void;
  setCurrentTrackFromQueue: (track: Track) => void;
  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;

  // Time control
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  seek: (time: number) => void;
  resetSeekRequest: () => void;

  // Volume control
  setVolume: (volume: number) => void;
  toggleMute: () => void;

  // Queue management
  setQueue: (tracks: Track[]) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  skipToNext: () => void;
  skipToPrevious: () => void;
  skipToTrack: (index: number) => void;

  // Playlist management
  setPlaylist: (tracks: Track[], playlistId: string) => void;
  setCurrentPlaylistId: (playlistId: string | null) => void;

  // Playback modes
  toggleShuffle: () => void;
  toggleRepeat: () => void;

  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export type AudioStore = AudioState & AudioActions;
