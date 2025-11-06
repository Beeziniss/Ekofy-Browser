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
  const { data: categoriesData, isLoading } = useQuery(
    moderatorCategoriesOptions(categoryIds)
  );

  const categories = categoriesData?.categories?.items || [];

  if (isLoading) {
    return (
      <div className="flex items-center gap-1">
        <div className="h-5 w-16 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (!categoryIds || categoryIds.length === 0 || categories.length === 0) {
    return (
      <div className="flex items-center gap-1 text-muted-foreground">
        <FolderOpen className="h-3 w-3" />
        <span className="text-xs">No categories</span>
      </div>
    );
  }

  const displayCategories = categories.slice(0, maxDisplay);
  const remainingCount = categories.length - maxDisplay;

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {displayCategories.map((category) => (
        <Badge 
          key={category.id} 
          variant="secondary"
          className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300"
        >
          {category.name}
        </Badge>
      ))}
      {remainingCount > 0 && (
        <Badge 
          variant="outline"
          className="text-xs px-2 py-0.5"
        >
          +{remainingCount}
        </Badge>
      )}
    </div>
  );
}