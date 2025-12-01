"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import useSignIn from "../../hook/use-sign-in";
import useGoogleSignIn from "../../hook/use-google-sign-in";
import { EkofyLogo } from "@/assets/icons";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .max(50, "Email must be less than 50 characters")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must be less than 50 characters"),
  isRememberMe: z.boolean(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginFormSection = () => {
  const { signIn, isLoading } = useSignIn();
  const { signInWithGoogle } = useGoogleSignIn();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      isRememberMe: false,
    },
  });

  const onSubmit = (data: LoginFormData) => {
    signIn({
      email: data.email,
      password: data.password,
      isRememberMe: data.isRememberMe,
    });
  };

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      signInWithGoogle({
        googleToken: credentialResponse.credential,
        isMobile: false,
      });
    }
  };

  const handleGoogleError = () => {
    console.error("Google login failed");
  };

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-[#121212] px-6 py-12 lg:px-8">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="mb-6 flex items-center justify-center">
            <div className="mr-3 flex items-center justify-center rounded-full">
              <EkofyLogo className="size-[60px]" />
            </div>
            <h1 className="text-primary-gradient text-4xl font-bold">Ekofy</h1>
          </div>
          <h2 className="mb-8 text-4xl font-bold text-white">Welcome Back</h2>
        </div>

        {/* Login Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-white">
                    Email <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      disabled={isLoading}
                      placeholder="Enter your email"
                      maxLength={50}
                      className="border-gradient-input h-12 w-full text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-white">
                    Password <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        disabled={isLoading}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        maxLength={50}
                        className="border-gradient-input h-12 w-full pr-10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/50"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-white focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400 hover:text-white" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400 hover:text-white" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="isRememberMe"
                render={({ field }) => (
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-gray-600 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                    />
                    <label 
                      className="cursor-pointer text-sm text-white"
                      onClick={() => field.onChange(!field.value)}
                    >
                      Remember me
                    </label>
                  </div>
                )}
              />
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
        </Form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <span className="text-sm text-white">Don&apos;t have an account? </span>
          <Link href="/sign-up" className="font-medium text-white underline transition-colors hover:text-blue-400">
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
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="filled_black"
            size="large"
            width="384"
            text="continue_with"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginFormSection;
