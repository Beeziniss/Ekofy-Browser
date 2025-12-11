"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { listenerRefundTransactionsOptions } from "@/gql/options/listener-refund-options";
import { useAuthStore } from "@/store";
import { RefundTransactionStatus } from "@/gql/graphql";

export function useListenerRefundHistory() {
  const { user } = useAuthStore();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<RefundTransactionStatus | undefined>(undefined);
  const [sortBy, setSortBy] = useState("date-desc");
  const pageSize = 10;

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1); // Reset to page 1 when search changes
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, isError } = useQuery({
    ...listenerRefundTransactionsOptions({
      userId: user?.userId || "",
      page,
      pageSize,
    }),
    enabled: !!user?.userId,
  });

  const totalCount = data?.refundTransactions?.totalCount || 0;

  // Client-side filtering and sorting
  const filteredAndSortedItems = useMemo(() => {
    const items = data?.refundTransactions?.items || [];
    
    // Filter by search term
    let result = debouncedSearchTerm
      ? items.filter((transaction) => {
          const searchLower = debouncedSearchTerm.toLowerCase();
          return (
            transaction?.id?.toLowerCase().includes(searchLower) ||
            transaction?.amount?.toString().includes(searchLower) ||
            transaction?.stripePaymentId?.toLowerCase().includes(searchLower)
          );
        })
      : [...items];

    // Filter by status
    if (statusFilter) {
      result = result.filter(transaction => transaction?.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime();
        case "date-asc":
          return new Date(a?.createdAt || 0).getTime() - new Date(b?.createdAt || 0).getTime();
        case "amount-desc":
          return (b?.amount || 0) - (a?.amount || 0);
        case "amount-asc":
          return (a?.amount || 0) - (b?.amount || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [data?.refundTransactions?.items, debouncedSearchTerm, statusFilter, sortBy]);

  return {
    refunds: filteredAndSortedItems,
    totalCount: debouncedSearchTerm || statusFilter ? filteredAndSortedItems.length : totalCount,
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
  };
}
