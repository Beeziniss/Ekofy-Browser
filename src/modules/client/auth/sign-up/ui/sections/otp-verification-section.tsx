"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import EkofyLogo from '../../../../../../../public/ekofy-logo.svg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';
import { useSignUpStore } from '@/store/stores/index';

interface OTPVerificationSectionProps {
  onNext: (data?: any) => void;
  onBack: () => void;
  initialData?: {
    otp: string;
  };
}

const OTPVerificationSection = ({ onNext, onBack, initialData }: OTPVerificationSectionProps) => {
  const [otp, setOtp] = useState(initialData?.otp || '');
  const [isVerifying, setIsVerifying] = useState(false);
  
  const { completeOTPVerification, goToPreviousStep } = useSignUpStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length < 4) {
      console.log('Please enter a valid OTP');
      return;
    }
    
    setIsVerifying(true);
    
    try {
      console.log('OTP submitted:', otp);
      
      // Complete OTP verification - this is the final step
      await completeOTPVerification({ otp });
      
      // Call the original onNext for component communication
      onNext({ otp });
    } catch (error) {
      console.error('OTP verification failed:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = () => {
    // Handle resend code logic
    console.log('Resend code clicked');
    // TODO: Implement resend OTP functionality
  };

  const handleBack = () => {
    // Use hook to go back
    goToPreviousStep();
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
          <h2 className="text-3xl font-bold text-white mb-4">Xác thực tài khoản</h2>
          <p className="text-gray-300 text-sm mb-8">
            Vui lòng kiểm tra email và nhập mã xác thực được gửi đến email của bạn.
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
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Nhập mã xác thực"
              required
              className="w-full border-gradient-input text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/50 h-12"
            />
          </div>

          {/* Resend Code Link */}
          <div className="text-center">
            <span className="text-gray-400 text-sm">Chưa nhận được mã? </span>
            <button
              type="button"
              onClick={handleResendCode}
              className="text-white hover:text-blue-400 transition-colors underline text-sm"
            >
              Gửi lại mã xác thực.
            </button>
          </div>

          {/* Verify Button */}
          <Button
            type="submit"
            disabled={isVerifying || !otp || otp.length < 4}
            className="w-full primary_gradient hover:opacity-90 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-md transition duration-300 ease-in-out"
            size="lg"
          >
            {isVerifying ? "Đang xác thực..." : "Hoàn thành đăng ký"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default OTPVerificationSection;