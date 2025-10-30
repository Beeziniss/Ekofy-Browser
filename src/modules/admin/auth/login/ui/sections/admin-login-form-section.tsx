"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import EkofyLogo from '../../../../../../../public/ekofy-logo.svg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from "lucide-react";
import { Checkbox } from '@/components/ui/checkbox';
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
import useAdminSignIn from '../../hook/use-admin-sign-in';

const adminLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address").max(50, "Email must be less than 50 characters"),
  password: z.string().min(6, "Password must be at least 6 characters").max(50, "Password must be less than 50 characters"),
  rememberMe: z.boolean(),
});

type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

const AdminLoginFormSection = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, isLoading } = useAdminSignIn();

  const form = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = (data: AdminLoginFormData) => {
    signIn({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-8 bg-[#121212] min-h-screen">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="rounded-full flex items-center justify-center mr-3">
              <Image src={EkofyLogo} alt="Logo" width={60} height={60} />
            </div>
            <h1 className="text-4xl font-bold text-primary-gradient">Ekofy</h1>
          </div>
          <h2 className="text-4xl font-bold text-white mb-8">Welcome Back, Admin</h2>
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
                <FormMessage className="text-red-500 mt-1 text-sm" />
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
                      className="border-gradient-input h-12 w-full text-white placeholder-gray-400 pr-10"
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
                <FormMessage className="text-red-500 mt-1 text-sm" />
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
                      className="border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                  </FormControl>
                  <FormLabel htmlFor="remember" className="text-sm text-white cursor-pointer">
                    Remember me
                  </FormLabel>
                </FormItem>
              )}
            />

            <Link href="#" className="text-sm text-white hover:text-blue-400 transition-colors underline">
              Forgot your password?
            </Link>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full primary_gradient hover:opacity-60 text-white font-medium py-3 px-4 rounded-md transition duration-300 ease-in-out"
            size="lg"
          >
            {isLoading ? "Logging in..." : "Log in"}
          </Button>
        </form>
        </Form>
      </div>
    </div>
  );
};

export default AdminLoginFormSection;