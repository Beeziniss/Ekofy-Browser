// Auth utility functions for localStorage operations and auth state management

import { IUserLocalStorage } from "@/types/auth";

const USER_STORAGE_KEY = "user-info";
const ACCESS_TOKEN_KEY = "access-token";

/**
 * Set user information to localStorage
 */
export const setUserInfoToLocalStorage = (
  userData: IUserLocalStorage,
): void => {
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
export const getUserInfoFromLocalStorage = (): IUserLocalStorage | null => {
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
 * Set access token to localStorage
 */
export const setAccessTokenToLocalStorage = (token: string): void => {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
    }
  } catch (error) {
    console.error("Failed to save access token to localStorage:", error);
  }
};

/**
 * Get access token from localStorage
 */
export const getAccessTokenFromLocalStorage = (): string | null => {
  try {
    if (typeof window !== "undefined") {
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    }
    return null;
  } catch (error) {
    console.error("Failed to get access token from localStorage:", error);
    return null;
  }
};

/**
 * Remove access token from localStorage
 */
export const removeAccessTokenFromLocalStorage = (): void => {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
  } catch (error) {
    console.error("Failed to remove access token from localStorage:", error);
  }
};

/**
 * Clear all auth-related data from localStorage
 */
export const clearAuthData = (): void => {
  removeUserInfoFromLocalStorage();
  removeAccessTokenFromLocalStorage();
};

/**
 * Check if user is authenticated based on localStorage data
 */
export const isUserAuthenticated = (): boolean => {
  const userInfo = getUserInfoFromLocalStorage();
  const accessToken = getAccessTokenFromLocalStorage();
  return (
    userInfo !== null && userInfo.userId !== undefined && accessToken !== null
  );
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
