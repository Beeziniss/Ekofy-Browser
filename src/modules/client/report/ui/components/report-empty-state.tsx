"use client";

import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface ReportEmptyStateProps {
  title?: string;
  description?: string;
}

export function ReportEmptyState({
  title = "No reports yet",
  description = "You haven't created any reports yet. When you report violating content, it will appear here.",
}: ReportEmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="rounded-full bg-muted p-6">
            <AlertCircle className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}