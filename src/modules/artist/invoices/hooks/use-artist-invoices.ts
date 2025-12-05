"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { artistInvoicesOptions } from "@/gql/options/artist-activity-options";
import { useAuthStore } from "@/store";

export function useArtistInvoices() {
  const { user } = useAuthStore();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
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
    ...artistInvoicesOptions({
      userId: user?.userId || "",
      page,
      pageSize,
    }),
    enabled: !!user?.userId,
  });

  const totalCount = data?.invoices?.totalCount || 0;

  // Client-side filtering and sorting
  const filteredAndSortedItems = useMemo(() => {
    const items = data?.invoices?.items || [];
    
    // Filter
    const result = debouncedSearchTerm
      ? items.filter((invoice) => {
          const searchLower = debouncedSearchTerm.toLowerCase();
          return (
            invoice?.id?.toLowerCase().includes(searchLower) ||
            invoice?.email?.toLowerCase().includes(searchLower) ||
            invoice?.to?.toLowerCase().includes(searchLower) ||
            invoice?.from?.toLowerCase().includes(searchLower) ||
            invoice?.amount?.toString().includes(searchLower)
          );
        })
      : [...items];

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b?.paidAt || 0).getTime() - new Date(a?.paidAt || 0).getTime();
        case "date-asc":
          return new Date(a?.paidAt || 0).getTime() - new Date(b?.paidAt || 0).getTime();
        case "amount-desc":
          return (b?.amount || 0) - (a?.amount || 0);
        case "amount-asc":
          return (a?.amount || 0) - (b?.amount || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [data?.invoices?.items, debouncedSearchTerm, sortBy]);

  return {
    invoices: filteredAndSortedItems,
    totalCount: debouncedSearchTerm ? filteredAndSortedItems.length : totalCount,
    isLoading,
    isError,
    page,
    pageSize,
    searchTerm,
    sortBy,
    setPage,
    setSearchTerm,
    setSortBy,
  };
}
