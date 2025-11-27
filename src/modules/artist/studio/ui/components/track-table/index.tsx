"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  OnChangeFn,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import Image from "next/image";
import {
  CircleArrowDownIcon,
  EarthIcon,
  EllipsisVerticalIcon,
  HeartIcon,
  LockIcon,
  MessageSquareTextIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export interface Track {
  id: string;
  name: string;
  mainArtistIds: string[];
  streamCount: number;
  favoriteCount: number;
  coverImage: string;
  isExplicit: boolean;
  releaseInfo: {
    releaseDate?: string;
    isRelease: boolean;
  };
  mainArtists?: {
    __typename?: "MainArtistsCollectionSegment";
    items?:
      | {
          __typename?: "Artist";
          stageName: string;
        }[]
      | null;
  } | null;
}

interface TrackTableProps {
  data: Track[];
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

const TrackTable = ({
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
}: TrackTableProps) => {
  const [rowSelection, setRowSelection] = useState({});

  const columns: ColumnDef<Track>[] = [
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
        const track = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="primary_gradient size-12 flex-shrink-0 rounded-md">
              {track.coverImage ? (
                <Image
                  src={track.coverImage}
                  alt={track.name}
                  width={48}
                  height={48}
                  className="size-12 rounded-md object-cover"
                />
              ) : (
                <div className="primary_gradient size-12 rounded-md" />
              )}
            </div>
            <div className="min-w-0">
              <div className="truncate font-medium text-white">{track.name}</div>
              <div className="text-main-grey truncate text-sm">
                {track.mainArtists?.items?.map((artist) => artist.stageName).join(", ") || "Unknown Artist"}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "isReleased",
      header: "Privacy",
      cell: ({ row }) => {
        const isReleased = row.original.releaseInfo.isRelease;
        return (
          <div className="flex items-center gap-2">
            {isReleased ? (
              <EarthIcon className="text-main-white size-4" />
            ) : (
              <LockIcon className="text-main-white size-4" />
            )}
            <span className="text-main-white text-sm">{isReleased ? "Public" : "Private"}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "releaseDate",
      header: "Released Date",
      cell: ({ row }) => {
        const releaseDate = row.original.releaseInfo.releaseDate;
        if (!releaseDate) {
          return <span className="text-main-white text-sm">Jan 01, 2025</span>;
        }
        const date = new Date(releaseDate);
        const formattedDate = date.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        });
        return <span className="text-main-white text-sm">{formattedDate}</span>;
      },
    },
    {
      accessorKey: "streamCount",
      header: "Streams",
      cell: ({ row }) => {
        const streamCount = row.original.streamCount;
        const formattedCount = streamCount >= 1000 ? `${Math.floor(streamCount / 1000)}K` : streamCount.toString();
        return <span className="text-main-white text-sm">{formattedCount}</span>;
      },
    },
    {
      id: "interactions",
      header: "Interactions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-1">
              <HeartIcon className="text-main-grey-dark-1 size-4" />
              <span className="text-main-grey-dark-1 text-sm">{row.original.favoriteCount || "—"}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquareTextIcon className="text-main-grey-dark-1 size-4" />
              <span className="text-main-grey-dark-1 text-sm">—</span>
            </div>
            <div className="flex items-center gap-1">
              <CircleArrowDownIcon className="text-main-grey-dark-1 size-4" />
              <span className="text-main-grey-dark-1 text-sm">—</span>
            </div>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: () => {
        return (
          <Button variant="ghost" className="text-main-white px-2 py-1.5">
            <EllipsisVerticalIcon className="size-4" />
          </Button>
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
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="text-main-white">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="border-gray-800">
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={`${cell.column.id === "number" ? "w-12" : ""} ${cell.column.id === "isReleased" ? "w-34" : ""} ${cell.column.id === "releaseDate" ? "w-42" : ""} ${cell.column.id === "streamCount" ? "w-28" : ""} ${cell.column.id === "interactions" ? "w-64" : ""} ${cell.column.id === "actions" ? "w-12" : ""}`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
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
            <span className="text-main-grey text-sm">Rows per page:</span>
            <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange?.(parseInt(value))}>
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="top" align="end">
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
                    className={`cursor-pointer ${!hasPreviousPage ? "pointer-events-none opacity-50" : ""}`}
                  />
                </PaginationItem>

                {renderPaginationItems()}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
                    className={`cursor-pointer ${!hasNextPage ? "pointer-events-none opacity-50" : ""}`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackTable;
