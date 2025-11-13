"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { FileText, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { ReportDetailQueryQuery, ReportStatus, ReportType, ReportRelatedContentType } from "@/gql/graphql";
import { REPORT_TYPE_LABELS, REPORT_TYPE_DESCRIPTIONS, CONTENT_TYPE_LABELS } from "@/types/report";

type ReportItem = NonNullable<NonNullable<ReportDetailQueryQuery["reports"]>["items"]>[0];

const STATUS_CONFIG: Record<ReportStatus, {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
  icon: typeof AlertTriangle;
  color: string;
}> = {
  [ReportStatus.Pending]: {
    label: "Pending",
    variant: "default",
    icon: AlertTriangle,
    color: "text-yellow-500",
  },
  [ReportStatus.UnderReview]: {
    label: "Under Review",
    variant: "secondary",
    icon: FileText,
    color: "text-blue-500",
  },
  [ReportStatus.Approved]: {
    label: "Approved",
    variant: "default",
    icon: CheckCircle,
    color: "text-green-500",
  },
  [ReportStatus.Rejected]: {
    label: "Rejected",
    variant: "destructive",
    icon: XCircle,
    color: "text-red-500",
  },
  [ReportStatus.Dismissed]: {
    label: "Dismissed",
    variant: "outline",
    icon: XCircle,
    color: "text-gray-500",
  },
  [ReportStatus.Escalated]: {
    label: "Escalated",
    variant: "destructive",
    icon: AlertTriangle,
    color: "text-orange-500",
  },
};

interface ReportDetailInfoSectionProps {
  report: ReportItem;
}

export function ReportDetailInfoSection({ report }: ReportDetailInfoSectionProps) {
  const statusConfig = STATUS_CONFIG[report.status];
  const StatusIcon = statusConfig.icon;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl">Report Information</CardTitle>
            <p className="text-sm text-muted-foreground">
              Reported on {format(new Date(report.createdAt), "PPP 'at' p")}
            </p>
          </div>
          <Badge variant={statusConfig.variant} className="gap-1.5">
            <StatusIcon className={`h-3.5 w-3.5 ${statusConfig.color}`} />
            {statusConfig.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Report Type */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Report Type</h3>
          <div className="space-y-1">
            <p className="font-medium">{REPORT_TYPE_LABELS[report.reportType as ReportType]}</p>
            <p className="text-sm text-muted-foreground">
              {REPORT_TYPE_DESCRIPTIONS[report.reportType as ReportType]}
            </p>
          </div>
        </div>

        {/* Related Content */}
        {report.relatedContentType && report.relatedContentId && (
          <div>
            <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Related Content</h3>
            <Badge variant="outline">
              {CONTENT_TYPE_LABELS[report.relatedContentType as ReportRelatedContentType]} (ID: {report.relatedContentId})
            </Badge>
          </div>
        )}

        {/* Description */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Description</h3>
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{report.description}</p>
          </div>
        </div>

        {/* Evidence */}
        {report.evidences && report.evidences.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Evidence</h3>
            <div className="space-y-2">
              {report.evidences.map((evidence: string, index: number) => (
                <a
                  key={index}
                  href={evidence}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-md border p-3 text-sm text-blue-600 hover:bg-muted/50 hover:underline"
                >
                  Evidence {index + 1}: {evidence}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Moderator Notes */}
        {report.note && (
          <div>
            <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Moderator Notes</h3>
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{report.note}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
