import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/services/auth-services";
import { useAuthStore } from "@/store";
import {
  setUserInfoToLocalStorage,
  setAccessTokenToLocalStorage,
  formatAuthError,
} from "@/utils/auth-utils";
import { ModeratorLoginResponse } from "@/types/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ModeratorSignInCredentials {
  email: string;
  password: string;
}

const useModeratorSignIn = () => {
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
    } = useMutation<ModeratorLoginResponse, Error, ModeratorSignInCredentials>({
      mutationFn: async ({ email, password }: ModeratorSignInCredentials) => {
        try {
        const response = await authApi.moderator.login(email, password);
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
            toast.success("Moderator signed in successfully!");
            // router.push("/moderator/dashboard");
            console.log("Moderator signed in successfully, redirect to dashboard.", data.result);
            }
        } catch (error) {
          toast.error(`Failed to process moderator sign-in success: ${error}`);
        }
      },
    onError: (error) => {
      console.error("Moderator sign-in error:", error);
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
}

export default useModeratorSignIn
