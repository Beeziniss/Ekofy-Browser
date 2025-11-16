"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useDebounce } from "use-debounce";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { listenerRequestsOptions } from "@/gql/options/listener-request-options";
import { RequestStatus as GqlRequestStatus, RequestType as GqlRequestType } from "@/gql/graphql";
import { useAuthStore } from "@/store";
import { RequestListItem } from "./request-list-item";
import { Card, CardContent } from "@/components/ui/card";

// Skeleton loader for request list
function RequestListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-full" />
              <div className="flex gap-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Empty state component
function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="mb-4 rounded-full bg-gray-800 p-6">
          <Search className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-white">
          {hasFilters ? "No requests found" : "No requests yet"}
        </h3>
        <p className="text-center text-sm text-gray-400">
          {hasFilters
            ? "Try adjusting your filters or search criteria"
            : "You haven't made any direct requests to artists yet. Browse artists and their packages to make your first request."}
        </p>
        {!hasFilters && (
          <Button asChild className="primary_gradient mt-6 text-white hover:opacity-65">
            <Link href="/artists-for-hire">Browse Artists</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// Pagination component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

function Pagination({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }: PaginationProps) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-gray-700 pt-4">
      <div className="text-sm text-gray-400">
        Showing {startItem} to {endItem} of {totalItems} requests
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <div className="flex items-center gap-2">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNumber;
            if (totalPages <= 5) {
              pageNumber = i + 1;
            } else if (currentPage <= 3) {
              pageNumber = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNumber = totalPages - 4 + i;
            } else {
              pageNumber = currentPage - 2 + i;
            }

            return (
              <Button
                key={pageNumber}
                variant={currentPage === pageNumber ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(pageNumber)}
                className={currentPage === pageNumber ? "primary_gradient text-white" : ""}
              >
                {pageNumber}
              </Button>
            );
          })}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default function MyRequestsSection() {
  const { user } = useAuthStore();
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue] = useDebounce(searchValue, 300);
  const [statusFilter, setStatusFilter] = useState<GqlRequestStatus | "ALL">("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Build query filter - only show DIRECT_REQUEST type for listener's private requests
  const skip = (currentPage - 1) * pageSize;
  const where = {
    ...(debouncedSearchValue && { title: { contains: debouncedSearchValue } }),
    ...(statusFilter !== "ALL" && { status: { eq: statusFilter } }),
    ...(user?.userId && { requestUserId: { eq: user.userId } }),
    type: { eq: GqlRequestType.DirectRequest },
  };

  // Fetch requests
  const { data: requestsData, isLoading } = useQuery(listenerRequestsOptions(skip, pageSize, where));
  
  const requests = requestsData?.items || [];
  const totalItems = requestsData?.totalCount || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchValue, statusFilter]);

  const hasFilters = searchValue !== "" || statusFilter !== "ALL";

  // Check if user is authenticated
  if (!user) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-white">Please log in to view your requests.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search Input */}
            <div className="relative flex-1 md:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search requests by title..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as GqlRequestStatus | "ALL")}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value={GqlRequestStatus.Pending}>Pending</SelectItem>
                  <SelectItem value={GqlRequestStatus.Confirmed}>Confirmed</SelectItem>
                  <SelectItem value={GqlRequestStatus.Canceled}>Canceled</SelectItem>
                  <SelectItem value={GqlRequestStatus.Rejected}>Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Request List */}
      {isLoading ? (
        <RequestListSkeleton count={5} />
      ) : requests.length === 0 ? (
        <EmptyState hasFilters={hasFilters} />
      ) : (
        <>
          <div className="space-y-4">
            {requests.map((request) => (
              <RequestListItem key={request.id} request={request} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={totalItems}
            itemsPerPage={pageSize}
          />
        </>
      )}
    </div>
  );
}
