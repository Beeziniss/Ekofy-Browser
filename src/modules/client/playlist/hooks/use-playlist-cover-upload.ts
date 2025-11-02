import { useState } from "react";
import { toast } from "sonner";
import {
  uploadPlaylistCoverImage,
  validateImageFile,
  CloudinaryUploadResponse,
} from "@/utils/cloudinary-utils";

interface UsePlaylistCoverUploadState {
  isUploading: boolean;
  uploadProgress: number;
  uploadedImage: CloudinaryUploadResponse | null;
  previewUrl: string | null;
  error: string | null;
}

interface UsePlaylistCoverUploadActions {
  uploadCover: (
    file: File,
    playlistId?: string,
  ) => Promise<CloudinaryUploadResponse | null>;
  setPreviewFromFile: (file: File) => void;
  clearPreview: () => void;
  clearError: () => void;
  resetUpload: () => void;
}

export const usePlaylistCoverUpload = (): UsePlaylistCoverUploadState &
  UsePlaylistCoverUploadActions => {
  const [state, setState] = useState<UsePlaylistCoverUploadState>({
    isUploading: false,
    uploadProgress: 0,
    uploadedImage: null,
    previewUrl: null,
    error: null,
  });

  const uploadCover = async (
    file: File,
    playlistId?: string,
  ): Promise<CloudinaryUploadResponse | null> => {
    // Validate file first
    if (!validateImageFile(file, 5)) {
      // 5MB limit for playlist covers
      return null;
    }

    setState((prev) => ({
      ...prev,
      isUploading: true,
      uploadProgress: 0,
      error: null,
    }));

    try {
      // Simulate progress for UX
      setState((prev) => ({ ...prev, uploadProgress: 25 }));

      const result = await uploadPlaylistCoverImage(file, playlistId);

      setState((prev) => ({ ...prev, uploadProgress: 100 }));

      // Store result and clear preview since we now have the uploaded image
      setState((prev) => ({
        ...prev,
        uploadedImage: result,
        isUploading: false,
        uploadProgress: 0,
        previewUrl: null, // Clear preview since we have uploaded image
      }));

      toast.success("Cover image uploaded successfully!");

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";

      setState((prev) => ({
        ...prev,
        isUploading: false,
        uploadProgress: 0,
        error: errorMessage,
      }));

      toast.error(`Upload failed: ${errorMessage}`);
      return null;
    }
  };

  const setPreviewFromFile = (file: File) => {
    if (!validateImageFile(file, 5)) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setState((prev) => ({
        ...prev,
        previewUrl: e.target?.result as string,
        uploadedImage: null, // Clear any previous uploaded image
        error: null,
      }));
    };
    reader.readAsDataURL(file);
  };

  const clearPreview = () => {
    setState((prev) => ({
      ...prev,
      previewUrl: null,
      uploadedImage: null,
    }));
  };

  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }));
  };

  const resetUpload = () => {
    setState({
      isUploading: false,
      uploadProgress: 0,
      uploadedImage: null,
      previewUrl: null,
      error: null,
    });
  };

  return {
    ...state,
    uploadCover,
    setPreviewFromFile,
    clearPreview,
    clearError,
    resetUpload,
  };
};
