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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CurrencyType } from "@/gql/graphql";
import { CREATE_ROYALTY_POLICY } from "@/modules/shared/mutations/admin/royalty-policies-mutation";
import { execute } from "@/gql/execute";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  ratePerStream: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Rate must be a positive number",
  }),
  currency: z.nativeEnum(CurrencyType),
  recordingPercentage: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100, {
      message: "Recording percentage must be between 0 and 100",
    }),
  workPercentage: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100, {
      message: "Work percentage must be between 0 and 100",
    }),
}).refine(
  (data) => {
    const recording = Number(data.recordingPercentage);
    const work = Number(data.workPercentage);
    return Math.abs(recording + work - 100) < 0.01; // Allow for floating point precision
  },
  {
    message: "Recording and Work percentages must total 100%",
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
      currency: CurrencyType.Vnd,
      recordingPercentage: "50",
      workPercentage: "50",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (input: {
      ratePerStream: number;
      currency: CurrencyType;
      recordingPercentage: number;
      workPercentage: number;
    }) => {
      return await execute(CREATE_ROYALTY_POLICY, {
        createRoyalPolicyRequest: {
          ratePerStream: input.ratePerStream,
          currency: input.currency,
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
    createMutation.mutate({
      ratePerStream: Number(values.ratePerStream),
      currency: values.currency,
      recordingPercentage: Number(values.recordingPercentage),
      workPercentage: Number(values.workPercentage),
    });
  };

  // Auto-calculate work percentage when recording changes
  const handleRecordingChange = (value: string) => {
    const recording = Number(value);
    if (!isNaN(recording) && recording >= 0 && recording <= 100) {
      const work = 100 - recording;
      form.setValue("workPercentage", work.toFixed(2));
    }
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
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={CurrencyType.Vnd}>VND</SelectItem>
                      <SelectItem value={CurrencyType.Usd}>USD</SelectItem>
                      <SelectItem value={CurrencyType.Eur}>EUR</SelectItem>
                      <SelectItem value={CurrencyType.Gbp}>GBP</SelectItem>
                      <SelectItem value={CurrencyType.Jpy}>JPY</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ratePerStream"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rate Per Stream</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.0001"
                      placeholder="0.0001"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Payment amount per stream (e.g., 0.0001)
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
                  <FormLabel>Recording Percentage</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      placeholder="50"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleRecordingChange(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Percentage allocated to recording rights (0-100)
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
                  <FormLabel>Work Percentage</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      placeholder="50"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Percentage allocated to composition/work rights (0-100)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-muted rounded-md p-4">
              <p className="text-muted-foreground text-sm">
                <strong>Note:</strong> Recording and Work percentages must total 100%. The
                policy will be created in PENDING status and requires activation.
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
