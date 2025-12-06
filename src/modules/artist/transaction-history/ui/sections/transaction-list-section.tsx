"use client";

import { useArtistTransactionHistory } from "../../hooks/use-artist-transaction-history";
import { TransactionTable } from "../components/transaction-table";
import { TransactionFilters } from "../components/transaction-filters";

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
    sortBy,
    setPage,
    setSearchTerm,
    setStatusFilter,
    setSortBy,
  } = useArtistTransactionHistory();

  return (
    <div className="space-y-4">
      <TransactionFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
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
