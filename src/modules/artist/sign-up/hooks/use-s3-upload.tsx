import { useState } from "react";
import { FilePath } from "@/types/file";

interface UploadResult {
  fileKey: string;
  fileName: string;
}

export const useS3Upload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file: File, filePath: FilePath = FilePath.NATIONS): Promise<UploadResult> => {
    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      throw new Error("Only JPEG, PNG, and WEBP image files are allowed");
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error("File size must not exceed 10MB");
    }

    setIsUploading(true);

    try {
      // 1. Get presigned URL from our API
      const presignRes = await fetch("/api/s3/presign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          filePath: filePath,
        }),
      });

      if (!presignRes.ok) {
        throw new Error("Failed to get presigned URL");
      }

      const { uploadUrl, fileKey } = await presignRes.json();

      // 2. Upload file directly to S3
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload file");
      }

      return {
        fileKey,
        fileName: file.name,
      };
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const uploadMultipleFiles = async (files: File[], filePath: FilePath = FilePath.NATIONS): Promise<UploadResult[]> => {
    const results: UploadResult[] = [];

    for (const file of files) {
      try {
        const result = await uploadFile(file, filePath);
        results.push(result);
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        throw error;
      }
    }

    return results;
  };

  return {
    uploadFile,
    uploadMultipleFiles,
    isUploading,
  };
};
