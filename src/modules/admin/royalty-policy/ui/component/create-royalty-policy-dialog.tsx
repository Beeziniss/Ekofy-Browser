"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
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
import { toast } from "sonner";
import { CurrencyType } from "@/gql/graphql";
import { CREATE_ROYALTY_POLICY } from "@/modules/shared/mutations/admin/royalty-policies-mutation";
import { execute } from "@/gql/execute";
import { Loader2 } from "lucide-react";

// Format number with thousand separator (dot)
const formatNumber = (value: string | number): string => {
  const numStr = typeof value === "number" ? value.toString() : value.replace(/\./g, "");
  const num = Number(numStr);
  if (isNaN(num) || numStr === "") return "";
  return num.toLocaleString("vi-VN");
};

// Parse formatted number to plain number
const parseNumber = (value: string): string => {
  return value.replace(/\./g, "");
};

const formSchema = z.object({
  ratePerStream: z
    .string()
    .refine(
      (val) => {
        const numStr = val.replace(/\./g, "");
        const num = Number(numStr);
        return !isNaN(num) && num > 0 && num <= 1000 && num % 2 === 0;
      },
      {
        message: "Rate must be a positive even number not exceeding 1.000 VND",
      }
    ),
  recordingPercentage: z
    .string()
    .refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num) && num >= 0 && num <= 100 && num % 2 === 0;
      },
      {
        message: "Recording percentage must be an even number between 0 and 100",
      }
    ),
  workPercentage: z
    .string()
    .refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num) && num >= 0 && num <= 100 && num % 2 === 0;
      },
      {
        message: "Work percentage must be an even number between 0 and 100",
      }
    ),
}).refine(
  (data) => {
    const recording = Number(data.recordingPercentage);
    const work = Number(data.workPercentage);
    const total = recording + work;
    return total <= 100;
  },
  {
    message: "Total of Recording and Work percentages must not exceed 100%",
    path: ["workPercentage"],
  }
);

type FormValues = z.infer<typeof formSchema>;

interface CreateRoyaltyPolicyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateRoyaltyPolicyDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateRoyaltyPolicyDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ratePerStream: "",
      recordingPercentage: "50",
      workPercentage: "50",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (input: {
      ratePerStream: number;
      recordingPercentage: number;
      workPercentage: number;
    }) => {
      return await execute(CREATE_ROYALTY_POLICY, {
        createRoyalPolicyRequest: {
          ratePerStream: input.ratePerStream,
          currency: CurrencyType.Vnd, // Always use VND
          recordingPercentage: input.recordingPercentage,
          workPercentage: input.workPercentage,
        },
      });
    },
    onSuccess: () => {
      toast.success("Royalty policy created successfully");
      form.reset();
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create royalty policy");
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    // Parse ratePerStream to remove thousand separators
    const ratePerStreamValue = parseNumber(values.ratePerStream);
    createMutation.mutate({
      ratePerStream: Number(ratePerStreamValue),
      recordingPercentage: Number(values.recordingPercentage),
      workPercentage: Number(values.workPercentage),
    });
  };

  // Auto-calculate work percentage when recording changes
  const handleRecordingChange = (value: string) => {
    const recording = Number(value);
    if (!isNaN(recording) && recording >= 0 && recording <= 100) {
      const work = 100 - recording;
      // Round to nearest even number
      const evenWork = Math.round(work / 2) * 2;
      form.setValue("workPercentage", evenWork.toString());
    }
  };

  // Round to nearest even number
  const roundToEven = (value: number): number => {
    return Math.round(value / 2) * 2;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Royalty Policy</DialogTitle>
          <DialogDescription>
            Set up a new royalty policy for stream payments and revenue splits.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="ratePerStream"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rate Per Stream (VND)<span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="0"
                      value={field.value ? formatNumber(field.value) : ""}
                      onChange={(e) => {
                        // Remove all non-digit characters
                        let plainValue = e.target.value.replace(/[^\d]/g, "");
                        
                        // Parse to number for validation
                        const numValue = Number(plainValue);
                        
                        // Validate and adjust
                        if (plainValue && numValue > 1000) {
                          plainValue = "1000";
                        } else if (numValue % 2 !== 0 && numValue !== 0) {
                          // Round to nearest even number
                          const evenValue = roundToEven(numValue);
                          plainValue = evenValue.toString();
                        }
                        
                        // Store plain number (without formatting) in form state
                        field.onChange(plainValue);
                      }}
                      onBlur={(e) => {
                        const plainValue = parseNumber(e.target.value);
                        if (plainValue) {
                          const numValue = Number(plainValue);
                          if (numValue % 2 !== 0 && numValue !== 0) {
                            const evenValue = roundToEven(numValue);
                            field.onChange(evenValue.toString());
                          }
                        }
                        field.onBlur();
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Payment amount per stream (even number, max 1.000 VND)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recordingPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recording Percentage<span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="2"
                      min="0"
                      max="100"
                      placeholder="50"
                      {...field}
                      onInput={(e) => {
                        const input = e.currentTarget;
                        const value = Number(input.value);
                        if (value > 100) {
                          input.value = "100";
                        } else if (value < 0) {
                          input.value = "0";
                        } else if (value % 2 !== 0 && value !== 0) {
                          // Round to nearest even number
                          const evenValue = roundToEven(value);
                          input.value = evenValue.toString();
                        }
                      }}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (!isNaN(value) && value % 2 !== 0 && value !== 0) {
                          const evenValue = roundToEven(value);
                          field.onChange(evenValue.toString());
                          handleRecordingChange(evenValue.toString());
                        } else {
                          field.onChange(e);
                          handleRecordingChange(e.target.value);
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Percentage allocated to recording rights (even number, 0-100)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="workPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Percentage<span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="2"
                      min="0"
                      max="100"
                      placeholder="50"
                      {...field}
                      onInput={(e) => {
                        const input = e.currentTarget;
                        const value = Number(input.value);
                        if (value > 100) {
                          input.value = "100";
                        } else if (value < 0) {
                          input.value = "0";
                        } else if (value % 2 !== 0 && value !== 0) {
                          // Round to nearest even number
                          const evenValue = roundToEven(value);
                          input.value = evenValue.toString();
                        }
                      }}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (!isNaN(value) && value % 2 !== 0 && value !== 0) {
                          const evenValue = roundToEven(value);
                          field.onChange(evenValue.toString());
                        } else {
                          field.onChange(e.target.value);
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Percentage allocated to composition/work rights (even number, 0-100)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-muted rounded-md p-4">
              <p className="text-muted-foreground text-sm">
                <strong>Note:</strong> Currency is set to VND by default. Recording and Work 
                percentages must not exceed 100% in total. The policy will be created in INACTIVE 
                status and requires activation.
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
