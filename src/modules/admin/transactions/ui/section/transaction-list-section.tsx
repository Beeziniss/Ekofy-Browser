"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminTransactionsOptions } from "@/gql/options/admin-options";
import { TransactionTable, TransactionFilters } from "../component";
import { PaymentTransactionStatus } from "@/gql/graphql";

export function TransactionListSection() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentTransactionStatus | undefined>(undefined);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, isError } = useQuery({
    ...adminTransactionsOptions(page, pageSize, debouncedSearchTerm, statusFilter),
  });

  const transactions = data?.paymentTransactions?.items ?? [];
  const totalCount = data?.paymentTransactions?.totalCount ?? 0;

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
