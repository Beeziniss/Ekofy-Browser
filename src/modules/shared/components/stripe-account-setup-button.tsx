"use client";

import { Button } from "@/components/ui/button";
import { useCreateExpressConnectedAccount, getStripeAccountUrls } from "@/gql/client-mutation-options/stripe-mutation";
import { CreditCard, Loader2 } from "lucide-react";

export function StripeAccountSetupButton() {
  const createAccountMutation = useCreateExpressConnectedAccount();

  const handleSetupStripeAccount = async () => {
    try {
      const { returnUrl, refreshUrl } = getStripeAccountUrls();
      
      await createAccountMutation.mutateAsync({
        returnUrl,
        refreshUrl,
      });
      // Mutation will automatically redirect to Stripe onboarding
    } catch (error) {
      console.error("Failed to setup Stripe account:", error);
    }
  };

  return (
    <Button
      onClick={handleSetupStripeAccount}
      disabled={createAccountMutation.isPending}
      className="flex items-center gap-2"
    >
      {createAccountMutation.isPending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Setting up account...
        </>
      ) : (
        <>
          <CreditCard className="w-4 h-4" />
          Setup Stripe Account
        </>
      )}
    </Button>
  );
}