"use client";

import React, { useState } from "react";
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
import { AlertTriangle } from "lucide-react";

interface OrderRefundRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
  isPending?: boolean;
  packageName?: string;
}

const OrderRefundRequestDialog = ({
  open,
  onOpenChange,
  onConfirm,
  isPending = false,
  packageName,
}: OrderRefundRequestDialogProps) => {
  const [reason, setReason] = useState("");
  const maxCharacters = 5000;

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason.trim());
      setReason(""); // Reset after confirm
    }
  };

  const handleCancel = () => {
    setReason("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <DialogTitle>Request Refund</DialogTitle>
          </div>
          <DialogDescription>
            You are about to request a refund for <span className="font-semibold">{packageName || "this order"}</span>.
            Please provide a reason for your refund request.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">
              Reason for refund request <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="Please explain why you're requesting a refund..."
              value={reason}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (inputValue.length <= maxCharacters) {
                  setReason(inputValue);
                }
              }}
              maxLength={maxCharacters}
              className="min-h-[120px] resize-none"
              disabled={isPending}
            />
            <div className="text-muted-foreground flex justify-between text-xs">
              <span>Please provide a detailed explanation</span>
              <span>
                {reason.length}/{maxCharacters}
              </span>
            </div>
          </div>

          <div className="rounded-md bg-orange-500/10 p-3 text-sm text-orange-300">
            <p className="font-semibold">Important:</p>
            <ul className="mt-1 list-inside list-disc space-y-1">
              <li>This will mark the order as disputed</li>
              <li>Chat will be disabled until the dispute is resolved</li>
              <li>The artist will be notified of your refund request</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={!reason.trim() || isPending}>
            {isPending ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderRefundRequestDialog;
