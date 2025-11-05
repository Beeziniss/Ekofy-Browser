"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useSignUpStore } from "@/store/stores/index";
import useSignUp from "../../hook/use-sign-up";
import { toast } from "sonner";
import { ClientOTPVerificationSectionProps } from "@/types/listener-auth";
import { EkofyLogo } from "@/assets/icons";

const OTPVerificationSection = ({
  onNext,
  onBack,
  initialData,
}: ClientOTPVerificationSectionProps) => {
  const {
    completeOTPVerification,
    goToPreviousStepFromOTP,
    formData,
    clearOTPData,
  } = useSignUpStore();

  // Initialize state from global store or initial data
  const [otp, setOtp] = useState(initialData?.otp || formData.otp || "");
  const [countdown, setCountdown] = useState(60); // Start with 60 seconds
  const [canResend, setCanResend] = useState(false); // Start disabled

  const {
    verifyOTP,
    isVerifyingOTP,
    // verifyOTPError,
    resendOTP,
    isResendingOTP,
    // resendOTPError
  } = useSignUp();

  // Countdown timer effect - starts immediately when component mounts
  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true); // Enable resend button after countdown
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [countdown]);

  // Debug log to show what data is available
  React.useEffect(() => {
    console.log("OTP Section - Available form data:", formData);
    console.log("OTP Section - Email available:", formData.email);
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || otp.length !== 6 || !/^\d+$/.test(otp)) {
      toast.error("Please enter a valid 6-digit numeric OTP");
      return;
    }

    try {
      // Verify OTP using the hook
      await verifyOTP(otp);

      // Complete OTP verification - this is the final step
      await completeOTPVerification({ otp });

      // Call the original onNext for component communication
      onNext({ otp });
    } catch (error) {
      console.error("OTP verification failed:", error);
    }
  };

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numeric input and limit to 6 characters
    if (!/^\d*$/.test(value) || value.length > 6) {
      return;
    }
    setOtp(value);
  };

  const handleResendCode = async () => {
    if (!canResend || isResendingOTP) {
      return;
    }

    try {
      await resendOTP();

      // Reset countdown for next resend (60 seconds)
      setCanResend(false);
      setCountdown(60);
    } catch (error) {
      console.error("Resend OTP failed:", error);
    }
  };

  const handleBack = () => {
    // Clear OTP data when going back
    clearOTPData();
    setOtp(""); // Clear local OTP state

    // Use hook to go back directly to form step
    goToPreviousStepFromOTP();
    // Also call the original onBack for component communication
    onBack();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#121212] px-6 py-12">
      <div className="w-full max-w-sm space-y-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-8 flex items-center text-white transition-colors hover:text-blue-400"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </button>

        {/* Logo and Title */}
        <div className="text-center">
          <div className="mb-8 flex items-center justify-center">
            <div className="mr-3 flex items-center justify-center rounded-full">
              <EkofyLogo className="size-[60px]" />
            </div>
            <h1 className="text-primary-gradient text-4xl font-bold">Ekofy</h1>
          </div>
          <h2 className="mb-4 text-3xl font-bold text-white">
            Account Verification
          </h2>
          <p className="mb-8 text-sm text-gray-300">
            Please check your email and enter the verification code sent to your
            email.
          </p>
        </div>

        {/* OTP Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Field */}
          <div>
            <label
              htmlFor="otp"
              className="mb-2 block text-sm font-medium text-white"
            >
              OTP*
            </label>
            <Input
              id="otp"
              type="text"
              maxLength={6}
              value={otp}
              onChange={handleOTPChange}
              placeholder="Enter your 6-digit OTP"
              required
              className="border-gradient-input h-12 w-full text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/50"
            />
          </div>

          {/* Resend Code Link */}
          <div className="text-center">
            <span className="text-sm text-gray-400">
              Have not received the code?{" "}
            </span>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={isResendingOTP || !canResend}
              className={`text-sm underline transition-colors ${
                isResendingOTP || !canResend
                  ? "cursor-not-allowed text-gray-500"
                  : "text-white hover:text-blue-400"
              }`}
            >
              {isResendingOTP
                ? "Sending..."
                : !canResend
                  ? `Resend later ${countdown}s`
                  : "Resend verification code"}
            </button>
          </div>

          {/* Verify Button */}
          <Button
            type="submit"
            disabled={isVerifyingOTP || !otp || otp.length !== 6}
            className="primary_gradient w-full rounded-md px-4 py-3 font-medium text-white transition duration-300 ease-in-out hover:opacity-90 disabled:opacity-50"
            size="lg"
          >
            {isVerifyingOTP ? "Verifying..." : "Verify OTP"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default OTPVerificationSection;
