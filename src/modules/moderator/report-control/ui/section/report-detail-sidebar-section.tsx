"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar, User, AlertTriangle } from "lucide-react";
import { ReportDetailQueryQuery } from "@/gql/graphql";

type ReportItem = NonNullable<NonNullable<ReportDetailQueryQuery["reports"]>["items"]>[0];

interface ReportDetailSidebarSectionProps {
  report: ReportItem;
}

export function ReportDetailSidebarSection({ report }: ReportDetailSidebarSectionProps) {
  return (
    <div className="space-y-6">
      {/* Reporter Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5" />
            Reporter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{report.userReporter?.[0]?.fullName || "Unknown"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">User ID</p>
              <p className="font-mono text-sm">{report.reporterId}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reported User Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle className="h-5 w-5" />
            Reported User
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{report.userReported?.[0]?.fullName || "Unknown"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">User ID</p>
              <p className="font-mono text-sm">{report.reportedUserId}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assigned Moderator Card */}
      {report.assignedModeratorId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              Assigned Moderator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Moderator ID</p>
                <p className="font-mono text-sm">{report.assignedModeratorId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Assigned on</p>
                <p className="text-sm">{format(new Date(report.createdAt), "PPP")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5" />
            Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="text-sm font-medium">{format(new Date(report.createdAt), "PPP 'at' p")}</p>
            </div>
            {report.updatedAt && (
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="text-sm font-medium">{format(new Date(report.updatedAt), "PPP 'at' p")}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
