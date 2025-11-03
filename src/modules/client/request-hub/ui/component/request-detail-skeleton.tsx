"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface RequestDetailSkeletonProps {
  onBack: () => void;
}

export function RequestDetailSkeleton({ onBack }: RequestDetailSkeletonProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Requests
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Bookmark */}
            <div className="flex items-start justify-between">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-8 w-8" />
            </div>

            {/* Author and Post Info */}
            <div className="flex items-center space-x-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div>
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>

            {/* Description Card */}
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-24 mb-4" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>

            {/* Requirements Card */}
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-start">
                      <Skeleton className="w-2 h-2 rounded-full mt-2 mr-3" />
                      <Skeleton className="h-4 flex-1" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skills Card */}
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-28 mb-4" />
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-6 w-16" />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* About Client Card */}
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-36 mb-4" />
                <div className="grid grid-cols-2 gap-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i}>
                      <Skeleton className="h-3 w-16 mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-8 w-32 mb-4" />

                <div className="space-y-3 mb-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}