"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import EkofyLogo from '../../../../../../public/ekofy-logo.svg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SignUpFormSectionProps {
  onNext: () => void;
}

const SignUpFormSection = ({ onNext }: SignUpFormSectionProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign up logic here
    console.log('Sign up submitted:', { email, password });
    
    // Move to next step (OTP verification)
    onNext();
  };

  const handleGoogleSignUp = () => {
    // Handle Google sign up logic here
    console.log('Google sign up clicked');
  };

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-8 bg-gray-900 min-h-screen">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="rounded-full flex items-center justify-center mr-3">
              <Image src={EkofyLogo} alt="Logo" width={32} height={32} />
            </div>
            <h1 className="text-2xl font-bold text-primary-gradient">Ekofy</h1>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Let's get started</h2>
          <p className="text-gray-300 text-sm mb-8">
            Enter your email and password to create a new account.<br />
            We will send you a verification code through the registered email.
          </p>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              Email*
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/50 h-12"
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
              Password* 
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required 
              className="w-full bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/50 h-12"
            />
          </div>

          {/* Continue Button */}
          <Button
            type="submit"
            className="w-full primary_gradient hover:opacity-90 text-white font-medium py-3 px-4 rounded-md transition duration-300 ease-in-out"
            size="lg"
          >
            Continue
          </Button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-6">
          <span className="text-white text-sm">Already have an account? </span>
          <a href="/login" className="text-white hover:text-blue-400 transition-colors underline font-medium">
            Log in to Ekofy.
          </a>
        </div>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-gray-900 text-gray-400">or</span>
          </div>
        </div>

        {/* Google Sign Up Button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignUp}
          className="w-full bg-transparent border-gray-600 text-white hover:bg-gray-800 font-medium py-3 px-4 rounded-md transition duration-300 ease-in-out"
          size="lg"
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign up with Google
        </Button>
      </div>
    </div>
  );
};

export default SignUpFormSection;