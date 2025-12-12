"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { UserManagementArtist } from "@/types/user-management";

// Extended interface for artist approval data with additional fields
interface ArtistApprovalTableData extends Omit<UserManagementArtist, "followers"> {
  fullName?: string;
  gender?: string;
  birthDate?: string;
  phoneNumber?: string;
  followers?: number;
  followerCount?: number;
  requestedAt: string;
}

interface ArtistApprovalTableProps {
  data: ArtistApprovalTableData[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onSearch: (searchTerm: string) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  searchTerm: string;
  isLoading?: boolean;
  error?: Error | null;
}

export function ArtistApprovalTable({
  data,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onSearch,
  hasNextPage,
  hasPreviousPage,
  searchTerm, // Receive searchTerm from parent
  isLoading = false,
  error = null,
}: ArtistApprovalTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns: ColumnDef<ArtistApprovalTableData>[] = [
    {
      accessorKey: "No.",
      header: "No.",
      cell: ({ row }) => <span className="text-gray-300">{(currentPage - 1) * pageSize + row.index + 1}</span>,
    },
    {
      accessorKey: "stageName",
      header: "Stage Name",
      cell: ({ row }) => <span className="font-medium text-gray-300">{row.original.stageName}</span>,
    },
    {
      accessorKey: "fullName",
      header: "Full Name",
      cell: ({ row }) => <span className="text-gray-300">{row.original.fullName}</span>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <span className="text-gray-300">{row.original.email}</span>,
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone",
      cell: ({ row }) => <span className="text-gray-300">{row.original.phoneNumber || "N/A"}</span>,
    },
    {
      accessorKey: "artistType",
      header: "Type",
      cell: ({ row }) => <span className="text-gray-300 capitalize">{row.original.artistType.toLowerCase()}</span>,
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: ({ row }) => (
        <span className="text-gray-300 capitalize">{row.original.gender?.toLowerCase() || "N/A"}</span>
      ),
    },
    {
      accessorKey: "birthDate",
      header: "Birth Date",
      cell: ({ row }) => (
        <span className="text-gray-300">
          {row.original.birthDate
            ? new Date(row.original.birthDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "N/A"}
        </span>
      ),
    },
    {
      accessorKey: "requestedAt",
      header: "Requested At",
      cell: ({ row }) => (
        <span className="text-gray-300">
          {new Date(row.original.requestedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="border-gray-700 bg-gray-800">
            <DropdownMenuItem
              onClick={() => router.push(`/moderator/artist-approval/${row.original.id}`)}
              className="cursor-pointer text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              View Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    manualPagination: true,
    pageCount: Math.ceil(totalCount / pageSize),
  });

  const handleSearch = (value: string) => {
    onSearch(value);
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search name..."
          value={searchTerm}
          onChange={(event) => handleSearch(event.target.value)}
          className="max-w-sm border-gray-700 bg-gray-800 text-white placeholder-gray-400"
        />
      </div>

      {/* Table */}
      <div className="relative">
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-md bg-gray-900/50">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-white"></div>
              <span className="text-white">Loading...</span>
            </div>
          </div>
        )}

        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-gray-700 hover:bg-gray-800">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-gray-300">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {error ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="text-red-400">Error loading artists: {error.message}</div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-gray-700 hover:bg-gray-800"
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-gray-400">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-gray-400">
          Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount}{" "}
          entries
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPreviousPage || isLoading}
            className="border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNextPage || isLoading}
            className="border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-50"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
