import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/services/auth-services";
import { RegisterArtistData } from "@/types/auth";
import { useAuthStore } from "@/store";
import { setUserInfoToLocalStorage } from "@/utils/auth-utils";
import { toast } from "sonner";
import { useArtistSignUpStore } from "@/store/stores/artist-signup-store";
import { isAxiosError } from "axios";
import { User } from "@/gql/graphql";
import { mapGraphQLUserRoleToLocal } from "@/utils/signup-utils";

// Simple error formatter for artist signup
const formatArtistSignUpError = (error: unknown): string => {
  if (isAxiosError(error)) {
    const response = error.response;
    const data = response?.data;
    
    // Use detail if available, otherwise fallback to generic message
    if (data?.detail) {
      return data.detail;
    }
    
    // Fallback based on status
    if (response?.status === 409) {
      return "An account with this email already exists.";
    }

    return error.message || "An error occurred. Please try again.";
  }
  
  if (error instanceof Error) {
    return error.message;
  }

  return "An error occurred. Please try again.";
};

interface ArtistSignUpResponse {
  user?: User | null;
  message?: string;
  success?: boolean;
}

const useArtistSignUp = (onNavigate?: () => void) => {
  const { setUserData, setAuthenticated, setLoading } = useAuthStore();
  const { resetForm, clearSessionData } = useArtistSignUpStore();
  // Removed currentStep as OTP is no longer used
  // const { currentStep } = useArtistSignUpStore();

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
        
        const response = await authApi.artist.register(registerData); // Cast to avoid type mismatch
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
        const message = data?.message || "Artist registration successful! We will contact you within 48 hours.";
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
        
        // Always redirect to login after successful registration (no OTP needed)
        setTimeout(() => {
          // Clear state before navigation
          resetForm();
          clearSessionData();
          
          if (onNavigate) {
            onNavigate();
          }
        }, 2000); // Give user time to read the success message
        
      } catch (error) {
        console.error("Failed to process artist sign-up success:", error);
      }
    },
    onError: (error: Error) => {
      console.error("Artist sign-up error:", error);
      const errorMessage = formatArtistSignUpError(error);
      toast.error(errorMessage);
      setAuthenticated(false);
      // Clear sensitive session data on error for security
      clearSessionData();
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