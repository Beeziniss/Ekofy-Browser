"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { XCircle } from "lucide-react";

interface RejectTrackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trackName: string;
  artistName: string;
  onConfirm: (reason: string) => void;
  isLoading?: boolean;
}

export function RejectTrackDialog({
  open,
  onOpenChange,
  trackName,
  artistName,
  onConfirm,
  isLoading = false,
}: RejectTrackDialogProps) {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason.trim());
      onOpenChange(false);
      setReason(""); // Reset form
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setReason(""); // Reset form
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-600" />
            Reject Track Upload
          </DialogTitle>
          <DialogDescription className="text-left">
            Please provide a reason for rejecting this track upload request.
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
          
          <div className="space-y-2">
            <Label htmlFor="reject-reason">Reason for rejection *</Label>
            <Textarea
              id="reject-reason"
              placeholder="Please explain why this track is being rejected..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px] resize-none"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              This reason will be sent to the artist.
            </p>
          </div>
          
          <div className="rounded-md bg-red-50 p-3 border border-red-200 dark:bg-red-950 dark:border-red-800">
            <p className="text-sm text-red-800 dark:text-red-200">
              <strong>This action will:</strong>
            </p>
            <ul className="text-sm text-red-700 dark:text-red-300 mt-1 space-y-1">
              <li>• Reject the track upload request</li>
              <li>• Notify the artist with the provided reason</li>
              <li>• Remove the track from pending approvals</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading || !reason.trim()}
            variant="destructive"
          >
            {isLoading ? "Rejecting..." : "Reject Track"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}