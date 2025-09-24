import { isAxiosError } from "axios";
import axiosInstance from "@/config/axios-instance";
import {
  ArtistLoginResponse,
  IUserCurrent,
  ListenerLoginResponse,
} from "@/types/auth";

export const authApi = {
  listener: {
    login: async (
      email: string,
      password: string,
    ): Promise<ListenerLoginResponse> => {
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
  artist: {
    login: async (
      email: string,
      password: string,
    ): Promise<ArtistLoginResponse> => {
      try {
        const response = await axiosInstance.post(
          "/api/authentication/login/artist",
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
  general: {
    getCurrentProfile: async (): Promise<IUserCurrent> => {
      try {
        const response = await axiosInstance.post(
          "/api/authentication/users/me",
        );
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
    logout: async () => {
      try {
        const response = await axiosInstance.post("/api/authentication/logout");
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
  },
};
