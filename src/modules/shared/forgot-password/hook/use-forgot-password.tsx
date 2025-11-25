import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/services/auth-services";
import { formatAuthError } from "@/utils/auth-utils";
import { ForgotPasswordRequestData } from "@/types/auth";
import { toast } from "sonner";

interface ForgotPasswordResponse {
  message: string;
}

const useForgotPassword = () => {
  const {
    mutate: requestForgotPassword,
    mutateAsync: requestForgotPasswordAsync,
    data,
    isError,
    error,
    isPending,
    isSuccess,
    reset,
  } = useMutation<ForgotPasswordResponse, Error, ForgotPasswordRequestData>({
    mutationFn: async ({ email }: ForgotPasswordRequestData) => {
      try {
        const response = await authApi.general.forgotPassword({ email });
        return response;
      } catch (error) {
        throw new Error(formatAuthError(error));
      }
    },
    onSuccess: () => {
      toast.success("Reset password OTP sent to your email successfully");
    },
    onError: (error) => {
      console.error("Forgot password error:", error);
      toast.error("Failed to send reset password email. Please try again.");
    },
  });

  return {
    requestForgotPassword,
    requestForgotPasswordAsync,
    data,
    isLoading: isPending,
    isError,
    error,
    isSuccess,
    reset,
  };
};

export default useForgotPassword;