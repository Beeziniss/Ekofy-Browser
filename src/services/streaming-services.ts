import axiosInstance from "@/config/axios-instance";
import { isAxiosError } from "axios";

export const streamingApi = {
  signToken: async (token: string) => {
    try {
      const response = await axiosInstance.post(
        "/api/authentication/login/artist",
        token,
      );
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  },
  getStreamingUrl: async (trackId: string, token: string) => {
    try {
      const response = await axiosInstance.get(
        `/api/media-streaming/cloudfront/${trackId}/master.m3u8`,
        {
          params: { token },
        },
      );
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  },
};
