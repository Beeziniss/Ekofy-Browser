"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X, Filter } from "lucide-react";
import {
  ReportStatus,
  ReportType,
  ReportRelatedContentType,
} from "@/gql/graphql";
import {
  REPORT_TYPE_LABELS,
  CONTENT_TYPE_LABELS,
} from "@/types/report";

interface ReportFiltersState {
  status?: { eq?: ReportStatus };
  reportType?: { eq?: ReportType };
  relatedContentType?: { eq?: ReportRelatedContentType };
  createdAt?: { gte?: string; lte?: string };
  description?: { contains?: string };
}

interface ReportFiltersProps {
  onFiltersChange: (filters: ReportFiltersState) => void;
  className?: string;
}

export function ReportFilters({ onFiltersChange, className }: ReportFiltersProps) {
  const [filters, setFilters] = useState<ReportFiltersState>(
    {}
  );

  const updateFilter = <K extends keyof ReportFiltersState>(
    key: K,
    value: string | null
  ) => {
    const newFilters = {
      ...filters,
      [key]: value && value !== "ALL" ? { eq: value } : undefined,
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {};
    setFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const hasActiveFilters = Object.values(filters).some(
    (filter) => filter !== undefined
  );

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-6 px-2"
            >
              <X className="h-3 w-3 mr-1" />
              Clear filters
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              value={filters.status?.eq || "ALL"}
              onValueChange={(value) => updateFilter("status", value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value={ReportStatus.Pending}>Pending</SelectItem>
                <SelectItem value={ReportStatus.UnderReview}>
                  Under Review
                </SelectItem>
                <SelectItem value={ReportStatus.Approved}>
                  Approved
                </SelectItem>
                <SelectItem value={ReportStatus.Restored}>
                  Restored
                </SelectItem>
                <SelectItem value={ReportStatus.Rejected}>
                  Rejected
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Violation Type</label>
            <Select
              value={filters.reportType?.eq || "ALL"}
              onValueChange={(value) => updateFilter("reportType", value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All types</SelectItem>
                {Object.entries(REPORT_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Content Type</label>
            <Select
              value={filters.relatedContentType?.eq || "ALL"}
              onValueChange={(value) =>
                updateFilter("relatedContentType", value || null)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All content" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All content</SelectItem>
                {Object.entries(CONTENT_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}