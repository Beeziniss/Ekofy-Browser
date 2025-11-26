"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { sendRedoRequestMutationOptions } from "@/gql/options/client-mutation-options";
import { toast } from "sonner";
import { parseGraphQLError } from "@/utils/graphql-error-utils";

interface OrderSubmissionRevisionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  packageOrderId: string;
  revisionNumber: number;
}

const OrderSubmissionRevisionDialog = ({
  isOpen,
  onClose,
  packageOrderId,
  revisionNumber,
}: OrderSubmissionRevisionDialogProps) => {
  const [clientFeedback, setClientFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const sendRedoRequestMutation = useMutation(sendRedoRequestMutationOptions);

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
      queryClient.invalidateQueries({ queryKey: ["order-package-detail"] });
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
          <div className="space-y-2">
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
              rows={4}
              required
              className="resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !clientFeedback.trim()}>
              {isSubmitting ? "Sending..." : "Send Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderSubmissionRevisionDialog;
