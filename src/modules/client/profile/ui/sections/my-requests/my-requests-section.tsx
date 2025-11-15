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
import { myRequestsOptions } from "@/gql/options/client-options";
import { RequestStatus as GqlRequestStatus, RequestType as GqlRequestType, RequestsQuery } from "@/gql/graphql";
import { useAuthStore } from "@/store";
import { RequestListItem } from "./request-list-item";
import { Card, CardContent } from "@/components/ui/card";

type RequestItem = NonNullable<NonNullable<RequestsQuery["requests"]>["items"]>[0];

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

  // MOCK DATA for testing
  const MOCK_DATA = true;
  const mockRequests: RequestItem[] = [
    {
      __typename: "Request",
      id: "req-001",
      requestUserId: user?.userId || "user-123",
      title: "Need a custom logo design for my startup",
      titleUnsigned: "need a custom logo design for my startup",
      summary: "Looking for a professional logo that represents innovation and technology",
      summaryUnsigned: "looking for a professional logo that represents innovation and technology",
      detailDescription: "I need a modern, minimalist logo for my tech startup. The logo should incorporate elements of AI and innovation.",
      budget: { min: 500, max: 1000 },
      currency: "USD",
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      status: GqlRequestStatus.Pending,
      type: GqlRequestType.DirectRequest,
      postCreatedTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      requestCreatedTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      artistId: "artist-001",
      packageId: "pkg-001",
      artist: [
        {
          __typename: "Artist",
          id: "artist-001",
          stageName: "Creative Studio Pro",
          avatarImage: null,
        },
      ],
    },
    {
      __typename: "Request",
      id: "req-002",
      requestUserId: user?.userId || "user-123",
      title: "Music production for my upcoming album",
      titleUnsigned: "music production for my upcoming album",
      summary: "Need full music production including mixing and mastering",
      summaryUnsigned: "need full music production including mixing and mastering",
      detailDescription: "Looking for professional music production services for 10 tracks. Genre: Electronic/Pop.",
      budget: { min: 2000, max: 5000 },
      currency: "USD",
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: GqlRequestStatus.Confirmed,
      type: GqlRequestType.DirectRequest,
      postCreatedTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      requestCreatedTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      artistId: "artist-002",
      packageId: "pkg-002",
      artist: [
        {
          __typename: "Artist",
          id: "artist-002",
          stageName: "BeatMaster Productions",
          avatarImage: null,
        },
      ],
    },
    {
      __typename: "Request",
      id: "req-003",
      requestUserId: user?.userId || "user-123",
      title: "Voice over for commercial",
      titleUnsigned: "voice over for commercial",
      summary: "Professional voice over needed for 60-second TV commercial",
      summaryUnsigned: "professional voice over needed for 60 second tv commercial",
      detailDescription: "Need a clear, professional voice for a tech product commercial. Must sound enthusiastic and trustworthy.",
      budget: { min: 300, max: 600 },
      currency: "USD",
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: GqlRequestStatus.Rejected,
      type: GqlRequestType.DirectRequest,
      postCreatedTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      requestCreatedTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      artistId: "artist-003",
      packageId: "pkg-003",
      artist: [
        {
          __typename: "Artist",
          id: "artist-003",
          stageName: "VoiceArt Studios",
          avatarImage: null,
        },
      ],
    },
    {
      __typename: "Request",
      id: "req-004",
      requestUserId: user?.userId || "user-123",
      title: "Website redesign project",
      titleUnsigned: "website redesign project",
      summary: "Complete website redesign with modern UI/UX",
      summaryUnsigned: "complete website redesign with modern ui ux",
      detailDescription: "Looking for a complete website redesign. Need modern, responsive design with excellent UX.",
      budget: { min: 1500, max: 3000 },
      currency: "USD",
      deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
      status: GqlRequestStatus.Canceled,
      type: GqlRequestType.DirectRequest,
      postCreatedTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      requestCreatedTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      artistId: "artist-004",
      packageId: "pkg-004",
      artist: [
        {
          __typename: "Artist",
          id: "artist-004",
          stageName: "Web Design Masters",
          avatarImage: null,
        },
      ],
    },
  ];

  // Build query filter - only show DIRECT_REQUEST type for listener's private requests
  const skip = (currentPage - 1) * pageSize;
  const where = {
    ...(debouncedSearchValue && { title: { contains: debouncedSearchValue } }),
    ...(statusFilter !== "ALL" && { status: { eq: statusFilter } }),
    ...(user?.userId && { requestUserId: { eq: user.userId } }),
    type: { eq: GqlRequestType.DirectRequest },
  };

  // Fetch requests
  const { data: requestsData, isLoading } = useQuery(myRequestsOptions(skip, pageSize, where));
  
  // Use mock data or real data
  const requests = MOCK_DATA ? mockRequests : (requestsData?.items || []);
  const totalItems = MOCK_DATA ? mockRequests.length : (requestsData?.totalCount || 0);
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
            {requests.map((request: RequestItem) => (
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
