"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, AlertTriangle, ExternalLink } from "lucide-react";
import { useCreateExpressConnectedAccount, getStripeAccountUrls } from "@/gql/client-mutation-options/stripe-mutation";

interface StripeAccountRequiredModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel?: () => void;
}

export function StripeAccountRequiredModal({
  open,
  onOpenChange,
  onCancel,
}: StripeAccountRequiredModalProps) {
  const createAccountMutation = useCreateExpressConnectedAccount();

  const handleSetupStripeAccount = async () => {
    try {
      const { returnUrl, refreshUrl } = getStripeAccountUrls();
      
      await createAccountMutation.mutateAsync({
        returnUrl,
        refreshUrl,
      });
      
      // Close modal as user will be redirected to Stripe
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to setup Stripe account:", error);
      // Keep modal open on error so user can retry
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    onCancel?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-amber-600" />
          </div>
          <DialogTitle className="text-xl font-bold">
            Stripe Account Required
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            You need a connected Stripe account to apply for music requests and receive payments.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Info badges */}
          <div className="space-y-3">
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Secure Payment Setup
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    Connect your bank account safely through Stripe to receive payments for your music work.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <div className="flex items-start gap-3">
                <ExternalLink className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Quick Setup
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    The setup process takes just a few minutes and is handled securely by Stripe.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm font-medium text-gray-800 mb-2">
              What you&apos;ll need:
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Valid government ID</li>
              <li>• Bank account information</li>
              <li>• Business or personal tax information</li>
            </ul>
          </div>

          <div className="flex items-center justify-center">
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-300">
              Required for Artists
            </Badge>
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSetupStripeAccount}
            disabled={createAccountMutation.isPending}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
          >
            {createAccountMutation.isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Setting up...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Setup Stripe Account
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}