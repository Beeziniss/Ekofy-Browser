"use client";

import { useAdminTransactions } from "../../hooks";
import { TransactionTable, TransactionFilters } from "../components";

export function TransactionListSection() {
  const {
    transactions,
    totalCount,
    isLoading,
    isError,
    page,
    pageSize,
    searchTerm,
    statusFilter,
    setPage,
    setSearchTerm,
    setStatusFilter,
  } = useAdminTransactions();

  return (
    <div className="space-y-4">
      <TransactionFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      <TransactionTable
        transactions={transactions}
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
