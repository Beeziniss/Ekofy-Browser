"use client";

import { useUserReportDetail } from "../../hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  // Calendar,
  // User,
  Clock,
  FileText,
  ArrowLeft,
  ExternalLink,
  Shield,
  LoaderCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { ReportStatusBadge } from "../components/report-status-badge";
import { REPORT_TYPE_LABELS, CONTENT_TYPE_LABELS } from "@/types/report";

interface ReportDetailSectionProps {
  reportId: string;
  className?: string;
}

export function ReportDetailSection({ reportId, className }: ReportDetailSectionProps) {
  const { data: report, isLoading, error } = useUserReportDetail(reportId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-muted-foreground text-sm">Loading report information...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="py-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full bg-red-100 p-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <div>
            <p className="text-destructive mb-2 text-lg font-medium">Unable to load report information</p>
            <p className="text-muted-foreground mb-4 text-sm">
              The report does not exist or you do not have access to it.
            </p>
          </div>
          <Button asChild>
            <Link href="/reports">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to list
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const createdAt = new Date(report.createdAt);
  const updatedAt = report.updatedAt ? new Date(report.updatedAt) : null;
  const resolvedAt = report.resolvedAt ? new Date(report.resolvedAt) : null;

  const reportTypeLabel = REPORT_TYPE_LABELS[report.reportType];
  const contentTypeLabel = report.relatedContentType ? CONTENT_TYPE_LABELS[report.relatedContentType] : "User";

  const getTargetInfo = () => {
    if (report.track && report.track.length > 0) {
      return {
        title: `Track: ${report.track[0].name}`,
        href: `/track/${report.track[0].id}`,
      };
    }
    if (report.comment && report.comment.length > 0) {
      const comment = report.comment[0];
      const commenterName =
        comment.user?.[0]?.fullName ||
        comment.listener?.[0]?.displayName ||
        comment.artist?.[0]?.stageName ||
        "Anonymous";
      return {
        title: `Comment by ${commenterName}`,
        content: comment.content,
      };
    }
    if (report.request && report.request.length > 0) {
      return {
        title: `Request: ${report.request[0].title}`,
        content: report.request[0].summary,
        href: `/request-hub/${report.request[0].id}`,
      };
    }
    if (report.userReported && report.userReported.length > 0) {
      return {
        title: `User: ${report.userReported[0].fullName}`,
        href: `/artists/${report.userReported[0].id}`,
      };
    }
    return {
      title: "Undefined",
    };
  };

  const targetInfo = getTargetInfo();

  return (
    <div className={className}>
      <div className="grid gap-6">
        {/* Header Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Report Details
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{reportTypeLabel}</Badge>
                  <Badge variant="secondary">{contentTypeLabel}</Badge>
                </div>
              </div>
              <ReportStatusBadge status={report.status} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <h3 className="mb-2 font-medium">Reported Target:</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{targetInfo.title}</span>
                  {targetInfo.href && (
                    <Button asChild size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <Link href={targetInfo.href}>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </Button>
                  )}
                </div>
                {targetInfo.content && (
                  <p className="text-muted-foreground bg-muted mt-2 rounded-lg p-3 text-sm">{targetInfo.content}</p>
                )}
              </div>

              {report.userReported && report.userReported.length > 0 && (
                <div>
                  <h3 className="mb-2 font-medium">Reported User:</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{report.nicknameReported}</span>
                    <Badge variant="outline">{report.userReported[0].role}</Badge>
                  </div>
                </div>
              )}

              {report.assignedModeratorId && (
                <div>
                  <h3 className="mb-2 font-medium">Assigned Moderator:</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{report.userAssignedTo[0].fullName}</span>
                    <Badge variant="outline">{report.userAssignedTo[0].role}</Badge>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Description Card */}
        {report.description && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Violation Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{report.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Evidence Card */}
        {report.evidences && report.evidences.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Evidence ({report.evidences.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {report.evidences.map((evidence, index) => (
                  <div key={index} className="overflow-hidden rounded-lg border transition-shadow hover:shadow-md">
                    <Image
                      src={evidence}
                      alt={`Evidence ${index + 1}`}
                      width={400}
                      height={192}
                      className="h-48 w-full object-cover"
                    />
                    <div className="bg-muted p-2">
                      <p className="text-muted-foreground text-center text-xs">Evidence {index + 1}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Timeline Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Timeline History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Created at:</span>
                <span>{format(createdAt, "dd/MM/yyyy HH:mm", { locale: vi })}</span>
              </div>

              {updatedAt && (
                <>
                  <Separator />
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Last updated:</span>
                    <span>{format(updatedAt, "dd/MM/yyyy HH:mm", { locale: vi })}</span>
                  </div>
                </>
              )}

              {resolvedAt && (
                <>
                  <Separator />
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Resovle time:</span>
                    <span>{format(resolvedAt, "dd/MM/yyyy HH:mm", { locale: vi })}</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Admin Note Card */}
        {report.note && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Administrator Response
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm whitespace-pre-wrap">{report.note}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
