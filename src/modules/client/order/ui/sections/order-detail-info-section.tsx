"use client";

import { Badge } from "@/components/ui/badge";
import { PackageOrderStatus } from "@/gql/graphql";
import { orderPackageDetailOptions } from "@/gql/options/client-options";
import { formatCurrency } from "@/utils/format-currency";
import { formatDate } from "@/utils/format-date";
import { useQuery } from "@tanstack/react-query";
import { CircleQuestionMarkIcon } from "lucide-react";
import { useParams } from "next/navigation";

const statusBadgeVariants = {
  [PackageOrderStatus.Paid]: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  [PackageOrderStatus.InProgress]: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  [PackageOrderStatus.Dispersed]: "bg-green-500/20 text-green-400 border-green-500/30",
  [PackageOrderStatus.Cancelled]: "bg-red-500/20 text-red-400 border-red-500/30",
  [PackageOrderStatus.Disputed]: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  [PackageOrderStatus.Refund]: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

const OrderDetailInfoSection = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { data: orderPackageDetail } = useQuery(orderPackageDetailOptions(orderId));

  const packageData = orderPackageDetail?.package[0];

  if (!orderPackageDetail || !packageData) {
    return <div className="bg-main-grey-1 rounded-md p-3">No order available.</div>;
  }

  return (
    <div className="flex flex-col gap-y-6">
      <div className="bg-main-grey-1 rounded-md p-3">
        <div className="flex flex-col">
          <h3 className="mb-2 text-xl font-semibold">Order Details</h3>
          <div className="flex flex-col gap-y-1">
            <div className="text-main-white text-sm">{packageData?.packageName}</div>
            <Badge
              variant="outline"
              className={`capitalize ${statusBadgeVariants[orderPackageDetail?.status || PackageOrderStatus.InProgress] || ""}`}
            >
              {orderPackageDetail?.status}
            </Badge>
          </div>

          <div className="mt-3 flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
              <span>Deadline</span>
              <span className="font-medium">{formatDate(orderPackageDetail.deadline)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Total Price</span>
              <span className="font-medium">{formatCurrency(packageData?.amount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Revisions Allowed</span>
              <span className="font-medium">{packageData?.maxRevision}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-main-grey-1 rounded-md p-3">
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
      </div>
    </div>
  );
};

export default OrderDetailInfoSection;
