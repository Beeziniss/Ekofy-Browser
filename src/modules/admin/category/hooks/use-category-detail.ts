"use client";

import { useQuery } from "@tanstack/react-query";
import { categoryDetailQueryOptions } from "@/gql/options/category-options";

export function useCategoryDetail(categoryId: string) {
  const { data: category, isLoading, refetch } = useQuery({
    ...categoryDetailQueryOptions(categoryId),
    enabled: !!categoryId,
  });

  return {
    category,
    isLoading,
    refetch,
  };
}
