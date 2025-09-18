import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/services/auth-services";
import { useAuthStore } from "@/store";
import { setUserInfoToLocalStorage, formatAuthError } from "@/utils/auth-utils";
import { User } from "@/gql/graphql";

interface SignInCredentials {
  email: string;
  password: string;
}

interface SignInResponse {
  user: User;
  message?: string;
}

const useSignIn = () => {
  const { setUserData, setAuthenticated, setLoading } = useAuthStore();

  const {
    mutate: signIn,
    mutateAsync: signInAsync,
    data,
    isError,
    error,
    isPending,
    isSuccess,
    reset,
  } = useMutation<SignInResponse, Error, SignInCredentials>({
    mutationFn: async ({ email, password }: SignInCredentials) => {
      setLoading(true);
      try {
        const response = await authApi.listener.login(email, password);
        return response;
      } catch (error) {
        throw new Error(formatAuthError(error));
      } finally {
        setLoading(false);
      }
    },
    onSuccess: async (data) => {
      try {
        // Store user data in local storage and zustand store
        await setUserInfoToLocalStorage(data.user);
        setUserData(data.user);
        setAuthenticated(true);
      } catch (error) {
        console.error("Failed to process sign-in success:", error);
      }
    },
    onError: (error) => {
      console.error("Sign-in error:", error);
      setAuthenticated(false);
    },
  });

  return {
    signIn,
    signInAsync,
    user: data?.user,
    isLoading: isPending,
    isError,
    error,
    isSuccess,
    reset,
  };
};

export default useSignIn;
