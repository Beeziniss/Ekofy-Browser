import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/services/auth-services";
import { useAuthStore } from "@/store";
import {
  setUserInfoToLocalStorage,
  setAccessTokenToLocalStorage,
  formatAuthError,
} from "@/utils/auth-utils";
import { ListenerLoginResponse } from "@/types/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SignInCredentials {
  email: string;
  password: string;
}

const useSignIn = () => {
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
  } = useMutation<ListenerLoginResponse, Error, SignInCredentials>({
    mutationFn: async ({ email, password }: SignInCredentials) => {
      try {
        const response = await authApi.listener.login(email, password);
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
            listenerId: data.result.listenerId,
            role: data.result.role,
          };
          setUserInfoToLocalStorage(userInfo);
          setUserData(userInfo, data.result.accessToken);
          setAuthenticated(true);

          toast.success("Signed in successfully!");
          router.push("/");
        }
      } catch (error) {
        console.error("Failed to process sign-in success:", error);
      }
    },
    onError: (error) => {
      console.error("Sign-in error:", error);
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

export default useSignIn;
