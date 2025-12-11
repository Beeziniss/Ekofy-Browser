"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PackageOrderStatus } from "@/gql/graphql";
import { switchStatusByRequestorMutationOptions } from "@/gql/options/client-mutation-options";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal, XCircle, RefreshCw, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import OrderRefundRequestDialog from "./order-refund-request-dialog";

interface OrderActionsDropdownProps {
  orderId: string;
  status: PackageOrderStatus;
  packageName?: string;
  onSuccess?: () => void;
}

const OrderActionsDropdown = ({ orderId, status, packageName, onSuccess }: OrderActionsDropdownProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync: switchStatus, isPending } = useMutation(switchStatusByRequestorMutationOptions);
  const [showRefundDialog, setShowRefundDialog] = useState(false);

  const handleViewDetails = () => {
    router.push(`/orders/${orderId}/details`);
  };

  // TODO: reason is used to input in refund request
  // const handleStatusChange = async (newStatus: PackageOrderStatus, reason?: string) => {

  const handleStatusChange = async (newStatus: PackageOrderStatus) => {
    try {
      await switchStatus({
        id: orderId,
        status: newStatus,
      });

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["order-packages"] });
      queryClient.invalidateQueries({ queryKey: ["order-package-detail", orderId] });

      const actionText = newStatus === PackageOrderStatus.Cancelled ? "cancelled" : "refund requested";
      toast.success(`Order has been ${actionText} successfully.`);

      onSuccess?.();
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status. Please try again.");
    }
  };

  const handleRefundRequest = () => {
    setShowRefundDialog(true);
  };

  // TODO: reason is used to input in refund request
  // const handleRefundConfirm = async (reason: string) => {
  const handleRefundConfirm = async () => {
    // TODO: uncomment when reason is used
    // await handleStatusChange(PackageOrderStatus.Disputed, reason);
    await handleStatusChange(PackageOrderStatus.Disputed);
    setShowRefundDialog(false);
  };

  const getStatusActionText = () => {
    switch (status) {
      case PackageOrderStatus.Paid:
        return "Cancel";
      case PackageOrderStatus.InProgress:
        return "Request Refund";
      default:
        return null;
    }
  };

  const getStatusActionIcon = () => {
    switch (status) {
      case PackageOrderStatus.Paid:
        return XCircle;
      case PackageOrderStatus.InProgress:
        return RefreshCw;
      default:
        return null;
    }
  };

  const getTargetStatus = () => {
    switch (status) {
      case PackageOrderStatus.Paid:
        return PackageOrderStatus.Cancelled;
      case PackageOrderStatus.InProgress:
        return PackageOrderStatus.Disputed;
      default:
        return null;
    }
  };

  const statusActionText = getStatusActionText();
  const StatusActionIcon = getStatusActionIcon();
  const targetStatus = getTargetStatus();

  const handleAction = () => {
    if (status === PackageOrderStatus.InProgress) {
      // Show dialog for refund request
      handleRefundRequest();
    } else if (targetStatus) {
      // Direct action for cancel
      handleStatusChange(targetStatus);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleViewDetails} className="cursor-pointer hover:bg-gray-700">
            <Eye className="mr-2 h-4 w-4" />
            <span className="text-main-white text-sm">View Details</span>
          </DropdownMenuItem>
          {statusActionText && StatusActionIcon && targetStatus && (
            <DropdownMenuItem
              onClick={handleAction}
              disabled={isPending}
              className="cursor-pointer text-red-300 hover:bg-gray-700 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <StatusActionIcon className="mr-2 h-4 w-4" />
              {statusActionText}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <OrderRefundRequestDialog
        open={showRefundDialog}
        onOpenChange={setShowRefundDialog}
        onConfirm={handleRefundConfirm}
        isPending={isPending}
        packageName={packageName}
      />
    </>
  );
};

export default OrderActionsDropdown;
