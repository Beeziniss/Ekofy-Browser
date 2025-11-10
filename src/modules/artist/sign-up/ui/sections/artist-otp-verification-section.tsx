"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useArtistSignUpStore } from "@/store/stores/artist-signup-store";
import { toast } from "sonner";
import { ArtistOTPData, ArtistSignUpSectionProps } from "@/types/artist_type";
import { EkofyLogo } from "@/assets/icons";

type ArtistOTPVerificationSectionProps = ArtistSignUpSectionProps<ArtistOTPData> & {
  onBack: () => void;
};

const ArtistOTPVerificationSection = ({ onNext, onBack, initialData }: ArtistOTPVerificationSectionProps) => {
  const [otp, setOtp] = useState<string[]>(
    Array.isArray(initialData?.otp) ? initialData.otp : ["", "", "", "", "", ""],
  );
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  // Store and hooks
  const { formData, completeOTPVerification, goToPreviousStep } = useArtistSignUpStore();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      toast.error("Please enter a complete 6-digit OTP code");
      return;
    }

    try {
      // Update OTP in store
      completeOTPVerification({ otp: otpCode });

      toast.success("OTP verification successful! Registration completed.");

      // Call onNext to trigger final navigation
      onNext({ otp: otpCode });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  const handleBack = () => {
    goToPreviousStep();
    onBack();
  };

  const handleResend = () => {
    setTimer(60);
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#121212] px-6 py-12">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-8 flex items-center text-white transition-colors hover:text-blue-400"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </button>

        {/* Logo and Title */}
        <div className="mb-8 text-center">
          <div className="mb-6 flex items-center justify-center">
            <div className="mr-3 flex items-center justify-center rounded-full">
              <EkofyLogo className="size-[60px]" />
            </div>
            <h1 className="text-primary-gradient text-4xl font-bold">Ekofy</h1>
          </div>
          <h2 className="mb-4 text-3xl font-bold text-white">Xác thực OTP</h2>
          <p className="mb-2 text-sm text-gray-300">Chúng tôi đã gửi mã xác thực tới emaill</p>
          <p className="font-medium text-white">{formData.email || "của bạn"}</p>
        </div>

        {/* OTP Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-4 block text-center text-sm font-medium text-white">Nhập mã xác thực</label>
            <div className="flex justify-center space-x-3">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="border-gradient-input h-12 w-12 text-center text-lg font-medium text-white"
                  maxLength={1}
                />
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="primary_gradient w-full rounded-md px-4 py-3 font-medium text-white transition duration-300 ease-in-out hover:opacity-90"
            size="lg"
            disabled={otp.join("").length !== 6}
          >
            Xác thực OTP
          </Button>
        </form>

        {/* Resend Code */}
        <div className="mt-6 text-center">
          {!canResend ? (
            <p className="text-sm text-gray-400">Gửi lại mã sau {timer}s</p>
          ) : (
            <button onClick={handleResend} className="text-sm font-medium text-blue-400 hover:text-blue-300">
              Gửi lại mã xác thực
            </button>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400">
            Did not receive the code? Check your spam folder or{" "}
            <button className="text-blue-400 hover:text-blue-300">change email address</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArtistOTPVerificationSection;
