import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import useForgotPassword from "../../hook/use-forgot-password";
import { Loader2} from "lucide-react";

const forgotPasswordSchema = z.object({
    email: z
    .email("Please enter a valid email address")
    .min(5, "Email must be at least 5 characters long") // Độ dài tối thiểu
    .max(50, "Email must be at most 50 characters long") // Độ dài tối đa
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
  onSuccess?: (email: string) => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSuccess }) => {
  const { requestForgotPassword, isLoading } = useForgotPassword();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      await requestForgotPassword({ email: data.email });
      onSuccess?.(data.email);
    } catch {
      // Error handling is done in the hook
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-main-dark-1 rounded-xl p-8 shadow-xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Forgot Password?</h2>
          <p className="text-gray-400 text-sm">
            Enter your email address and we&apos;ll send you a reset code
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
                      placeholder="Enter your email address"
                      {...field}
                      disabled={isLoading}
                      className="border-gradient-input h-12 w-full text-white placeholder-gray-400 bg-transparent focus:border-blue-500 focus:ring-blue-500/50"
                    />
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
              Send Reset Code
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;