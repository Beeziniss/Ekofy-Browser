import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/services/auth-services";
import { useAuthStore } from "@/store";
import { setUserInfoToLocalStorage, setAccessTokenToLocalStorage, formatAuthError } from "@/utils/auth-utils";
import { ArtistLoginResponse } from "@/types/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ArtistSignInCredentials {
  email: string;
  password: string;
}

const useArtistSignIn = () => {
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
  } = useMutation<ArtistLoginResponse, Error, ArtistSignInCredentials>({
    mutationFn: async ({ email, password }: ArtistSignInCredentials) => {
      try {
        const response = await authApi.artist.login(email, password);
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
            artistId: data.result.artistId,
            role: data.result.role,
          };
          setUserInfoToLocalStorage(userInfo);
          setUserData(userInfo, data.result.accessToken);
          setAuthenticated(true);

          toast.success("Artist signed in successfully!");
          // Redirect to artist studio
          router.push("/artist/studio");
        }
      } catch (error) {
        console.error("Failed to process artist sign-in success:", error);
      }
    },
    onError: (error) => {
      console.error("Artist sign-in error:", error);
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

export default useArtistSignIn;
