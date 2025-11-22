"use client";

import { useState } from "react";
import { ProcessReportDialog } from "../components/process-report-dialog";
import { RestoreUserDialog } from "../components/restore-user-dialog";
import { ReportDetailLayout } from "../layout/report-detail-layout";
import { ReportDetailHeaderSection } from "../section/report-detail-header-section";
import { ReportDetailInfoSection } from "../section/report-detail-info-section";
import { ReportDetailSidebarSection } from "../section/report-detail-sidebar-section";
import { useQuery } from "@tanstack/react-query";
import { reportDetailOptions } from "@/gql/options/report-options";
import { notFound } from "next/navigation";
import MainLoader from "@/components/main-loader";
import { useAuthStore } from "@/store/stores/auth-store";
import { useAssignReportToModerator } from "@/gql/client-mutation-options/report-mutation-options";
import { toast } from "sonner";

interface ReportDetailViewProps {
  reportId: string;
}

export function ReportDetailView({ reportId }: ReportDetailViewProps) {
  const [processDialogOpen, setProcessDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const { user } = useAuthStore();
  const assignReport = useAssignReportToModerator();

  // Fetch report detail on client-side with authentication
  const { data: report, isLoading, isError, refetch } = useQuery(reportDetailOptions(reportId));

  // Loading state
  if (isLoading) {
    return <MainLoader />;
  }

  // Error or not found
  if (isError || !report) {
    notFound();
  }

  // Handle assign to me
  const handleAssignToMe = async () => {
    if (!user?.userId) {
      toast.error("User information not found");
      return;
    }

    try {
      await assignReport.mutateAsync({ reportId: report.id, moderatorId: user.userId });
      toast.success("Report assigned successfully");
      refetch(); // Refetch to update the UI
    } catch (error) {
      console.error("Error assigning report:", error);
      toast.error("Failed to assign report");
    }
  };

  // Handle process click with validation
  const handleProcessClick = () => {
    // Check if report is assigned to current user
    if (report.assignedModeratorId !== user?.userId) {
      toast.warning("You can only process reports assigned to you. Please assign this report to yourself first.");
      return;
    }
    
    setProcessDialogOpen(true);
  };

  // Handle process success
  const handleProcessSuccess = () => {
    refetch(); // Refetch to update the UI after processing
  };

  // Handle restore user
  const handleRestoreUser = () => {
    setRestoreDialogOpen(true);
  };

  const handleRestoreSuccess = () => {
    refetch(); // Refetch to update the UI after restoring
  };

  return (
    <>
      <ReportDetailLayout
        header={
          <ReportDetailHeaderSection
            report={report}
            currentUserId={user?.userId}
            isAssigning={assignReport.isPending}
            onProcessClick={handleProcessClick}
            onAssignClick={handleAssignToMe}
            onRestoreClick={handleRestoreUser}
            isRestoring={false}
          />
        }
        mainContent={<ReportDetailInfoSection report={report} />}
        sidebar={<ReportDetailSidebarSection report={report} />}
      />

      {/* Process Report Dialog */}
      <ProcessReportDialog
        reportId={report.id}
        relatedContentType={report.relatedContentType}
        open={processDialogOpen}
        onOpenChange={setProcessDialogOpen}
        onSuccess={handleProcessSuccess}
      />

      {/* Restore User Dialog */}
      <RestoreUserDialog
        reportId={report.id}
        reportedUserName={report.nicknameReported}
        open={restoreDialogOpen}
        onOpenChange={setRestoreDialogOpen}
        onSuccess={handleRestoreSuccess}
      />
    </>
  );
}
