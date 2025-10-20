import axiosInstance from "@/config/axios-instance";
import { isAxiosError } from "axios";

export const streamingApi = {
  // Sign token for a specific track ID
  signToken: async (trackId: string) => {
    try {
      const response = await axiosInstance.post(
        "/api/media-streaming/signed-token",
        trackId,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.data.token;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  },

  // Generate streaming URL with token
  getStreamingUrl: (trackId: string, token: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_URL_ENDPOINT;
    return `${baseUrl}/api/media-streaming/cloudfront/${trackId}/master.m3u8?token=${token}`;
  },

  // Validate token and get streaming URL in one call
  getSignedStreamingUrl: async (trackId: string) => {
    try {
      const token = await streamingApi.signToken(trackId);
      return streamingApi.getStreamingUrl(trackId, token);
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  },
};
