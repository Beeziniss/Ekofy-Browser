"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Calendar, User, AlertCircle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { ReportStatusBadge } from "./report-status-badge";
import {
  REPORT_TYPE_LABELS,
  CONTENT_TYPE_LABELS,
} from "@/types/report";
import { ReportType, ReportRelatedContentType, ReportStatus } from "@/gql/graphql";

interface UserReportedData {
  id: string;
  fullName: string;
  role: string;
}

interface TrackData {
  id: string;
  name: string;
}

interface CommentData {
  id: string;
  content: string;
}

interface RequestData {
  id: string;
  title: string;
}

interface ReportItem {
  id: string;
  reportType: ReportType;
  status: ReportStatus;
  relatedContentType?: ReportRelatedContentType | null;
  createdAt: string | number | Date;
  description: string;
  userReported?: UserReportedData[];
  track?: TrackData[];
  comment?: CommentData[];
  request?: RequestData[];
}

interface ReportListItemProps {
  report: ReportItem;
  href: string;
}

export function ReportListItem({ report, href }: ReportListItemProps) {
  const createdAt = new Date(report.createdAt);
  const reportTypeLabel = REPORT_TYPE_LABELS[report.reportType as ReportType];
  const contentTypeLabel = report.relatedContentType
    ? CONTENT_TYPE_LABELS[report.relatedContentType as ReportRelatedContentType]
    : "User";

  const getTargetInfo = () => {
    if (report.track && report.track.length > 0) {
      return `Track: ${report.track[0].name}`;
    }
    if (report.comment && report.comment.length > 0) {
      return `Comment: ${report.comment[0].content.slice(0, 50)}...`;
    }
    if (report.request && report.request.length > 0) {
      return `Request: ${report.request[0].title}`;
    }
    if (report.userReported && report.userReported.length > 0) {
      return `User: ${report.userReported[0].fullName}`;
    }
    return "Unknown content";
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <Badge variant="outline">{reportTypeLabel}</Badge>
              <Badge variant="secondary">{contentTypeLabel}</Badge>
            </div>
            <h3 className="font-medium text-sm text-muted-foreground">
              {getTargetInfo()}
            </h3>
          </div>
          <ReportStatusBadge status={report.status} />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {report.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {report.description}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>
                  {format(createdAt, "dd/MM/yyyy HH:mm", { locale: vi })}
                </span>
              </div>
              {report.userReported && report.userReported.length > 0 && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>Reported: {report.userReported[0].fullName}</span>
                </div>
              )}
            </div>

            <Button asChild size="sm" variant="outline">
              <Link href={href}>
                <Eye className="h-3 w-3 mr-1" />
                Details
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}