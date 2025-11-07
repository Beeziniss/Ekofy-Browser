"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { moderatorCategoriesOptions } from "@/gql/options/moderator-options";
import { FolderOpen, Tag } from "lucide-react";

interface TrackCategoriesCardProps {
  categoryIds: string[];
}

export function TrackCategoriesCard({ categoryIds }: TrackCategoriesCardProps) {
  const { data: categoriesData, isLoading, error } = useQuery(moderatorCategoriesOptions(categoryIds));

  const categories = categoriesData?.categories?.items || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-muted h-6 w-20 animate-pulse rounded-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Failed to load categories</p>
        </CardContent>
      </Card>
    );
  }

  if (!categoryIds || categoryIds.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground flex items-center gap-2 text-sm">
            <Tag className="h-4 w-4" />
            No categories assigned
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5" />
          Categories
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge key={category.id} variant="outline" className="h-10 w-16 text-[14px]">
              {category.name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
