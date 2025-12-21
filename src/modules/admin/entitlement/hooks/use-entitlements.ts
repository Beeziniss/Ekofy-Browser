"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { entitlementsQueryOptions } from "@/gql/options/entitlements-options";
import { EntitlementFilters } from "@/types/entitlement";
import { SortEnumType } from "@/gql/graphql";

interface UseEntitlementsProps {
  pageSize?: number;
}

export function useEntitlements({ pageSize = 10 }: UseEntitlementsProps = {}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<EntitlementFilters>({});

  const skip = (currentPage - 1) * pageSize;

  // Build where clause for GraphQL query
  const buildWhereClause = useCallback(() => {
    const where: Record<string, unknown> = {};

    if (filters.searchTerm) {
      where.or = [
        { name: { contains: filters.searchTerm } },
        { code: { contains: filters.searchTerm } },
        { description: { contains: filters.searchTerm } },
      ];
    }

    if (filters.isActive !== undefined) {
      where.isActive = { eq: filters.isActive };
    }

    if (filters.valueType) {
      where.valueType = { eq: filters.valueType };
    }

    return Object.keys(where).length > 0 ? where : undefined;
  }, [filters]);

  const { data, isLoading, refetch } = useQuery({
    ...entitlementsQueryOptions(skip, pageSize, buildWhereClause(), [
      { createdAt: SortEnumType.Desc },
    ]),
  });

  const entitlements = data?.items || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleFilterChange = useCallback((newFilters: Partial<EntitlementFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  const handleSearch = useCallback((searchTerm: string) => {
    setFilters((prev) => ({ ...prev, searchTerm }));
    setCurrentPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({});
    setCurrentPage(1);
  }, []);

  return {
    entitlements,
    totalCount,
    totalPages,
    currentPage,
    pageSize,
    isLoading,
    filters,
    handlePageChange,
    handleFilterChange,
    handleSearch,
    resetFilters,
    refetch,
  };
}

