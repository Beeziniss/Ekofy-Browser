import { create } from "zustand";
import { AudioStore, Track } from "../types/audio";

const initialState = {
  currentTrack: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 70,
  isMuted: false,
  previousVolume: 70,
  queue: [],
  currentIndex: -1,
  currentPlaylistId: null,
  isShuffling: false,
  isRepeating: false,
  isLoading: false,
  error: null,
  seekRequested: false,
};

export const useAudioStore = create<AudioStore>((set, get) => ({
  ...initialState,

  // Track control
  setCurrentTrack: (track: Track) => {
    // Don't auto-play immediately - let the audio player handle it when ready
    set({
      currentTrack: track,
      queue: [track],
      currentIndex: 0,
      currentTime: 0,
      currentPlaylistId: null, // Clear playlist when setting individual track
      error: null,
      isPlaying: false, // Don't auto-play immediately
      isLoading: true, // Set loading when changing tracks
    });
  },

  setCurrentTrackFromQueue: (track: Track) => {
    const state = get();
    let newQueue = state.queue;
    let newIndex = state.currentIndex;

    // If track is not in queue, add it and set as current
    const existingIndex = newQueue.findIndex((t) => t.id === track.id);
    if (existingIndex === -1) {
      newQueue = [...newQueue, track];
      newIndex = newQueue.length - 1;
    } else {
      newIndex = existingIndex;
    }

    // Don't auto-play immediately - let the audio player handle it when ready
    set({
      currentTrack: track,
      queue: newQueue,
      currentIndex: newIndex,
      currentTime: 0,
      error: null,
      isPlaying: false, // Don't auto-play immediately
      isLoading: true, // Set loading when changing tracks
    });
  },

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  togglePlayPause: () => set((state) => ({ isPlaying: !state.isPlaying })),
  
  // Auto-play when audio is ready (called by audio player)
  autoPlayWhenReady: () => set({ isPlaying: true }),

  // Time control
  setCurrentTime: (time: number) => set({ currentTime: time }),
  setDuration: (duration: number) => set({ duration }),
  seek: (time: number) => {
    set({ currentTime: time, seekRequested: true });
  },
  resetSeekRequest: () => set({ seekRequested: false }),

  // Volume control
  setVolume: (volume: number) =>
    set((state) => ({
      volume,
      isMuted: volume === 0,
      previousVolume: volume > 0 ? volume : state.previousVolume,
    })),
  toggleMute: () =>
    set((state) => ({
      isMuted: !state.isMuted,
      volume: !state.isMuted ? 0 : state.previousVolume,
      previousVolume: !state.isMuted ? state.volume : state.previousVolume,
    })),

  // Queue management
  setQueue: (tracks: Track[]) =>
    set({ queue: tracks, currentIndex: 0, currentPlaylistId: null }),
  addToQueue: (track: Track) =>
    set((state) => ({ queue: [...state.queue, track] })),
  removeFromQueue: (index: number) =>
    set((state) => ({
      queue: state.queue.filter((_, i) => i !== index),
      currentIndex:
        state.currentIndex > index
          ? state.currentIndex - 1
          : state.currentIndex,
    })),

  skipToNext: () => {
    const state = get();
    if (state.queue.length === 0) return;

    let nextIndex = state.currentIndex + 1;
    if (state.isShuffling) {
      nextIndex = Math.floor(Math.random() * state.queue.length);
    } else if (nextIndex >= state.queue.length) {
      if (state.isRepeating) {
        nextIndex = 0;
      } else {
        set({ isPlaying: false });
        return;
      }
    }

    const nextTrack = state.queue[nextIndex];
    if (nextTrack) {
      set({
        currentTrack: nextTrack,
        currentIndex: nextIndex,
        currentTime: 0,
      });
    }
  },

  skipToPrevious: () => {
    const state = get();
    if (state.queue.length === 0) return;

    // If more than 3 seconds into the track, restart current track
    if (state.currentTime > 3000) {
      // Convert to milliseconds for consistency
      set({ currentTime: 0, seekRequested: true });
      return;
    }

    let prevIndex = state.currentIndex - 1;
    if (prevIndex < 0) {
      if (state.isRepeating) {
        prevIndex = state.queue.length - 1;
      } else {
        prevIndex = 0;
      }
    }

    const prevTrack = state.queue[prevIndex];
    if (prevTrack) {
      set({
        currentTrack: prevTrack,
        currentIndex: prevIndex,
        currentTime: 0,
      });
    }
  },

  skipToTrack: (index: number) => {
    const state = get();
    if (index >= 0 && index < state.queue.length) {
      const track = state.queue[index];
      set({
        currentTrack: track,
        currentIndex: index,
        currentTime: 0,
      });
    }
  },

  // Playlist management
  setPlaylist: (tracks: Track[], playlistId: string) => {
    const firstTrack = tracks[0];
    if (firstTrack) {
      set({
        currentTrack: firstTrack,
        queue: tracks,
        currentIndex: 0,
        currentPlaylistId: playlistId,
        currentTime: 0,
        error: null,
      });
    }
  },

  setCurrentPlaylistId: (playlistId: string | null) => {
    set({ currentPlaylistId: playlistId });
  },

  // Playback modes
  toggleShuffle: () => set((state) => ({ isShuffling: !state.isShuffling })),
  toggleRepeat: () => set((state) => ({ isRepeating: !state.isRepeating })),

  // State management
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),
  clearAudioState: () => set({ 
    currentTrack: null, 
    isPlaying: false, 
    currentTime: 0, 
    error: null, 
    isLoading: false,
    queue: [],
    currentIndex: -1,
  }),
  reset: () => set(initialState),
}));
