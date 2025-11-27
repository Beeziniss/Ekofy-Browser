"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Music, 
  MessageSquare, 
  FileQuestion,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";
import { ReportDetailQueryQuery, ReportStatus, ReportType, ReportRelatedContentType } from "@/gql/graphql";
import { REPORT_TYPE_LABELS, CONTENT_TYPE_LABELS } from "@/types/report";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type ReportItem = NonNullable<NonNullable<ReportDetailQueryQuery["reports"]>["items"]>[0];

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
  [ReportStatus.Restored]: {
    label: "Restored",
    className: "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800/30 dark:text-gray-400 dark:border-gray-700",
  },
  [ReportStatus.Escalated]: {
    label: "Escalated",
    className: "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-700",
  },
};

const CONTENT_ICONS: Record<ReportRelatedContentType, typeof Music> = {
  [ReportRelatedContentType.Track]: Music,
  [ReportRelatedContentType.Comment]: MessageSquare,
  [ReportRelatedContentType.Request]: FileQuestion,
  [ReportRelatedContentType.Artist]: FileText,
  [ReportRelatedContentType.Listener]: FileText,
};

interface ReportDetailInfoSectionProps {
  report: ReportItem;
}

export function ReportDetailInfoSection({ report }: ReportDetailInfoSectionProps) {
  const statusConfig = STATUS_CONFIG[report.status];

  // Get the actual data from arrays (API returns arrays, not single objects)
  const trackData = report.track?.[0];
  const commentData = report.comment?.[0];
  const requestData = report.request?.[0];

  return (
    <div className="space-y-6">
      {/* Status & Priority Card */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold mb-4">Report Information</CardTitle>
          
          {/* Report Status Section */}
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Status</p>
              <Badge variant="outline" className={`gap-2 px-4 py-2 text-sm ${statusConfig.className}`}>
                <span className="font-semibold">{statusConfig.label.toUpperCase()}</span>
              </Badge>
            </div>

            {/* Priority Section */}
            {report.priority && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Priority</p>
                <Badge 
                  variant="outline" 
                  className={`gap-2 px-4 py-2 text-sm ${
                    report.priority === 'HIGH' 
                      ? 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400' 
                      : report.priority === 'MEDIUM'
                      ? 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-400'
                      : 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}
                >
                  <span className="font-semibold">{report.priority}</span>
                </Badge>
              </div>
            )}

            {/* Action Taken Section */}
            {report.actionTaken && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Action Taken</p>
                <Badge 
                  variant="outline" 
                  className={`gap-2 px-4 py-2 text-sm ${
                    report.actionTaken === 'PERMANENT_BAN' || report.actionTaken === 'CONTENT_REMOVAL'
                      ? 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400'
                      : report.actionTaken === 'SUSPENDED'
                      ? 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-400'
                      : report.actionTaken === 'WARNING'
                      ? 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}
                >
                  <span className="font-semibold">
                    {report.actionTaken.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </Badge>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Report Type Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            Report Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Badge variant="secondary" className="text-sm">
              {REPORT_TYPE_LABELS[report.reportType as ReportType]}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Related Content Card */}
      {report.relatedContentType && report.relatedContentId && (
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-base flex items-center gap-2">
              {(() => {
                const Icon = CONTENT_ICONS[report.relatedContentType as ReportRelatedContentType];
                return <Icon className="h-4 w-4" />;
              })()}
              Related Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                {CONTENT_TYPE_LABELS[report.relatedContentType as ReportRelatedContentType]}
              </Badge>
            </div>

            <Separator />
            
            {/* Track Content */}
            {report.relatedContentType === ReportRelatedContentType.Track && trackData && (
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1 space-y-1">
                    <p className="text-xs text-muted-foreground">Track Name</p>
                    <p className="font-medium">{trackData.name || "N/A"}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Comment Content */}
            {report.relatedContentType === ReportRelatedContentType.Comment && commentData && (
              <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1 space-y-1">
                    <p className="text-xs text-muted-foreground">Comment by</p>
                    <p className="font-medium">
                      {commentData.user?.[0]?.fullName || 
                       commentData.listener?.[0]?.displayName || 
                       commentData.artist?.[0]?.stageName || 
                       "Unknown User"}
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Comment Content</p>
                  <div className="rounded-md p-3">
                    <p className="text-sm whitespace-pre-wrap">{commentData.content || "N/A"}</p>
                  </div>
                </div>
                
                {commentData.track?.[0] && (
                  <>
                    <Separator />
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">On track:</span>
                      <span className="font-medium">{commentData.track[0].name}</span>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Request Content */}
            {report.relatedContentType === ReportRelatedContentType.Request && requestData && (
              <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1 space-y-2">
                    <p className="text-xs text-muted-foreground">Request Title</p>
                    <p className="font-medium">{requestData.title || "N/A"}</p>
                  </div>
                </div>
                
                {requestData.summary && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Summary</p>
                      <div className="rounded-md p-2">
                        <p className="text-sm whitespace-pre-wrap">{requestData.summary}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Show message if no related content data found */}
            {report.relatedContentType === ReportRelatedContentType.Track && !trackData && (
              <div className="rounded-lg border border-dashed bg-muted/30 p-4 text-center text-sm text-muted-foreground">
                Track data not available
              </div>
            )}
            {report.relatedContentType === ReportRelatedContentType.Comment && !commentData && (
              <div className="rounded-lg border border-dashed bg-muted/30 p-4 text-center text-sm text-muted-foreground">
                Comment data not available
              </div>
            )}
            {report.relatedContentType === ReportRelatedContentType.Request && !requestData && (
              <div className="rounded-lg border border-dashed bg-muted/30 p-4 text-center text-sm text-muted-foreground">
                Request data not available
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Description Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Report Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border-2 p-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{report.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Evidence Card */}
      {report.evidences && report.evidences.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Evidence ({report.evidences.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.evidences.map((evidence: string, index: number) => (
                <div
                  key={index}
                  className="group relative rounded-lg border overflow-hidden bg-muted/30 hover:border-primary transition-colors"
                >
                  {/* Image Preview */}
                  <div className="aspect-video relative bg-muted">
                    <Image
                      src={evidence}
                      alt={`Evidence ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={() => {
                        console.error(`Failed to load evidence image: ${evidence}`);
                      }}
                      width={500}
                      height={300}
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all flex items-center justify-center">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity gap-2"
                        onClick={() => window.open(evidence, "_blank")}
                      >
                        <ExternalLink className="h-4 w-4" />
                        View Full
                      </Button>
                    </div>
                  </div>
                  {/* Label */}
                  <div className="p-2 bg-background border-t">
                    <p className="text-xs text-muted-foreground">
                      Evidence {index + 1}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Moderator Notes Card */}
      {report.note && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              Moderator Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border-2 p-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{report.note}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
