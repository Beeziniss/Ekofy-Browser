"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { sendRedoRequestMutationOptions } from "@/gql/options/client-mutation-options";
import { toast } from "sonner";
import { parseGraphQLError } from "@/utils/graphql-error-utils";
import { differenceInHours, formatDate } from "date-fns";

interface OrderSubmissionRevisionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  packageOrderId: string;
  revisionNumber: number;
  deadline?: Date | null;
}

const OrderSubmissionRevisionDialog = ({
  isOpen,
  onClose,
  packageOrderId,
  revisionNumber,
  deadline,
}: OrderSubmissionRevisionDialogProps) => {
  const [clientFeedback, setClientFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const sendRedoRequestMutation = useMutation(sendRedoRequestMutationOptions);

  // Check if deadline is within 48 hours
  const hoursRemaining = deadline ? differenceInHours(deadline, new Date()) : null;
  const isWithin48Hours = hoursRemaining !== null && hoursRemaining <= 48 && hoursRemaining > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientFeedback.trim()) {
      toast.error("Please provide feedback for the revision request");
      return;
    }

    setIsSubmitting(true);

    try {
      await sendRedoRequestMutation.mutateAsync({
        packageOrderId,
        revisionNumber,
        clientFeedback: clientFeedback.trim(),
      });

      toast.success("Revision request sent successfully!");
      await queryClient.invalidateQueries({ queryKey: ["order-package-detail"] });
      handleClose();
    } catch (error) {
      const graphqlError = parseGraphQLError(error, "Failed to send revision request");
      toast.error(graphqlError.detail);
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setClientFeedback("");
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request Revision</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Warning Alert for 48-hour deadline */}
          {isWithin48Hours && deadline && (
            <Alert className="border-yellow-500/30 bg-yellow-500/10">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <AlertDescription className="text-yellow-400">
                ⚠️ Warning: Only {Math.max(0, Math.round(hoursRemaining!))} hours remaining until deadline (
                {formatDate(deadline, "PPp")}). Requesting a revision may impact the delivery timeline.
              </AlertDescription>
            </Alert>
          )}

          <div className="hidden space-y-2">
            <Label htmlFor="revisionNumber">Revision Number</Label>
            <Input id="revisionNumber" type="number" value={revisionNumber} disabled className="bg-gray-50" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientFeedback">
              Feedback <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="clientFeedback"
              placeholder="Please describe what needs to be revised or changed..."
              value={clientFeedback}
              onChange={(e) => setClientFeedback(e.target.value)}
              required
              className="h-30 max-h-30 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant={"ekofy"} disabled={isSubmitting || !clientFeedback.trim()}>
              {isSubmitting ? "Sending..." : "Send Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderSubmissionRevisionDialog;
