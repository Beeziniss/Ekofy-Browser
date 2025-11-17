"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, RefreshCw } from "lucide-react";
import { useArtistReports } from "../../hooks";
import { ArtistReportStatusBadge } from "../components/artist-report-status-badge";
import { ReportStatus } from "@/gql/graphql";
import { REPORT_TYPE_LABELS } from "@/types/report";
import Link from "next/link";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface ArtistReportListSectionProps {
  className?: string;
}

export function ArtistReportListSection({ className }: ArtistReportListSectionProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "ALL">("ALL");
  const [skip, setSkip] = useState(0);
  const take = 20;

  const { data, isLoading, error, refetch } = useArtistReports(
    skip,
    take,
    statusFilter && statusFilter !== "ALL" ? { status: { eq: statusFilter } } : undefined
  );

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

  const filteredReports = reports.filter(report =>
    search === "" || 
    report.description.toLowerCase().includes(search.toLowerCase()) ||
    report.id.includes(search)
  );

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <p className="text-red-600">An error occurred while loading the report list.</p>
          <Button onClick={() => refetch()} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            My Reports
          </h1>
          <p className="text-gray-600 mt-1">
            Manage the reports you have sent ({totalCount} reports)
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-700">Search</label>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search by description or ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-700">Status</label>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ReportStatus | "ALL")}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All statuses</SelectItem>
                  <SelectItem value={ReportStatus.Pending}>Pending</SelectItem>
                  <SelectItem value={ReportStatus.UnderReview}>Under Review</SelectItem>
                  <SelectItem value={ReportStatus.Approved}>Approved</SelectItem>
                  <SelectItem value={ReportStatus.Restored}>Restored</SelectItem>
                  <SelectItem value={ReportStatus.Rejected}>Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-700">Actions</label>
              <Button 
                onClick={() => refetch()}
                variant="outline"
                className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <div className="space-y-4">
        {isLoading ? (
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center justify-center">
                <RefreshCw className="h-8 w-8 animate-spin text-purple-500" />
                <span className="ml-2 text-purple-600">Loading...</span>
              </div>
            </CardContent>
          </Card>
        ) : filteredReports.length === 0 ? (
          <Card className="border-purple-200">
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No reports found.</p>
            </CardContent>
          </Card>
        ) : (
          filteredReports.map((report) => (
            <Card
              key={report.id}
              className="hover:shadow-lg transition-all duration-200 border-purple-200 hover:border-purple-300"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm text-purple-600 bg-purple-100 px-2 py-1 rounded">
                        #{report.id.slice(-8).toUpperCase()}
                      </span>
                      <ArtistReportStatusBadge status={report.status} />
                    </div>
                    
                    <h3 className="font-semibold text-lg text-gray-900">
                      {REPORT_TYPE_LABELS[report.reportType]}
                    </h3>
                    
                    <p className="text-gray-600 line-clamp-2">
                      {report.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>
                        Created at: {format(new Date(report.createdAt), "dd/MM/yyyy HH:mm", { locale: vi })}
                      </span>
                      {report.userReported?.[0] && (
                        <span>
                          Report: {report.userReported[0].fullName}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <Link href={`/artist/studio/reports/${report.id}`}>
                      View details
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalCount > take && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-500">
            Showing {skip + 1} - {Math.min(skip + take, totalCount)} of {totalCount} reports
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handlePrevPage}
              disabled={!hasPrev}
              className="border-purple-300 text-purple-700"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={handleNextPage}
              disabled={!hasNext}
              className="border-purple-300 text-purple-700"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}