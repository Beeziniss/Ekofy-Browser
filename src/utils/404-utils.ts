import { notFound } from "next/navigation";

/**
 * Utility function to trigger a 404 error programmatically
 * Call this function in your page components when content is not found
 */
export const trigger404 = (): never => {
  notFound();
};

/**
 * Hook to check if content exists and redirect to 404 if not
 * @param condition Boolean condition - if false, triggers 404
 */
export const use404Check = (condition: boolean) => {
  if (!condition) {
    notFound();
  }
};

/**
 * Utility function to check if a resource exists
 * Common patterns for checking existence
 */
export const checkResourceExists = {
  /**
   * Check if an ID is valid (not null, undefined, or empty)
   */
  validId: (id: string | number | null | undefined): boolean => {
    if (typeof id === "string") return id.trim().length > 0;
    if (typeof id === "number") return !isNaN(id) && id > 0;
    return false;
  },

  /**
   * Check if data was fetched successfully
   */
  hasData: <T>(data: T | null | undefined): data is T => {
    return data !== null && data !== undefined;
  },

  /**
   * Check if array has items
   */
  hasItems: <T>(arr: T[] | null | undefined): arr is T[] => {
    return Array.isArray(arr) && arr.length > 0;
  },
};
