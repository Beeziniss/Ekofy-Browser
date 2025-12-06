import { useState } from "react";
import { toast } from "sonner";

export enum FilePath {
  ORDERS = "orders",
  LEGALS = "legals",
  NATIONS = "nations",
}

export interface S3UploadResult {
  fileKey: string;
  uploadUrl: string;
}

export const useS3Upload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  /**
   * Upload a file to AWS S3
   * @param file - The file to upload
   * @param filePath - The folder path in S3 (orders, legals, nations, etc.)
   * @returns Object containing fileKey and uploadUrl, or null if failed
   */
  const uploadFile = async (file: File, filePath: FilePath): Promise<string | null> => {
    if (!file) {
      setError("No file provided");
      return null;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

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

      // 2. Upload file directly to S3 using presigned URL
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload file to S3");
      }

      setUploadProgress(100);
      return fileKey;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed";
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Get presigned URL for viewing/downloading a file from S3
   * @param fileKey - The S3 file key
   * @returns Presigned URL for accessing the file, or null if failed
   */
  const getPresignedUrl = async (fileKey: string): Promise<string | null> => {
    try {
      const response = await fetch(`/api/s3/presign?key=${encodeURIComponent(fileKey)}`);

      if (!response.ok) {
        throw new Error("Failed to get presigned URL");
      }

      const data = await response.json();
      return data.url;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get presigned URL";
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    }
  };

  return {
    uploadFile,
    getPresignedUrl,
    isUploading,
    uploadProgress,
    error,
  };
};
