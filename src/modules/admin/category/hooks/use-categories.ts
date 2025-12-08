"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { categoriesQueryOptions } from "@/gql/options/category-options";
import { CategoryFilters } from "@/types/category";
import { SortEnumType } from "@/gql/graphql";

interface UseCategoriesProps {
  pageSize?: number;
}

export function useCategories({ pageSize = 10 }: UseCategoriesProps = {}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<CategoryFilters>({});

  const skip = (currentPage - 1) * pageSize;

  // Build where clause for GraphQL query
  const buildWhereClause = useCallback(() => {
    const where: Record<string, unknown> = {};

    if (filters.searchTerm) {
      where.or = [
        { name: { contains: filters.searchTerm } },
        { slug: { contains: filters.searchTerm } },
        { description: { contains: filters.searchTerm } },
      ];
    }

    if (filters.type) {
      where.type = { eq: filters.type };
    }

    if (filters.isVisible !== undefined) {
      where.isVisible = { eq: filters.isVisible };
    }

    return Object.keys(where).length > 0 ? where : undefined;
  }, [filters]);

  const { data, isLoading, refetch } = useQuery({
    ...categoriesQueryOptions(skip, pageSize, buildWhereClause(), {
      createdAt: SortEnumType.Desc,
    }),
  });

  const categories = data?.items || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleFilterChange = useCallback((newFilters: Partial<CategoryFilters>) => {
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
    categories,
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
