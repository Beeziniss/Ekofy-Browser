import { toast } from "sonner";

export const useGetS3File = () => {
  // Function to get presigned URL for file access
  const getFileUrl = async (fileKey: string): Promise<string> => {
    try {
      const response = await fetch(`/api/s3/presign?key=${encodeURIComponent(fileKey)}`);

      if (!response.ok) {
        throw new Error("Failed to get file URL");
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Error getting file URL:", error);
      toast.error("Failed to access file. Please try again.");
      throw error;
    }
  };

  // Function to handle file access (either direct URL or S3 key)
  const handleFileAccess = async (deliveryFileUrl: string) => {
    try {
      // Check if it's a direct URL or an S3 key
      if (deliveryFileUrl.startsWith("http")) {
        // Direct URL - open it
        window.open(deliveryFileUrl, "_blank");
      } else {
        // S3 key - get presigned URL first
        const actualUrl = await getFileUrl(deliveryFileUrl);
        window.open(actualUrl, "_blank");
      }
    } catch {
      // Error already handled in getFileUrl
    }
  };

  return { getFileUrl, handleFileAccess };
};

