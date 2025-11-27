"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { ReportDetailQueryQuery } from "@/gql/graphql";

type ReportItem = NonNullable<NonNullable<ReportDetailQueryQuery["reports"]>["items"]>[0];

interface ReportDetailSidebarSectionProps {
  report: ReportItem;
}

export function ReportDetailSidebarSection({ report }: ReportDetailSidebarSectionProps) {
  
  // const assignedModerator = moderatorData?.items?.[0];
  return (
    <div className="space-y-4 lg:sticky lg:top-6">
      {/* Reporter Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-base">
            Reporter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Nick Name Reporter</p>
            <p className="font-medium">{report.nicknameReporter || "Unknown"}</p>
          </div>
          <Separator />
          <div>
            <p className="text-xs text-muted-foreground mb-1">Role</p>
            <Badge variant="secondary" className="text-xs">
              {report.userReporter?.[0]?.role || "Unknown"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Reported User Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-base">
            Reported User
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Nick Name Reported</p>
            <p className="font-medium">{report.nicknameReported || "Unknown"}</p>
          </div>
          <Separator />
          <div>
            <p className="text-xs text-muted-foreground mb-1">Role</p>
            <Badge variant="secondary" className="text-xs">
              {report.userReported?.[0]?.role || "Unknown"}
            </Badge>
          </div>
          {report.totalReportsCount && report.totalReportsCount > 0 && (
            <>
              <Separator />
              <div className="bg-orange-50 dark:bg-orange-950/30 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
                <div className="flex items-center gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Reports</p>
                    <p className="text-lg font-bold text-orange-600">{report.totalReportsCount}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Assigned Moderator Card */}
      {report.assignedModeratorId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              Assigned Moderator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Full Name</p>
              <p className="font-medium">
                {report.userAssignedTo?.[0]?.fullName || "Loading..."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-base">
            Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative pb-1">
            <p className="text-[15px] text-muted-foreground mb-1">Created</p>
            <p className="text-sm font-medium">
              {format(new Date(report.createdAt), "PPP")}
            </p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(report.createdAt), "p")}
            </p>
          </div>
          
          {report.updatedAt && (
            <div className="relative pb-3">
              <p className="text-[15px] text-muted-foreground mb-1">Last Updated</p>
              <p className="text-sm font-medium">
                {format(new Date(report.updatedAt), "PPP")}
              </p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(report.updatedAt), "p")}
              </p>
            </div>
          )}

          {report.resolvedAt && (
            <div className="relative pb-3">
              <p className="text-[15px] text-muted-foreground mb-1">Resolved At</p>
              <p className="text-sm font-medium">
                {format(new Date(report.resolvedAt), "PPP")}
              </p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(report.resolvedAt), "p")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
