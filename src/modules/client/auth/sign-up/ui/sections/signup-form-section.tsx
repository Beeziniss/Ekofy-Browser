"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useSignUpStore } from "@/store/stores";
import { Eye, EyeOff, CircleHelp } from "lucide-react";
import { ClientSignUpFormSectionProps } from "@/types/listener-auth";
import { EkofyLogoTextLg } from "@/assets/icons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const signUpSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .max(50, "Email must be less than 50 characters")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(50, "Password must be less than 50 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUpFormSection = ({ onNext, initialData }: ClientSignUpFormSectionProps) => {
  const { goToNextStep, updateFormData, formData } = useSignUpStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: initialData?.email || formData.email || "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = form.watch("password");

  const validatePassword = (password: string) => {
    return {
      minLength: password.length >= 6,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumbers: /[0-9]/.test(password),
      hasSpecialChars: /[^A-Za-z0-9]/.test(password),
    };
  };

  const passwordValidation = validatePassword(password || "");

  const onSubmit = (data: SignUpFormData) => {
    const formDataToSubmit = { email: data.email, password: data.password, confirmPassword: data.confirmPassword };

    // Update global store
    updateFormData(formDataToSubmit);

    // Pass data to next step using the hook
    goToNextStep(formDataToSubmit);

    // Also call the original onNext for component communication
    onNext(formDataToSubmit);
  };

  const handleGoogleSignUp = () => {
    // Handle Google sign up logic here
    console.log("Google sign up clicked");
  };

  return (
    <div className="flex h-screen flex-1 items-center justify-center bg-[#121212]">
      <div className="h-full w-full overflow-y-auto">
        <div className="mx-auto w-full max-w-md space-y-6 py-8">
          {/* Logo and Title */}
          <div className="text-center">
            <Link href={"/landing"} className="w-fit">
              <EkofyLogoTextLg className="mx-auto mb-6 w-42 text-white" />
            </Link>
            <h1 className="mb-4 text-4xl font-bold text-white">Sign up to start listening</h1>
          </div>

          {/* Sign Up Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-white">
                      Email<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
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
                    <FormLabel className="flex items-center gap-1 text-sm font-medium text-white">
                      Password<span className="text-red-500">*</span>
                      <Link href="#" className="ml-2">
                        <CircleHelp className="h-4 w-4 text-white" />
                      </Link>
                    </FormLabel>
                    <FormControl>
                      <div className="relative flex-1">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
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

              {/* Confirm Password Field */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-white">
                      Confirm Password<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm Password"
                          maxLength={50}
                          className="border-gradient-input h-12 w-full pr-10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/50"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-white focus:outline-none"
                        >
                          {showConfirmPassword ? (
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

              {/* Password validation tooltip */}
              <div className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3 shadow-lg">
                <div className="space-y-1 text-sm">
                  <div
                    className={`flex items-center ${passwordValidation.minLength ? "text-green-400" : "text-gray-400"}`}
                  >
                    <span className="mr-2">{passwordValidation.minLength ? "✓" : "○"}</span>
                    At least 6 characters
                  </div>
                  <div
                    className={`flex items-center ${passwordValidation.hasUppercase ? "text-green-400" : "text-gray-400"}`}
                  >
                    <span className="mr-2">{passwordValidation.hasUppercase ? "✓" : "○"}</span>
                    Contains uppercase letter
                  </div>
                  <div
                    className={`flex items-center ${passwordValidation.hasLowercase ? "text-green-400" : "text-gray-400"}`}
                  >
                    <span className="mr-2">{passwordValidation.hasLowercase ? "✓" : "○"}</span>
                    Contains lowercase letter
                  </div>
                  <div
                    className={`flex items-center ${passwordValidation.hasNumbers ? "text-green-400" : "text-gray-400"}`}
                  >
                    <span className="mr-2">{passwordValidation.hasNumbers ? "✓" : "○"}</span>
                    Contains number
                  </div>
                  <div
                    className={`flex items-center ${passwordValidation.hasSpecialChars ? "text-green-400" : "text-gray-400"}`}
                  >
                    <span className="mr-2">{passwordValidation.hasSpecialChars ? "✓" : "○"}</span>
                    Contains special character
                  </div>
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
          </Form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <span className="text-sm text-white">Already have an account? </span>
            <Link href="/login" className="font-medium text-white underline transition-colors hover:text-blue-400">
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
    </div>
  );
};

export default SignUpFormSection;
