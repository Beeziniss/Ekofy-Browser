"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ApprovalHistoriesTable } from "../component/approval-histories-table";
import { moderatorApprovalHistoriesOptions } from "@/gql/options/moderator-options";
import { ApprovalHistoriesResponse } from "@/types/approval-histories";

export function ApprovalHistoriesSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const pageSize = 10;

  // Debounce search term
  useEffect(() => {
    if (searchTerm !== debouncedSearchTerm) {
      setIsSearching(true);
    }

    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when search term changes
      setIsSearching(false);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchTerm, debouncedSearchTerm]);

  const {
    data: approvalHistoriesData,
    isLoading,
    error,
  } = useQuery(moderatorApprovalHistoriesOptions(currentPage, pageSize, debouncedSearchTerm));

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center">Loading Data...</div>;
  }
  if (error) {
    return <div className="text-red-500">Error loading data: {error.message}</div>;
  }

  // Handle mock data structure from moderator-options
  const responseData = approvalHistoriesData as ApprovalHistoriesResponse;
  const approvalHistories = responseData?.approvalHistories?.items || [];
  const totalCount = responseData?.approvalHistories?.totalCount || 0;

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / pageSize);
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  // Show loading state for table or searching state
  const isTableLoading = isLoading || isSearching;

  return (
    <div className="space-y-6">
      <ApprovalHistoriesTable
        data={approvalHistories}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        searchTerm={searchTerm}
        isLoading={isTableLoading}
        error={error}
      />
    </div>
  );
}
