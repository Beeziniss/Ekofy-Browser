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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { ReportStatus, ReportRelatedContentType, ReportQueriesQuery } from "@/gql/graphql";
import { REPORT_TYPE_LABELS, CONTENT_TYPE_LABELS } from "@/types/report";
import { UserCheck, Eye, MoreHorizontal, FileCheck } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { moderatorReportsOptions } from "@/gql/options/report-options";

type ReportItem = NonNullable<NonNullable<ReportQueriesQuery["reports"]>["items"]>[0];

// Component to display moderator name
function ModeratorCell({ assignedModeratorId }: { assignedModeratorId?: string | null }) {
  const { data: moderatorData } = useQuery(
    moderatorReportsOptions({ id: { eq: assignedModeratorId || "" } })
  );
  
  const moderator = moderatorData?.items?.[0];
  
  if (!assignedModeratorId) {
    return <span className="text-sm text-muted-foreground">Not assigned</span>;
  }
  
  return (
    <span className="text-sm font-medium">
      {moderator?.fullName || "Loading..."}
    </span>
  );
}

const STATUS_CONFIG: Record<ReportStatus, {
  label: string;
  className: string;
}> = {
  [ReportStatus.Pending]: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700",
  },
  [ReportStatus.UnderReview]: {
    label: "Under Review",
    className: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700",
  },
  [ReportStatus.Approved]: {
    label: "Approved",
    className: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700",
  },
  [ReportStatus.Rejected]: {
    label: "Rejected",
    className: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700",
  },
  [ReportStatus.Dismissed]: {
    label: "Dismissed",
    className: "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800/30 dark:text-gray-400 dark:border-gray-700",
  },
  [ReportStatus.Escalated]: {
    label: "Escalated",
    className: "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-700",
  },
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
            <TableHead>Assigned User</TableHead>
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
                    <div className="text-xs text-muted-foreground">
                      {report.relatedContentType 
                        ? CONTENT_TYPE_LABELS[report.relatedContentType as ReportRelatedContentType] 
                        : "User"
                      }
                    </div>
                  </div>
                </TableCell>
                <TableCell>{report.userReporter?.[0]?.fullName || "N/A"}</TableCell>
                <TableCell>{report.userReported?.[0]?.fullName || "N/A"}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={STATUS_CONFIG[report.status].className}>
                    {STATUS_CONFIG[report.status].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <ModeratorCell assignedModeratorId={report.assignedModeratorId} />
                </TableCell>
                <TableCell>
                  {format(new Date(report.createdAt), "dd/MM/yyyy HH:mm", { locale: vi })}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link href={`/moderator/report-control/${report.id}`} className="flex items-center gap-2 cursor-pointer">
                          <Eye className="h-4 w-4" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      
                      {!report.assignedModeratorId && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onAssignToMe(report.id)}
                            disabled={isAssigning}
                            className="flex items-center gap-2"
                          >
                            <UserCheck className="h-4 w-4" />
                            Assign to Me
                          </DropdownMenuItem>
                        </>
                      )}
                      
                      {report.assignedModeratorId === currentUserId &&
                        report.status !== ReportStatus.Approved &&
                        report.status !== ReportStatus.Rejected && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => onProcess(report.id)}
                              className="flex items-center gap-2"
                            >
                              <FileCheck className="h-4 w-4" />
                              Process Report
                            </DropdownMenuItem>
                          </>
                        )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
