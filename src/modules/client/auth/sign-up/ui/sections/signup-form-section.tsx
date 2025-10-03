"use client";

import React, { useState } from "react";
import Image from "next/image";
import EkofyLogo from "../../../../../../../public/ekofy-logo.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useSignUpStore } from "@/store/stores";
import { validateEmail, validatePassword } from "@/utils/signup-utils";
import { Eye, EyeOff } from "lucide-react";

interface SignUpFormSectionProps {
  onNext: (data?: any) => void;
  initialData?: {
    email: string;
    password: string;
  };
}

const SignUpFormSection = ({ onNext, initialData }: SignUpFormSectionProps) => {
  const [email, setEmail] = useState(initialData?.email || "");
  const [password, setPassword] = useState(initialData?.password || "");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { goToNextStep, updateFormData } = useSignUpStore();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!email) {
      newErrors.email = "Email là bắt buộc";
    } else if (!validateEmail(email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else {
      const passwordErrors = validatePassword(password);
      if (passwordErrors.length > 0) {
        newErrors.password = passwordErrors[0]; // Show first error
      }
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Xác nhận mật khẩu là bắt buộc";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = { email, password, confirmPassword };

    // Pass data to next step using the hook
    goToNextStep(formData);

    // Also call the original onNext for component communication
    onNext(formData);
  };

  const handleGoogleSignUp = () => {
    // Handle Google sign up logic here
    console.log("Google sign up clicked");
  };

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-[#121212] px-6 py-12 lg:px-8">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="mb-6 flex items-center justify-center">
            <div className="mr-3 flex items-center justify-center rounded-full">
              <Image src={EkofyLogo} alt="Logo" width={60} height={60} />
            </div>
            <h1 className="text-primary-gradient text-4xl font-bold">Ekofy</h1>
          </div>
          <h2 className="mb-4 text-4xl font-bold text-white">
            Let's get started
          </h2>
          <p className="mb-8 text-sm text-gray-300">
            Enter your email and password to create a new account.
            <br />
            We will send you a verification code through the registered email.
          </p>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-white"
            >
              Email*
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="border-gradient-input h-12 w-full text-white focus:border-blue-500 focus:ring-blue-500/50"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="relative">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-white"
            >
              Password*
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="border-gradient-input h-12 w-full text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-white"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-white"
            >
              Confirm Password*
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
                className="border-gradient-input h-12 w-full text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/50"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-white"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Continue Button */}
          <Button
            type="submit"
            className="primary_gradient w-full rounded-md px-4 py-3 font-medium text-white transition duration-300 ease-in-out hover:opacity-90"
            size="lg"
          >
            Continue
          </Button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <span className="text-sm text-white">Already have an account? </span>
          <Link
            href="/login"
            className="font-medium text-white underline transition-colors hover:text-blue-400"
          >
            Log in to Ekofy.
          </Link>
        </div>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-[#121212] px-4 text-gray-400">or</span>
          </div>
        </div>

        {/* Google Sign Up Button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignUp}
          className="w-full rounded-md border-gray-600 bg-transparent px-4 py-3 font-medium text-white transition duration-300 ease-in-out hover:bg-gray-800"
          size="lg"
        >
          <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
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
          Sign up with Google
        </Button>
      </div>
    </div>
  );
};

export default SignUpFormSection;
