"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ApprovalHistoriesTable } from "../component/approval-histories-table";
import { moderatorApprovalHistoriesOptions } from "@/gql/options/moderator-options";
import { ApprovalHistoriesResponse } from "@/types/approval-histories";
import { useRouter, useSearchParams } from "next/navigation";

export function ApprovalHistoriesSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  const [approvalTypeFilter, setApprovalTypeFilter] = useState(searchParams.get("type") || "ALL");
  const [actionFilter, setActionFilter] = useState(searchParams.get("action") || "ALL");
  const pageSize = 10;

  // Sync URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set("page", currentPage.toString());
    if (approvalTypeFilter !== "ALL") params.set("type", approvalTypeFilter);
    if (actionFilter !== "ALL") params.set("action", actionFilter);
    
    const queryString = params.toString();
    router.replace(`/moderator/approval-histories${queryString ? `?${queryString}` : ""}`, { scroll: false });
  }, [currentPage, approvalTypeFilter, actionFilter, router]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [approvalTypeFilter, actionFilter]);

  const {
    data: approvalHistoriesData,
    isLoading,
    error,
  } = useQuery(moderatorApprovalHistoriesOptions(currentPage, pageSize, approvalTypeFilter, actionFilter));

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleApprovalTypeFilter = (type: string) => {
    setApprovalTypeFilter(type);
  };

  const handleActionFilter = (action: string) => {
    setActionFilter(action);
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

  return (
    <div className="space-y-6">
      <ApprovalHistoriesTable
        data={approvalHistories}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onApprovalTypeFilter={handleApprovalTypeFilter}
        onActionFilter={handleActionFilter}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        approvalTypeFilter={approvalTypeFilter}
        actionFilter={actionFilter}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
