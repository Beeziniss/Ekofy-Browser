import { useMutation } from "@tanstack/react-query";
import { stripeMutation } from "@/modules/shared/mutations/client/stripe-mutation";
import { execute } from "@/gql/execute";
import { toast } from "sonner";

// Hook for creating Stripe Express Connected Account
export const useCreateExpressConnectedAccount = () => {
  return useMutation({
    mutationFn: async ({
      returnUrl,
      refreshUrl,
    }: {
      returnUrl: string;
      refreshUrl: string;
    }) => {
      const result = await execute(stripeMutation, {
        returnUrl,
        refreshUrl,
      });
      
      if (!result.createExpressConnectedAccount?.url) {
        throw new Error("Failed to create Stripe account");
      }
      
      return result.createExpressConnectedAccount.url;
    },
    onSuccess: (url: string) => {
      toast.success("Redirecting to Stripe account setup...");
      // Redirect to Stripe onboarding URL
      window.location.href = url;
    },
    onError: (error: Error) => {
      console.error("Stripe account creation failed:", error);
      toast.error(error.message || "Failed to create Stripe account");
    },
  });
};

// Utility function to get current origin for URLs
export const getStripeAccountUrls = () => {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  
  return {
    returnUrl: `${origin}/stripe-account-successful`,
    refreshUrl: `${origin}/stripe-account-fail`,
  };
};