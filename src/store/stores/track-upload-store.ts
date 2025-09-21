import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  TrackUploadStore,
  UploadedTrack,
  UploadProgress,
  TrackMetadata,
} from "../types/track-upload";

// Utility function to extract basic metadata from audio file
const extractMetadata = async (file: File): Promise<TrackMetadata> => {
  // For now, we'll extract basic file information
  // You can enhance this with a library like music-metadata-browser for detailed metadata
  const metadata: TrackMetadata = {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
  };

  // If you have music-metadata-browser or similar library installed, use it here
  // const audioMetadata = await parseBlob(file);
  // metadata.title = audioMetadata.common.title || metadata.title;
  // metadata.artist = audioMetadata.common.artist;
  // metadata.album = audioMetadata.common.album;
  // metadata.duration = audioMetadata.format.duration;

  return metadata;
};

// Simulate upload progress
const simulateUpload = (
  trackId: string,
  updateProgress: (trackId: string, progress: UploadProgress) => void,
  completeUpload: (trackId: string) => void,
) => {
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 15; // Random progress increment
    if (progress >= 100) {
      progress = 100;
      updateProgress(trackId, {
        percentage: 100,
        status: "completed",
        message: "Upload completed successfully!",
      });
      completeUpload(trackId);
      clearInterval(interval);
    } else {
      updateProgress(trackId, {
        percentage: Math.floor(progress),
        status: "uploading",
        message: `Uploading... ${Math.floor(progress)}%`,
      });
    }
  }, 200); // Update every 200ms
};

export const useTrackUploadStore = create<TrackUploadStore>()(
  persist(
    (set, get) => ({
      // State
      uploadedTracks: [],
      currentUpload: null,
      isUploading: false,

      // Actions
      startUpload: async (file: File) => {
        const trackId = Date.now().toString(); // Simple ID generation
        const metadata = await extractMetadata(file);

        const newTrack: UploadedTrack = {
          id: trackId,
          file,
          metadata,
          progress: {
            percentage: 0,
            status: "uploading",
            message: "Starting upload...",
          },
          uploadedAt: new Date(),
        };

        set((state) => ({
          currentUpload: newTrack,
          isUploading: true,
          uploadedTracks: [...state.uploadedTracks, newTrack],
        }));

        // Start simulated upload
        const { updateProgress, completeUpload } = get();
        simulateUpload(trackId, updateProgress, completeUpload);
      },

      updateProgress: (trackId: string, progress: UploadProgress) => {
        set((state) => ({
          uploadedTracks: state.uploadedTracks.map((track) =>
            track.id === trackId ? { ...track, progress } : track,
          ),
          currentUpload:
            state.currentUpload?.id === trackId
              ? { ...state.currentUpload, progress }
              : state.currentUpload,
        }));
      },

      completeUpload: (trackId: string) => {
        set(() => ({
          isUploading: false,
          // Keep currentUpload data instead of setting to null
          // This allows the track name to remain visible in the header
        }));
      },

      clearCurrentUpload: () => {
        set({ currentUpload: null, isUploading: false });
      },

      removeTrack: (trackId: string) => {
        set((state) => ({
          uploadedTracks: state.uploadedTracks.filter(
            (track) => track.id !== trackId,
          ),
          currentUpload:
            state.currentUpload?.id === trackId ? null : state.currentUpload,
        }));
      },

      clearAllTracks: () => {
        set({
          uploadedTracks: [],
          currentUpload: null,
          isUploading: false,
        });
      },
    }),
    {
      name: "track-upload-store",
      // Only persist uploaded tracks, not current upload state
      partialize: (state) => ({
        uploadedTracks: state.uploadedTracks,
        currentUpload: state.currentUpload,
      }),
    },
  ),
);
