"use client";

import { OrderDisputedTable } from "./order-disputed-table";
import { OrderDisputedSearch } from "./order-disputed-search";
import { PackageOrderItem } from "@/types";

interface OrderDisputedTableWrapperProps {
  orders: PackageOrderItem[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
  onSearchChange: (search: string) => void;
  searchTerm: string;
}

export function OrderDisputedTableWrapper({
  orders,
  totalCount,
  currentPage,
  pageSize,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
  onSearchChange,
  searchTerm,
}: OrderDisputedTableWrapperProps) {
  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center justify-between">
        <OrderDisputedSearch onSearchChange={onSearchChange} initialValue={searchTerm} />
      </div>

      {/* Table */}
      <OrderDisputedTable
        data={orders}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        onPageChange={onPageChange}
      />
    </div>
  );
}
