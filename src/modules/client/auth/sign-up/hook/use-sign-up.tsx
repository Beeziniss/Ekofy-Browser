import { useMutation } from "@tanstack/react-query";
import { authApi, RegisterListenerData } from "@/services/auth-services";
import { useAuthStore } from "@/store";
import { setUserInfoToLocalStorage } from "@/utils/auth-utils";
import { User } from "@/gql/graphql";
import { toast } from "sonner";
import { useSignUpStore } from "@/store/stores/signup-store";
import { formatSimpleAPIError } from "@/utils/signup-utils";
// Simple error formatter that only uses status and detail


interface SignUpResponse {
  user?: User | null;
  message?: string;
  success?: boolean;
}

const useSignUp = (onNavigate?: () => void) => {
  const { setUserData, setAuthenticated, setLoading } = useAuthStore();
  const { goToNextStep } = useSignUpStore();

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
        // Show success message immediately
        const message = data?.message || "Đăng ký thành công! Chúng tôi đã gửi mã xác thực đến email của bạn.";
        toast.success(message);
        
        // If user data is returned, store it (some APIs return user data immediately)
        if (data?.user) {
          await setUserInfoToLocalStorage(data.user);
          setUserData(data.user);
          setAuthenticated(true);
        }
        
        // Auto-navigate to next step after success
        setTimeout(() => {
          goToNextStep();
          // Call the optional callback
          if (onNavigate) {
            onNavigate();
          }
        }, 500);
        
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

export default useSignUp;