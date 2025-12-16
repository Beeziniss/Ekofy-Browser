"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { reportsOptions } from "@/gql/options/report-options";
import { ReportStatus, ReportRelatedContentType, ReportType } from "@/gql/graphql";
import { ReportTable } from "@/modules/admin/report/ui/components/report-table";
import { ReportFiltersSection } from "./report-filters-section";
import { useRouter, useSearchParams } from "next/navigation";

export function ReportSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "all">((searchParams.get("status") as ReportStatus) || "all");
  const [contentTypeFilter, setContentTypeFilter] = useState<ReportRelatedContentType | "all" | "none">((searchParams.get("contentType") as ReportRelatedContentType | "none") || "all");
  const [reportTypeFilter, setReportTypeFilter] = useState<ReportType | "all">((searchParams.get("reportType") as ReportType) || "all");
  
  const pageSize = 10;

  // Sync URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set("page", currentPage.toString());
    if (searchTerm) params.set("search", searchTerm);
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (contentTypeFilter !== "all") params.set("contentType", contentTypeFilter);
    if (reportTypeFilter !== "all") params.set("reportType", reportTypeFilter);
    
    const queryString = params.toString();
    router.replace(`/admin/report${queryString ? `?${queryString}` : ""}`, { scroll: false });
  }, [currentPage, searchTerm, statusFilter, contentTypeFilter, reportTypeFilter, router]);

  // Build filter
  const where = {
    ...(statusFilter !== "all" && { status: { eq: statusFilter } }),
    ...(contentTypeFilter !== "all" && (
      contentTypeFilter === "none" 
        ? { relatedContentType: { eq: null } }
        : { relatedContentType: { eq: contentTypeFilter } }
    )),
    ...(reportTypeFilter !== "all" && { reportType: { eq: reportTypeFilter } }),
  };

  const skip = (currentPage - 1) * pageSize;
  const { data, isLoading, error } = useQuery(reportsOptions(skip, pageSize, where));

  const reports = data?.items || [];
  
  // Client-side filtering for search term
  const filteredReports = searchTerm.trim() 
    ? reports.filter(report => {
        const searchLower = searchTerm.toLowerCase();
        const reporterName = report.nicknameReporter?.toLowerCase() || '';
        const reportedName = report.nicknameReported?.toLowerCase() || '';
        return reporterName.includes(searchLower) || reportedName.includes(searchLower);
      })
    : reports;
  
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: ReportStatus | "all") => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleContentTypeChange = (value: ReportRelatedContentType | "all" | "none") => {
    setContentTypeFilter(value);
    setCurrentPage(1);
  };

  const handleReportTypeChange = (value: ReportType | "all") => {
    setReportTypeFilter(value);
    setCurrentPage(1);
  };

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center">Loading Data...</div>;
  }
  
  if (error) {
    return <div className="text-red-500">Error loading data: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <ReportFiltersSection
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        contentTypeFilter={contentTypeFilter}
        reportTypeFilter={reportTypeFilter}
        onSearchChange={handleSearch}
        onStatusChange={handleStatusChange}
        onContentTypeChange={handleContentTypeChange}
        onReportTypeChange={handleReportTypeChange}
      />
      
      <ReportTable
        data={filteredReports}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
