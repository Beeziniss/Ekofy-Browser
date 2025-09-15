"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import EkofyLogo from '../../../../../../public/ekofy-logo.svg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';

interface OTPVerificationSectionProps {
  onNext: () => void;
  onBack: () => void;
}

const OTPVerificationSection = ({ onNext, onBack }: OTPVerificationSectionProps) => {
  const [otp, setOtp] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle OTP verification logic here
    console.log('OTP submitted:', otp);
    
    // Move to next step (Profile completion)
    onNext();
  };

  const handleResendCode = () => {
    // Handle resend code logic
    console.log('Resend code clicked');
  };

  const handleBack = () => {
    // Handle back navigation
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
          <h2 className="text-3xl font-bold text-white mb-4">Enter the verification code</h2>
          <p className="text-gray-300 text-sm mb-8">
            Please check your email.
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
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter the code"
              required
              className="w-full bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/50 h-12"
            />
          </div>

          {/* Resend Code Link */}
          <div className="text-center">
            <span className="text-gray-400 text-sm">Not received yet? </span>
            <button
              type="button"
              onClick={handleResendCode}
              className="text-white hover:text-blue-400 transition-colors underline text-sm"
            >
              Resend the code.
            </button>
          </div>

          {/* Verify Button */}
          <Button
            type="submit"
            className="w-full primary_gradient hover:opacity-90 text-white font-medium py-3 px-4 rounded-md transition duration-300 ease-in-out"
            size="lg"
          >
            Verify
          </Button>
        </form>
      </div>
    </div>
  );
};

export default OTPVerificationSection;