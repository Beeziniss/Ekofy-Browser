"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/format-currency";
import { getUserInitials } from "@/utils/format-shorten-name";
import { calculateDeadline } from "@/utils/calculate-deadline";
import { CustomPagination } from "@/components/ui/custom-pagination";
import { PackageOrderStatus, OrderPackageQuery } from "@/gql/graphql";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "date-fns";
import OrderActionsDropdown from "@/modules/client/order/ui/components/order-actions-dropdown";

type OrderItem = NonNullable<NonNullable<OrderPackageQuery["packageOrders"]>["items"]>[number];

interface ActivityConversationTableProps {
  orders: OrderItem[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onStatusChange?: () => void;
}

const statusBadgeVariants = {
  [PackageOrderStatus.Paid]: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  [PackageOrderStatus.InProgress]: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  [PackageOrderStatus.Completed]: "bg-green-500/20 text-green-400 border-green-500/30",
  [PackageOrderStatus.Cancelled]: "bg-red-500/20 text-red-400 border-red-500/30",
  [PackageOrderStatus.Disputed]: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  [PackageOrderStatus.Refund]: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

const ActivityConversationTable = ({
  orders,
  totalCount,
  totalPages,
  currentPage,
  pageSize,
  onPageChange,
  onStatusChange,
}: ActivityConversationTableProps) => {
  return (
    <div className="space-y-6">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-80 max-w-80">Client</TableHead>
              <TableHead>Package</TableHead>
              <TableHead className="w-52">Deadline</TableHead>
              <TableHead className="w-44">Total</TableHead>
              <TableHead className="w-28">Status</TableHead>
              <TableHead className="w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => {
                const finalDeadline = calculateDeadline(order.startedAt, order.duration || 0, order.freezedTime);

                const deadlineDisplay = formatDate(new Date(finalDeadline), "PPp");

                return (
                  <TableRow key={order.id}>
                    {/* Client */}
                    <TableCell className="w-80 max-w-80">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={order.client?.[0]?.avatarImage || undefined}
                            alt={order.client?.[0]?.displayName || "Client"}
                          />
                          <AvatarFallback className="text-xs">
                            {order.client?.[0]?.displayName ? getUserInitials(order.client[0].displayName) : "CL"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {order.client?.[0]?.displayName || "Unknown Client"}
                        </span>
                      </div>
                    </TableCell>

                    {/* Package */}
                    <TableCell className="truncate">
                      <span className="text-sm">{order.package?.[0]?.packageName || "Unknown Package"}</span>
                    </TableCell>

                    {/* Deadline */}
                    <TableCell className="w-52">
                      <span className="text-muted-foreground text-sm">{deadlineDisplay}</span>
                    </TableCell>

                    {/* Amount/Total */}
                    <TableCell className="w-44">
                      <span className="text-sm font-medium">{formatCurrency(order.package?.[0]?.amount || 0)}</span>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="w-28">
                      <Badge variant="outline" className={`${statusBadgeVariants[order.status] || ""} capitalize`}>
                        {order.status}
                      </Badge>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="w-20">
                      <OrderActionsDropdown orderId={order.id} status={order.status} onSuccess={onStatusChange} />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-muted-foreground py-8 text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          pageSize={pageSize}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default ActivityConversationTable;
