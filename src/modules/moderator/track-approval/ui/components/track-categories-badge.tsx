"use client";

import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { moderatorCategoriesOptions } from "@/gql/options/moderator-options";
import { FolderOpen } from "lucide-react";

interface TrackCategoriesBadgeProps {
  categoryIds: string[];
  maxDisplay?: number;
}

export function TrackCategoriesBadge({ categoryIds, maxDisplay = 2 }: TrackCategoriesBadgeProps) {
  const { data: categoriesData, isLoading } = useQuery(moderatorCategoriesOptions(categoryIds));

  const categories = categoriesData?.categories?.items || [];

  if (isLoading) {
    return (
      <div className="flex items-center gap-1">
        <div className="bg-muted h-5 w-16 animate-pulse rounded" />
      </div>
    );
  }

  if (!categoryIds || categoryIds.length === 0 || categories.length === 0) {
    return (
      <div className="text-muted-foreground flex items-center gap-1">
        <FolderOpen className="h-3 w-3" />
        <span className="text-xs">No categories</span>
      </div>
    );
  }

  const displayCategories = categories.slice(0, maxDisplay);
  const remainingCount = categories.length - maxDisplay;

  return (
    <div className="flex flex-wrap items-center gap-1">
      {displayCategories.map((category) => (
        <Badge
          key={category.id}
          variant="secondary"
          className="border-blue-200 bg-blue-50 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
        >
          {category.name}
        </Badge>
      ))}
      {remainingCount > 0 && (
        <Badge variant="outline" className="px-2 py-0.5 text-xs">
          +{remainingCount}
        </Badge>
      )}
    </div>
  );
}
