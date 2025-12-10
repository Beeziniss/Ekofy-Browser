"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { EkofyLogoTextLg } from "@/assets/icons";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function StripeSuccessCard() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [countdown, setCountdown] = useState(20);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsRedirecting(true);
          toast.success("Redirecting to studio...");
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);
  
  const handleGoToHome = () => {
    setIsRedirecting(true);
    toast.success("Redirecting to Home...");
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center  p-4">
      <Card className="w-full max-w-md mx-auto  shadow-lg border border-gray-200 rounded-2xl overflow-hidden">
        <CardContent className="p-8 text-center space-y-8">
          {/* Ekofy Logo */}
          <div className="flex justify-center">
            <EkofyLogoTextLg className="w-32 h-auto" />
          </div>

          {/* Animated Success Icon */}
          <div className="mb-6 flex justify-center">
            <div
              className={`transform transition-all duration-500 delay-200 ${
                isVisible ? "scale-100 opacity-100" : "scale-50 opacity-0"
              }`}
            >
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-green-500/20" />
                <CheckCircle2 className="relative h-20 w-20 text-green-500" />
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-main-white">
              Connected successfully!
            </h1>
            <p className="text-main-white leading-relaxed text-sm">
              Your Stripe account has been connected successfully. You are now ready to start receiving payments.
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-center gap-2 text-green-700">
              <Clock className="w-5 h-5" />
              <span className="font-medium">
                Auto-redirecting in {countdown} seconds
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="space-y-4">
            <Button
              onClick={handleGoToHome}
              disabled={isRedirecting}
              className="w-full primary_gradient hover:opacity-80 text-main-white font-semibold py-3 h-12 rounded-xl transition-all duration-200 shadow-lg"
            >
              <div className="flex items-center gap-2">
                Back to Home
                <ArrowRight className="w-4 h-4" />
              </div>
            </Button>
          </div>

          {/* Additional Info */}
          <div className="text-sm text-main-white">
            <p>If you have any questions, please contact our support team.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}