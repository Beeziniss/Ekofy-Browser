"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { CurrencyType } from "@/gql/graphql";
import { useCreateEscrowPolicyMutation } from "@/gql/client-mutation-options/escrow-policies-mutation";

const formSchema = z.object({
  platformFeePercentage: z
    .string()
    .refine(
      (val) => {
        const num = Number(val);
        return (
          !isNaN(num) &&
          Number.isInteger(num) &&
          num >= 1 &&
          num <= 100
        );
      },
      {
        message: "Platform fee percentage must be an integer between 1 and 100",
      }
    ),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateEscrowPolicyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateEscrowPolicyDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateEscrowPolicyDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platformFeePercentage: "",
    },
  });

  const createMutation = useCreateEscrowPolicyMutation();

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    createMutation.mutate(
      {
        platformFeePercentage: Number(values.platformFeePercentage),
        currency: CurrencyType.Vnd, // Always use VND
      },
      {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
          onSuccess?.();
        },
        onSettled: () => {
          setIsSubmitting(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Escrow Commission Policy</DialogTitle>
          <DialogDescription>
            Set up a new escrow commission policy for platform fees.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="platformFeePercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Platform Fee Percentage<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="1"
                      min="1"
                      max="100"
                      placeholder="5"
                      {...field}
                      onInput={(e) => {
                        const input = e.currentTarget;
                        const value = Number(input.value);
                        if (value > 100) {
                          input.value = "100";
                        } else if (value < 1 && input.value !== "") {
                          input.value = "1";
                        }
                        // Remove decimal part if user enters decimal
                        if (!Number.isInteger(value) && !isNaN(value) && input.value !== "") {
                          input.value = Math.floor(value).toString();
                        }
                      }}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        // Round to integer if decimal is entered
                        if (!isNaN(value) && !Number.isInteger(value) && e.target.value !== "") {
                          const intValue = Math.floor(value);
                          field.onChange(intValue.toString());
                        } else {
                          field.onChange(e.target.value);
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    The platform commission fee percentage (integer only, 1-100)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-muted rounded-md p-4">
              <p className="text-muted-foreground text-sm">
                <strong>Note:</strong> Currency is set to VND by default. The policy will be 
                created in INACTIVE status and requires activation.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Policy
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
