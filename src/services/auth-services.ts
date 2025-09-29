import { isAxiosError } from "axios";
import axiosInstance from "@/config/axios-instance";
import {
  ArtistLoginResponse,
  IUserCurrent,
  ListenerLoginResponse,
  RegisterListenerDataResponse,
  RegisterArtistData // Import raw data type instead of wrapped response
} from "@/types/auth";
import { formatServiceError } from "@/utils/signup-utils";

export const authApi = {
  listener: {
    login: async (
      email: string,
      password: string,
    ): Promise<ListenerLoginResponse> => {
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
    register: async (data: RegisterListenerDataResponse) => {
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
    register: async (data: RegisterArtistData) => {
      try {
        console.log("📡 API Call - Raw data being sent:", data);
        
        // Try mapping to PascalCase field names if API expects them
        const apiData = {
          Email: data.email,
          Password: data.password, 
          ConfirmPassword: data.confirmPassword,
          FullName: data.fullName,
          BirthDate: data.birthDate,
          Gender: data.gender,
          PhoneNumber: data.phoneNumber,
          StageName: data.stageName,
          ArtistType: data.artistType,
          Members: data.members,
          IdentityCard: {
            Number: data.identityCard.number,
            FullName: data.identityCard.fullName,
            DateOfBirth: data.identityCard.dateOfBirth,
            Gender: data.identityCard.gender,
            PlaceOfOrigin: data.identityCard.placeOfOrigin,
            Nationality: data.identityCard.nationality,
            PlaceOfResidence: {
              Street: data.identityCard.placeOfResidence.street,
              Ward: data.identityCard.placeOfResidence.ward,
              Province: data.identityCard.placeOfResidence.province,
              AddressLine: data.identityCard.placeOfResidence.addressLine,
            },
            FrontImage: data.identityCard.frontImage,
            BackImage: data.identityCard.backImage,
            ValidUntil: data.identityCard.validUntil,
          },
        };
        
        console.log("📡 API Call - PascalCase data being sent:", apiData);
        
        const response = await axiosInstance.post(
          "/api/authentication/register/artist",
          apiData, // Send PascalCase version
        );
        
        // Handle 204 No Content response
        if (response.status === 204) {
          return {
            success: true,
            message: "Đăng ký nghệ sĩ thành công! Chúng tôi đã gửi mã OTP đến số điện thoại của bạn để xác thực.",
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
