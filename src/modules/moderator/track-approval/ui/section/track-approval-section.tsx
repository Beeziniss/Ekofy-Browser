"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { moderatorPendingTracksOptions } from "@/gql/options/moderator-options";
import { TrackApprovalTable } from "../components/track-approval-table";
import { TrackApprovalFilters } from "../components/track-approval-filters";
// import { TrackApprovalStats } from "../components/track-approval-stats";
import { useRouter } from "next/navigation";
export function TrackApprovalSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const pageSize = 10;
  const router = useRouter();

  const { data, isLoading, error } = useQuery(
    moderatorPendingTracksOptions(currentPage, pageSize, searchTerm)
  );

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleViewDetail = (trackId: string) => {
    // Navigate to detail page
    router.push(`/moderator/track-approval/${trackId}`);
  };

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
        <p className="text-destructive">
          Failed to load track approval data. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {/* <TrackApprovalStats /> */}

      {/* Filters and Actions */}
      <div className="flex items-center justify-between">
        <TrackApprovalFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
        />
      </div>

      {/* Table */}
      <TrackApprovalTable
        data={data?.pendingTrackUploadRequests?.items || []}
        totalCount={data?.pendingTrackUploadRequests?.totalCount || 0}
        isLoading={isLoading}
        currentPage={currentPage}
        pageSize={pageSize}
        onViewDetailAction={handleViewDetail}
      />
    </div>
  );
}