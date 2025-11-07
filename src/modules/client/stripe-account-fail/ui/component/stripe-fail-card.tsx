"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, RefreshCw, AlertTriangle } from "lucide-react";
import { useCreateExpressConnectedAccount, getStripeAccountUrls } from "@/gql/client-mutation-options/stripe-mutation";
import { toast } from "sonner";

export function StripeFailCard() {
  const router = useRouter();
  const [isRetrying, setIsRetrying] = useState(false);
  
  const createAccountMutation = useCreateExpressConnectedAccount();

  const handleBackToStudio = () => {
    toast.info("Returning to studio...");
    router.push("artist/studio/tracks");
  };

  const handleRetryStripeSetup = async () => {
    try {
      setIsRetrying(true);
      const { returnUrl, refreshUrl } = getStripeAccountUrls();
      
      await createAccountMutation.mutateAsync({
        returnUrl,
        refreshUrl,
      });
    } catch (error) {
      console.error("Retry failed:", error);
      setIsRetrying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 p-4">
      <Card className="w-full max-w-md mx-auto bg-white shadow-2xl border-0">
        <CardContent className="p-8 text-center space-y-6">
          {/* Fail Icon */}
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>

          {/* Fail Message */}
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-gray-900">
              Account Setup Failed
            </h1>
            <p className="text-gray-600 leading-relaxed">
              Something went wrong during the Stripe account setup process. Please try again or contact support if the issue persists.
            </p>
          </div>

          {/* Warning Info */}
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm text-amber-800 font-medium">
                  Payment setup required
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  You need a connected Stripe account to receive payments for your music.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Retry Button */}
            <Button
              onClick={handleRetryStripeSetup}
              disabled={isRetrying || createAccountMutation.isPending}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 h-12 transition-all duration-200"
            >
              {isRetrying || createAccountMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Setting up account...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </div>
              )}
            </Button>

            {/* Back to Studio Button */}
            <Button
              onClick={handleBackToStudio}
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 h-12 transition-all duration-200"
            >
              <div className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Studio
              </div>
            </Button>
          </div>

          {/* Additional Info */}
          <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
            <p>💡 You can continue using the studio, but payment features will be limited until account setup is complete.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}