"use client";

import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { orderPackageDetailOptions } from "@/gql/options/client-options";
import { formatDate } from "date-fns";
import { formatCurrency } from "@/utils/format-currency";
import { Card, CardContent } from "@/components/ui/card";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { OrderReviewCard } from "../components/order-review-card";
import { PackageOrderStatus } from "@/gql/graphql";
import { Button } from "@/components/ui/button";
import { ExternalLink, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store";
import { UserRole } from "@/types/role";

interface OrderDetailSectionProps {
  orderId: string;
}

const OrderDetailSection = ({ orderId }: OrderDetailSectionProps) => {
  return (
    <Suspense fallback={<OrderDetailSectionSkeleton />}>
      <OrderDetailSectionSuspense orderId={orderId} />
    </Suspense>
  );
};

const OrderDetailSectionSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-4">
      <Card>
        <CardContent className="rouned-md flex flex-col gap-y-3">
          <div className="flex items-start justify-between">
            <div>
              <Skeleton className="h-8 w-48 rounded-md" />
              <Skeleton className="h-8 w-90 rounded-md" />
            </div>
            <div className="flex flex-col items-end gap-y-2">
              <Skeleton className="h-6 w-24 rounded-md" />
              <Skeleton className="h-8 w-32 rounded-md" />
            </div>
          </div>

          <Skeleton className="h-6 w-32 rounded-md" />

          <Skeleton className="h-24 w-full rounded-md" />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="rounded-md">
          <Skeleton className="h-[28px] w-32 rounded-md" />
          <Skeleton className="mt-2 h-48 w-full rounded-md" />
        </CardContent>
      </Card>
    </div>
  );
};

const OrderDetailSectionSuspense = ({ orderId }: OrderDetailSectionProps) => {
  const queryClient = useQueryClient();
  const { data: orderPackageDetail } = useSuspenseQuery(orderPackageDetailOptions(orderId));
  const { user } = useAuthStore();

  const orderPackageData = orderPackageDetail?.package[0];
  const clientData = orderPackageDetail?.client?.[0];
  const providerData = orderPackageDetail?.provider?.[0];

  const isArtist = user?.role === UserRole.ARTIST;
  const isCompleted = orderPackageDetail?.status === PackageOrderStatus.Completed;
  const hasPayoutTransaction = !!orderPackageDetail?.payoutTransactionId;

  const handleReviewUpdated = () => {
    // Invalidate and refetch order detail to get updated review
    queryClient.invalidateQueries({ queryKey: ["order-package-detail", orderId] });
  };

  return (
    <div className="flex flex-col gap-y-4">
      <Card>
        <CardContent className="flex flex-col gap-y-3 rounded-md">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-main-purple text-2xl font-semibold">{orderPackageData?.packageName}</h3>
              <div className="mt-2 flex items-center gap-x-3">
                <div className="text-muted-foreground flex items-center gap-x-2 text-sm font-stretch-normal">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={clientData?.avatarImage || ""} alt={clientData?.displayName || "Client"} />
                    <AvatarFallback>{clientData?.displayName?.charAt(0) || "C"}</AvatarFallback>
                  </Avatar>
                  Order by <strong className="text-main-white">{clientData?.displayName}</strong>
                </div>
                {orderPackageDetail?.createdAt && (
                  <div className="text-muted-foreground text-sm">
                    Date ordered {formatDate(new Date(orderPackageDetail.createdAt), "MMM dd, yyyy")}
                  </div>
                )}
              </div>
              {providerData && (
                <div className="text-muted-foreground mt-2 flex items-center gap-x-2 text-sm font-stretch-normal">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={providerData?.avatarImage || ""}
                      alt={providerData?.stageName || providerData?.email || "Provider"}
                    />
                    <AvatarFallback>
                      {providerData?.stageName?.charAt(0) || providerData?.email?.charAt(0) || "P"}
                    </AvatarFallback>
                  </Avatar>
                  Provider:{" "}
                  <strong className="text-main-white">{providerData?.stageName || providerData?.email}</strong>
                </div>
              )}
            </div>
            <div className="flex flex-col items-end gap-y-2">
              <div className="text-sm font-normal">Total price</div>
              <div className="text-main-purple text-xl font-semibold">{formatCurrency(orderPackageData?.amount)}</div>
            </div>
          </div>

          <div className="text-base">
            <span className="font-semibold">Duration:</span> {orderPackageData?.estimateDeliveryDays} day
            {orderPackageData?.estimateDeliveryDays !== 1 ? "s" : ""}
          </div>

          <div className="text-base">
            <div className="font-semibold">Package features</div>
            <ul className="flex list-disc flex-col pl-5">
              {orderPackageData?.serviceDetails?.map((detail, index) => (
                <li key={index} className="text-main-white/90 text-sm">
                  {detail.value}
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements Section - Only show if requirements exist */}
          {orderPackageDetail?.requirements && orderPackageDetail.requirements.trim() !== "" && (
            <div className="text-base">
              <div className="font-semibold">Requirements</div>
              <div
                className="text-main-white/90 mt-2 text-sm whitespace-pre-wrap"
                dangerouslySetInnerHTML={{
                  __html: orderPackageDetail.requirements,
                }}
              ></div>
            </div>
          )}

          {/* Conversation Link - Show for all users */}
          {orderPackageDetail?.conversationId && (
            <div className="flex items-center justify-between border-t pt-3">
              <div>
                <h4 className="font-semibold">Need to discuss this order?</h4>
                <p className="text-muted-foreground text-sm">Chat with the other party about this order</p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href={`/inbox/${orderPackageDetail.conversationId}`} className="flex items-center gap-x-2">
                  <MessageSquare className="size-4" />
                  Open Chat
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      {orderPackageDetail?.disputedReason && (
        <Card>
          <CardContent className="rounded-md">
            <h3 className="text-xl font-semibold">Disputed Reason</h3>
            <div className="text-main-white/90 mt-2 text-sm whitespace-pre-wrap">
              {orderPackageDetail?.disputedReason}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payout Transaction Link - Only show for artists with completed orders */}
      {isArtist && isCompleted && hasPayoutTransaction && (
        <Card>
          <CardContent className="rounded-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">Payout Information</h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  View the payout transaction details for this completed order
                </p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link
                  href={`/artist/studio/transactions/payouts/${orderPackageDetail.payoutTransactionId}`}
                  className="flex items-center gap-x-2"
                >
                  View Payout <ExternalLink className="size-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review Section - Only show for completed or refund orders */}
      {(orderPackageDetail?.status === PackageOrderStatus.Completed ||
        orderPackageDetail?.status === PackageOrderStatus.Refund) && (
        <OrderReviewCard
          orderId={orderId}
          orderStatus={orderPackageDetail.status}
          review={orderPackageDetail?.review}
          onReviewUpdated={handleReviewUpdated}
        />
      )}
    </div>
  );
};

export default OrderDetailSection;
