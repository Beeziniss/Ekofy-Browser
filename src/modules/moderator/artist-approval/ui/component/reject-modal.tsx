import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (rejectionReason: string) => void;
  isLoading?: boolean;
  artistName: string;
}

export function RejectModal({ isOpen, onClose, onConfirm, isLoading = false, artistName }: RejectModalProps) {
  const [rejectionReason, setRejectionReason] = useState("");

  const handleConfirm = () => {
    if (rejectionReason.trim()) {
      onConfirm(rejectionReason.trim());
      setRejectionReason(""); // Reset after confirm
    }
  };

  const handleClose = () => {
    setRejectionReason(""); // Reset when closing
    onClose();
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="border-gray-700 bg-gray-900 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Reject Artist Registration</DialogTitle>
          <DialogDescription className="text-gray-300">
            Please provide a reason for rejecting this artist registration.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-gray-300">
            You are about to reject <span className="font-semibold text-white">{artistName}</span> as an artist.
          </p>

          <div className="space-y-2">
            <Label htmlFor="rejection-reason" className="text-white">
              Rejection Reason <span className="text-red-400">*</span>
            </Label>
            <Textarea
              id="rejection-reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Please explain why this registration is being rejected..."
              className="min-h-[100px] border-gray-600 bg-gray-800 text-white placeholder-gray-400"
              disabled={isLoading}
            />
          </div>
        </div>

        <DialogFooter className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="border-gray-600 bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading || !rejectionReason.trim()}
            className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? "Rejecting..." : "Reject"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
