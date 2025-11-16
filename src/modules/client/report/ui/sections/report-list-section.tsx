"use client";

import { useState } from "react";
import { useUserReports, usePrefetchUserReports } from "../../hooks";
import { ReportListItem, ReportFilters, ReportEmptyState } from "../components";
import { Button } from "@/components/ui/button";
import { LoaderCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { ReportStatus, ReportType, ReportRelatedContentType } from "@/gql/graphql";

interface ReportListFilters {
  status?: { eq?: ReportStatus };
  reportType?: { eq?: ReportType };
  relatedContentType?: { eq?: ReportRelatedContentType };
  createdAt?: { gte?: string; lte?: string };
  description?: { contains?: string };
}

interface ReportListSectionProps {
  className?: string;
}

export function ReportListSection({ className }: ReportListSectionProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState<ReportListFilters>(
    {}
  );
  const take = 10;
  const skip = currentPage * take;

  const { data, isLoading, error } = useUserReports(skip, take, filters);
  const { prefetchDetail } = usePrefetchUserReports();

  const reports = data?.items || [];
  const hasNextPage = data?.pageInfo.hasNextPage || false;
  const hasPreviousPage = currentPage > 0;
  const totalCount = data?.totalCount || 0;

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (hasPreviousPage) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFiltersChange = (newFilters: ReportListFilters) => {
    setFilters(newFilters);
    setCurrentPage(0); // Reset to first page when filters change
  };

  const handleReportHover = (reportId: string) => {
    prefetchDetail?.(reportId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoaderCircle className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">An error occurred while loading reports.</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <ReportFilters
        onFiltersChange={handleFiltersChange}
        className="mb-6"
      />

      {reports.length === 0 ? (
        <ReportEmptyState />
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {reports.map((report) => (
              <div
                key={report.id}
                onMouseEnter={() => handleReportHover(report.id)}
              >
                <ReportListItem
                  report={report}
                  href={`/reports/${report.id}`}
                />
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {skip + 1} - {Math.min(skip + take, totalCount)} of {totalCount} reports
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={!hasPreviousPage}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              <span className="px-3 py-1 text-sm">
                Page {currentPage + 1}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={!hasNextPage}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}