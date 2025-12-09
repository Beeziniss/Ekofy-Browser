"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Category } from "@/types/category";
import { formatDate } from "@/utils/format-date";
import { Calendar, Hash, Tag, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryDetailCardProps {
  category: Category | null | undefined;
  isLoading: boolean;
}

export function CategoryDetailCard({ category, isLoading }: CategoryDetailCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-64" />
        </CardHeader>
        <CardContent className="space-y-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!category) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-12">
          <div className="text-center">
            <h3 className="text-lg font-semibold">Category not found</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              The category you&apos;re looking for doesn&apos;t exist or has been deleted.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl">{category.name}</CardTitle>
            </div>
            <Badge
              variant={category.isVisible ? "default" : "secondary"}
              className="flex items-center gap-2"
            >
              {category.isVisible ? (
                <>
                  Visible
                </>
              ) : (
                <>
                  Hidden
                </>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Tag className="h-4 w-4" />
                Type
              </div>
              <Badge variant="outline" className="text-base">
                {category.type}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Hash className="h-4 w-4" />
                Popularity
              </div>
              <div className="text-2xl font-semibold">{category.popularity}</div>
            </div>
          </div>

          {category.description && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <FileText className="h-4 w-4" />
                Description
              </div>
              <p className="rounded-lg bg-muted p-4 text-sm leading-relaxed">
                {category.description}
              </p>
            </div>
          )}

          {category.aliases && category.aliases.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Tag className="h-4 w-4" />
                Aliases
              </div>
              <div className="flex flex-wrap gap-2">
                {category.aliases.map((alias, index) => (
                  <Badge key={index} variant="secondary">
                    {alias}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-4 pt-4 border-t md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Created Date
              </div>
              <div className="text-sm">{formatDate(category.createdAt)}</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Last Updated
              </div>
              <div className="text-sm">{formatDate(category.updatedAt)}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
