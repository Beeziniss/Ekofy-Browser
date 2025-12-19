"use client";

import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import type { ColumnDef, SortingState, OnChangeFn } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ArtistType, ReportRelatedContentType, ReportType } from "@/gql/graphql";
import { MoreHorizontal, Eye, Flag } from "lucide-react";
import { ReportDialog } from "@/modules/shared/ui/components/report-dialog";

export interface PendingTrackUploadRequest {
  id: string;
  requestedAt: string;
  createdBy: string;
  track: {
    id: string;
    name: string;
    description?: string | null;
    type: string;
    coverImage?: string | null;
    isExplicit: boolean;
    requestedAt: string;
    releaseInfo?: {
      isRelease: boolean;
      releaseDate?: string | null;
      releasedAt?: string | null;
      releaseStatus?: string | null;
    } | null;
  };
  mainArtists?: {
    __typename?: "MainArtistsCollectionSegment";
    items?:
      | {
          __typename?: "Artist";
          id: string;
          userId: string;
          stageName: string;
          stageNameUnsigned: string;
          email: string;
          artistType: ArtistType;
          avatarImage?: string | null;
        }[]
      | null;
  } | null;
  featuredArtists?: {
    __typename?: "FeaturedArtistsCollectionSegment";
    items?:
      | {
          __typename?: "Artist";
          id: string;
          userId: string;
          stageName: string;
          stageNameUnsigned: string;
          email: string;
        }[]
      | null;
  } | null;
}

interface PendingRequestsTableProps {
  data: PendingTrackUploadRequest[];
  currentPage?: number;
  pageSize?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

const PendingRequestsTable = ({
  data,
  currentPage = 1,
  pageSize = 10,
  totalCount = 0,
  onPageChange,
  onPageSizeChange,
  sorting = [],
  onSortingChange,
  hasNextPage = false,
  hasPreviousPage = false,
}: PendingRequestsTableProps) => {
  const [rowSelection, setRowSelection] = useState({});
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<PendingTrackUploadRequest | null>(null);

  const columns: ColumnDef<PendingTrackUploadRequest>[] = [
    {
      id: "number",
      header: "No.",
      cell: ({ row }) => {
        const rowNumber = (currentPage - 1) * pageSize + row.index + 1;
        return <span className="text-main-white text-sm font-medium">{rowNumber}</span>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Track",
      cell: ({ row }) => {
        const request = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="primary_gradient size-12 flex-shrink-0 rounded-md">
              {request.track.coverImage ? (
                <Image
                  src={request.track.coverImage}
                  alt={request.track.name}
                  width={48}
                  height={48}
                  className="size-12 rounded-md object-cover"
                />
              ) : (
                <div className="primary_gradient size-12 rounded-md" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-main-white truncate font-medium">{request.track.name}</p>
              <div className="text-main-grey truncate text-sm">
                {request.mainArtists?.items?.map((artist) => artist.stageName).join(", ") || "Unknown Artist"}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "requestedAt",
      header: "Requested",
      cell: ({ row }) => {
        const requestedAt = row.original.requestedAt;
        const timeAgo = formatDistanceToNow(new Date(requestedAt), { addSuffix: true });
        return <span className="text-main-white text-sm">{timeAgo}</span>;
      },
    },
    {
      accessorKey: "isExplicit",
      header: "Explicit",
      cell: ({ row }) => {
        const isExplicit = row.original.track.isExplicit;
        return <Badge variant={isExplicit ? "destructive" : "ekofy"}>{isExplicit ? "Explicit" : "Clean"}</Badge>;
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const request = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/artist/studio/tracks/pending/${request.id}`} className="flex items-center cursor-pointer">
                  <Eye className="mr-2 h-4 w-4" />
                  <span>View</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedRequest(request);
                  setReportDialogOpen(true);
                }}
              >
                <Flag className="mr-2 h-4 w-4" />
                <span>Report</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: onSortingChange,
    state: {
      rowSelection,
      sorting,
    },
    manualPagination: true,
    pageCount: Math.ceil(totalCount / pageSize),
  });

  const totalPages = Math.ceil(totalCount / pageSize);

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink onClick={() => onPageChange?.(i)} isActive={currentPage === i} className="cursor-pointer">
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      }
    } else {
      // Show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink onClick={() => onPageChange?.(1)} isActive={currentPage === 1} className="cursor-pointer">
            1
          </PaginationLink>
        </PaginationItem>,
      );

      // Show ellipsis if needed
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }

      // Show pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        if (i !== 1 && i !== totalPages) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink onClick={() => onPageChange?.(i)} isActive={currentPage === i} className="cursor-pointer">
                {i}
              </PaginationLink>
            </PaginationItem>,
          );
        }
      }

      // Show ellipsis if needed
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }

      // Show last page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              onClick={() => onPageChange?.(totalPages)}
              isActive={currentPage === totalPages}
              className="cursor-pointer"
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>,
        );
      }
    }

    return items;
  };

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="text-main-white">
                  {header.isPlaceholder ? null : (
                    <div>
                      {typeof header.column.columnDef.header === "string" ? header.column.columnDef.header : null}
                    </div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={`${cell.column.id === "number" ? "w-12" : ""} ${cell.column.id === "requestedAt" ? "w-32" : ""} ${cell.column.id === "isExplicit" ? "w-25" : ""} ${cell.column.id === "actions" ? "w-12" : ""}`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <span className="text-main-grey">No pending requests found.</span>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex w-full items-center justify-between px-2 py-4">
        <div className="text-main-grey shrink-0 text-sm">
          Showing {Math.min((currentPage - 1) * pageSize + 1, totalCount)} to{" "}
          {Math.min(currentPage * pageSize, totalCount)} of {totalCount} entries
        </div>

        <div className="flex items-center gap-4">
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-main-white text-sm">Rows per page</span>
            <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange?.(Number(value))}>
              <SelectTrigger className="w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => hasPreviousPage && onPageChange?.(currentPage - 1)}
                    className={`cursor-pointer ${!hasPreviousPage ? "pointer-events-none opacity-50" : ""}`}
                  />
                </PaginationItem>
                {renderPaginationItems()}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => hasNextPage && onPageChange?.(currentPage + 1)}
                    className={`cursor-pointer ${!hasNextPage ? "pointer-events-none opacity-50" : ""}`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>

      {selectedRequest && (
        <ReportDialog
          reportType={ReportType.UnapprovedUploadedTrack}
          contentType={ReportRelatedContentType.Track}
          contentId={selectedRequest.track.id}
          reportedUserId={selectedRequest.createdBy}
          reportedUserName={selectedRequest.track.name}
          open={reportDialogOpen}
          onOpenChange={setReportDialogOpen}
        />
      )}
    </div>
  );
};

export default PendingRequestsTable;
