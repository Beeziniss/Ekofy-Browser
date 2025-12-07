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

interface OrderActionsDropdownProps {
  orderId: string;
  status: PackageOrderStatus;
  onSuccess?: () => void;
}

const OrderActionsDropdown = ({ orderId, status, onSuccess }: OrderActionsDropdownProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync: switchStatus, isPending } = useMutation(switchStatusByRequestorMutationOptions);

  const handleViewDetails = () => {
    router.push(`/orders/${orderId}/details`);
  };

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={handleViewDetails}
          className="cursor-pointer hover:bg-gray-700">
          <Eye className="mr-2 h-4 w-4" />
          <span className="text-sm text-main-white">View Details</span>
        </DropdownMenuItem>
        {statusActionText && StatusActionIcon && targetStatus && (
          <DropdownMenuItem
            onClick={() => handleStatusChange(targetStatus)}
            disabled={isPending}
            className="cursor-pointer text-red-300 hover:bg-gray-700 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <StatusActionIcon className="mr-2 h-4 w-4" />
            {statusActionText}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OrderActionsDropdown;
