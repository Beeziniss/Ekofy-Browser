"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Clock } from "lucide-react";
import { toast } from "sonner";

export function StripeSuccessCard() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(20);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsRedirecting(true);
          toast.success("Redirecting to studio...");
          router.push("artist/studio/tracks");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleManualRedirect = () => {
    setIsRedirecting(true);
    toast.success("Redirecting to studio...");
    router.push("/studio/track");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <Card className="w-full max-w-md mx-auto bg-white shadow-2xl border-0">
        <CardContent className="p-8 text-center space-y-6">
          {/* Success Icon */}
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          {/* Success Message */}
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-gray-900">
              Account Setup Successful!
            </h1>
            <p className="text-gray-600 leading-relaxed">
              Your Stripe account has been successfully connected. You can now receive payments for your music.
            </p>
          </div>

          {/* Countdown */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-center gap-2 text-green-700">
              <Clock className="w-5 h-5" />
              <span className="font-medium">
                Auto-redirecting in {countdown} seconds
              </span>
            </div>
          </div>

          {/* Manual Redirect Button */}
          <Button
            onClick={handleManualRedirect}
            disabled={isRedirecting}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 h-12 transition-all duration-200"
          >
            {isRedirecting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Redirecting...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                Go to Studio
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </Button>

          {/* Additional Info */}
          <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
            <p>🎉 You can now upload and monetize your music tracks!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}