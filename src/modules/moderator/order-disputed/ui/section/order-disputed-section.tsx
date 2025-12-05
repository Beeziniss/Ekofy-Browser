"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { OrderDisputedStats, OrderDisputedTableWrapper } from "../component";
import { moderatorDisputedPackageOrdersOptions } from "@/gql/options/moderator-options";
import { toast } from "sonner";
import { PackageOrderItem } from "@/types";

export function OrderDisputedSection() {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");

  const {
    data: ordersData,
    isLoading,
    error,
  } = useQuery(moderatorDisputedPackageOrdersOptions(currentPage, pageSize));

  if (isLoading && !ordersData) {
    return (
      <div className="space-y-6">
        <OrderDisputedStats />
        <div className="flex h-64 items-center justify-center rounded-lg border border-gray-700 bg-gray-800/50">
          <div className="text-gray-400">Loading disputed orders...</div>
        </div>
      </div>
    );
  }

  if (error) {
    toast.error("Failed to load disputed orders");
    return (
      <div className="space-y-6">
        <OrderDisputedStats />
        <div className="flex h-64 items-center justify-center rounded-lg border border-gray-700 bg-gray-800/50">
          <div className="text-red-400">Error loading orders: {error.message}</div>
        </div>
      </div>
    );
  }

  const orders = (ordersData?.items || []) as PackageOrderItem[];
  const totalCount = ordersData?.totalCount || 0;
  const pageInfo = ordersData?.pageInfo;

  // Calculate stats from disputed orders
  const stats = {
    totalDisputed: totalCount,
    pendingResolution: totalCount, // All disputed orders are pending resolution
    resolvedToday: 0, // TODO: Calculate from resolved orders today
    totalAmount: orders.reduce((sum, order) => {
      const payment = order.paymentTransaction?.[0];
      return sum + (payment?.amount || 0);
    }, 0),
  };

  return (
    <div className="space-y-6">
      <OrderDisputedStats {...stats} />

      <OrderDisputedTableWrapper
        orders={orders}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        hasNextPage={pageInfo?.hasNextPage || false}
        hasPreviousPage={pageInfo?.hasPreviousPage || false}
      />
    </div>
  );
}
