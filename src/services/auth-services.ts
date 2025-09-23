import { isAxiosError } from "axios";
import axiosInstance from "@/config/axios-instance";
import { formatServiceError } from "@/utils/signup-utils";
export interface RegisterListenerData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  birthDate: string;
  gender: string;
  displayName: string;
}

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
    register: async (data: RegisterListenerData) => {
      try {
        const response = await axiosInstance.post(
          "/api/authentication/register/listener",
          data,
          { withCredentials: false } // Tạm thời tắt credentials cho register API
        );
        
        // Handle 204 No Content response
        if (response.status === 204) {
          return {
            success: true,
            message: "Đăng ký thành công! Chúng tôi đã gửi mã xác thực đến email của bạn.",
            user: null
          };
        }
        
        return response.data;
      } catch (error) {
        if (isAxiosError(error)) {
          throw new Error(formatServiceError(error));
        }
        throw error;
      }
    },
  },
};
