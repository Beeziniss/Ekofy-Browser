"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminTransactionsOptions } from "@/gql/options/admin-options";
import { PaymentTransactionStatus } from "@/gql/graphql";

export function useAdminTransactions() {
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

  // Fetch transactions with current filters
  const { data, isLoading, isError } = useQuery({
    ...adminTransactionsOptions(page, pageSize, debouncedSearchTerm, statusFilter),
  });

  // Extract transactions and metadata
  // Handle both regular query (paymentTransactions) and search query (searchPaymentTransactions)
  const transactionData = (data as any)?.searchPaymentTransactions || (data as any)?.paymentTransactions;
  const transactions = transactionData?.items ?? [];
  const totalCount = transactionData?.totalCount ?? 0;
  const pageInfo = transactionData?.pageInfo;

  return {
    // Data
    transactions,
    totalCount,
    pageInfo,
    
    // Loading states
    isLoading,
    isError,
    
    // Pagination
    page,
    pageSize,
    setPage,
    
    // Filters
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    
    // Computed
    hasNextPage: pageInfo?.hasNextPage ?? false,
    hasPreviousPage: pageInfo?.hasPreviousPage ?? false,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}
