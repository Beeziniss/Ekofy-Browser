"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import useArtistSignIn from "../../hook/use-artist-sign-in";
import { EkofyLogo } from "@/assets/icons";

const ArtistLoginFormSection = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [customErrors, setCustomErrors] = useState<{ [key: string]: string }>({});
  const { signIn, isLoading } = useArtistSignIn();

  // Custom validation function
  const validateField = (field: string, value: string) => {
    const errors = { ...customErrors };

    if (field === "email") {
      if (!value) {
        errors.email = "Email is required";
      } else if (value.length > 50) {
        errors.email = "Email must be less than 50 characters";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors.email = "Please enter a valid email address";
      } else {
        delete errors.email;
      }
    }

    if (field === "password") {
      if (!value) {
        errors.password = "Password is required";
      } else if (value.length < 6) {
        errors.password = "Password must be at least 6 characters";
      } else if (value.length > 50) {
        errors.password = "Password must be less than 50 characters";
      } else {
        delete errors.password;
      }
    }

    setCustomErrors(errors);
    return !errors[field];
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Clear custom errors
    setCustomErrors({});

    // Validate all fields
    const emailValid = validateField("email", email);
    const passwordValid = validateField("password", password);

    if (!emailValid || !passwordValid) {
      return;
    }

    signIn({
      email,
      password,
      isRememberMe: rememberMe,
    });
  };

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-[#121212] px-6 py-12 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Title */}
        <div className="mb-8 text-center">
          <div className="mb-6 flex items-center justify-center">
            <div className="mr-3 flex items-center justify-center rounded-full">
              <EkofyLogo className="size-[60px]" />
            </div>
            <h1 className="text-primary-gradient text-4xl font-bold">Ekofy</h1>
          </div>
          <h2 className="mb-4 text-3xl font-bold text-white">Welcome Back, Artist</h2>
          <p className="text-sm text-gray-300">Enter your email and password to access your artist account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-white">
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              disabled={isLoading}
              placeholder="Enter your email"
              value={email}
              maxLength={50}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 50) {
                  setEmail(value);
                  validateField("email", value);
                } else {
                  // Show notification that limit is reached
                  const errors = { ...customErrors };
                  errors.email = "Email must be less than 50 characters";
                  setCustomErrors(errors);
                }
              }}
              className={`border-gradient-input h-12 w-full text-white placeholder-gray-400 ${
                customErrors.email ? "border-red-500" : ""
              }`}
            />
            {customErrors.email && <p className="mt-1 text-sm text-red-400">{customErrors.email}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-white">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                disabled={isLoading}
                placeholder="Enter your password"
                value={password}
                maxLength={50}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 50) {
                    setPassword(value);
                    validateField("password", value);
                  } else {
                    // Show notification that limit is reached
                    const errors = { ...customErrors };
                    errors.password = "Password must be less than 50 characters";
                    setCustomErrors(errors);
                  }
                }}
                className={`border-gradient-input h-12 w-full pr-10 text-white placeholder-gray-400 ${
                  customErrors.password ? "border-red-500" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {customErrors.password && <p className="mt-1 text-sm text-red-400">{customErrors.password}</p>}
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Checkbox
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(!!checked)}
                className="border-gray-600 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
              />
              <label 
                className="cursor-pointer text-sm text-white"
                onClick={() => setRememberMe(!rememberMe)}
              >
                Remember me
              </label>
            </div>
            <Link href="/forgot-password" className="text-sm text-white underline transition-colors hover:text-blue-400">
              Forgot your password?
            </Link>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="primary_gradient w-full rounded-md px-4 py-3 text-base font-semibold text-white transition duration-300 ease-in-out hover:opacity-90 disabled:opacity-50"
            size="lg"
          >
            {isLoading ? "Signing in..." : "Log in"}
          </Button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <span className="text-sm text-white">Don&apos;t have an artist account? </span>
          <Link
            href="/artist/sign-up"
            className="font-medium text-white underline transition-colors hover:text-blue-400"
          >
            Sign up for Ekofy.
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArtistLoginFormSection;
