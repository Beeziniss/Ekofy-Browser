/**
 * Utility functions for handling image URLs from various sources (S3, Cloudinary, direct URLs)
 */

/**
 * Get the displayable image URL - handles both S3 keys and direct URLs
 * @param imageKey - The S3 key or direct URL
 * @returns Promise<string | null> - The presigned URL or original URL
 */
export async function getImageUrl(imageKey: string | null | undefined): Promise<string | null> {
  if (!imageKey) return null;

  // If it's already a full URL (Cloudinary, Discord CDN, etc.), return as is
  if (imageKey.startsWith('http://') || imageKey.startsWith('https://')) {
    return imageKey;
  }

  // Otherwise, it's an S3 key - get presigned URL from API
  try {
    const response = await fetch(`/api/s3/presign?key=${encodeURIComponent(imageKey)}`);
    if (!response.ok) {
      console.error('Failed to get presigned URL:', response.statusText);
      return null;
    }
    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error fetching presigned URL:', error);
    return null;
  }
}

/**
 * Check if a string is a direct URL
 * @param str - The string to check
 * @returns boolean - True if it's a URL
 */
export function isDirectUrl(str: string | null | undefined): boolean {
  if (!str) return false;
  return str.startsWith('http://') || str.startsWith('https://');
}
