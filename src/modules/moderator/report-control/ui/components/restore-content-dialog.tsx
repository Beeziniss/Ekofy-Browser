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
import { useRestoreContent } from "@/gql/client-mutation-options/report-mutation-options";
import { toast } from "sonner";

interface RestoreContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportId: string;
  contentName?: string;
  contentType?: string;
  onSuccess?: () => void;
}

export function RestoreContentDialog({
  open,
  onOpenChange,
  reportId,
  contentName,
  contentType = "content",
  onSuccess,
}: RestoreContentDialogProps) {
  const restoreContent = useRestoreContent();

  const onSubmit = async () => {
    try {
      await restoreContent.mutateAsync(reportId);
      toast.success(`${contentType} restored successfully`);
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error restoring content:", error);
      toast.error(`Failed to restore ${contentType}`);
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
            Restore {contentType}
          </DialogTitle>
          <DialogDescription>
            You are about to restore {contentType.toLowerCase()} {contentName ? `"${contentName}"` : ""}. 
            This will make the content visible and accessible again on the platform.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-50 border border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-yellow-800 dark:text-yellow-200">
              Important Notice
            </p>
            <p className="mt-1 text-yellow-700 dark:text-yellow-300">
              This action will immediately restore the content and make it available to all users again.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={restoreContent.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={restoreContent.isPending}
            className="gap-2 bg-green-600 hover:bg-green-700 text-white"
          >
            <RotateCcw className="h-4 w-4" />
            {restoreContent.isPending ? "Restoring..." : `Restore ${contentType}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}