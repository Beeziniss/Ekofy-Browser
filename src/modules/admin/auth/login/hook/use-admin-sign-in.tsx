import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/services/auth-services";
import { useAuthStore } from "@/store";
import { setUserInfoToLocalStorage, setAccessTokenToLocalStorage, formatAuthError } from "@/utils/auth-utils";
import { AdminLoginResponse } from "@/types/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AdminSignInCredentials {
  email: string;
  password: string;
  isRememberMe: boolean;
}

const useAdminSignIn = () => {
  const router = useRouter();
  const { setUserData, setAuthenticated } = useAuthStore();

  const {
    mutate: signIn,
    mutateAsync: signInAsync,
    data,
    isError,
    error,
    isPending,
    isSuccess,
    reset,
  } = useMutation<AdminLoginResponse, Error, AdminSignInCredentials>({
    mutationFn: async ({ email, password, isRememberMe }: AdminSignInCredentials) => {
      try {
        const response = await authApi.admin.login(email, password, isRememberMe);
        return response;
      } catch (error) {
        throw new Error(formatAuthError(error));
      }
    },
    onSuccess: async (data) => {
      try {
        // Store tokens and user data in local storage and zustand store
        if (data.result) {
          setAccessTokenToLocalStorage(data.result.accessToken);
          const userInfo = {
            userId: data.result.userId,
            role: data.result.role,
          };
          setUserInfoToLocalStorage(userInfo);
          setUserData(userInfo, data.result.accessToken);
          setAuthenticated(true);
          toast.success("Admin signed in successfully!");
          router.push("/admin/profile");
        }
      } catch (error) {
        toast.error(`Failed to process admin sign-in success: ${error}`);
      }
    },
    onError: (error) => {
      console.error("Admin sign-in error:", error);
      toast.error("Invalid credentials. Please try again.");
      setAuthenticated(false);
    },
  });

  return {
    signIn,
    signInAsync,
    data: data?.result,
    isLoading: isPending,
    isError,
    error,
    isSuccess,
    reset,
  };
};

export default useAdminSignIn;
