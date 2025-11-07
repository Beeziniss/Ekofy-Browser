/**
 * Cloudinary Upload Utility
 * Provides functions to upload images to Cloudinary
 */

import { toast } from "sonner";
import axios from "axios";

// Cloudinary configuration interface
interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
  apiKey: string;
}

// Upload response interface
interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
  version: number;
  folder?: string;
}

// Error response interface
interface CloudinaryError {
  message: string;
  http_code: number;
}

// Default Cloudinary configuration
const CLOUDINARY_CONFIG: CloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
  apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
};

/**
 * Upload image to Cloudinary
 * @param file - File object to upload
 * @param options - Upload options
 * @returns Promise<CloudinaryUploadResponse>
 */
export const uploadImageToCloudinary = async (
  file: File,
  options?: {
    folder?: string;
    tags?: string[];
    resourceType?: "image" | "video" | "raw" | "auto";
  },
): Promise<CloudinaryUploadResponse> => {
  try {
    // Validate file
    if (!file) {
      throw new Error("No file provided for upload");
    }

    // Check if file is image
    if (!file.type.startsWith("image/")) {
      throw new Error("File must be an image");
    }

    // Create FormData for upload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);

    // Add optional parameters (only allowed ones for unsigned upload)
    if (options?.folder) {
      formData.append("folder", options.folder);
    }

    if (options?.tags && options.tags.length > 0) {
      formData.append("tags", options.tags.join(","));
    }

    // Upload to Cloudinary using axios
    const response = await axios.post<CloudinaryUploadResponse>(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/${options?.resourceType || "image"}/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    const uploadResult: CloudinaryUploadResponse = response.data;

    return uploadResult;
  } catch (error) {
    console.error("❌ Cloudinary upload failed:", error);

    if (error instanceof Error) {
      throw new Error(`Cloudinary upload failed: ${error.message}`);
    } else {
      throw new Error("Unknown error occurred during upload");
    }
  }
};

/**
 * Upload CCCD image with specific settings
 * @param file - CCCD image file
 * @param side - "front" or "back"
 * @param artistId - Artist ID for folder organization
 * @returns Promise<CloudinaryUploadResponse>
 */
export const uploadCCCDImage = async (
  file: File,
  side: "front" | "back",
  artistId?: string,
): Promise<CloudinaryUploadResponse> => {
  const folder = artistId ? `artist-cccd/${artistId}` : "artist-cccd/temp";
  const tags = ["cccd", side, "artist-verification"];

  return uploadImageToCloudinary(file, {
    folder,
    tags,
    resourceType: "image",
  });
};

/**
 * Upload artist profile image
 * @param file - Profile image file
 * @param artistId - Artist ID
 * @param type - "avatar" or "banner"
 * @returns Promise<CloudinaryUploadResponse>
 */
export const uploadArtistImage = async (
  file: File,
  artistId: string,
  type: "avatar" | "banner",
): Promise<CloudinaryUploadResponse> => {
  const folder = `artist-profiles/${artistId}`;
  const tags = ["artist", "profile", type];

  return uploadImageToCloudinary(file, {
    folder,
    tags,
    resourceType: "image",
  });
};

/**
 * Upload playlist cover image
 * @param file - Cover image file
 * @param playlistId - Playlist ID (optional for new playlists)
 * @returns Promise<CloudinaryUploadResponse>
 */
export const uploadPlaylistCoverImage = async (file: File, playlistId?: string): Promise<CloudinaryUploadResponse> => {
  const folder = playlistId ? `playlist-covers/${playlistId}` : "playlist-covers/temp";
  const tags = ["playlist", "cover", "music"];

  return uploadImageToCloudinary(file, {
    folder,
    tags,
    resourceType: "image",
  });
};

/**
 * Generate Cloudinary URL with transformations
 * @param publicId - Cloudinary public ID
 * @param transformations - Transformation string
 * @returns Transformed image URL
 */
export const getCloudinaryUrl = (publicId: string, transformations?: string): string => {
  const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload`;

  if (transformations) {
    return `${baseUrl}/${transformations}/${publicId}`;
  }

  return `${baseUrl}/${publicId}`;
};

/**
 * Validate image file before upload
 * @param file - File to validate
 * @param maxSize - Maximum file size in MB (default: 10MB)
 * @returns boolean
 */
export const validateImageFile = (file: File, maxSize: number = 10): boolean => {
  // Check file type
  if (!file.type.startsWith("image/")) {
    toast.error("File must be an image");
    return false;
  }

  // Check file size (convert MB to bytes)
  const maxBytes = maxSize * 1024 * 1024;
  if (file.size > maxBytes) {
    toast.error(`File size must not exceed ${maxSize}MB`);
    return false;
  }

  // Check supported formats
  const supportedFormats = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (!supportedFormats.includes(file.type)) {
    toast.error("Only supports formats: JPG, PNG, WEBP");
    return false;
  }

  return true;
};

// Export configuration for reference
export { CLOUDINARY_CONFIG };

// Export types
export type { CloudinaryUploadResponse, CloudinaryConfig, CloudinaryError };
