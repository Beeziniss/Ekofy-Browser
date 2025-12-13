"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminRefundTransactionsOptions } from "@/gql/options/transaction-options";
import { RefundTransactionStatus } from "@/gql/graphql";

export function useAdminRefundTransactions() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<RefundTransactionStatus | undefined>(undefined);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, isError } = useQuery({
    ...adminRefundTransactionsOptions(page, pageSize, debouncedSearchTerm, statusFilter),
  });

  const transactions = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;
  const pageInfo = data?.pageInfo;

  return {
    transactions,
    totalCount,
    pageInfo,
    isLoading,
    isError,
    page,
    pageSize,
    setPage,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    hasNextPage: pageInfo?.hasNextPage ?? false,
    hasPreviousPage: pageInfo?.hasPreviousPage ?? false,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}
