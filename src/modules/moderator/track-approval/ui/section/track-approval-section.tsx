"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { moderatorPendingTracksOptions } from "@/gql/options/moderator-options";
import { TrackApprovalTable } from "../components/track-approval-table";
import { TrackApprovalFilters } from "../components/track-approval-filters";
import { ApprovalPriorityStatus } from "@/types/approval-track";
import { useRouter, useSearchParams } from "next/navigation";
import { TrackUploadPopup } from "@/components/track-upload-popup";

export function TrackApprovalSection() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  // TODO: Uncomment when GraphQL supports search
  // const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const searchTerm = ""; // Temporary: search disabled
  const [priorityFilter, setPriorityFilter] = useState<ApprovalPriorityStatus | "ALL">(
    (searchParams.get("priority") as ApprovalPriorityStatus) || "ALL",
  );
  const pageSize = 10;

  // Sync URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set("page", currentPage.toString());
    if (priorityFilter !== "ALL") params.set("priority", priorityFilter);

    const queryString = params.toString();
    router.replace(`/moderator/track-approval${queryString ? `?${queryString}` : ""}`, { scroll: false });
  }, [currentPage, priorityFilter, router]);

  const { data, isLoading, error } = useQuery(
    moderatorPendingTracksOptions(currentPage, pageSize, searchTerm, priorityFilter),
  );

  // TODO: Uncomment when GraphQL supports search
  // const handleSearch = (term: string) => {
  //   setSearchTerm(term);
  //   setCurrentPage(1); // Reset to first page when searching
  // };
  const handleSearch = (term: string) => {
    // Search functionality disabled until backend support
    console.log("Search disabled:", term);
  };

  const handlePriorityChange = (priority: ApprovalPriorityStatus | "ALL") => {
    setPriorityFilter(priority);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleViewDetail = (uploadId: string) => {
    // Navigate to detail page - route parameter is named trackId but it's actually uploadId
    router.push(`/moderator/track-approval/${uploadId}`);
  };

  if (error) {
    return (
      <div className="border-destructive/20 bg-destructive/10 rounded-lg border p-4">
        <p className="text-destructive">Failed to load track approval data. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="space-y-6">
        {/* Stats Cards */}
        {/* <TrackApprovalStats /> */}

        {/* Filters and Actions */}
        <div className="flex items-center justify-between">
          <TrackApprovalFilters
            searchTerm={searchTerm}
            onSearchChange={handleSearch}
            priorityFilter={priorityFilter}
            onPriorityChange={handlePriorityChange}
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

      {/* Upload Progress Popup */}
      <TrackUploadPopup />
    </div>
  );
}
