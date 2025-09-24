import { useState } from "react";
import { toast } from "sonner";
import { 
  uploadCCCDImage, 
  uploadArtistImage, 
  validateImageFile,
  CloudinaryUploadResponse 
} from "@/utils/cloudinary-utils";

interface UseCloudinaryUploadState {
  isUploading: boolean;
  uploadProgress: number;
  uploadedImages: Record<string, CloudinaryUploadResponse>;
  error: string | null;
}

interface UseCloudinaryUploadActions {
  uploadCCCD: (file: File, side: "front" | "back", artistId?: string) => Promise<CloudinaryUploadResponse | null>;
  uploadProfile: (file: File, artistId: string, type: "avatar" | "banner") => Promise<CloudinaryUploadResponse | null>;
  clearError: () => void;
  resetUpload: () => void;
}

export const useCloudinaryUpload = (): UseCloudinaryUploadState & UseCloudinaryUploadActions => {
  const [state, setState] = useState<UseCloudinaryUploadState>({
    isUploading: false,
    uploadProgress: 0,
    uploadedImages: {},
    error: null,
  });

  const uploadCCCD = async (
    file: File, 
    side: "front" | "back", 
    artistId?: string
  ): Promise<CloudinaryUploadResponse | null> => {
    // Validate file first
    if (!validateImageFile(file, 10)) {
      return null;
    }

    setState(prev => ({ 
      ...prev, 
      isUploading: true, 
      uploadProgress: 0, 
      error: null 
    }));

    try {      
      // Simulate progress for UX
      setState(prev => ({ ...prev, uploadProgress: 25 }));
      
      const result = await uploadCCCDImage(file, side, artistId);
      
      setState(prev => ({ ...prev, uploadProgress: 100 }));
      
      // Store result
      const imageKey = `cccd_${side}`;
      setState(prev => ({ 
        ...prev, 
        uploadedImages: {
          ...prev.uploadedImages,
          [imageKey]: result
        },
        isUploading: false,
        uploadProgress: 0
      }));

      toast.success(`Upload CCCD ${side === "front" ? "mặt trước" : "mặt sau"} thành công!`);
            
      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Upload failed";
      
      setState(prev => ({ 
        ...prev, 
        isUploading: false, 
        uploadProgress: 0,
        error: errorMessage 
      }));

      toast.error(`Lỗi upload CCCD: ${errorMessage}`);      
      return null;
    }
  };

  const uploadProfile = async (
    file: File, 
    artistId: string, 
    type: "avatar" | "banner"
  ): Promise<CloudinaryUploadResponse | null> => {
    // Validate file first
    if (!validateImageFile(file, 5)) { // Smaller limit for profile images
      return null;
    }

    setState(prev => ({ 
      ...prev, 
      isUploading: true, 
      uploadProgress: 0, 
      error: null 
    }));

    try {      
      setState(prev => ({ ...prev, uploadProgress: 25 }));
      
      const result = await uploadArtistImage(file, artistId, type);
      
      setState(prev => ({ ...prev, uploadProgress: 100 }));
      
      // Store result
      setState(prev => ({ 
        ...prev, 
        uploadedImages: {
          ...prev.uploadedImages,
          [type]: result
        },
        isUploading: false,
        uploadProgress: 0
      }));

      toast.success(`Upload ${type === "avatar" ? "ảnh đại diện" : "ảnh bìa"} thành công!`);
            
      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Upload failed";
      
      setState(prev => ({ 
        ...prev, 
        isUploading: false, 
        uploadProgress: 0,
        error: errorMessage 
      }));

      toast.error(`Lỗi upload ${type}: ${errorMessage}`);      
      return null;
    }
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  const resetUpload = () => {
    setState({
      isUploading: false,
      uploadProgress: 0,
      uploadedImages: {},
      error: null,
    });
  };

  return {
    ...state,
    uploadCCCD,
    uploadProfile,
    clearError,
    resetUpload,
  };
};