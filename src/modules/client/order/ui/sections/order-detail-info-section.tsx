"use client";

import { toast } from "sonner";
import { Suspense, useEffect } from "react";
import { formatDate } from "date-fns";
import { useAuthStore } from "@/store";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PackageOrderStatus } from "@/gql/graphql";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format-currency";
import { calculateDeadline } from "@/utils/calculate-deadline";
import OrderApproveDelivery from "../components/order-approve-delivery";
import OrderActionsDropdown from "../components/order-actions-dropdown";
import { orderPackageDetailOptions } from "@/gql/options/client-options";
import { CircleQuestionMarkIcon, MoreHorizontalIcon } from "lucide-react";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { acceptRequestByArtistMutationOptions } from "@/gql/options/client-mutation-options";

const statusBadgeVariants = {
  [PackageOrderStatus.Paid]: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  [PackageOrderStatus.InProgress]: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  [PackageOrderStatus.Completed]: "bg-green-500/20 text-green-400 border-green-500/30",
  [PackageOrderStatus.Cancelled]: "bg-red-500/20 text-red-400 border-red-500/30",
  [PackageOrderStatus.Disputed]: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  [PackageOrderStatus.Refund]: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

const OrderDetailInfoSection = () => {
  return (
    <Suspense fallback={<OrderDetailInfoSectionSkeleton />}>
      <OrderDetailInfoSectionSuspense />
    </Suspense>
  );
};

const OrderDetailInfoSectionSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-6 select-none">
      <Card>
        <CardContent className="rounded-md">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-xl font-semibold">Order Details</h3>
            <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </div>

          <Skeleton className="h-[70px] w-full rounded-md" />

          <div className="mt-3 flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
              <strong>Deadline</strong>
              <Skeleton className="h-6 w-24 rounded-md" />
            </div>
            <div className="flex items-center justify-between">
              <strong>Total Price</strong>
              <Skeleton className="h-6 w-24 rounded-md" />
            </div>
            <div className="flex items-center justify-between">
              <strong>Revisions Allowed</strong>
              <Skeleton className="h-6 w-24 rounded-md" />
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
    </div>
  );
};

const OrderDetailInfoSectionSuspense = () => {
  const { user } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { orderId } = useParams<{ orderId: string }>();

  const { data: orderPackageDetail } = useSuspenseQuery(orderPackageDetailOptions(orderId));
  const { mutateAsync, isPending: isMutationPending } = useMutation(acceptRequestByArtistMutationOptions);

  useEffect(() => {
    if (orderPackageDetail && user) {
      const isAuthorized = orderPackageDetail.clientId === user.userId || orderPackageDetail.providerId === user.userId;

      if (!isAuthorized) {
        router.push("/unauthorized");
      }
    }
  }, [orderPackageDetail, user, router]);

  if (!orderPackageDetail || !orderPackageDetail?.package.length) {
    return <div className="bg-main-grey-1 rounded-md p-3">No order available.</div>;
  }

  const deadlineDisplay = () => {
    if (!orderPackageDetail.package.length) return "";

    const rawDeadline = calculateDeadline(
      orderPackageDetail.startedAt,
      orderPackageDetail.duration || 0,
      orderPackageDetail.freezedTime,
    );

    const finalDeadline = rawDeadline instanceof Date && !isNaN(rawDeadline.getTime()) ? rawDeadline : new Date();
    // formatDate(new Date(finalDeadline), "PPp");
    return formatDate(new Date(finalDeadline), "PPp");
  };

  const handleStartWorking = async () => {
    await mutateAsync(orderPackageDetail.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["order-packages"] });
        queryClient.invalidateQueries({ queryKey: ["order-package-detail", orderId] });
        toast.success("You have accepted the request and can start working now.");
      },
    });
  };

  const packageData = orderPackageDetail?.package[0];

  return (
    <div className="flex flex-col gap-y-6">
      <Card>
        <CardContent className="rounded-md">
          <div className="flex flex-col">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Order Details</h3>
              {user?.userId === orderPackageDetail.clientId && (
                <OrderActionsDropdown
                  orderId={orderPackageDetail.id}
                  status={orderPackageDetail.status}
                  onSuccess={() => {
                    // Status has been updated, queries are already invalidated in the component
                  }}
                />
              )}
            </div>
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
                  {orderPackageDetail?.startedAt ? deadlineDisplay() : "N/A"}
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
        <Button variant={"ekofy"} onClick={handleStartWorking} disabled={isMutationPending} size={"lg"}>
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
