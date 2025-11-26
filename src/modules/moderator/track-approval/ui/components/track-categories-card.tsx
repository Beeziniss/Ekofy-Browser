"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { moderatorCategoriesOptions } from "@/gql/options/moderator-options";
import { FolderOpen, Tag } from "lucide-react";
import { Separator } from "@radix-ui/react-select";

interface TrackCategoriesCardProps {
  categoryIds: string[];
  tags?: string[];
}

export function TrackCategoriesCard({ categoryIds, tags }: TrackCategoriesCardProps) {
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
          Categories & Tags
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Categories */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Categories</h4>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge key={category.id} variant="outline" className="h-8 text-sm">
                {category.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <>
          <Separator />
          <div className="space-y-2">
            <h4 className="flex items-center gap-2 font-medium text-sm">
              <Tag className="h-4 w-4" />
              Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="h-8 text-sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
