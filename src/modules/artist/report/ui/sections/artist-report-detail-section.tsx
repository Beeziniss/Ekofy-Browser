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
        <Card className="border-purple-200">
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent"></div>
              <span className="ml-3 text-purple-600">Loading report details...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={className}>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Unable to load report
            </h3>
            <p className="text-red-600 mb-4">
              Report does not exist or you do not have permission to view it.
            </p>
            <Button asChild variant="outline">
              <Link href="/artist/studio/reports">
                <ArrowLeft className="h-4 w-4 mr-2" />
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <Button asChild variant="ghost" className="mb-4 text-purple-600 hover:text-purple-800">
            <Link href="/artist/studio/reports">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to list
            </Link>
          </Button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Report Details #{report.id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-gray-600 mt-1">
            View detailed information about this report
          </p>
        </div>
        <ArtistReportStatusBadge status={report.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Info */}
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <FileText className="h-5 w-5" />
                Report Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  {REPORT_TYPE_LABELS[report.reportType]}
                </h3>
                <Badge variant="secondary" className="mb-4">
                  {report.relatedContentType ? CONTENT_TYPE_LABELS[report.relatedContentType] : "User"}
                </Badge>
                <p className="text-gray-700 leading-relaxed">
                  {report.description}
                </p>
              </div>

              {report.note && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2 text-purple-700">Note from Moderator:</h4>
                    <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded">
                      <p className="text-purple-800">{report.note}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Evidence */}
          {report.evidences && report.evidences.length > 0 && (
            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <FileText className="h-5 w-5" />
                  Evidence ({report.evidences.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {report.evidences.map((evidence, index) => (
                    <div key={index} className="space-y-2">
                      <Image
                        src={evidence}
                        alt={`Evidence ${index + 1}`}
                        width={400}
                        height={300}
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <a href={evidence} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 mr-2" />
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
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Calendar className="h-5 w-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Report created</p>
                  <p className="text-sm text-gray-500">
                    {format(createdDate, "dd/MM/yyyy 'lúc' HH:mm", { locale: vi })}
                  </p>
                </div>
              </div>
              {updatedDate && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Last updated</p>
                    <p className="text-sm text-gray-500">
                      {format(updatedDate, "dd/MM/yyyy 'lúc' HH:mm", { locale: vi })}
                    </p>
                  </div>
                </div>
              )}
              {report.resolvedAt && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Resolved</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(report.resolvedAt), "dd/MM/yyyy 'lúc' HH:mm", { locale: vi })}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reported User */}
          {report.userReported?.[0] && (
            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <User className="h-5 w-5" />
                  Reported Person
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{report.userReported[0].fullName}</span>
                    <Badge variant="outline">{report.userReported[0].role}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Priority */}
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <AlertCircle className="h-5 w-5" />
                Priority
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge 
                variant={report.priority === "HIGH" ? "destructive" : 
                        report.priority === "MEDIUM" ? "default" : "secondary"}
              >
                {report.priority === "HIGH" ? "Cao" :
                 report.priority === "MEDIUM" ? "Medium" : "Low"}
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}