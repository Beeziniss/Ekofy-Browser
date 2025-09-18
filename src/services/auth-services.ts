import { isAxiosError } from "axios";
import axiosInstance from "@/config/axios-instance";

export const authApi = {
  listener: {
    getCurrentProfile: async () => {
      try {
        const response = await axiosInstance.get("/api/authentication/me");
        return response.data;
      } catch (error) {
        if (isAxiosError(error)) {
          throw new Error(
            error.response?.data?.message || "Failed to get user",
          );
        }
        throw error;
      }
    },
    login: async (email: string, password: string) => {
      try {
        const response = await axiosInstance.post(
          "/api/authentication/login/listener",
          { email, password },
        );
        return response.data;
      } catch (error) {
        if (isAxiosError(error)) {
          throw new Error(error.response?.data?.message || error.message);
        }
        throw error;
      }
    },
  },
};
