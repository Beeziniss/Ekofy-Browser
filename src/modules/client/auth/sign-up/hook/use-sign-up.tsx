import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/services/auth-services";
import { RegisterListenerData } from "@/types/auth";
import { useAuthStore } from "@/store";
// import { setUserInfoToLocalStorage } from "@/utils/auth-utils";
// import { User } from "@/gql/graphql";
import { toast } from "sonner";
import { useSignUpStore } from "@/store/stores/listener-signup-store";
import { formatSimpleAPIError } from "@/utils/signup-utils";
import { useRouter } from "next/navigation";

// Simple error formatter that only uses status and detail


interface SignUpResponse {
  user?: RegisterListenerData | null;
  message?: string;
  success?: boolean;
}

const useSignUp = (onNavigate?: () => void) => {
  const { setAuthenticated, setLoading } = useAuthStore();
  const { goToNextStep, formData, resetForm, updateFormData } = useSignUpStore();
  const router = useRouter();

  const {
    mutate: signUp,
    mutateAsync: signUpAsync,
    data,
    isError,
    error,
    isPending,
    isSuccess,
    reset,
  } = useMutation<SignUpResponse, Error, RegisterListenerData>({
    mutationFn: async (registerData: RegisterListenerData) => {
      setLoading(true);
      try {
        const response = await authApi.listener.register(registerData);
        return response;
      } catch (error) {
        throw new Error(formatSimpleAPIError(error));
      } finally {
        setLoading(false);
      }
    },
    onSuccess: async (data) => {
      try {
        if (data.success) {
          // Show success message immediately
          const message = data?.message || "Registration successful! We have sent a verification code to your email.";
          toast.success(message);
          
          // Keep only email for OTP verification, clear everything else
          updateFormData({ 
            email: formData.email,
            password: undefined,
            confirmPassword: undefined,
            fullName: formData.fullName,
            birthDate: formData.birthDate,
            gender: formData.gender,
            displayName: formData.displayName,
            avatarImage: formData.avatarImage,
            otp: undefined
          });
          
          // Auto-navigate to next step after success
          setTimeout(() => {
            goToNextStep();
            // Call the optional callback
            if (onNavigate) {
              onNavigate();
            }
          }, 500);
        }
      } catch (error) {
        console.error("Failed to process sign-up success:", error);
      }
    },
    onError: (error) => {
      const errorMessage = formatSimpleAPIError(error);
      toast.error(errorMessage);
      setAuthenticated(false);
    },
  });

  // Verify OTP Mutation
  const verifyOTPMutation = useMutation({
    mutationFn: async (otp: string) => {
      if (!formData.email) {
        throw new Error("Email does not exist. Please try again from the beginning.");
      }
      return await authApi.general.verifyOPT(formData.email, otp);
    },
    onSuccess: (data) => {
      const message = data?.message || "OTP verification successful! Redirecting to login page...";
      toast.success(message);
      setAuthenticated(true);
      
      // Reset form data after successful OTP verification
      resetForm();
      
      // Redirect to login page after successful OTP verification
      setTimeout(() => {
        router.push("/login");
      }, 2000); // Wait 2 seconds to show success message
    },
    onError: (error) => {
      const errorMessage = formatSimpleAPIError(error);
      toast.error(errorMessage);
    },
  });

  // Resend OTP Mutation  
  const resendOTPMutation = useMutation({
    mutationFn: async () => {
      if (!formData.email) {
        throw new Error("Email does not exist. Please try again from the beginning.");
      }
      return await authApi.general.resendOTP(formData.email);
    },
    onSuccess: (data) => {
      const message = data?.message || "OTP has been resent successfully!";
      toast.success(message);
    },
    onError: (error) => {
      const errorMessage = formatSimpleAPIError(error);
      toast.error(errorMessage);
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
    // OTP functions
    verifyOTP: verifyOTPMutation.mutate,
    verifyOTPAsync: verifyOTPMutation.mutateAsync,
    isVerifyingOTP: verifyOTPMutation.isPending,
    verifyOTPError: verifyOTPMutation.error,
    resendOTP: resendOTPMutation.mutate,
    resendOTPAsync: resendOTPMutation.mutateAsync,
    isResendingOTP: resendOTPMutation.isPending,
    resendOTPError: resendOTPMutation.error,
  };
};

export default useSignUp;