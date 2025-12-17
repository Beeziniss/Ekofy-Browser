"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PackageOrderStatus } from "@/gql/graphql";
import { formatCurrencyVND } from "@/utils/format-currency";
import { formatDate } from "@/utils/format-date";
// import { calculateDeadline } from "@/utils/calculate-deadline";
import { PackageOrderDetail } from "@/types";
import Image from "next/image";
import { toast } from "sonner";
import { 
  Package,
  FileIcon,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderConversationMessages } from "./order-conversation-messages";
import { useGetS3File } from "@/hooks/use-get-s3-file";

interface OrderDetailInfoProps {
  order: PackageOrderDetail;
  conversationMessages?: Array<{
    id: string;
    conversationId?: string | null;
    senderId?: string | null;
    text?: string | null;
    sentAt: string;
    seenAt?: string | null;
    senderProfileMessages: {
      avatar?: string | null;
      nickname?: string | null;
      userId?: string | null;
    };
  }>;
  hasMoreMessages?: boolean;
  loadMoreMessages?: () => void;
  isLoadingMore?: boolean;
}

export function OrderDetailInfo({ 
  order, 
  conversationMessages = [],
  hasMoreMessages,
  loadMoreMessages,
  isLoadingMore,
}: OrderDetailInfoProps) {
  const { handleFileAccess } = useGetS3File();
  const packageInfo = order.package?.[0];
  const client = order.client?.[0];
  const provider = order.provider?.[0];
  const payment = order.paymentTransaction?.[0];


  // Calculate deadline
  // const deadline = order.startedAt && packageInfo?.estimateDeliveryDays
  //   ? calculateDeadline(order.startedAt, packageInfo.estimateDeliveryDays, order.freezedTime || undefined)
  //   : null;

  const getStatusBadge = (status: PackageOrderStatus) => {
    switch (status) {
      case PackageOrderStatus.Disputed:
        return (
          <Badge className="border-red-200 bg-red-100 text-red-800">
            DISPUTED
          </Badge>
        );
      case PackageOrderStatus.InProgress:
        return <Badge className="border-blue-200 bg-blue-100 text-blue-800">IN PROGRESS</Badge>;
      case PackageOrderStatus.Completed:
        return <Badge className="border-green-200 bg-green-100 text-green-800">COMPLETED</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Order Status Card */}
      <Card className="border-gray-700 bg-gray-800/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-gray-100">Order Information</CardTitle>
            {getStatusBadge(order.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start space-x-3">
              <div>
                <p className="text-sm text-main-white">Order ID</p>
                <p className="font-mono text-sm font-medium text-main-grey">{order.id}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div>
                <p className="text-sm text-main-white">Created At</p>
                <p className="text-sm font-medium text-main-grey">{formatDate(order.createdAt)}</p>
              </div>
            </div>
            {order.startedAt && (
              <div className="flex items-start space-x-3">
                <div>
                  <p className="text-sm text-main-white">Started At</p>
                  <p className="text-sm font-medium text-main-grey">{formatDate(order.startedAt)}</p>
                </div>
              </div>
            )}
            {order.disputedAt && (
              <div className="flex items-start space-x-3">
                <div>
                  <p className="text-sm text-main-white">Disputed At</p>
                  <p className="text-sm font-medium text-main-grey">{formatDate(order.disputedAt)}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Parties Involved */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Client Card */}
        <Card className="border-gray-700 bg-gray-800/50">
          <CardHeader>
            <CardTitle className="flex items-center text-lg text-gray-100">
              Listener
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500">
                {client?.avatarImage ? (
                  <Image src={client.avatarImage} alt="" width={64} height={64} className="h-full w-full rounded-full object-cover" />
                ) : (
                  <span className="text-2xl font-medium text-white">
                    {client?.displayName?.charAt(0)?.toUpperCase() || "C"}
                  </span>
                )}
              </div>
              <div>
                <p className="font-medium text-gray-200">{client?.displayName || "Unknown"}</p>
                <p className="text-sm text-gray-400">{client?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Provider Card */}
        <Card className="border-gray-700 bg-gray-800/50">
          <CardHeader>
            <CardTitle className="flex items-center text-lg text-gray-100">
              Provider (Artist)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-500">
                {provider?.avatarImage ? (
                  <Image src={provider.avatarImage} alt="" width={64} height={64} className="h-full w-full rounded-full object-cover" />
                ) : (
                  <span className="text-2xl font-medium text-white">
                    {provider?.stageName?.charAt(0)?.toUpperCase() || "A"}
                  </span>
                )}
              </div>
              <div>
                <p className="font-medium text-gray-200">{provider?.stageName || "Unknown"}</p>
                <p className="text-sm text-gray-400">{provider?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Package Details */}
      <Card className="border-gray-700 bg-gray-800/50">
        <CardHeader>
          <CardTitle className="flex items-center text-lg text-gray-100">
            <Package className="mr-2 h-5 w-5" />
            Package Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-100">{packageInfo?.packageName}</h3>
            <p className="text-2xl font-bold text-blue-400">{formatCurrencyVND(packageInfo?.amount || 0)} {packageInfo?.currency}</p>
          </div>
          <Separator className="bg-gray-700" />
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-gray-400">Delivery Time</p>
              <p className="font-medium text-gray-200">{packageInfo?.estimateDeliveryDays} days</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Max Revisions</p>
              <p className="font-medium text-gray-200">{packageInfo?.maxRevision}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Used Revisions</p>
              <p className="font-medium text-gray-200">{Math.max(0, order.revisionCount || 0)}</p>
            </div>
          </div>
          {packageInfo?.serviceDetails && packageInfo.serviceDetails.length > 0 && (
            <>
              <Separator className="bg-gray-700" />
              <div>
                <p className="mb-2 text-sm font-medium text-gray-400">Service Details</p>
                <ul className="space-y-1">
                  {packageInfo.serviceDetails.map((detail, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-300">
                      <span className="mr-2 text-green-400">✓</span>
                      {detail.value}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Payment Information */}
      <Card className="border-gray-700 bg-gray-800/50">
        <CardHeader>
          <CardTitle className="flex items-center text-lg text-gray-100">
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-400">Total Amount</p>
              <p className="text-xl font-bold text-gray-100">
                {formatCurrencyVND(payment?.amount || 0)} {payment?.currency}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Payment Status</p>
              <Badge className="bg-green-100 text-green-800">{payment?.paymentStatus}</Badge>
            </div>
            <div>
              <p className="text-sm text-gray-400">Platform Fee</p>
              <p className="font-medium text-gray-200">{order.platformFeePercentage}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Artist Fee</p>
              <p className="font-medium text-gray-200">{order.artistFeePercentage}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Transaction ID</p>
              <p className="font-mono text-sm text-gray-300">{payment?.stripePaymentId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Payment Date</p>
              <p className="text-sm text-gray-300">{formatDate(payment?.createdAt || "")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requirements */}
      <Card className="border-gray-700 bg-gray-800/50">
        <CardHeader>
          <CardTitle className="text-lg text-gray-100">Client Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300">{order.requirements || "No specific requirements provided."}</p>
        </CardContent>
      </Card>

      {/* Deliveries */}
      {order.deliveries && order.deliveries.length > 0 && (
        <Card className="border-gray-700 bg-gray-800/50">
          <CardHeader>
            <CardTitle className="text-lg text-gray-100">Delivery History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.deliveries.map((delivery, index) => (
                <div key={index} className="rounded-lg border border-gray-700 bg-gray-900/50 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <Badge variant="ekofy">Revision #{delivery.revisionNumber}</Badge>
                    <span className="text-sm text-gray-400">{formatDate(delivery.deliveredAt)}</span>
                  </div>
                  <p className="mb-2 text-sm text-gray-300">Notes: {delivery.notes}</p>
                  
                  {/* Delivery File */}
                  {delivery.deliveryFileUrl && (
                    <div className="mb-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleFileAccess(delivery.deliveryFileUrl!)}
                        className="flex items-center gap-2 border-gray-600 text-blue-400 hover:bg-gray-800 hover:text-blue-300"
                      >
                        <FileIcon className="h-4 w-4" />
                        <span>View Delivery File</span>
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  
                  {delivery.clientFeedback && (
                    <div className="mt-2 rounded bg-gray-800 p-2">
                      <p className="text-xs text-gray-400">Client Feedback:</p>
                      <p className="text-sm text-gray-300">{delivery.clientFeedback}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conversation Messages */}
      <OrderConversationMessages
        messages={conversationMessages}
        clientId={order.clientId}
        providerId={order.providerId}
        hasMoreMessages={hasMoreMessages}
        loadMoreMessages={loadMoreMessages}
        isLoadingMore={isLoadingMore}
      />
    </div>
  );
}
