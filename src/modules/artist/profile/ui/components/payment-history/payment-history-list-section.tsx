"use client";

import { useArtistPaymentHistory } from "../../../hooks/use-artist-payment-history";
import { ArtistPaymentHistoryTable } from "./payment-history-table";
import { ArtistPaymentHistoryFilters } from "./payment-history-filters";

export function ArtistPaymentHistoryListSection() {
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
  } = useArtistPaymentHistory();

  return (
    <div className="space-y-6">
      <ArtistPaymentHistoryFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <ArtistPaymentHistoryTable
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
