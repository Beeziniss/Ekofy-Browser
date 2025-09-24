/**
 * Cloudinary Upload Utility
 * Provides functions to upload images to Cloudinary
 */

import { toast } from "sonner";

// Cloudinary configuration interface
interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
  apiKey?: string;
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
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "your-cloud-name",
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "your-upload-preset",
  apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
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
  }
): Promise<CloudinaryUploadResponse> => {
  try {
    console.log("🌥️ Starting Cloudinary upload for:", file.name);
    
    // Validate file
    if (!file) {
      throw new Error("No file provided for upload");
    }

    // Check if file is image
    if (!file.type.startsWith('image/')) {
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

    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/${options?.resourceType || "image"}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Upload failed with status ${response.status}`);
    }

    const uploadResult: CloudinaryUploadResponse = await response.json();
    
    console.log("✅ Cloudinary upload successful:", {
      public_id: uploadResult.public_id,
      secure_url: uploadResult.secure_url,
      format: uploadResult.format,
      bytes: uploadResult.bytes
    });

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
  artistId?: string
): Promise<CloudinaryUploadResponse> => {
  const folder = artistId ? `artist-cccd/${artistId}` : "artist-cccd/temp";
  const tags = ["cccd", side, "artist-verification"];

  return uploadImageToCloudinary(file, {
    folder,
    tags,
    resourceType: "image"
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
  type: "avatar" | "banner"
): Promise<CloudinaryUploadResponse> => {
  const folder = `artist-profiles/${artistId}`;
  const tags = ["artist", "profile", type];

  return uploadImageToCloudinary(file, {
    folder,
    tags,
    resourceType: "image"
  });
};

/**
 * Generate Cloudinary URL with transformations
 * @param publicId - Cloudinary public ID
 * @param transformations - Transformation string
 * @returns Transformed image URL
 */
export const getCloudinaryUrl = (
  publicId: string,
  transformations?: string
): string => {
  const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload`;
  
  if (transformations) {
    return `${baseUrl}/${transformations}/${publicId}`;
  }
  
  return `${baseUrl}/${publicId}`;
};

/**
 * Delete image from Cloudinary
 * @param publicId - Public ID of image to delete
 * @returns Promise<boolean>
 */
export const deleteCloudinaryImage = async (publicId: string): Promise<boolean> => {
  try {
    // Note: Deletion requires server-side implementation for security
    // This is a placeholder for client-side reference
    console.log("🗑️ Image deletion requested for:", publicId);
    
    // In a real implementation, you would call your backend API
    // that handles the deletion using Cloudinary's admin API
    
    return true;
  } catch (error) {
    console.error("❌ Failed to delete image:", error);
    return false;
  }
};

/**
 * Validate image file before upload
 * @param file - File to validate
 * @param maxSize - Maximum file size in MB (default: 10MB)
 * @returns boolean
 */
export const validateImageFile = (file: File, maxSize: number = 10): boolean => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    toast.error("File phải là hình ảnh");
    return false;
  }

  // Check file size (convert MB to bytes)
  const maxBytes = maxSize * 1024 * 1024;
  if (file.size > maxBytes) {
    toast.error(`Kích thước file không được vượt quá ${maxSize}MB`);
    return false;
  }

  // Check supported formats
  const supportedFormats = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (!supportedFormats.includes(file.type)) {
    toast.error("Chỉ hỗ trợ định dạng: JPG, PNG, WEBP");
    return false;
  }

  return true;
};

// Export configuration for reference
export { CLOUDINARY_CONFIG };

// Export types
export type { 
  CloudinaryUploadResponse, 
  CloudinaryConfig,
  CloudinaryError 
};