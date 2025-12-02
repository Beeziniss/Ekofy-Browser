import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/services/auth-services";
import { toast } from "sonner";

const useLinkGoogleAccount = () => {
  const {
    mutate: linkGoogleAccount,
    mutateAsync: linkGoogleAccountAsync,
    isPending,
    isError,
    error,
    isSuccess,
    reset,
  } = useMutation({
    mutationFn: async () => {
      try {
        const response = await authApi.listener.linkgoogleAccount();
        return response;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Google account linked successfully!");
    },
    onError: (error: Error) => {
      console.error("Link Google account error:", error);
      toast.error(error.message || "Failed to link Google account. Please try again.");
    },
  });

  return {
    linkGoogleAccount,
    linkGoogleAccountAsync,
    isLoading: isPending,
    isError,
    error,
    isSuccess,
    reset,
  };
};

export default useLinkGoogleAccount;
