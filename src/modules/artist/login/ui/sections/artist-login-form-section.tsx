"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import useArtistSignIn from "../../hook/use-artist-sign-in";
import { EkofyLogoTextLg } from "@/assets/icons";

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

const ArtistLoginFormSection = () => {
  const { signIn, isLoading } = useArtistSignIn();
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

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-[#121212] px-6 py-12 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Title */}
        <div className="mb-8 text-center">
          <Link href={"/landing"} className="w-fit">
            <EkofyLogoTextLg className="mx-auto mb-6 w-42 text-white" />
          </Link>
          <h2 className="mb-4 text-3xl font-bold text-white">Welcome Back, Artist</h2>
          <p className="text-sm text-gray-300">Enter your email and password to access your artist account</p>
        </div>

        {/* Login Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-white">
                    Email <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
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
                  <FormLabel className="block text-sm font-medium text-white">
                    Password <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        disabled={isLoading}
                        placeholder="Enter your password"
                        maxLength={50}
                        className="border-gradient-input h-12 w-full pr-10 text-white placeholder-gray-400"
                        {...field}
                      />
                      <Button
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                        type="button"
                        variant={"ghost"}
                        className="absolute top-1/2 right-2 -translate-y-1/2"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
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
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    <label className="cursor-pointer text-sm text-white" onClick={() => field.onChange(!field.value)}>
                      Remember me
                    </label>
                  </div>
                )}
              />
              <Link
                href="/forgot-password?type=artist"
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
        </Form>

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
