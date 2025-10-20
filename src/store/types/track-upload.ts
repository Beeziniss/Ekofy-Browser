export interface TrackMetadata {
  title?: string;
  artist?: string;
  album?: string;
  duration?: number;
  genre?: string;
  year?: number;
  fileSize: number;
  fileName: string;
  fileType: string;
}

export interface UploadProgress {
  percentage: number;
  status: "idle" | "uploading" | "completed" | "error";
  message?: string;
}

export interface UploadedTrack {
  id: string;
  file: File;
  metadata: TrackMetadata;
  progress: UploadProgress;
  uploadedAt: Date;
}

export interface TrackUploadState {
  uploadedTracks: UploadedTrack[];
  currentUpload: UploadedTrack | null;
  isUploading: boolean;
}

export interface TrackUploadActions {
  startUpload: (file: File) => void;
  updateProgress: (trackId: string, progress: UploadProgress) => void;
  completeUpload: (trackId: string) => void;
  clearCurrentUpload: () => void;
  removeTrack: (trackId: string) => void;
  clearAllTracks: () => void;
}

export type TrackUploadStore = TrackUploadState & TrackUploadActions;
