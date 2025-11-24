"use client";

import { Badge } from "@/components/ui/badge";
import { PackageOrderStatus } from "@/gql/graphql";
import { orderPackageDetailOptions } from "@/gql/options/client-options";
import { useQuery } from "@tanstack/react-query";
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
    <div className="bg-main-grey-1 rounded-md p-3">
      <div className="flex flex-col">
        <h3 className="text-xl font-semibold">Order Details</h3>
        <div className="flex flex-col">
          <div className="text-main-white text-sm">{packageData?.packageName}</div>
          <Badge
            variant="outline"
            className={`capitalize ${statusBadgeVariants[orderPackageDetail?.status || PackageOrderStatus.InProgress] || ""}`}
          >
            {orderPackageDetail?.status}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailInfoSection;
