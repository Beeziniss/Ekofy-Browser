"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, CircleHelp } from "lucide-react";
import Link from "next/link";
import { useArtistSignUpStore } from "@/store/stores/artist-signup-store";
import { UserGender } from "@/gql/graphql";
import { ArtistSignUpFormData, ArtistSignUpSectionProps } from "@/types/artist_type";
import { EkofyLogoTextLg } from "@/assets/icons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

type ArtistSignUpFormSectionProps = ArtistSignUpSectionProps<ArtistSignUpFormData>;

const artistSignUpSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .max(50, "Email must be less than 50 characters")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(50, "Password must be less than 50 characters")
      .regex(/[a-zA-Z]/, "Password must contain letters")
      .regex(/\d/, "Password must contain numbers")
      .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain special characters")
      .refine((val) => !/(password|123456|qwerty|abc123)/i.test(val), "Avoid common passwords"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    agreeTerms: z.boolean().refine((val) => val === true, "You must agree to the terms and conditions"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ArtistSignUpSchemaData = z.infer<typeof artistSignUpSchema>;

const ArtistSignUpFormSection = ({ onNext, initialData }: ArtistSignUpFormSectionProps) => {
  const { formData, updateFormData, goToNextStep } = useArtistSignUpStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ArtistSignUpSchemaData>({
    resolver: zodResolver(artistSignUpSchema),
    defaultValues: {
      email: initialData?.email || formData.email || "",
      password: "",
      confirmPassword: "",
      agreeTerms: initialData?.agreeTerms || false,
    },
  });

  const password = form.watch("password");

  const validatePassword = (password: string) => {
    return {
      minLength: password.length >= 8,
      hasLetters: /[a-zA-Z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasSpecialChars: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  };

  const passwordValidation = validatePassword(password || "");

  const onSubmit = (data: ArtistSignUpSchemaData) => {
    // Update store without persisting password fields
    updateFormData({
      email: data.email,
      fullName: formData.fullName || "",
      birthDate: formData.birthDate || "",
      gender: formData.gender || ("Male" as UserGender),
      phoneNumber: formData.phoneNumber || "",
    });

    // Navigate to next step with complete data (including password for API)
    const formDataToStore = {
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      fullName: formData.fullName || "",
      birthDate: formData.birthDate || "",
      gender: formData.gender || ("Male" as UserGender),
      phoneNumber: formData.phoneNumber || "",
    };

    goToNextStep(formDataToStore);

    // Also call the original onNext for backward compatibility
    onNext({
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      agreeTerms: data.agreeTerms,
    });
  };

  return (
    <div className="flex h-screen flex-1 items-center justify-center bg-[#121212]">
      <div className="h-full w-full overflow-y-auto">
        <div className="mx-auto w-full max-w-md space-y-6 py-12">
          {/* Logo and Title */}
          <div className="mb-8 text-center">
            <Link href={"/landing"} className="w-fit">
              <EkofyLogoTextLg className="mx-auto mb-6 w-42 text-white" />
            </Link>
            <h2 className="mb-4 text-3xl font-bold text-white">Sign up to start your musical journey</h2>
          </div>

          {/* Sign Up Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        className="border-gradient-input h-12 w-full text-white placeholder-gray-400"
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
                    <div className="relative flex items-start gap-3">
                      <FormControl>
                        <div className="relative flex-1">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create password"
                            maxLength={50}
                            className="border-gradient-input h-12 w-full pr-10 text-white placeholder-gray-400"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-white"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                    </div>
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
                          placeholder="Confirm password"
                          maxLength={50}
                          className="border-gradient-input h-12 w-full pr-10 text-white placeholder-gray-400"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-white"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <div className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3 shadow-lg">
                <div className="space-y-1 text-xs">
                  <div
                    className={`flex items-center ${passwordValidation.minLength ? "text-green-400" : "text-gray-400"}`}
                  >
                    <span className="mr-2">{passwordValidation.minLength ? "✓" : "○"}</span>
                    At least 8 characters
                  </div>
                  <div
                    className={`flex items-center ${passwordValidation.hasLetters ? "text-green-400" : "text-gray-400"}`}
                  >
                    <span className="mr-2">{passwordValidation.hasLetters ? "✓" : "○"}</span>
                    Contains letters
                  </div>
                  <div
                    className={`flex items-center ${passwordValidation.hasNumbers ? "text-green-400" : "text-gray-400"}`}
                  >
                    <span className="mr-2">{passwordValidation.hasNumbers ? "✓" : "○"}</span>
                    Contains numbers
                  </div>
                  <div
                    className={`flex items-center ${passwordValidation.hasSpecialChars ? "text-green-400" : "text-gray-400"}`}
                  >
                    <span className="mr-2">{passwordValidation.hasSpecialChars ? "✓" : "○"}</span>
                    Contains special characters
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <FormField
                control={form.control}
                name="agreeTerms"
                render={({ field }) => (
                  <FormItem className="flex items-start space-y-0 space-x-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-1" />
                    </FormControl>
                    <div className="flex-1">
                      <FormLabel className="text-sm font-normal text-gray-300">
                        I agree to the{" "}
                        <Link href="#" className="text-blue-400 hover:text-blue-300">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="#" className="text-blue-400 hover:text-blue-300">
                          Privacy Policy
                        </Link>
                      </FormLabel>
                      <FormMessage className="text-red-400" />
                    </div>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="primary_gradient w-full rounded-md px-4 py-3 font-medium text-white transition duration-300 ease-in-out hover:opacity-60"
                size="lg"
              >
                Continue
              </Button>

              {/* Login Link */}
              <div className="mt-2 text-center">
                <span className="text-sm text-white">Already have an account? </span>
                <Link
                  href="/artist/login"
                  className="font-medium text-white underline transition-colors hover:text-blue-400"
                >
                  Log in to Ekofy.
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ArtistSignUpFormSection;
