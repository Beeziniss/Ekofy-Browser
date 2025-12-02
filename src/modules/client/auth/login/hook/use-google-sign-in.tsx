import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/services/auth-services";
import { useAuthStore } from "@/store";
import { setUserInfoToLocalStorage, setAccessTokenToLocalStorage, formatAuthError } from "@/utils/auth-utils";
import { ListenerLoginResponse } from "@/types/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface GoogleSignInCredentials {
  googleToken: string;
  isMobile: boolean;
}

const useGoogleSignIn = () => {
  const router = useRouter();
  const { setUserData, setAuthenticated } = useAuthStore();

  const {
    mutate: signInWithGoogle,
    mutateAsync: signInWithGoogleAsync,
    data,
    isError,
    error,
    isPending,
    isSuccess,
    reset,
  } = useMutation<ListenerLoginResponse, Error, GoogleSignInCredentials>({
    mutationFn: async ({ googleToken, isMobile }: GoogleSignInCredentials) => {
      try {
        const response = await authApi.listener.googleLogin(googleToken, isMobile);
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
            isRememberMe: true, // Google login always remember
          };
          setUserInfoToLocalStorage(userInfo);
          setUserData(userInfo, data.result.accessToken);
          setAuthenticated(true);

          toast.success("Signed in!");
          
          // Redirect to home page after short delay for toast to show
          setTimeout(() => {
            router.push("/");
          }, 500);
        }
      } catch (error) {
        console.error("Failed to process Google sign-in success:", error);
        toast.error("Failed to complete sign-in. Please try again.");
      }
    },
    onError: (error) => {
      console.error("Google sign-in error:", error);
      toast.error("Failed to sign in with Google. Please try again.");
      setAuthenticated(false);
    },
  });

  return {
    signInWithGoogle,
    signInWithGoogleAsync,
    data: data?.result,
    isLoading: isPending,
    isError,
    error,
    isSuccess,
    reset,
  };
};

export default useGoogleSignIn;
