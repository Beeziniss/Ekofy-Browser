"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, RefreshCw } from "lucide-react";
import { useArtistReports } from "../../hooks";
import { ArtistReportStatusBadge } from "../components/artist-report-status-badge";
import { ReportStatus, ReportType } from "@/gql/graphql";
import { REPORT_TYPE_LABELS } from "@/types/report";
import Link from "next/link";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface ArtistReportListSectionProps {
  className?: string;
}

export function ArtistReportListSection({ className }: ArtistReportListSectionProps) {
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "ALL">("ALL");
  const [reportTypeFilter, setReportTypeFilter] = useState<ReportType | "ALL">("ALL");
  const [skip, setSkip] = useState(0);
  const take = 20;

  const { data, isLoading, error, refetch } = useArtistReports(skip, take, {
    ...(statusFilter && statusFilter !== "ALL" ? { status: { eq: statusFilter } } : {}),
    ...(reportTypeFilter && reportTypeFilter !== "ALL" ? { reportType: { eq: reportTypeFilter } } : {}),
  });

  const reports = data?.items || [];
  const totalCount = data?.totalCount || 0;
  const hasNext = data?.pageInfo?.hasNextPage || false;
  const hasPrev = data?.pageInfo?.hasPreviousPage || false;

  const handleNextPage = () => {
    if (hasNext) {
      setSkip(skip + take);
    }
  };

  const handlePrevPage = () => {
    if (hasPrev && skip >= take) {
      setSkip(skip - take);
    }
  };

  const filteredReports = reports;

  if (error) {
    return (
      <Card className="bg-main-card-bg border-red-500/20">
        <CardContent className="p-6">
          <p className="text-red-400">An error occurred while loading the report list.</p>
          <Button onClick={() => refetch()} className="primary_gradient mt-4">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-primary-gradient text-2xl font-bold">My Reports</h1>
          <p className="text-main-grey mt-1">Manage the reports you have sent ({totalCount} reports)</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-main-grey-dark-bg/30 mb-6">
        <CardHeader>
          <CardTitle className="text-main-white flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="w-full space-y-2 md:w-[200px]">
              <label className="text-main-white text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ReportStatus | "ALL")}>
                <SelectTrigger className="bg-main-dark-bg-1 border-main-grey-dark-bg/50 text-main-white">
                  <SelectValue placeholder="ALL STATUSES" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">ALL STATUSES</SelectItem>
                  <SelectItem value={ReportStatus.Pending}>PENDING</SelectItem>
                  <SelectItem value={ReportStatus.UnderReview}>UNDER REVIEW</SelectItem>
                  <SelectItem value={ReportStatus.Approved}>APPROVED</SelectItem>
                  <SelectItem value={ReportStatus.Restored}>RESTORED</SelectItem>
                  <SelectItem value={ReportStatus.Rejected}>REJECTED</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full space-y-2 md:w-[200px]">
              <label className="text-main-white text-sm font-medium">Report Type</label>
              <Select
                value={reportTypeFilter}
                onValueChange={(value) => setReportTypeFilter(value as ReportType | "ALL")}
              >
                <SelectTrigger className="bg-main-dark-bg-1 border-main-grey-dark-bg/50 text-main-white">
                  <SelectValue placeholder="ALL TYPES" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">ALL TYPES</SelectItem>
                  <SelectItem value={ReportType.Harassment}>HARASSMENT</SelectItem>
                  <SelectItem value={ReportType.HateSpeech}>HATE SPEECH</SelectItem>
                  <SelectItem value={ReportType.Impersonation}>IMPERSONATION</SelectItem>
                  <SelectItem value={ReportType.CopyrightViolation}>COPYRIGHT VIOLATION</SelectItem>
                  <SelectItem value={ReportType.FakeAccount}>FAKE ACCOUNT</SelectItem>
                  <SelectItem value={ReportType.ScamOrFraud}>SCAM/FRAUD</SelectItem>
                  <SelectItem value={ReportType.Spam}>SPAM</SelectItem>
                  <SelectItem value={ReportType.InappropriateContent}>INAPPROPRIATE CONTENT</SelectItem>
                  <SelectItem value={ReportType.SelfHarmOrDangerousContent}>SELF-HARM OR DANGEROUS</SelectItem>
                  <SelectItem value={ReportType.Other}>OTHER</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <div className="space-y-4">
        {isLoading ? (
          <Card className="border-main-grey-dark-bg/30">
            <CardContent className="p-8">
              <div className="flex items-center justify-center">
                <RefreshCw className="text-main-white h-8 w-8 animate-spin" />
                <span className="text-main-white ml-2">Loading...</span>
              </div>
            </CardContent>
          </Card>
        ) : filteredReports.length === 0 ? (
          <Card className="border-main-grey-dark-bg/30">
            <CardContent className="p-8 text-center">
              <p className="text-main-grey">No reports found.</p>
            </CardContent>
          </Card>
        ) : (
          filteredReports.map((report) => (
            <Card
              key={report.id}
              className="border-main-grey-dark-bg/30 hover:border-main-blue/50 transition-all duration-200"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-main-blue bg-main-blue/10 border-main-blue/30 rounded border px-2 py-1 font-mono text-sm">
                        #{report.id.slice(-8).toUpperCase()}
                      </span>
                      <ArtistReportStatusBadge status={report.status as ReportStatus} />
                    </div>

                    <h3 className="text-main-white text-lg font-semibold">{REPORT_TYPE_LABELS[report.reportType]}</h3>

                    <p className="text-main-grey line-clamp-2">{report.description}</p>

                    <div className="text-main-grey-dark-1 flex items-center gap-4 text-sm">
                      <span>Created at: {format(new Date(report.createdAt), "dd/MM/yyyy HH:mm", { locale: vi })}</span>
                      {report.nicknameReported ? (
                        <span>Reported: {report.nicknameReported}</span>
                      ) : (
                        <span>Reported: Unknown</span>
                      )}
                    </div>
                  </div>

                  <Button asChild className="primary_gradient text-white transition-opacity hover:opacity-90">
                    <Link href={`/artist/studio/reports/${report.id}`}>View details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalCount > take && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-main-grey text-sm">
            Showing {skip + 1} - {Math.min(skip + take, totalCount)} of {totalCount} reports
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handlePrevPage}
              disabled={!hasPrev}
              className="border-main-grey-dark-bg/50 text-main-white hover:bg-main-dark-bg-1"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={handleNextPage}
              disabled={!hasNext}
              className="border-main-grey-dark-bg/50 text-main-white hover:bg-main-dark-bg-1"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
