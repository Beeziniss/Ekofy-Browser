"use client";

import { useListenerRefundHistory } from "../../hooks/use-listener-refund-history";
import { RefundTable } from "../components/refund-table";
import { RefundFilters } from "../components/refund-filters";

export function RefundListSection() {
  const {
    refunds,
    totalCount,
    isLoading,
    isError,
    page,
    pageSize,
    searchTerm,
    statusFilter,
    sortBy,
    setPage,
    setSearchTerm,
    setStatusFilter,
    setSortBy,
  } = useListenerRefundHistory();

  return (
    <div className="space-y-4">
      <RefundFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <RefundTable
        refunds={refunds}
        isLoading={isLoading}
        isError={isError}
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={setPage}
      />
    </div>
  );
}
