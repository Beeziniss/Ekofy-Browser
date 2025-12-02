"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { moderatorPublicRequestsQueryOptions } from "@/gql/options/moderator-public-request-query-options";
import { RequestStatus } from "@/gql/graphql";
import { PublicRequestTable } from "../component/public-request-table";
import { RequestSearch } from "../component/filters/request-search";
import { StatusFilter } from "../component/filters/status-filter";
import { useRouter, useSearchParams } from "next/navigation";

export function PublicRequestSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchParams.get("search") || "");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus | "ALL">((searchParams.get("status") as RequestStatus) || "ALL");
  const pageSize = 10;

  // Sync URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set("page", currentPage.toString());
    if (debouncedSearchTerm) params.set("search", debouncedSearchTerm);
    if (selectedStatus !== "ALL") params.set("status", selectedStatus);
    
    const queryString = params.toString();
    router.replace(`/moderator/public-request${queryString ? `?${queryString}` : ""}`, { scroll: false });
  }, [currentPage, debouncedSearchTerm, selectedStatus, router]);

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
      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <RequestSearch
            searchQuery={searchTerm}
            onSearchChange={handleSearch}
            placeholder="Search by title or requestor"
          />
        </div>
        <StatusFilter
          selectedStatus={selectedStatus}
          onStatusChange={handleStatusChange}
        />
      </div>

      {/* Table */}
      <PublicRequestTable
        data={requests}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        isLoading={isTableLoading}
        error={error}
      />
    </div>
  );
}
