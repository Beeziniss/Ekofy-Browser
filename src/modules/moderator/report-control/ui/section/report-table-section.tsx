"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { ReportStatus, ReportAction, ReportRelatedContentType, ReportQueriesQuery } from "@/gql/graphql";
import { REPORT_TYPE_LABELS, CONTENT_TYPE_LABELS } from "@/types/report";
import { UserCheck, Eye } from "lucide-react";
import Link from "next/link";

type ReportItem = NonNullable<NonNullable<ReportQueriesQuery["reports"]>["items"]>[0];

const STATUS_VARIANTS: Record<ReportStatus, "default" | "secondary" | "destructive" | "outline"> = {
  [ReportStatus.Pending]: "outline",
  [ReportStatus.UnderReview]: "secondary",
  [ReportStatus.Approved]: "default",
  [ReportStatus.Rejected]: "destructive",
  [ReportStatus.Dismissed]: "outline",
  [ReportStatus.Escalated]: "destructive",
};

const STATUS_LABELS: Record<ReportStatus, string> = {
  [ReportStatus.Pending]: "Pending",
  [ReportStatus.UnderReview]: "Under Review",
  [ReportStatus.Approved]: "Approved",
  [ReportStatus.Rejected]: "Rejected",
  [ReportStatus.Dismissed]: "Dismissed",
  [ReportStatus.Escalated]: "Escalated",
};

const ACTION_LABELS: Record<ReportAction, string> = {
  [ReportAction.NoAction]: "No Action",
  [ReportAction.Warning]: "Warning",
  [ReportAction.Suspended]: "Suspended",
  [ReportAction.EntitlementRestriction]: "Entitlement Restriction",
  [ReportAction.ContentRemoval]: "Content Removal",
  [ReportAction.PermanentBan]: "Permanent Ban",
};

interface ReportTableSectionProps {
  reports: ReportItem[];
  isLoading: boolean;
  currentUserId?: string;
  isAssigning: boolean;
  onAssignToMe: (reportId: string) => void;
  onProcess: (reportId: string) => void;
}

export function ReportTableSection({
  reports,
  isLoading,
  currentUserId,
  isAssigning,
  onAssignToMe,
  onProcess,
}: ReportTableSectionProps) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Reporter</TableHead>
            <TableHead>Reported User</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                Loading...
              </TableCell>
            </TableRow>
          ) : reports.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No reports found
              </TableCell>
            </TableRow>
          ) : (
            reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>
                  <div className="space-y-1">
                    <Badge variant="outline">{REPORT_TYPE_LABELS[report.reportType]}</Badge>
                    {report.relatedContentType && (
                      <div className="text-xs text-muted-foreground">
                        {CONTENT_TYPE_LABELS[report.relatedContentType as ReportRelatedContentType]}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{report.userReporter?.[0]?.fullName || "N/A"}</TableCell>
                <TableCell>{report.userReported?.[0]?.fullName || "N/A"}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANTS[report.status]}>
                    {STATUS_LABELS[report.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  {report.actionTaken ? (
                    <span className="text-sm">{ACTION_LABELS[report.actionTaken]}</span>
                  ) : (
                    <span className="text-sm text-muted-foreground">Not processed</span>
                  )}
                </TableCell>
                <TableCell>
                  {format(new Date(report.createdAt), "dd/MM/yyyy HH:mm", { locale: vi })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/moderator/report-control/${report.id}`}>
                      <Button size="sm" variant="outline" className="gap-1">
                        <Eye className="h-3 w-3" />
                        View
                      </Button>
                    </Link>
                    {!report.assignedModeratorId && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onAssignToMe(report.id)}
                        disabled={isAssigning}
                        className="gap-1"
                      >
                        <UserCheck className="h-3 w-3" />
                        Assign
                      </Button>
                    )}
                    {report.assignedModeratorId === currentUserId &&
                      report.status !== ReportStatus.Approved &&
                      report.status !== ReportStatus.Rejected && (
                        <Button size="sm" onClick={() => onProcess(report.id)}>
                          Process
                        </Button>
                      )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
