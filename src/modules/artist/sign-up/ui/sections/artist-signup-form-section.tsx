"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import EkofyLogo from '../../../../../../public/ekofy-logo.svg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, CircleHelp } from 'lucide-react';
import Link from 'next/link';
import { useArtistSignUpStore } from '@/store/stores/artist-signup-store';
import { UserGender } from '@/gql/graphql';

interface ArtistSignUpFormSectionProps {
  onNext: (data?: any) => void;
  initialData?: {
    email: string;
    password: string;
    confirmPassword: string;
    agreeTerms: boolean;
  };
}

const ArtistSignUpFormSection = ({ onNext, initialData }: ArtistSignUpFormSectionProps) => {
  const { formData, updateFormData, goToNextStep } = useArtistSignUpStore();
  
  const [email, setEmail] = useState(initialData?.email || formData.email || '');
  const [password, setPassword] = useState(initialData?.password || formData.password || '');
  const [confirmPassword, setConfirmPassword] = useState(initialData?.confirmPassword || formData.confirmPassword || '');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(initialData?.agreeTerms || false);

  // Password validation state
  const [passwordFocus, setPasswordFocus] = useState(false);

  const validatePassword = (password: string) => {
    return {
      minLength: password.length >= 8,
      hasLetters: /[a-zA-Z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasSpecialChars: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      noCommonWords: !/(password|123456|qwerty|abc123)/i.test(password)
    };
  };

  const passwordValidation = validatePassword(password);
  const isPasswordValid = Object.values(passwordValidation).every(Boolean);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert('Mật khẩu không khớp');
      return;
    }
    if (!isPasswordValid) {
      alert('Vui lòng đảm bảo mật khẩu đáp ứng tất cả yêu cầu');
      return;
    }
    if (!agreeTerms) {
      alert('Vui lòng đồng ý với điều khoản và điều kiện');
      return;
    }
    // Update store with form data (preserve existing data)
    const formDataToStore = {
      email,
      password,
      confirmPassword,
      // Preserve existing values if they exist
      fullName: formData.fullName || '', 
      birthDate: formData.birthDate || '', 
      gender: formData.gender || 'Male' as UserGender, 
      phoneNumber: formData.phoneNumber || '', 
    };
    
    updateFormData(formDataToStore);
    
    // Navigate to next step
    goToNextStep(formDataToStore);
    
    // Also call the original onNext for backward compatibility
    onNext({
      email,
      password,
      confirmPassword,
      agreeTerms
    });
  };

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-8 bg-[#121212] min-h-screen">
      <div className="w-full max-w-md space-x-6">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="rounded-full flex items-center justify-center mr-3">
              <Image src={EkofyLogo} alt="Logo" width={60} height={60} />
            </div>
            <h1 className="text-4xl font-bold text-primary-gradient">Ekofy</h1>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Let’s get started</h2>
          <p className="text-gray-300 text-sm">
            Enter your email and password to create a new account.
            We will send you a verification code through the registered email.
          </p>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full border-gradient-input text-white placeholder-gray-400 h-12"
            />
          </div>

          <div className="relative">
            <label className="flex items-center gap-1 text-sm font-medium text-white mb-2">
              Password*
              <Link href="#" className='ml-2'>
                <CircleHelp className="w-4 h-4 text-white" />
              </Link>
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => setPasswordFocus(false)}
                placeholder="Create password"
                required
                className="w-full border-gradient-input text-white placeholder-gray-400 h-12 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password validation tooltip */}
            {(passwordFocus || (password && !isPasswordValid)) && (
              <div className="absolute z-10 mt-2 p-3 bg-gray-800 border border-gray-700 rounded-lg shadow-lg w-full">
                <div className="text-xs space-y-1">
                  <div className={`flex items-center ${passwordValidation.minLength ? 'text-green-400' : 'text-gray-400'}`}>
                    <span className="mr-2">{passwordValidation.minLength ? '✓' : '○'}</span>
                    At least 8 characters
                  </div>
                  <div className={`flex items-center ${passwordValidation.hasLetters ? 'text-green-400' : 'text-gray-400'}`}>
                    <span className="mr-2">{passwordValidation.hasLetters ? '✓' : '○'}</span>
                    Contains letters
                  </div>
                  <div className={`flex items-center ${passwordValidation.hasNumbers ? 'text-green-400' : 'text-gray-400'}`}>
                    <span className="mr-2">{passwordValidation.hasNumbers ? '✓' : '○'}</span>
                    Contains numbers
                  </div>
                  <div className={`flex items-center ${passwordValidation.hasSpecialChars ? 'text-green-400' : 'text-gray-400'}`}>
                    <span className="mr-2">{passwordValidation.hasSpecialChars ? '✓' : '○'}</span>
                    Contains special characters
                  </div>
                  <div className={`flex items-center ${passwordValidation.noCommonWords ? 'text-green-400' : 'text-gray-400'}`}>
                    <span className="mr-2">{passwordValidation.noCommonWords ? '✓' : '○'}</span>
                    Avoid common passwords
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Confirm Password</label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
                className="w-full border-gradient-input text-white placeholder-gray-400 h-12 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 mt-1"
              required
            />
            <label className="text-sm text-gray-300">
              I agree to the{' '}
              <Link href="#" className="text-blue-400 hover:text-blue-300">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="#" className="text-blue-400 hover:text-blue-300">
                Privacy Policy
              </Link>
            </label>
          </div>

          <Button
            type="submit"
            className="w-full primary_gradient hover:opacity-60 text-white font-medium py-3 px-4 rounded-md transition duration-300 ease-in-out"
            size="lg"
          >
            Create Account
          </Button>
        {/* Login Link */}
        <div className="text-center mt-2">
          <span className="text-white text-sm">Already have an account? </span>
          <Link href="/artist/login" className="text-white hover:text-blue-400 transition-colors underline font-medium">
            Log in to Ekofy.
          </Link>
        </div>
        </form>

        {/* Divider */}
        <div className="mt-6 mb-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#121212] text-gray-400">Or continue with</span>
            </div>
          </div>
        </div>

        {/* Google Sign Up */}
        <Button
          type="button"
          variant="outline"
          className="w-full border-gray-700 bg-gray-800/50 text-white hover:bg-gray-700/50 mb-6"
          size="lg"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </Button>
      </div>
    </div>
  );
};

export default ArtistSignUpFormSection;