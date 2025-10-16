"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import EkofyLogo from '../../../../../../public/ekofy-logo.svg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';
import { useArtistSignUpStore } from '@/store/stores/artist-signup-store';
import { toast } from 'sonner';

interface ArtistOTPVerificationSectionProps {
  onNext: (data?: any) => void;
  onBack: () => void;
  initialData?: {
    otp: string[];
  };
}

const ArtistOTPVerificationSection = ({ onNext, onBack, initialData }: ArtistOTPVerificationSectionProps) => {
  const [otp, setOtp] = useState(initialData?.otp || ['', '', '', '', '', '']);
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
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      toast.error('Please enter a complete 6-digit OTP code');
      return;
    }
    
    try {
      // Update OTP in store
      completeOTPVerification({ otp: otpCode });
      
      console.log("🎉 OTP Verification completed successfully!");
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
    setOtp(['', '', '', '', '', '']);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#121212] px-6 py-12">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button 
          onClick={handleBack}
          className="flex items-center text-white hover:text-blue-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="rounded-full flex items-center justify-center mr-3">
              <Image src={EkofyLogo} alt="Logo" width={60} height={60} />
            </div>
            <h1 className="text-4xl font-bold text-primary-gradient">Ekofy</h1>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Xác thực OTP</h2>
          <p className="text-gray-300 text-sm mb-2">
            Chúng tôi đã gửi mã xác thực tới emaill
          </p>
          <p className="text-white font-medium">{formData.email || 'của bạn'}</p>
        </div>

        {/* OTP Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-4 text-center">
              Nhập mã xác thực
            </label>
            <div className="flex justify-center space-x-3">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center border-gradient-input text-white text-lg font-medium"
                  maxLength={1}
                />
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full primary_gradient hover:opacity-90 text-white font-medium py-3 px-4 rounded-md transition duration-300 ease-in-out"
            size="lg"
            disabled={otp.join('').length !== 6}
          >
            Xác thực OTP
          </Button>
        </form>

        {/* Resend Code */}
        <div className="text-center mt-6">
          {!canResend ? (
            <p className="text-gray-400 text-sm">
              Gửi lại mã sau {timer}s
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium"
            >
              Gửi lại mã xác thực
            </button>
          )}
        </div>

        {/* Help Text */}
        <div className="text-center mt-4">
          <p className="text-gray-400 text-xs">
            Didn't receive the code? Check your spam folder or{' '}
            <button className="text-blue-400 hover:text-blue-300">
              change email address
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArtistOTPVerificationSection;