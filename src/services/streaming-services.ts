import axiosInstance from "@/config/axios-instance";
import { isAxiosError } from "axios";

// Token storage for each track
const tokenCache = new Map<string, string>();

// Track ongoing refresh promises to prevent multiple simultaneous refreshes
const refreshPromiseCache = new Map<string, Promise<string>>();

// Track last refresh attempt timestamp to prevent rapid retries
const lastRefreshAttempt = new Map<string, number>();

const REFRESH_COOLDOWN_MS = 5000; // 5 seconds cooldown between refresh attempts

export const streamingApi = {
  // Sign token for a specific track ID
  signToken: async (trackId: string) => {
    try {
      const response = await axiosInstance.post("/api/media-streaming/signed-token", trackId, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const token = response.data.token;
      // Cache the token for this track
      tokenCache.set(trackId, token);
      return token;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  },

  // Refresh an existing signed token when the old one is expired (with memoization)
  refreshSignToken: async ({ trackId, oldToken }: { trackId: string; oldToken: string }) => {
    // Check if there's already an ongoing refresh for this track
    const existingRefreshPromise = refreshPromiseCache.get(trackId);
    if (existingRefreshPromise) {
      console.log(`Reusing existing refresh promise for track ${trackId}`);
      return existingRefreshPromise;
    }

    // Check cooldown period to prevent rapid retries
    const lastAttempt = lastRefreshAttempt.get(trackId);
    const now = Date.now();
    if (lastAttempt && now - lastAttempt < REFRESH_COOLDOWN_MS) {
      console.log(`Refresh cooldown active for track ${trackId}. Waiting...`);
      throw new Error(`Refresh cooldown active for track ${trackId}. Please wait before retrying.`);
    }

    // Create and cache the refresh promise
    const refreshPromise = (async () => {
      try {
        lastRefreshAttempt.set(trackId, now);
        console.log(`Starting token refresh for track ${trackId}`);

        const response = await axiosInstance.post(
          "/api/media-streaming/refresh-signed-url",
          {},
          {
            headers: {
              "Content-Type": "application/json",
            },
            params: {
              trackId,
              oldToken,
            },
          },
        );

        const newToken = response.data.token;
        if (!newToken) {
          throw new Error("Received empty token from refresh API");
        }

        // Update the cached token
        tokenCache.set(trackId, newToken);
        console.log(`Token refresh successful for track ${trackId}`);
        return newToken;
      } catch (error) {
        console.error(`Token refresh failed for track ${trackId}:`, error);

        // If refresh fails due to invalid old token, clear the cache
        if (isAxiosError(error) && error.response?.status === 401) {
          console.log(`Old token was invalid, clearing cache for track ${trackId}`);
          tokenCache.delete(trackId);
        }

        if (isAxiosError(error)) {
          throw new Error(error.response?.data?.message || error.message);
        }
        throw error;
      } finally {
        // Remove the promise from cache when done (success or failure)
        refreshPromiseCache.delete(trackId);
      }
    })();

    // Cache the promise
    refreshPromiseCache.set(trackId, refreshPromise);

    return refreshPromise;
  },

  // Generate streaming URL with token
  getStreamingUrl: (trackId: string, token: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_URL_ENDPOINT;
    return `${baseUrl}/api/media-streaming/cloudfront/${trackId}/master.m3u8?token=${token}`;
  },

  // Get cached token for a track
  getCachedToken: (trackId: string) => {
    return tokenCache.get(trackId);
  },

  // Clear cached token for a track and cleanup all related caches
  clearCachedToken: (trackId: string) => {
    tokenCache.delete(trackId);
    refreshPromiseCache.delete(trackId);
    lastRefreshAttempt.delete(trackId);
  },

  // Force refresh token and get new streaming URL (with memoization)
  forceRefreshStreamingUrl: async (trackId: string) => {
    // Check if there's already an ongoing refresh for this track
    const existingRefreshPromise = refreshPromiseCache.get(trackId);
    if (existingRefreshPromise) {
      console.log(`Waiting for existing refresh to complete for track ${trackId}`);
      try {
        const newToken = await existingRefreshPromise;
        return streamingApi.getStreamingUrl(trackId, newToken);
      } catch {
        // If the existing refresh failed, continue with force refresh
        console.log(`Existing refresh failed, proceeding with force refresh for track ${trackId}`);
      }
    }

    try {
      // Clear any existing cached data
      streamingApi.clearCachedToken(trackId);

      // Get a completely new token
      const newToken = await streamingApi.signToken(trackId);
      return streamingApi.getStreamingUrl(trackId, newToken);
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  },

  // Validate token and get streaming URL with automatic retry on 401
  getSignedStreamingUrl: async (trackId: string) => {
    try {
      // Try to get cached token first, if not available, sign a new one
      let token = tokenCache.get(trackId);
      if (!token) {
        token = await streamingApi.signToken(trackId);
      }

      // Ensure token is defined before using it
      if (!token) {
        throw new Error("Failed to obtain streaming token");
      }

      return streamingApi.getStreamingUrl(trackId, token);
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  },

  // Retry streaming URL with token refresh on 401 error
  getSignedStreamingUrlWithRetry: async (trackId: string) => {
    try {
      return await streamingApi.getSignedStreamingUrl(trackId);
    } catch (error) {
      console.error("Initial streaming URL request failed:", error);

      // Always try to refresh token if there's an error and we have an old token
      const oldToken = tokenCache.get(trackId);
      if (oldToken) {
        try {
          console.log("Attempting to refresh token for trackId:", trackId);
          const newToken = await streamingApi.refreshSignToken({ trackId, oldToken });
          return streamingApi.getStreamingUrl(trackId, newToken);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          // If refresh fails, clear cached token and try with a new token
          tokenCache.delete(trackId);
          const newToken = await streamingApi.signToken(trackId);
          return streamingApi.getStreamingUrl(trackId, newToken);
        }
      } else {
        // No cached token, sign a new one
        const newToken = await streamingApi.signToken(trackId);
        return streamingApi.getStreamingUrl(trackId, newToken);
      }
    }
  },
};
