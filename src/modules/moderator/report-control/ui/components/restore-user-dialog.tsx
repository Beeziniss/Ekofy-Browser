"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { useRestoreUser } from "@/gql/client-mutation-options/report-mutation-options";
import { toast } from "sonner";

interface RestoreUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportId: string;
  reportedUserName?: string;
  onSuccess?: () => void;
}

const restoreUserFormSchema = z.object({
  reason: z.string().min(10, {
    message: "Reason must be at least 10 characters.",
  }),
});

type RestoreUserFormValues = z.infer<typeof restoreUserFormSchema>;

export function RestoreUserDialog({
  open,
  onOpenChange,
  reportId,
  reportedUserName,
  onSuccess,
}: RestoreUserDialogProps) {
  const restoreUser = useRestoreUser();

  const form = useForm<RestoreUserFormValues>({
    resolver: zodResolver(restoreUserFormSchema),
    defaultValues: {
      reason: "",
    },
  });

  const onSubmit = async () => {
    try {
      await restoreUser.mutateAsync(reportId);
      toast.success("User restored successfully");
      onOpenChange(false);
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error restoring user:", error);
      toast.error("Failed to restore user");
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-green-500" />
            Restore User
          </DialogTitle>
          <DialogDescription>
            You are about to restore user {reportedUserName ? `"${reportedUserName}"` : ""}. 
            This will remove any active restrictions or suspensions applied to their account.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-50 border border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800 dark:text-yellow-200">
                  Important Notice
                </p>
                <p className="mt-1 text-yellow-700 dark:text-yellow-300">
                  This action will immediately lift all current restrictions and allow the user to fully access the platform again.
                </p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Restoration *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please provide a detailed reason for restoring this user's access..."
                      className="min-h-24 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Explain why you are restoring this user&apos;s access. This will be logged for audit purposes.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={restoreUser.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={restoreUser.isPending}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                {restoreUser.isPending ? "Restoring..." : "Restore User"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}