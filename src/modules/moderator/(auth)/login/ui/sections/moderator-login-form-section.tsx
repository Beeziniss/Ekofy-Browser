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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import useModeratorSignIn from "../../hook/use-moderator-sign-in";
import { EkofyLogo } from "@/assets/icons";

const moderatorLoginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(50, "Email must be less than 50 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must be less than 50 characters"),
  rememberMe: z.boolean(),
});

type ModeratorLoginFormData = z.infer<typeof moderatorLoginSchema>;

const ModeratorLoginFormSection = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, isLoading } = useModeratorSignIn();

  const form = useForm<ModeratorLoginFormData>({
    resolver: zodResolver(moderatorLoginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = (data: ModeratorLoginFormData) => {
    signIn({
      email: data.email,
      password: data.password,
    });
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
          <h2 className="mb-8 text-4xl font-bold text-white">
            Welcome Back, Moderator
          </h2>
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
                  <FormLabel className="block text-sm font-medium text-white">
                    Email <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      {...field}
                      disabled={isLoading}
                      placeholder="Enter your email"
                      maxLength={50}
                      className="border-gradient-input h-12 w-full text-white placeholder-gray-400"
                    />
                  </FormControl>
                  <FormMessage className="mt-1 text-sm text-red-500" />
                </FormItem>
              )}
            />
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
                        id="password"
                        type={showPassword ? "text" : "password"}
                        disabled={isLoading}
                        placeholder="Enter your password"
                        maxLength={50}
                        className="border-gradient-input h-12 w-full pr-10 text-white placeholder-gray-400"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant={"ghost"}
                        disabled={isLoading}
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-main-grey absolute top-1/2 right-2 -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage className="mt-1 text-sm text-red-500" />
                </FormItem>
              )}
            />

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-gray-600 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                      />
                    </FormControl>
                    <FormLabel
                      htmlFor="remember"
                      className="cursor-pointer text-sm text-white"
                    >
                      Remember me
                    </FormLabel>
                  </FormItem>
                )}
              />

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
              className="primary_gradient w-full rounded-md px-4 py-3 font-medium text-white transition duration-300 ease-in-out hover:opacity-60"
              size="lg"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ModeratorLoginFormSection;
