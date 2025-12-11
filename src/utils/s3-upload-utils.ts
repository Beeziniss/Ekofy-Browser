import { toast } from "sonner";
import { FilePath } from "@/types/file";

/**
 * S3 Upload Response
 */
export interface S3UploadResponse {
  fileUrl: string;
  fileKey: string;
}

/**
 * Upload Progress Callback
 */
export type UploadProgressCallback = (progress: number) => void;

/**
 * Validate document file before upload
 * @param file - File to validate
 * @param maxSize - Maximum file size in MB (default: 20MB)
 * @returns boolean
 */
export const validateDocumentFile = (file: File, maxSize: number = 20): boolean => {
  // Check file size (convert MB to bytes)
  const maxBytes = maxSize * 1024 * 1024;
  if (file.size > maxBytes) {
    toast.error(`File size must not exceed ${maxSize}MB`);
    return false;
  }

  // Check supported formats
  const supportedFormats = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "application/vnd.ms-excel", // .xls
    "text/plain",
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
    "image/gif",
  ];

  if (!supportedFormats.includes(file.type)) {
    toast.error("Only supports formats: PDF, DOC, DOCX, XLS, XLSX, TXT, JPG, PNG, WEBP, GIF");
    return false;
  }

  return true;
};

/**
 * Upload a single file to S3 using presigned URL
 * @param file - File to upload
 * @param filePath - S3 folder path (e.g., 'legals', 'orders', 'nations')
 * @param onProgress - Optional callback to track upload progress
 * @returns Promise with S3 upload response
 */
export const uploadFileToS3 = async (
  file: File,
  filePath: string,
  onProgress?: UploadProgressCallback,
): Promise<S3UploadResponse> => {
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
        filePath,
      }),
    });

    if (!presignRes.ok) {
      throw new Error("Failed to get presigned URL");
    }

    const { uploadUrl, fileKey } = await presignRes.json();

    // 2. Upload file directly to S3 with progress tracking
    const xhr = new XMLHttpRequest();

    return new Promise<S3UploadResponse>((resolve, reject) => {
      // Track upload progress
      if (onProgress) {
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            onProgress(progress);
          }
        });
      }

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          // Construct the file URL
          const fileUrl = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${fileKey}`;

          resolve({
            fileUrl,
            fileKey,
          });
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Network error during upload"));
      });

      xhr.addEventListener("abort", () => {
        reject(new Error("Upload aborted"));
      });

      xhr.open("PUT", uploadUrl);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.send(file);
    });
  } catch (error) {
    console.error("S3 upload error:", error);
    throw error;
  }
};

/**
 * Upload multiple files to S3 concurrently
 * @param files - Array of files to upload
 * @param filePath - S3 folder path (e.g., 'legals', 'orders', 'nations')
 * @param onProgressUpdate - Optional callback for individual file progress updates
 * @returns Promise with array of S3 upload responses
 */
export const uploadMultipleFilesToS3 = async (
  files: File[],
  filePath: string,
  onProgressUpdate?: (fileName: string, progress: number) => void,
): Promise<S3UploadResponse[]> => {
  // Upload files concurrently
  const uploadPromises = files.map((file) =>
    uploadFileToS3(file, filePath, (progress) => {
      if (onProgressUpdate) {
        onProgressUpdate(file.name, progress);
      }
    }),
  );

  try {
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error("Multiple upload error:", error);
    throw error;
  }
};

/**
 * Upload a legal document to S3
 * @param file - Document file to upload
 * @param userId - User ID for folder organization
 * @param documentType - Type of document (e.g., 'license', 'contract')
 * @param onProgress - Optional callback to track upload progress
 * @returns Promise with S3 upload response
 */
export const uploadLegalDocument = async (
  file: File,
  userId?: string,
  documentType?: string,
  onProgress?: UploadProgressCallback,
): Promise<S3UploadResponse> => {
  // Validate file before upload
  if (!validateDocumentFile(file)) {
    throw new Error("Invalid document file");
  }

  const filePath = FilePath.LEGALS;

  return uploadFileToS3(file, filePath, onProgress);
};

/**
 * Get a presigned URL for reading a file from S3
 * @param fileKey - S3 file key
 * @returns Promise with presigned read URL
 */
export const getS3FileUrl = async (fileKey: string): Promise<string> => {
  try {
    const res = await fetch(`/api/s3/presign?key=${encodeURIComponent(fileKey)}`);

    if (!res.ok) {
      throw new Error("Failed to get presigned URL");
    }

    const data = await res.json();
    return data.url;
  } catch (error) {
    console.error("Failed to get S3 file URL:", error);
    throw error;
  }
};
