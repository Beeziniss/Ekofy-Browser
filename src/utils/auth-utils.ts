// Auth utility functions for localStorage operations and auth state management

import { User } from "@/gql/graphql";

const USER_STORAGE_KEY = "user-info";

/**
 * Set user information to localStorage
 */
export const setUserInfoToLocalStorage = async (
  userData: User,
): Promise<void> => {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    }
  } catch (error) {
    console.error("Failed to save user info to localStorage:", error);
  }
};

/**
 * Get user information from localStorage
 */
export const getUserInfoFromLocalStorage = (): User | null => {
  try {
    if (typeof window !== "undefined") {
      const userInfo = localStorage.getItem(USER_STORAGE_KEY);
      return userInfo ? JSON.parse(userInfo) : null;
    }
    return null;
  } catch (error) {
    console.error("Failed to get user info from localStorage:", error);
    return null;
  }
};

/**
 * Remove user information from localStorage
 */
export const removeUserInfoFromLocalStorage = (): void => {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  } catch (error) {
    console.error("Failed to remove user info from localStorage:", error);
  }
};

/**
 * Clear all auth-related data from localStorage
 */
export const clearAuthData = (): void => {
  removeUserInfoFromLocalStorage();
  // Add other auth-related localStorage cleanup here if needed
};

/**
 * Check if user is authenticated based on localStorage data
 */
export const isUserAuthenticated = (): boolean => {
  const userInfo = getUserInfoFromLocalStorage();
  return userInfo !== null && userInfo.id !== undefined;
};

/**
 * Format error message for authentication errors
 */
export const formatAuthError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "An unknown authentication error occurred";
};
