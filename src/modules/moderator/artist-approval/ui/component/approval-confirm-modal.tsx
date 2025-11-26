"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ApprovalConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  artistName: string;
}

export function ApprovalConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  artistName,
}: ApprovalConfirmModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-gray-700 bg-gray-900 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Approval Artist Registration</DialogTitle>
          <DialogDescription className="text-gray-300">Do you really want to approve this artist?</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-gray-300">
            You are about to approve <span className="font-semibold text-white">{artistName}</span> as an artist. This
            action will activate their account and allow them to upload tracks.
          </p>
        </div>

        <DialogFooter className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="border-gray-600 bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isLoading} className="bg-green-600 text-white hover:bg-green-700">
            {isLoading ? "Approving..." : "Approve"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
