"use client";

import React, { useState } from "react";
import Image from "next/image";
import EkofyLogo from "../../../../../../../public/ekofy-logo.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import useSignIn from "../../hook/use-sign-in";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .max(128, "Email must be less than 128 characters")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password must be less than 128 characters"),
  rememberMe: z.boolean(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginFormSection = () => {
  const { signIn, isLoading } = useSignIn();
  const [showPassword, setShowPassword] = useState(false);
  const [customErrors, setCustomErrors] = useState<{ [key: string]: string }>({});

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = (data: LoginFormData) => {
    // Clear custom errors
    setCustomErrors({});
    
    signIn({
      email: data.email,
      password: data.password,
    });
  };

  // Custom validation function
  const validateField = (field: string, value: string) => {
    const errors: { [key: string]: string } = {};
    
    if (field === 'email') {
      if (!value) {
        errors.email = "Email is required";
      } else if (value.length > 254) {
        errors.email = "Email must be less than 254 characters";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors.email = "Please enter a valid email address";
      }
    }
    
    if (field === 'password') {
      if (!value) {
        errors.password = "Password is required";
      } else if (value.length < 6) {
        errors.password = "Password must be at least 6 characters";
      } else if (value.length > 128) {
        errors.password = "Password must be less than 128 characters";
      }
    }
    
    setCustomErrors(prev => ({ ...prev, ...errors }));
    return Object.keys(errors).length === 0;
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
          <h2 className="mb-8 text-4xl font-bold text-white">Welcome Back</h2>
        </div>

        {/* Login Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-white">
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              disabled={isLoading}
              placeholder="Enter your email"
              className={`border-gradient-input h-12 w-full text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/50 ${
                customErrors.email ? "border-red-500" : ""
              }`}
              {...form.register("email")}
              onChange={(e) => {
                form.setValue("email", e.target.value);
                validateField("email", e.target.value);
              }}
            />
            {customErrors.email && (
              <p className="mt-1 text-sm text-red-400">{customErrors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-white">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                disabled={isLoading}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={`border-gradient-input h-12 w-full pr-10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/50 ${
                  customErrors.password ? "border-red-500" : ""
                }`}
                {...form.register("password")}
                onChange={(e) => {
                  form.setValue("password", e.target.value);
                  validateField("password", e.target.value);
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-white"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {customErrors.password && (
              <p className="mt-1 text-sm text-red-400">{customErrors.password}</p>
            )}
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Checkbox
                checked={form.watch("rememberMe")}
                onCheckedChange={(checked) => form.setValue("rememberMe", !!checked)}
                className="border-gray-600 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
              />
              <label className="cursor-pointer text-sm text-white">
                Remember me
              </label>
            </div>
            <Link
              href="#"
              className="text-sm text-white underline transition-colors hover:text-blue-400"
            >
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
          <span className="text-sm text-white">
            Don&apos;t have an account?{" "}
          </span>
          <Link
            href="/sign-up"
            className="font-medium text-white underline transition-colors hover:text-blue-400"
          >
            Sign up for Ekofy.
          </Link>
        </div>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-gray-900 px-4 text-gray-400">or</span>
          </div>
        </div>

        {/* Google Login Button */}
        <Button
          type="button"
          variant="outline"
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
          Continue with Google
        </Button>
      </div>
    </div>
  );
};

export default LoginFormSection;
