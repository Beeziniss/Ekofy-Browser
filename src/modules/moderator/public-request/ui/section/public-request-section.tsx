"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { moderatorPublicRequestsQueryOptions } from "@/gql/options/moderator-public-request-query-options";
import { RequestStatus } from "@/gql/graphql";
import { PublicRequestTable } from "../component/public-request-table";

export function PublicRequestSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus | "ALL">("ALL");
  const pageSize = 10;

  // Debounce search term
  useEffect(() => {
    if (searchTerm !== debouncedSearchTerm) {
      setIsSearching(true);
    }

    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
      setIsSearching(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, debouncedSearchTerm]);

  const skip = (currentPage - 1) * pageSize;

  const {
    data,
    isLoading,
    error,
  } = useQuery(
    moderatorPublicRequestsQueryOptions(
      skip,
      pageSize,
      selectedStatus === "ALL" ? null : selectedStatus,
      debouncedSearchTerm ? debouncedSearchTerm : null
    )
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleStatusChange = (status: RequestStatus | "ALL") => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center">Loading Data...</div>;
  }
  
  if (error) {
    return <div className="text-red-500">Error loading data: {error.message}</div>;
  }

  const requests = data?.requests?.items || [];
  const totalCount = data?.requests?.totalCount || 0;
  const hasNextPage = data?.requests?.pageInfo?.hasNextPage || false;
  const hasPreviousPage = data?.requests?.pageInfo?.hasPreviousPage || false;

  // Calculate pagination info
//   const totalPages = Math.ceil(totalCount / pageSize);

  // Show loading state for table or searching state
  const isTableLoading = isLoading || isSearching;

  return (
    <div className="space-y-6">
      <PublicRequestTable
        data={requests}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        onStatusChange={handleStatusChange}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        searchTerm={searchTerm}
        selectedStatus={selectedStatus}
        isLoading={isTableLoading}
        error={error}
      />
    </div>
  );
}
