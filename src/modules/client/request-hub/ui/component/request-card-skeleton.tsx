"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function RequestCardSkeleton() {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {/* Header with Avatar and Save Button */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div>
              <Skeleton className="mb-1 h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="h-8 w-8" />
        </div>

        {/* Title */}
        <Skeleton className="mb-3 h-6 w-3/4" />

        {/* Description */}
        <div className="mb-4 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Tags */}
        <div className="mb-4 flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-14" />
        </div>

        {/* Budget, Category, Deadline */}
        <div className="mb-4 grid grid-cols-3 gap-4">
          <div>
            <Skeleton className="mb-1 h-3 w-12" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div>
            <Skeleton className="mb-1 h-3 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div>
            <Skeleton className="mb-1 h-3 w-14" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <Skeleton className="h-4 w-24" />
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function RequestListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <RequestCardSkeleton key={i} />
      ))}
    </div>
  );
}
