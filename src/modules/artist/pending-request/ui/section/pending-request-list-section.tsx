"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { pendingRequestsOptions } from "@/gql/options/pending-request-option";
import { useChangeRequestStatusMutation } from "@/gql/client-mutation-options/pending-request-mutation";
import { PendingRequestFilters } from "../component/pending-request-filters";
import { PendingRequestTable } from "../component/pending-request-table";
import { PendingRequestPagination } from "../component/pending-request-pagination";
import { RequestStatus } from "@/gql/graphql";

const PAGE_SIZE = 20;

export function PendingRequestListSection() {
  const [filters, setFilters] = useState({
    search: "",
    status: undefined as string | undefined,
    skip: 0,
  });

  // Fetch requests
  const { data, isLoading, refetch } = useQuery(
    pendingRequestsOptions({
      search: filters.search || undefined,
      status: filters.status as RequestStatus | undefined,
      skip: filters.skip,
      take: PAGE_SIZE,
    })
  );

  // Mutations
  const changeStatusMutation = useChangeRequestStatusMutation();

  // Handlers
  const handleSearchChange = (search: string) => {
    setFilters(prev => ({ ...prev, search, skip: 0 }));
  };

  const handleStatusChange = (status: string | undefined) => {
    setFilters(prev => ({ ...prev, status, skip: 0 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, skip: (page - 1) * PAGE_SIZE }));
  };

  const handleApprove = async (requestId: string) => {
    try {
      await changeStatusMutation.mutateAsync({
        requestId,
        status: RequestStatus.Confirmed,
      });
      toast.success("Request approved successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to approve request");
      console.error("Error approving request:", error);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await changeStatusMutation.mutateAsync({
        requestId,
        status: RequestStatus.Rejected,
      });
      toast.success("Request rejected successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to reject request");
      console.error("Error rejecting request:", error);
    }
  };

  // Pagination calculations
  const currentPage = Math.floor(filters.skip / PAGE_SIZE) + 1;
  const totalCount = data?.requests?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const hasNextPage = filters.skip + PAGE_SIZE < totalCount;
  const hasPreviousPage = filters.skip > 0;

  const requests = data?.requests?.items || [];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <PendingRequestFilters
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        searchValue={filters.search}
        statusValue={filters.status}
      />

      {/* Table */}
      <PendingRequestTable
        requests={requests}
        isLoading={isLoading}
        onApprove={handleApprove}
        onReject={handleReject}
        isProcessing={changeStatusMutation.isPending}
      />

      {/* Pagination */}
      {totalCount > 0 && (
        <PendingRequestPagination
          currentPage={currentPage}
          totalPages={totalPages}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          onPageChange={handlePageChange}
          totalCount={totalCount}
          pageSize={PAGE_SIZE}
        />
      )}
    </div>
  );
}