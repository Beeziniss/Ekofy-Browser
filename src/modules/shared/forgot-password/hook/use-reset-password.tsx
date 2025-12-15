import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/services/auth-services";
import { formatAuthError } from "@/utils/auth-utils";
import { ResetPasswordRequestData } from "@/types/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ResetPasswordResponse {
  message: string;
}

const useResetPassword = (userType: string = "listener") => {
  const router = useRouter();

  const {
    mutate: resetPassword,
    mutateAsync: resetPasswordAsync,
    data,
    isError,
    error,
    isPending,
    isSuccess,
    reset,
  } = useMutation<ResetPasswordResponse, Error, ResetPasswordRequestData>({
    mutationFn: async (resetData: ResetPasswordRequestData) => {
      try {
        const response = await authApi.general.resetPassword(resetData);
        return response;
      } catch (error) {
        throw new Error(formatAuthError(error));
      }
    },
    onSuccess: () => {
      toast.success("Password reset successfully");
      // Redirect to appropriate login page based on user type
      const loginPath = userType === "artist" ? "/artist/login" : "/login";
      router.push(loginPath);
    },
    onError: (error) => {
      console.error("Reset password error:", error);
      toast.error("Failed to reset password. Please check your OTP and try again.");
    },
  });

  return {
    resetPassword,
    resetPasswordAsync,
    data,
    isLoading: isPending,
    isError,
    error,
    isSuccess,
    reset,
  };
};

export default useResetPassword;