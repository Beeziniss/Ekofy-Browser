"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { approveDeliveryMutationOptions } from "@/gql/options/client-mutation-options";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface OrderApproveDeliveryProps {
  orderId: string;
}

const OrderApproveDelivery = ({ orderId }: OrderApproveDeliveryProps) => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation(approveDeliveryMutationOptions);

  const handleApproveDelivery = async () => {
    try {
      await mutateAsync(orderId);
      // Invalidate relevant queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["order-packages"] });
      queryClient.invalidateQueries({ queryKey: ["order-package-detail", orderId] });
      toast.success("Delivery has been approved successfully!");
    } catch {
      toast.error("Failed to approve delivery. Please try again.");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="lg" variant="ekofy" disabled={isPending}>
          Approve Delivery
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Approve Delivery</AlertDialogTitle>
          <AlertDialogDescription className="space-y-1">
            <span className="inline-block">Are you satisfied with the delivered work?</span>
            <br />
            <br />
            <span className="inline-block">
              Once you approve this delivery, the order will be marked as completed and payment will be released to the
              artist.
            </span>
            <br />
            <div>This action cannot be undone.</div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleApproveDelivery}
            disabled={isPending}
            className="!bg-green-600 hover:!bg-green-700"
          >
            {isPending ? "Approving..." : "Yes, Approve Delivery"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OrderApproveDelivery;
