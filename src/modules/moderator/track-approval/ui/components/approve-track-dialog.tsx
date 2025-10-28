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
import { CheckCircle } from "lucide-react";

interface ApproveTrackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trackName: string;
  artistName: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function ApproveTrackDialog({
  open,
  onOpenChange,
  trackName,
  artistName,
  onConfirm,
  isLoading = false,
}: ApproveTrackDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Approve Track Upload
          </DialogTitle>
          <DialogDescription className="text-left">
            Are you sure you want to approve this track upload request?
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-muted-foreground">Track:</span>
              <span className="text-sm font-medium">{trackName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-muted-foreground">Artist:</span>
              <span className="text-sm font-medium">{artistName}</span>
            </div>
          </div>
          
          <div className="rounded-md bg-green-50 p-3 border border-green-200 dark:bg-green-950 dark:border-green-800">
            <p className="text-sm text-green-800 dark:text-green-200">
              <strong>This action will:</strong>
            </p>
            <ul className="text-sm text-green-700 dark:text-green-300 mt-1 space-y-1">
              <li>• Approve the track for public release</li>
              <li>• Notify the artist of the approval</li>
              <li>• Make the track available on the platform</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? "Approving..." : "Approve Track"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}