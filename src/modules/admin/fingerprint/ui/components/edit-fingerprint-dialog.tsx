"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateFingerprintConfidencePolicy } from "@/gql/client-mutation-options/fingerprint-mutation-options";
import { FingerprintConfidencePolicyQuery } from "@/gql/graphql";

type FingerprintConfidencePolicy = NonNullable<
  FingerprintConfidencePolicyQuery["fingerprintConfidencePolicy"]
>;

const formSchema = z
  .object({
    rejectThreshold: z
      .number({
        message: "Reject threshold must be a number",
      })
      .min(0, "Reject threshold must be at least 0")
      .max(1, "Reject threshold must be at most 1"),
    manualReviewThreshold: z
      .number({
        message: "Manual review threshold must be a number",
      })
      .min(0, "Manual review threshold must be at least 0")
      .max(1, "Manual review threshold must be at most 1"),
  })
  .refine((data) => data.rejectThreshold > data.manualReviewThreshold, {
    message: "Reject threshold must be greater than manual review threshold",
    path: ["rejectThreshold"],
  });

type FormValues = z.infer<typeof formSchema>;

interface EditFingerprintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  policy: FingerprintConfidencePolicy | null;
  onSuccess?: () => void;
}

export function EditFingerprintDialog({
  open,
  onOpenChange,
  policy,
  onSuccess,
}: EditFingerprintDialogProps) {
  const updateMutation = useUpdateFingerprintConfidencePolicy();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rejectThreshold: 0,
      manualReviewThreshold: 0,
    },
  });

  useEffect(() => {
    if (policy && open) {
      form.reset({
        rejectThreshold: policy.rejectThreshold,
        manualReviewThreshold: policy.manualReviewThreshold,
      });
    }
  }, [policy, open, form]);

  const handleSubmit = async (values: FormValues) => {
    if (!policy) {
      return;
    }

    try {
      await updateMutation.mutateAsync({
        rejectThreshold: values.rejectThreshold,
        manualReviewThreshold: values.manualReviewThreshold,
      });
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      // Error is handled by mutation's onError
      console.error(error);
    }
  };

  const handleCancel = () => {
    if (policy) {
      form.reset({
        rejectThreshold: policy.rejectThreshold,
        manualReviewThreshold: policy.manualReviewThreshold,
      });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Fingerprint Confidence Policy</DialogTitle>
          <DialogDescription>
            Update the confidence thresholds for content matching. Changes will affect how content is automatically processed.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4" noValidate>
            <FormField
              control={form.control}
              name="rejectThreshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Reject Threshold <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value === "" ? 0 : parseFloat(e.target.value);
                        field.onChange(isNaN(value) ? 0 : value);
                      }}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Content with confidence below this value (0-1) will be automatically rejected.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="manualReviewThreshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Manual Review Threshold <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value === "" ? 0 : parseFloat(e.target.value);
                        field.onChange(isNaN(value) ? 0 : value);
                      }}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Content with confidence between reject threshold and this value will require manual review.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={updateMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

