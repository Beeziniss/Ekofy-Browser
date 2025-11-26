"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, RefreshCw } from "lucide-react";
import { useCreateExpressConnectedAccount, getStripeAccountUrls } from "@/gql/client-mutation-options/stripe-mutation";
import { EkofyLogoTextLg } from "@/assets/icons";

export function StripeFailCard() {
  const router = useRouter();
  const [isRetrying, setIsRetrying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const createAccountMutation = useCreateExpressConnectedAccount();

    useEffect(() => {
    // Trigger animation after mount
    setTimeout(() => setIsVisible(true), 100);
  }, []);

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

  const handleBackToHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-lg border border-gray-200 rounded-2xl overflow-hidden">
        <CardContent className="p-8 text-center space-y-8">
          {/* Ekofy Logo */}
          <div className="flex justify-center">
            <EkofyLogoTextLg className="w-32 h-auto" />
          </div>

          {/* Animated Fail Icon */}
          <div className="mb-6 flex justify-center">
            <div
              className={`transform transition-all duration-500 delay-200 ${
                isVisible ? "scale-100 opacity-100" : "scale-50 opacity-0"
              }`}
            >
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-destructive/20" />
                <XCircle className="relative h-20 w-20 text-destructive" />
              </div>
            </div>
          </div>

          {/* Fail Message */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-main-white">
              Kết nối thất bại!
            </h1>
            <p className="text-main-white leading-relaxed text-sm">
              Đã có lỗi xảy ra khi kết nối tài khoản Stripe của bạn. Vui lòng thử lại hoặc liên hệ với đội hỗ trợ nếu vấn đề vẫn tiếp tục.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            {/* Retry Button */}
            <Button
              onClick={handleRetryStripeSetup}
              disabled={isRetrying || createAccountMutation.isPending}
              className="w-full primary_gradient hover:opacity-80 text-white font-semibold py-3 h-12 rounded-xl transition-all duration-200 shadow-lg"
            >
              {isRetrying || createAccountMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Đang kết nối...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Thử lại kết nối
                </div>
              )}
            </Button>

            {/* Back Button */}
            <Button
              onClick={handleBackToHome}
              variant="ghost"
              className="w-full primary_gradient hover:opacity-80 font-medium py-3 h-12 transition-all duration-200"
            >
              Quay về trang chủ
            </Button>
          </div>

          {/* Support Info */}
          <div className="text-sm text-main-white">
            <p>Cần hỗ trợ? Liên hệ với chúng tôi qua email:</p>
            <p className="font-medium text-main-white mt-1">support@ekofy.com</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}