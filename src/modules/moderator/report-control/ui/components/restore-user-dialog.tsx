"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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

export function RestoreUserDialog({
  open,
  onOpenChange,
  reportId,
  reportedUserName,
  onSuccess,
}: RestoreUserDialogProps) {
  const restoreUser = useRestoreUser();

  const onSubmit = async () => {
    try {
      await restoreUser.mutateAsync(reportId);
      toast.success("User restored successfully");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error restoring user:", error);
      toast.error("Failed to restore user");
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
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
            onClick={onSubmit}
            disabled={restoreUser.isPending}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            {restoreUser.isPending ? "Restoring..." : "Restore User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}