"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PackageOrderStatus } from "@/gql/graphql";
import { formatCurrency } from "@/utils/format-currency";
import { formatDate } from "@/utils/format-date";
import { PackageOrderDetail } from "@/types";
import Image from "next/image";
import { 
  User, 
  Briefcase, 
  Calendar, 
  DollarSign, 
  AlertCircle, 
  FileText, 
  Package,
  CreditCard 
} from "lucide-react";

interface OrderDetailInfoProps {
  order: PackageOrderDetail;
}

export function OrderDetailInfo({ order }: OrderDetailInfoProps) {
  const packageInfo = order.package?.[0];
  const client = order.client?.[0];
  const provider = order.provider?.[0];
  const payment = order.paymentTransaction?.[0];

  const getStatusBadge = (status: PackageOrderStatus) => {
    switch (status) {
      case PackageOrderStatus.Disputed:
        return (
          <Badge className="border-red-200 bg-red-100 text-red-800">
            <AlertCircle className="mr-1 h-3 w-3" />
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
            <CardTitle className="text-xl text-gray-100">Order Details</CardTitle>
            {getStatusBadge(order.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start space-x-3">
              <FileText className="mt-1 h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">Order ID</p>
                <p className="font-mono text-sm font-medium text-gray-200">{order.id}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Calendar className="mt-1 h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">Created At</p>
                <p className="text-sm font-medium text-gray-200">{formatDate(order.createdAt)}</p>
              </div>
            </div>
            {order.startedAt && (
              <div className="flex items-start space-x-3">
                <Calendar className="mt-1 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Started At</p>
                  <p className="text-sm font-medium text-gray-200">{formatDate(order.startedAt)}</p>
                </div>
              </div>
            )}
            {order.disputedAt && (
              <div className="flex items-start space-x-3">
                <AlertCircle className="mt-1 h-5 w-5 text-red-400" />
                <div>
                  <p className="text-sm text-gray-400">Disputed At</p>
                  <p className="text-sm font-medium text-red-300">{formatDate(order.disputedAt)}</p>
                </div>
              </div>
            )}
            <div className="flex items-start space-x-3">
              <DollarSign className="mt-1 h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">Escrow Status</p>
                <Badge className={order.isEscrowReleased ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                  {order.isEscrowReleased ? "Released" : "Held"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parties Involved */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Client Card */}
        <Card className="border-gray-700 bg-gray-800/50">
          <CardHeader>
            <CardTitle className="flex items-center text-lg text-gray-100">
              <User className="mr-2 h-5 w-5" />
              Client
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
                <p className="text-sm text-gray-400">Client ID: {client?.id.slice(-8)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Provider Card */}
        <Card className="border-gray-700 bg-gray-800/50">
          <CardHeader>
            <CardTitle className="flex items-center text-lg text-gray-100">
              <Briefcase className="mr-2 h-5 w-5" />
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
                <p className="text-sm text-gray-400">Artist ID: {provider?.id.slice(-8)}</p>
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
            <p className="text-2xl font-bold text-blue-400">{formatCurrency(packageInfo?.amount || 0)}</p>
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
              <p className="font-medium text-gray-200">{order.revisionCount}</p>
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
            <CreditCard className="mr-2 h-5 w-5" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-400">Total Amount</p>
              <p className="text-xl font-bold text-gray-100">
                {formatCurrency(payment?.amount || 0)}
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
                    <Badge>Revision #{delivery.revisionNumber}</Badge>
                    <span className="text-sm text-gray-400">{formatDate(delivery.deliveredAt)}</span>
                  </div>
                  <p className="mb-2 text-sm text-gray-300">{delivery.notes}</p>
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
    </div>
  );
}
