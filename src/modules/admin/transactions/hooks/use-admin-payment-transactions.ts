"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminPaymentTransactionsOptions } from "@/gql/options/transaction-options";
import { PaymentTransactionStatus } from "@/gql/graphql";

export function useAdminPaymentTransactions() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentTransactionStatus | undefined>(undefined);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, isError } = useQuery({
    ...adminPaymentTransactionsOptions(page, pageSize, debouncedSearchTerm, statusFilter),
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
