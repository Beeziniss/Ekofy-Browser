"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import OrderApproveDelivery from "../components/order-approve-delivery";
import { PackageOrderStatus } from "@/gql/graphql";
import { acceptRequestByArtistMutationOptions } from "@/gql/options/client-mutation-options";
import { orderPackageDetailOptions } from "@/gql/options/client-options";
import { useAuthStore } from "@/store";
import { calculateDeadline } from "@/utils/calculate-deadline";
import { formatCurrency } from "@/utils/format-currency";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDate } from "date-fns";
import { CircleQuestionMarkIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

const statusBadgeVariants = {
  [PackageOrderStatus.Paid]: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  [PackageOrderStatus.InProgress]: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  [PackageOrderStatus.Completed]: "bg-green-500/20 text-green-400 border-green-500/30",
  [PackageOrderStatus.Cancelled]: "bg-red-500/20 text-red-400 border-red-500/30",
  [PackageOrderStatus.Disputed]: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  [PackageOrderStatus.Refund]: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

const OrderDetailInfoSection = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { orderId } = useParams<{ orderId: string }>();

  const { data: orderPackageDetail } = useQuery(orderPackageDetailOptions(orderId));
  const { mutateAsync, isPending } = useMutation(acceptRequestByArtistMutationOptions);

  const packageData = orderPackageDetail?.package[0];

  if (!orderPackageDetail || !packageData) {
    return <div className="bg-main-grey-1 rounded-md p-3">No order available.</div>;
  }

  const finalDeadline = calculateDeadline(
    orderPackageDetail.startedAt,
    orderPackageDetail.duration || 0,
    orderPackageDetail.freezedTime,
  );

  const deadlineDisplay = formatDate(new Date(finalDeadline), "PPp");

  const handleStartWorking = async () => {
    await mutateAsync(orderPackageDetail.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["order-packages"] });
        queryClient.invalidateQueries({ queryKey: ["order-package-detail", orderId] });
        toast.success("You have accepted the request and can start working now.");
      },
    });
  };

  return (
    <div className="flex flex-col gap-y-6">
      <Card>
        <CardContent className="rounded-md">
          <div className="flex flex-col">
            <h3 className="mb-2 text-xl font-semibold">Order Details</h3>
            <div className="border-input bg-main-purple/20 flex flex-col gap-y-1.5 rounded-md border p-2">
              <div className="text-main-white line-clamp-1 text-base">{packageData?.packageName}</div>
              <Badge
                variant="outline"
                className={`capitalize ${statusBadgeVariants[orderPackageDetail?.status || PackageOrderStatus.InProgress] || ""}`}
              >
                {orderPackageDetail?.status}
              </Badge>
            </div>

            <div className="mt-3 flex flex-col gap-y-2">
              <div className="flex items-center justify-between">
                <strong>Deadline</strong>
                <span className="text-muted-foreground font-medium">
                  {orderPackageDetail?.startedAt ? deadlineDisplay : "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <strong>Total Price</strong>
                <span className="text-muted-foreground font-medium">{formatCurrency(packageData?.amount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <strong>Revisions Allowed</strong>
                <span className="text-muted-foreground font-medium">{packageData?.maxRevision}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="rounded-md">
          <h3 className="mb-2 flex items-center gap-x-2 text-xl font-semibold">
            Support
            <CircleQuestionMarkIcon className="text-main-white h-5 w-5" />
          </h3>
          <div className="text-main-white/90 mt-2 text-sm">
            If you have any questions or need assistance regarding your order, please contact our support team at{" "}
            <a href="mailto:support@example.com" className="text-blue-400 underline">
              support@example.com
            </a>
            .
          </div>
        </CardContent>
      </Card>

      {!orderPackageDetail.startedAt && orderPackageDetail.status !== PackageOrderStatus.Disputed && (
        <Button variant={"ekofy"} onClick={handleStartWorking} disabled={isPending} size={"lg"}>
          Start Working
        </Button>
      )}

      {orderPackageDetail.clientId === user?.userId && orderPackageDetail.status !== PackageOrderStatus.Disputed && (
        <OrderApproveDelivery orderId={orderId} />
      )}
    </div>
  );
};

export default OrderDetailInfoSection;
