import { isAxiosError } from "axios";
import axiosInstance from "@/config/axios-instance";
import {
  ArtistLoginResponse,
  IUserCurrent,
  ListenerLoginResponse,
  RegisterArtistData, // Import raw data type instead of wrapped response
  ModeratorLoginResponse,
  AdminLoginResponse,
  RegisterListenerData,
  RefreshTokenResponse,
  ForgotPasswordRequestData,
  ResetPasswordRequestData,
} from "@/types/auth";
import { formatServiceError } from "@/utils/signup-utils";

export const authApi = {
  listener: {
    login: async (email: string, password: string, isRememberMe: boolean): Promise<ListenerLoginResponse> => {
      try {
        const response = await axiosInstance.post("/api/authentication/login/listener", {
          email,
          password,
          isRememberMe,
        });
        return response.data;
      } catch (error) {
        if (isAxiosError(error)) {
          throw new Error(error.response?.data?.message || error.message);
        }
        throw error;
      }
    },
    googleLogin: async (googleToken: string, isMobile: boolean): Promise<ListenerLoginResponse> => {
      try {
        const response = await axiosInstance.post("/api/authentication/login/listener/google", {
          googleToken,
          isMobile,
        });
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
        const response = await axiosInstance.post("/api/authentication/register/listener", data);

        // Handle 204 No Content response
        if (response.status === 204) {
          return {
            success: true,
            message: "Registration successful! We have sent a verification code to your email.",
            user: null,
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
    linkgoogleAccount: async () => {
      try {
        const response = await axiosInstance.patch("/api/authentication/listener/link-google");
        return response.data;
      }
      catch (error) {
        if (isAxiosError(error)) {
          throw new Error(error.response?.data?.message || error.message);
        }
        throw error;
      }
    },
  },
  artist: {
    login: async (email: string, password: string, isRememberMe: boolean): Promise<ArtistLoginResponse> => {
      try {
        const response = await axiosInstance.post("/api/authentication/login/artist", {
          email,
          password,
          isRememberMe,
        });
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
          AvatarImage: data.avatarImage,
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
        const response = await axiosInstance.post("/api/authentication/register/artist", apiData);

        // Handle 204 No Content response
        if (response.status === 204) {
          return {
            success: true,
            message:
              "Artist registration successful! We have received the information and will respond to you within 48 hours..",
            user: null,
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
    refreshToken: async (): Promise<RefreshTokenResponse> => {
      try {
        const response = await axiosInstance.post("/api/authentication/refresh-token");
        return response.data;
      } catch (error) {
        if (isAxiosError(error)) {
          throw new Error(error.response?.data?.message || "Failed to refresh token");
        }
        throw error;
      }
    },
    getCurrentProfile: async (): Promise<IUserCurrent> => {
      try {
        const response = await axiosInstance.post("/api/authentication/users/me");
        return response.data;
      } catch (error) {
        if (isAxiosError(error)) {
          throw new Error(error.response?.data?.message || "Failed to get user");
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
          throw new Error(error.response?.data?.message || "Failed to get user");
        }
        throw error;
      }
    },
    verifyOPT: async (email: string, providedOtp: string) => {
      try {
        const response = await axiosInstance.post(
          `/api/authentication/verify-otp?email=${encodeURIComponent(email)}&providedOtp=${encodeURIComponent(providedOtp)}`,
        );
        return response.data;
      } catch (error) {
        if (isAxiosError(error)) {
          throw new Error(error.response?.data?.message || "Failed to verify OTP");
        }
        throw error;
      }
    },
    resendOTP: async (email: string) => {
      try {
        const response = await axiosInstance.post(`/api/authentication/resend-otp?email=${encodeURIComponent(email)}`);
        return response.data;
      } catch (error) {
        if (isAxiosError(error)) {
          throw new Error(error.response?.data?.message || "Failed to resend OTP");
        }
        throw error;
      }
    },
    forgotPassword: async (data: ForgotPasswordRequestData) => {
      try {
        const response = await axiosInstance.post(`/api/authentication/forgot-password`, data);
        return response.data;
      } catch (error) {
        if (isAxiosError(error)) {
          throw new Error(error.response?.data?.message || "Failed to send forgot password request");
        }
        throw error;
      }
    },
    resetPassword: async (data: ResetPasswordRequestData) => {
      try {
        const response = await axiosInstance.post(`/api/authentication/reset-password`, data);
        return response.data;
      } catch (error) {
        if (isAxiosError(error)) {
          throw new Error(error.response?.data?.message || "Failed to reset password");
        }
        throw error;
      }
    },
    changePassword: async (currentPassword: string, newPassword: string, confirmPassword: string) => {
      try {
        const response = await axiosInstance.post(`/api/authentication/change-password`, {
          currentPassword,
          newPassword,
          confirmPassword,
        });
        return response.data;
      } catch (error) {
        if (isAxiosError(error)) {
          throw new Error(error.response?.data?.message || "Failed to change password");
        }
        throw error;
      }
    },
  },
  moderator: {
    login: async (email: string, password: string, isRememberMe: boolean): Promise<ModeratorLoginResponse> => {
      try {
        const response = await axiosInstance.post("/api/authentication/login/moderator", {
          email,
          password,
          isRememberMe,
        });
        return response.data;
      } catch (error) {
        if (isAxiosError(error)) {
          throw new Error(error.response?.data?.message || error.message);
        }
        throw error;
      }
    },
  },
  admin: {
    login: async (email: string, password: string, isRememberMe: boolean): Promise<AdminLoginResponse> => {
      try {
        const response = await axiosInstance.post("/api/authentication/login/admin", { email, password, isRememberMe });
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
