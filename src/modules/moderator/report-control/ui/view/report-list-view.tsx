"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { reportsOptions } from "@/gql/options/report-options";
import { useAuthStore } from "@/store/stores/auth-store";
import { useAssignReportToModerator } from "@/gql/client-mutation-options/report-mutation-options";
import { toast } from "sonner";
import { ReportStatus, ReportRelatedContentType } from "@/gql/graphql";
import { ReportControlLayout } from "../layout/report-control-layout";
import { ReportFiltersSection } from "../section/report-filters-section";
import { ReportTableSection } from "../section/report-table-section";
import { ReportPaginationSection } from "../section/report-pagination-section";
import { ProcessReportDialog } from "../components/process-report-dialog";

export function ReportListView() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "all">("all");
  const [contentTypeFilter, setContentTypeFilter] = useState<ReportRelatedContentType | "all" | "none">("all");
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [selectedReportType, setSelectedReportType] = useState<ReportRelatedContentType | null>(null);
  const [processDialogOpen, setProcessDialogOpen] = useState(false);
  const pageSize = 10;
  const { user } = useAuthStore();
  const assignReport = useAssignReportToModerator();

  // Build filter
  const where = {
    ...(statusFilter !== "all" && { status: { eq: statusFilter } }),
    ...(contentTypeFilter !== "all" && (
      contentTypeFilter === "none" 
        ? { relatedContentType: { eq: null } }
        : { relatedContentType: { eq: contentTypeFilter } }
    )),
    ...(searchTerm.trim() && {
      or: [
        { description: { contains: searchTerm } },
        { userReporter: { some: { fullName: { contains: searchTerm } } } },
        { userReported: { some: { fullName: { contains: searchTerm } } } },
      ],
    }),
  };

  const skip = (page - 1) * pageSize;
  const { data, isLoading, refetch } = useQuery(reportsOptions(skip, pageSize, where));

  const reports = data?.items || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleStatusChange = (value: ReportStatus | "all") => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleContentTypeChange = (value: ReportRelatedContentType | "all" | "none") => {
    setContentTypeFilter(value);
    setPage(1);
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
    const report = reports.find(r => r.id === reportId);
    setSelectedReportId(reportId);
    setSelectedReportType(report?.relatedContentType || null);
    setProcessDialogOpen(true);
  };

  const handleProcessSuccess = () => {
    refetch();
  };

  return (
    <>
      <ReportControlLayout>
        <ReportFiltersSection
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          contentTypeFilter={contentTypeFilter}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
          onContentTypeChange={handleContentTypeChange}
        />

        <ReportTableSection
          reports={reports}
          isLoading={isLoading}
          currentUserId={user?.userId}
          isAssigning={assignReport.isPending}
          onAssignToMe={handleAssignToMe}
          onProcess={handleProcess}
        />

        <ReportPaginationSection
          currentPage={page}
          totalPages={totalPages}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={setPage}
        />
      </ReportControlLayout>

      {selectedReportId && (
        <ProcessReportDialog
          open={processDialogOpen}
          onOpenChange={setProcessDialogOpen}
          reportId={selectedReportId}
          relatedContentType={selectedReportType}
          onSuccess={handleProcessSuccess}
        />
      )}
    </>
  );
}
