"use client";

import { useArtistReportDetail } from "../../hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, User, FileText, AlertCircle, ExternalLink } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { ArtistReportStatusBadge } from "../components/artist-report-status-badge";
import { REPORT_TYPE_LABELS, CONTENT_TYPE_LABELS } from "@/types/report";
import Image from "next/image";

interface ArtistReportDetailSectionProps {
  reportId: string;
  className?: string;
}

export function ArtistReportDetailSection({ reportId, className }: ArtistReportDetailSectionProps) {
  const { data, isLoading, error } = useArtistReportDetail(reportId);

  if (isLoading) {
    return (
      <div className={className}>
        <Card className="bg-main-card-bg border-main-grey-dark-bg/30">
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <div className="border-main-purple h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"></div>
              <span className="text-main-white ml-3">Loading report details...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={className}>
        <Card className="bg-main-card-bg border-red-500/20">
          <CardContent className="p-8 text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-400" />
            <h3 className="text-main-white mb-2 text-lg font-semibold">Unable to load report</h3>
            <p className="mb-4 text-red-400">Report does not exist or you do not have permission to view it.</p>
            <Button
              asChild
              variant="outline"
              className="border-main-grey-dark-bg/50 text-main-white hover:bg-main-dark-bg-1"
            >
              <Link href="/artist/studio/reports">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to list
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const report = data;
  const createdDate = new Date(report.createdAt);
  const updatedDate = report.updatedAt ? new Date(report.updatedAt) : null;

  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Button asChild variant="ghost" className="text-main-white mb-4 hover:opacity-75">
            <Link href="/artist/studio/reports">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to list
            </Link>
          </Button>
          <h1 className="text-main-white text-2xl font-bold">Report Details</h1>
          <p className="text-main-grey mt-1">View detailed information about this report</p>
        </div>
        <ArtistReportStatusBadge status={report.status} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Report Info */}
          <Card className="border-main-grey-dark-bg/30">
            <CardHeader>
              <CardTitle className="text-main-white flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Report Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-main-white mb-2 text-lg font-semibold">{REPORT_TYPE_LABELS[report.reportType]}</h3>
                <Badge
                  variant="secondary"
                  className="bg-main-dark-bg-1 text-main-white border-main-grey-dark-bg/50 mb-4"
                >
                  {report.relatedContentType ? CONTENT_TYPE_LABELS[report.relatedContentType] : "User"}
                </Badge>
                <p className="text-main-grey leading-relaxed">{report.description}</p>
              </div>

              {report.note && (
                <>
                  <Separator className="bg-main-grey-dark-bg/30" />
                  <div>
                    <h4 className="text-main-purple mb-2 font-medium">Note from Moderator:</h4>
                    <div className="bg-main-dark-bg-1 border-main-purple rounded border-l-4 p-4">
                      <p className="text-main-white">{report.note}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Evidence */}
          {report.evidences && report.evidences.length > 0 && (
            <Card className="bg-main-card-bg border-main-grey-dark-bg/30">
              <CardHeader>
                <CardTitle className="text-main-purple flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Evidence ({report.evidences.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {report.evidences.map((evidence, index) => (
                    <div key={index} className="space-y-2">
                      <Image
                        src={evidence}
                        alt={`Evidence ${index + 1}`}
                        width={400}
                        height={300}
                        className="border-main-grey-dark-bg/50 h-48 w-full rounded-lg border object-cover"
                      />
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="border-main-grey-dark-bg/50 text-main-white hover:bg-main-dark-bg-1 w-full"
                      >
                        <a href={evidence} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-3 w-3" />
                          View full size
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timeline */}
          <Card className="border-main-grey-dark-bg/30">
            <CardHeader>
              <CardTitle className="text-main-white flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-main-blue mt-2 h-2 w-2 rounded-full"></div>
                <div>
                  <p className="text-main-white font-medium">Report created</p>
                  <p className="text-main-grey text-sm">
                    {format(createdDate, "dd/MM/yyyy 'lúc' HH:mm", { locale: vi })}
                  </p>
                </div>
              </div>
              {updatedDate && (
                <div className="flex items-start gap-3">
                  <div className="bg-main-blue mt-2 h-2 w-2 rounded-full"></div>
                  <div>
                    <p className="text-main-white font-medium">Last updated</p>
                    <p className="text-main-grey text-sm">
                      {format(updatedDate, "dd/MM/yyyy 'lúc' HH:mm", { locale: vi })}
                    </p>
                  </div>
                </div>
              )}
              {report.resolvedAt && (
                <div className="flex items-start gap-3">
                  <div className="mt-2 h-2 w-2 rounded-full bg-green-400"></div>
                  <div>
                    <p className="text-main-white font-medium">Resolved</p>
                    <p className="text-main-grey text-sm">
                      {format(new Date(report.resolvedAt), "dd/MM/yyyy 'lúc' HH:mm", { locale: vi })}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reported User */}
          {report.nicknameReported && (
            <Card className="border-main-grey-dark-bg/30">
              <CardHeader>
                <CardTitle className="text-main-white flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Reported Person
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-main-white text-sm font-medium">{report.nicknameReported}</span>
                    <Badge variant="outline" className="bg-main-dark-bg-1 text-main-white border-main-grey-dark-bg/50">
                      {report.userReported[0].role}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Assigned Moderator User */}
          {report.assignedModeratorId && (
            <Card className="border-main-grey-dark-bg/30">
              <CardHeader>
                <CardTitle className="text-main-white flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Assigned Moderator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-main-white text-sm font-medium">{report.userAssignedTo[0].fullName}</span>
                    <Badge variant="outline" className="bg-main-dark-bg-1 text-main-white border-main-grey-dark-bg/50">
                      {report.userAssignedTo[0].role}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Priority */}
          <Card className="border-main-grey-dark-bg/30">
            <CardHeader>
              <CardTitle className="text-main-white flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Priority
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge
                variant={
                  report.priority === "HIGH" ? "destructive" : report.priority === "MEDIUM" ? "default" : "secondary"
                }
                className={
                  report.priority === "HIGH"
                    ? "border-red-500/50 bg-red-500/20 text-red-400"
                    : report.priority === "MEDIUM"
                      ? "border-yellow-500/50 bg-yellow-500/20 text-yellow-400"
                      : "bg-main-dark-bg-1 text-main-grey border-main-grey-dark-bg/50"
                }
              >
                {report.priority === "HIGH" ? "Cao" : report.priority === "MEDIUM" ? "Medium" : "Low"}
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
