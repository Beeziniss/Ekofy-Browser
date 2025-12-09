"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle, AlertTriangle } from "lucide-react";
import { RefundModal } from "./refund-modal";
import { useSwitchStatusByRequestor } from "@/gql/client-mutation-options/moderator-mutation";
import { PackageOrderStatus } from "@/gql/graphql";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface OrderDetailActionsProps {
  orderId: string;
  orderAmount: number;
  currency?: string;
}

export function OrderDetailActions({ orderId, orderAmount, currency }: OrderDetailActionsProps) {
  const router = useRouter();
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
  const switchStatusMutation = useSwitchStatusByRequestor();

  const handleCancelRefund = async () => {
    try {
      await switchStatusMutation.mutateAsync({
        id: orderId,
        status: PackageOrderStatus.InProgress,
      });
      toast.success("Order status changed to In Progress successfully");
      setShowCancelConfirmModal(false);
      router.push("/moderator/order-disputed");
    } catch (error) {
      toast.error("Failed to cancel refund. Please try again.");
      console.error("Cancel refund error:", error);
    }
  };

  return (
    <>
      <Card className="border-gray-700 bg-gray-800/50">
        <CardHeader>
          <CardTitle className="flex items-center text-lg text-gray-100">
            Moderator Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="mt-0.5 h-5 w-5 text-yellow-500" />
              <div className="flex-1">
                <h4 className="font-medium text-yellow-500">Dispute Resolution Required</h4>
                <p className="mt-1 text-sm text-gray-300">
                  This order is in dispute. Review the details carefully and decide on the appropriate refund split
                  between the client and artist.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              onClick={() => setShowRefundModal(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-main-white"
              size="lg"
            >
              Process Refund
            </Button>
            <p className="text-center text-xs text-gray-400">
              Determine refund percentages for client and artist
            </p>
          </div>

          <div className="space-y-2">
            <Button
              onClick={() => setShowCancelConfirmModal(true)}
              disabled={switchStatusMutation.isPending}
              className="w-full bg-gray-600 hover:bg-gray-700 text-main-white"
              size="lg"
              variant="outline"
            >
              {switchStatusMutation.isPending ? (
                <>
                  Cancelling...
                </>
              ) : (
                <>
                  Cancel Refund
                </>
              )}
            </Button>
            <p className="text-center text-xs text-gray-400">
              Change order status back to In Progress
            </p>
          </div>
        </CardContent>
      </Card>

      <RefundModal
        open={showRefundModal}
        onClose={() => setShowRefundModal(false)}
        orderId={orderId}
        orderAmount={orderAmount}
        currency={currency}
      />

      {/* Cancel Refund Confirmation Modal */}
      <Dialog open={showCancelConfirmModal} onOpenChange={setShowCancelConfirmModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-yellow-500/10 p-3">
                <AlertTriangle className="h-6 w-6 text-yellow-500" />
              </div>
              <DialogTitle className="text-xl">Cancel Refund?</DialogTitle>
            </div>
            <DialogDescription className="pt-4 text-base">
              Are you sure you want to cancel this refund request? This will change the order status back to{" "}
              <span className="font-semibold text-blue-600 dark:text-blue-400">In Progress</span>.
            </DialogDescription>
          </DialogHeader>
          
          <div className="my-4 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Note:</strong> The dispute will be resolved and both parties can continue working on the order.
            </p>
          </div>

          <DialogFooter className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCancelConfirmModal(false)}
              disabled={switchStatusMutation.isPending}
            >
              Go Back
            </Button>
            <Button
              type="button"
              onClick={handleCancelRefund}
              disabled={switchStatusMutation.isPending}
              className="bg-yellow-600 hover:bg-yellow-700 text-main-white"
            >
              {switchStatusMutation.isPending ? (
                <>
                  Processing...
                </>
              ) : (
                <>
                  Confirm Cancel
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
