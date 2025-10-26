"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import EkofyLogo from '../../../../../../../public/ekofy-logo.svg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';
import { useSignUpStore } from '@/store/stores/index';
import useSignUp from '../../hook/use-sign-up';
import { toast } from 'sonner';
import { ClientOTPVerificationSectionProps } from '@/types/listener-auth';

const OTPVerificationSection = ({ onNext, onBack, initialData }: ClientOTPVerificationSectionProps) => {
  const { completeOTPVerification, goToPreviousStepFromOTP, formData, clearOTPData } = useSignUpStore();
  
  // Initialize state from global store or initial data
  const [otp, setOtp] = useState(initialData?.otp || formData.otp || '');
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
    console.log('OTP Section - Available form data:', formData);
    console.log('OTP Section - Email available:', formData.email);
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6 || !/^\d+$/.test(otp)) {
      toast.error('Please enter a valid 6-digit numeric OTP');
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
      console.error('OTP verification failed:', error);
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
      console.error('Resend OTP failed:', error);
    }
  };

  const handleBack = () => {
    // Clear OTP data when going back
    clearOTPData();
    setOtp(''); // Clear local OTP state
    
    // Use hook to go back directly to form step
    goToPreviousStepFromOTP();
    // Also call the original onBack for component communication
    onBack();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#121212] px-6 py-12">
      <div className="w-full max-w-sm space-y-8">
        {/* Back Button */}
        <button 
          onClick={handleBack}
          className="flex items-center text-white hover:text-blue-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        {/* Logo and Title */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-8">
            <div className="rounded-full flex items-center justify-center mr-3">
              <Image src={EkofyLogo} alt="Logo" width={60} height={60} />
            </div>
            <h1 className="text-4xl font-bold text-primary-gradient">Ekofy</h1>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Account Verification</h2>
          <p className="text-gray-300 text-sm mb-8">
            Please check your email and enter the verification code sent to your email.
          </p>
        </div>

        {/* OTP Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Field */}
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-white mb-2">
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
              className="w-full border-gradient-input text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/50 h-12"
            />
          </div>

          {/* Resend Code Link */}
          <div className="text-center">
            <span className="text-gray-400 text-sm">Have not received the code? </span>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={isResendingOTP || !canResend}
              className={`text-sm transition-colors underline ${
                isResendingOTP || !canResend 
                  ? 'text-gray-500 cursor-not-allowed' 
                  : 'text-white hover:text-blue-400'
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
            className="w-full primary_gradient hover:opacity-90 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-md transition duration-300 ease-in-out"
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