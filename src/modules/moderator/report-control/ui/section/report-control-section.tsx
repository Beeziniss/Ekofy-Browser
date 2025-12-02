"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { reportsOptions } from "@/gql/options/report-options";
import { useAuthStore } from "@/store/stores/auth-store";
import { useAssignReportToModerator } from "@/gql/client-mutation-options/report-mutation-options";
import { toast } from "sonner";
import { ReportStatus, ReportRelatedContentType, ReportType } from "@/gql/graphql";
import { ReportControlTable } from "../components/report-control-table";
import { ProcessReportDialog } from "../components/process-report-dialog";
import { RestoreUserDialog } from "../components/restore-user-dialog";
import { RestoreContentDialog } from "../components/restore-content-dialog";
import { ReportFiltersSection } from "./report-filters-section";
import { useRouter, useSearchParams } from "next/navigation";

export function ReportControlSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "all">((searchParams.get("status") as ReportStatus) || "all");
  const [contentTypeFilter, setContentTypeFilter] = useState<ReportRelatedContentType | "all" | "none">((searchParams.get("contentType") as ReportRelatedContentType | "none") || "all");
  const [reportTypeFilter, setReportTypeFilter] = useState<ReportType | "all">((searchParams.get("reportType") as ReportType) || "all");
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [selectedReportType, setSelectedReportType] = useState<ReportRelatedContentType | null>(null);
  const [processDialogOpen, setProcessDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [restoreContentDialogOpen, setRestoreContentDialogOpen] = useState(false);
  const [selectedReportForRestore, setSelectedReportForRestore] = useState<{ id: string; userName?: string } | null>(null);
  const [selectedReportForRestoreContent, setSelectedReportForRestoreContent] = useState<{ id: string; contentName?: string; contentType?: string } | null>(null);
  
  const pageSize = 10;
  const { user } = useAuthStore();
  const assignReport = useAssignReportToModerator();

  // Sync URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set("page", currentPage.toString());
    if (searchTerm) params.set("search", searchTerm);
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (contentTypeFilter !== "all") params.set("contentType", contentTypeFilter);
    if (reportTypeFilter !== "all") params.set("reportType", reportTypeFilter);
    
    const queryString = params.toString();
    router.replace(`/moderator/report-control${queryString ? `?${queryString}` : ""}`, { scroll: false });
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
  const { data, isLoading, error, refetch } = useQuery(reportsOptions(skip, pageSize, where));

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

  const handleAssignToMe = async (reportId: string) => {
    if (!user?.userId) {
      toast.error("User information not found");
      return;
    }

    try {
      await assignReport.mutateAsync({ reportId, moderatorId: user.userId });
      toast.success("Report assigned successfully");
      refetch();
    } catch (error) {
      console.error("Error assigning report:", error);
      toast.error("Failed to assign report");
    }
  };

  const handleProcess = (reportId: string) => {
    const report = filteredReports.find(r => r.id === reportId);
    setSelectedReportId(reportId);
    setSelectedReportType(report?.relatedContentType || null);
    setProcessDialogOpen(true);
  };

  const handleProcessSuccess = () => {
    refetch();
  };

  const handleRestoreUser = async (reportId: string) => {
    const report = filteredReports.find(r => r.id === reportId);
    setSelectedReportForRestore({
      id: reportId,
      userName: report?.nicknameReported || undefined
    });
    setRestoreDialogOpen(true);
  };

  const handleRestoreSuccess = () => {
    refetch();
    setSelectedReportForRestore(null);
  };

  const handleRestoreContent = async (reportId: string) => {
    const report = filteredReports.find(r => r.id === reportId);
    setSelectedReportForRestoreContent({
      id: reportId,
      contentName: report?.track?.[0]?.name || undefined,
      contentType: report?.relatedContentType || undefined
    });
    setRestoreContentDialogOpen(true);
  };

  const handleRestoreContentSuccess = () => {
    refetch();
    setSelectedReportForRestoreContent(null);
  };

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center">Loading Data...</div>;
  }
  
  if (error) {
    return <div className="text-red-500">Error loading data: {error.message}</div>;
  }

  return (
    <>
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
        
        <ReportControlTable
          data={filteredReports}
          totalCount={totalCount}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          currentUserId={user?.userId}
          isAssigning={assignReport.isPending}
          onAssignToMe={handleAssignToMe}
          onProcess={handleProcess}
          onRestoreUser={handleRestoreUser}
          onRestoreContent={handleRestoreContent}
          isLoading={isLoading}
          error={error}
        />
      </div>

      {selectedReportId && (
        <ProcessReportDialog
          open={processDialogOpen}
          onOpenChange={setProcessDialogOpen}
          reportId={selectedReportId}
          relatedContentType={selectedReportType}
          onSuccess={handleProcessSuccess}
        />
      )}

      {selectedReportForRestore && (
        <RestoreUserDialog
          open={restoreDialogOpen}
          onOpenChange={setRestoreDialogOpen}
          reportId={selectedReportForRestore.id}
          reportedUserName={selectedReportForRestore.userName}
          onSuccess={handleRestoreSuccess}
        />
      )}

      {selectedReportForRestoreContent && (
        <RestoreContentDialog
          open={restoreContentDialogOpen}
          onOpenChange={setRestoreContentDialogOpen}
          reportId={selectedReportForRestoreContent.id}
          contentName={selectedReportForRestoreContent.contentName}
          contentType={selectedReportForRestoreContent.contentType}
          onSuccess={handleRestoreContentSuccess}
        />
      )}
    </>
  );
}
