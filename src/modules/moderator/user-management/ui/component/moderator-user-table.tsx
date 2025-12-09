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
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, ChevronLeft, ChevronRight, Eye, UserCheck, UserX, Search } from "lucide-react";
import { UserRole, UserStatus } from "@/gql/graphql";
import { ModeratorUserTableData } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

interface ModeratorUserTableProps {
  data: ModeratorUserTableData[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onStatusChange: (userId: string, status: UserStatus) => void;
}

export function ModeratorUserTable({
  data,
  totalCount,
  currentPage,
  pageSize,
  hasNextPage,
  hasPreviousPage,
  onStatusChange,
}: ModeratorUserTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const searchTerm = searchParams.get("search") || "";

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    params.set("page", "1"); // Reset to first page on search
    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case UserStatus.Active:
        return <Badge className="border-green-200 bg-green-100 text-green-800 hover:bg-green-100">ACTIVE</Badge>;
      case UserStatus.Inactive:
        return <Badge className="border-yellow-200 bg-yellow-100 text-yellow-800 hover:bg-yellow-100">INACTIVE</Badge>;
      case UserStatus.Banned:
        return <Badge className="border-red-200 bg-red-100 text-red-800 hover:bg-red-100">BANNED</Badge>;
      default:
        return <Badge className="border-gray-200 bg-gray-100 text-gray-800 hover:bg-gray-100">UNKNOWN</Badge>;
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case UserRole.Artist:
        return <Badge className="border-purple-200 bg-purple-100 text-purple-800 hover:bg-purple-100">ARTIST</Badge>;
      case UserRole.Listener:
        return <Badge className="border-blue-200 bg-blue-100 text-blue-800 hover:bg-blue-100">LISTENER</Badge>;
      default:
        return <Badge className="border-gray-200 bg-gray-100 text-gray-800 hover:bg-gray-100">{role}</Badge>;
    }
  };

  const columns: ColumnDef<ModeratorUserTableData>[] = [
    {
      accessorKey: "No.",
      header: "No.",
      cell: ({ row }) => <span className="text-gray-300">{(currentPage - 1) * pageSize + row.index + 1}</span>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "fullName",
      header: "User",
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          {row.original.avatarImage ? (
            <Image
              src={row.original.avatarImage}
              alt={row.original.fullName || "User"}
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500">
              <span className="text-sm font-medium text-white">
                {row.original.fullName?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
          )}
          <span className="font-medium text-gray-300">{row.original.fullName || "Unknown User"}</span>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <span className="text-gray-300">{row.original.email}</span>,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => getRoleBadge(row.original.role),
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: ({ row }) => (
        <span className="text-gray-300 capitalize">{row.original.gender?.toLowerCase() || "N/A"}</span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-gray-300">
          {new Date(row.original.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "User Status",
      cell: ({ row }) => getStatusBadge(row.original.status),
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
              onClick={() => {
                const role = row.original.role;
                router.push(`/moderator/user-management/${row.original.id}?role=${role}`);
              }}
              className="cursor-pointer text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>

            {row.original.status === UserStatus.Active ? (
              <DropdownMenuItem
                onClick={() => onStatusChange(row.original.id, UserStatus.Banned)}
                className="cursor-pointer text-red-300 hover:bg-gray-700 hover:text-red-200"
              >
                <UserX className="mr-2 h-4 w-4" />
                Ban User
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() => onStatusChange(row.original.id, UserStatus.Active)}
                className="cursor-pointer text-green-300 hover:bg-gray-700 hover:text-green-200"
              >
                <UserCheck className="mr-2 h-4 w-4" />
                Reactivate User
              </DropdownMenuItem>
            )}
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

  const handleSearchInput = (value: string) => {
    handleSearch(value);
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            placeholder="Search name..."
            value={searchTerm}
            onChange={(e) => handleSearchInput(e.target.value)}
            className="border-gray-700 bg-gray-800 pl-10 text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* Table */}
      <div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-gray-700 hover:bg-gray-700/50">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-gray-300">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-gray-700 hover:bg-gray-700/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-gray-300">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-gray-400">
                  No users found.
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
          users
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!hasPreviousPage}
            className="border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, Math.ceil(totalCount / pageSize)) }, (_, i) => {
              const pageNumber = Math.max(1, currentPage - 2) + i;
              if (pageNumber > Math.ceil(totalCount / pageSize)) return null;

              return (
                <Button
                  key={pageNumber}
                  variant={pageNumber === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNumber)}
                  className={
                    pageNumber === currentPage
                      ? "bg-blue-600 text-white"
                      : "border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }
                >
                  {pageNumber}
                </Button>
              );
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasNextPage}
            className="border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
