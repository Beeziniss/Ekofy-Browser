import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import useResetPassword from "../../hook/use-reset-password";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const resetPasswordSchema = z
  .object({
    email: z.email("Please enter a valid email address"),
    otpCode: z.string().min(6, "OTP code must be 6 digits").max(6, "OTP code must be 6 digits"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain uppercase, lowercase and numbers"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  email?: string;
  onSuccess?: () => void;
  onBackToForgotPassword?: () => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ 
  email = "", 
  onSuccess,
  onBackToForgotPassword 
}) => {
  const { resetPassword, isLoading } = useResetPassword();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email,
      otpCode: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      await resetPassword({
        email: data.email,
        otpCode: data.otpCode,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      onSuccess?.();
    } catch (error) {
      // Error handling is done in the hook
      console.error("Reset password error:", error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-main-dark-1 rounded-xl p-8 shadow-xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
          <p className="text-gray-400 text-sm">
            Enter the code sent to your email and set a new password
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium">Email Address<span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      {...field}
                      disabled={true}
                      className="border-gradient-input h-12 w-full text-white bg-transparent cursor-not-allowed opacity-70"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="otpCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium">Verification Code<span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isLoading}
                        className="gap-2"
                      >
                        <InputOTPGroup className="gap-2">
                          <InputOTPSlot index={0} className="w-12 h-12 text-white border-gray-600 bg-main-dark-bg focus:border-blue-500" />
                          <InputOTPSlot index={1} className="w-12 h-12 text-white border-gray-600 bg-main-dark-bg focus:border-blue-500" />
                          <InputOTPSlot index={2} className="w-12 h-12 text-white border-gray-600 bg-main-dark-bg focus:border-blue-500" />
                          <InputOTPSlot index={3} className="w-12 h-12 text-white border-gray-600 bg-main-dark-bg focus:border-blue-500" />
                          <InputOTPSlot index={4} className="w-12 h-12 text-white border-gray-600 bg-main-dark-bg focus:border-blue-500" />
                          <InputOTPSlot index={5} className="w-12 h-12 text-white border-gray-600 bg-main-dark-bg focus:border-blue-500" />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium">New Password<span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        {...field}
                        disabled={isLoading}
                        className="border-gradient-input h-12 w-full pr-12 text-white placeholder-gray-400 bg-transparent focus:border-blue-500 focus:ring-blue-500/50"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium">Confirm New Password<span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        {...field}
                        disabled={isLoading}
                        className="border-gradient-input h-12 w-full pr-12 text-white placeholder-gray-400 bg-transparent focus:border-blue-500 focus:ring-blue-500/50"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-white"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="primary_gradient w-full h-12 text-white font-semibold rounded-md hover:opacity-90 transition-opacity"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reset Password
            </Button>

            {onBackToForgotPassword && (
              <Button 
                type="button" 
                variant="outline" 
                className="w-full h-12 text-white border-gray-600 hover:bg-gray-800 transition-colors" 
                onClick={onBackToForgotPassword}
                disabled={isLoading}
              >
                Back to Email Step
              </Button>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;