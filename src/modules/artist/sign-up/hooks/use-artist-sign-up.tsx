import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/services/auth-services";
import { RegisterArtistData, RegisterArtistResponse } from "@/types/auth";
import { useAuthStore } from "@/store";
import { setUserInfoToLocalStorage } from "@/utils/auth-utils";
import { toast } from "sonner";
import { useArtistSignUpStore } from "@/store/stores/artist-signup-store";
import { isAxiosError } from "axios";
import { User } from "@/gql/graphql";
import { mapGraphQLUserRoleToLocal } from "@/utils/signup-utils";

// Simple error formatter for artist signup
const formatArtistSignUpError = (error: any): string => {
  if (isAxiosError(error)) {
    const response = error.response;
    const data = response?.data;
    
    // Use detail if available, otherwise fallback to generic message
    if (data?.detail) {
      return data.detail;
    }
    
    // Fallback based on status
    if (response?.status === 409) {
      return "Dữ liệu đã tồn tại trong hệ thống.";
    }
    
    return error.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return "Đã xảy ra lỗi. Vui lòng thử lại.";
};

interface ArtistSignUpResponse {
  user?: User | null;
  message?: string;
  success?: boolean;
}

const useArtistSignUp = (onNavigate?: () => void) => {
  const { setUserData, setAuthenticated, setLoading } = useAuthStore();
  const { currentStep } = useArtistSignUpStore();

  const {
    mutate: signUp,
    mutateAsync: signUpAsync,
    data,
    isError,
    error,
    isPending,
    isSuccess,
    reset,
  } = useMutation<ArtistSignUpResponse, Error, RegisterArtistData>({
    mutationFn: async (registerData: RegisterArtistData) => {
      setLoading(true);
      try {
        // Send raw RegisterArtistData directly to API - no wrapping needed
        console.log("🚀 Sending registration data:", registerData);
        
        const response = await authApi.artist.register(registerData as any); // Cast to avoid type mismatch
        return response;
      } catch (error) {
        throw new Error(formatArtistSignUpError(error));
      } finally {
        setLoading(false);
      }
    },
    onSuccess: async (data: ArtistSignUpResponse) => {
      try {
        // Show success message immediately
        const message = data?.message || "Đăng ký nghệ sĩ thành công! Chúng tôi đã gửi mã xác thực đến email của bạn.";
        toast.success(message);
        
        // If user data is returned, store it (some APIs return user data immediately)
        if (data?.user) {
          // Map GraphQL User to IUserLocalStorage format
          const userData = {
            userId: data.user.id, // Map id to userId
            role: mapGraphQLUserRoleToLocal(data.user.role), // Map GraphQL role to local role
            artistId: undefined, // Will be set by auth system
            listenerId: undefined, // Will be set by auth system
          };
          
          await setUserInfoToLocalStorage(userData);
          setUserData(userData);
          setAuthenticated(true);
        }        
        // For OTP step, this is the final registration - navigate to success page or dashboard
        if (currentStep === "otp") {
          setTimeout(() => {
            if (onNavigate) {
              onNavigate();
            }
          }, 1000);
        } else {
          // For other steps, this shouldn't happen but we handle it gracefully
          console.warn("⚠️ Registration succeeded but not in OTP step. Current step:", currentStep);}
        
      } catch (error) {
        console.error("Failed to process artist sign-up success:", error);
      }
    },
    onError: (error: Error) => {
      console.error("Artist sign-up error:", error);
      const errorMessage = formatArtistSignUpError(error);
      toast.error(errorMessage);
      setAuthenticated(false);
    },
  });

  return {
    signUp,
    signUpAsync,
    user: data?.user,
    isLoading: isPending,
    isError,
    error,
    isSuccess,
    reset,
    response: data,
  };
};

export default useArtistSignUp;