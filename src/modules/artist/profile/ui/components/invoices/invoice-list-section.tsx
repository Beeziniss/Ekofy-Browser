"use client";

import { useArtistInvoices } from "../../../hooks/use-artist-invoices";
import { ArtistInvoiceTable } from "./invoice-table";
import { ArtistInvoiceFilters } from "./invoice-filters";

export function ArtistInvoiceListSection() {
  const {
    invoices,
    totalCount,
    isLoading,
    isError,
    page,
    pageSize,
    searchTerm,
    sortBy,
    setPage,
    setSearchTerm,
    setSortBy,
  } = useArtistInvoices();

  return (
    <div className="space-y-6">
      <ArtistInvoiceFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <ArtistInvoiceTable
        invoices={invoices}
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
