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
import { CreditCard, AlertTriangle, Lock, Zap } from "lucide-react";
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
      <DialogContent className="max-w-lg w-full mx-auto border-border/50 bg-gradient-to-br from-background via-background to-background/95 max-h-[100vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
          </div>
          <DialogTitle className="text-center text-xl font-bold">
            Stripe Account Required
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground">
            You need a connected Stripe account to apply for music requests and
            receive payments.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {/* Secure Payment Setup Card */}
          <div className="group relative overflow-hidden rounded-lg border border-primary/30 bg-primary/5 p-4 transition-all hover:border-primary/50">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-main-blue">
                <Lock className="h-5 w-5 text-main-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="mb-1 text-base font-semibold text-primary">
                  Secure Payment Setup
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Connect your bank account safely through Stripe to receive
                  payments for your music work.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Setup Card */}
          <div className="group relative overflow-hidden rounded-lg border border-primary/30 bg-primary/5 p-4 transition-all hover:border-primary/50">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-main-purple">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="mb-1 text-base font-semibold text-primary">
                  Quick Setup
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The setup process takes just a few minutes and is handled
                  securely by Stripe.
                </p>
              </div>
            </div>
          </div>

          {/* What you'll need */}
          <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
            <h4 className="mb-2 text-sm font-semibold text-foreground">
              What you&apos;ll need:
            </h4>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1 text-primary">•</span>
                <span>Valid government ID</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-primary">•</span>
                <span>Bank account information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-primary">•</span>
                <span>Business or personal tax information</span>
              </li>
            </ul>
          </div>

          {/* Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-500">
              <CreditCard className="h-3 w-3" />
              Required for Artists
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2 pt-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1 h-9 text-sm border-border/50 transition-all hover:border-border"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSetupStripeAccount}
            disabled={createAccountMutation.isPending}
            className="flex-1 h-9 text-sm primary_gradient font-semibold transition-all hover:opacity-80"
          >
            {createAccountMutation.isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Setting up...
              </div>
            ) : (
              <>
                <CreditCard className="mr-1 h-3 w-3 text-white" />
                <span className="text-white">Setup Stripe Account</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}