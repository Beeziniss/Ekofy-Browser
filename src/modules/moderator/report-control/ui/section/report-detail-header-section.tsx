"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileCheck2, Shield, UserCheck } from "lucide-react";
import Link from "next/link";
import { ReportDetailQueryQuery, ReportStatus } from "@/gql/graphql";

type ReportItem = NonNullable<NonNullable<ReportDetailQueryQuery["reports"]>["items"]>[0];

interface ReportDetailHeaderSectionProps {
  report: ReportItem;
  currentUserId?: string;
  isAssigning?: boolean;
  onProcessClick: () => void;
  onAssignClick: () => void;
}

export function ReportDetailHeaderSection({ 
  report, 
  currentUserId,
  isAssigning = false,
  onProcessClick,
  onAssignClick 
}: ReportDetailHeaderSectionProps) {
  // Check if user can process: must be assigned to current user and status is pending/under review
  const canProcess = 
    report.assignedModeratorId === currentUserId &&
    (report.status === ReportStatus.Pending || report.status === ReportStatus.UnderReview);
  
  // Check if report is not assigned yet
  const canAssign = !report.assignedModeratorId;
  
  // Check if already processed
  const isProcessed = report.status === ReportStatus.Approved || report.status === ReportStatus.Rejected;

  return (
    <div className="space-y-4">
      {/* Back Button - Separate */}
      <Link href="/moderator/report-control">
        <Button variant="outline" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Reports
        </Button>
      </Link>

      {/* Report Details Header */}
      <div className="rounded-lg border bg-card p-6 mt-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold">Report Details</h1>
              <p className="text-sm text-muted-foreground">
                Review and process this report
              </p>
            </div>
          </div>
          
          {/* Show Assign button if report is not assigned yet */}
          {canAssign && (
            <Button 
              onClick={onAssignClick}
              size="lg"
              variant="outline"
              className="gap-2"
              disabled={isAssigning}
            >
              <UserCheck className="h-5 w-5" />
              {isAssigning ? "Assigning..." : "Assign to Me"}
            </Button>
          )}
          
          {/* Show Process button if assigned to current user and not processed yet */}
          {canProcess && !isProcessed && (
            <Button 
              onClick={onProcessClick}
              size="lg"
              className="gap-2"
            >
              <FileCheck2 className="h-5 w-5" />
              Process Report
            </Button>
          )}
          
          {/* Show badge if assigned to someone else */}
          {!canAssign && !canProcess && !isProcessed && (
            <Badge 
              variant="outline" 
              className="text-sm px-4 py-2"
            >
              Assigned to Another Moderator
            </Badge>
          )}
          
          {/* Show badge if already processed */}
          {isProcessed && (
            <Badge 
              variant="outline" 
              className="text-sm px-4 py-2"
            >
              Already Processed
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
