"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { moderatorPublicRequestsQueryOptions } from "@/gql/options/moderator-public-request-query-options";
import { PublicRequestLayout } from "../layout/public-request-layout";
import { PublicRequestListSection } from "../section/public-request-list-section";
import { PublicRequestPagination } from "../component/public-request-pagination";
import { RequestStatus } from "@/gql/graphql";
import { useDebounce } from "@/hooks/use-debounce";

const PAGE_SIZE = 10;

export function PublicRequestView() {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  // Calculate skip value
  const skip = (currentPage - 1) * PAGE_SIZE;

  // Query public requests
  const { data, isLoading } = useQuery(
    moderatorPublicRequestsQueryOptions(
      skip,
      PAGE_SIZE,
      selectedStatus === "ALL" ? null : selectedStatus,
      debouncedSearchQuery ? debouncedSearchQuery : null
    )
  );

  const requests = data?.requests?.items || [];
  const totalCount = data?.requests?.totalCount || 0;
  const hasNextPage = data?.requests?.pageInfo?.hasNextPage || false;
  const hasPreviousPage = data?.requests?.pageInfo?.hasPreviousPage || false;

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // Handle status change
  const handleStatusChange = (status: RequestStatus | "ALL") => {
    setSelectedStatus(status);
    setCurrentPage(1); // Reset to first page
  };

  // Handle search change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page
  };

  // Handle view details
  const handleViewDetails = (id: string) => {
    router.push(`/moderator/public-request/${id}`);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <PublicRequestLayout
      selectedStatus={selectedStatus}
      searchQuery={searchQuery}
      onStatusChange={handleStatusChange}
      onSearchChange={handleSearchChange}
      totalCount={totalCount}
    >
      <PublicRequestListSection requests={requests} isLoading={isLoading} onViewDetails={handleViewDetails} />

      {/* Pagination */}
      <div className="mt-6">
        <PublicRequestPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
        />
      </div>
    </PublicRequestLayout>
  );
}
