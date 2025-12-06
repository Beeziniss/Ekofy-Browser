"use client";

import { useListenerInvoices } from "../../hooks/use-listener-invoices";
import { InvoiceTable } from "../components/invoice-table";
import { InvoiceFilters } from "../components/invoice-filters";

export function InvoiceListSection() {
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
  } = useListenerInvoices();

  return (
    <div className="space-y-4">
      <InvoiceFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <InvoiceTable
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
