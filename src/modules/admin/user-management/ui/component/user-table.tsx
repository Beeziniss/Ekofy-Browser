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

import { MoreHorizontal, Eye, CreditCard, UserCheck, UserX, Search, Plus } from "lucide-react";
import { UserStatus } from "@/gql/graphql";
import { useRouter } from "next/navigation";
import { UserManagementUser } from "@/types";
import { activeInactiveStatusBadge } from "@/modules/shared/ui/components/status/status-badges";
import { CustomPagination } from "@/components/ui/custom-pagination";
interface UserTableProps {
  data: UserManagementUser[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onSearch: (searchTerm: string) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  searchTerm: string;
  onStatusChange: (userId: string, status: UserStatus) => void;
  onCreateModerator: () => void;
  isLoading: boolean;
  error: Error | null;
}

export function UserTable({
  data,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onSearch,
  searchTerm,
  onStatusChange,
  onCreateModerator,
  isLoading,
  error,
}: UserTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns: ColumnDef<UserManagementUser>[] = [
    {
      accessorKey: "fullName",
      header: "User",
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <span className="font-medium text-white">{row.original.fullName || "User name"}</span>
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
      cell: ({ row }) => <span className="text-gray-300 capitalize">{row.original.role?.toLowerCase()}</span>,
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
      cell: ({ row }) => {
        const status = row.original.status;
        return activeInactiveStatusBadge(status);
      },
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const isActive = row.original.status === UserStatus.Active;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[180px] border-gray-700 bg-gray-800">
              <DropdownMenuItem
                onClick={() => {
                  const role = row.original.role;
                  router.push(`/admin/user-management/${row.original.id}?role=${role}`);
                }}
                className="flex cursor-pointer items-center gap-2 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <Eye className="h-4 w-4" />
                View Detail
              </DropdownMenuItem>
              <DropdownMenuItem className="flex cursor-pointer items-center gap-2 text-gray-300 hover:bg-gray-700 hover:text-white">
                <CreditCard className="h-4 w-4" />
                View Payment History
              </DropdownMenuItem>
              {/* Conditional Status Toggle */}
              {isActive ? (
                <DropdownMenuItem
                  onClick={() => onStatusChange(row.original.id, UserStatus.Banned)}
                  className="flex cursor-pointer items-center gap-2 text-red-400 hover:bg-gray-700 hover:text-red-300"
                >
                  <UserX className="h-4 w-4" />
                  Ban
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => onStatusChange(row.original.id, UserStatus.Active)}
                  className="flex cursor-pointer items-center gap-2 text-green-400 hover:bg-gray-700 hover:text-green-300"
                >
                  <UserCheck className="h-4 w-4" />
                  Active
                </DropdownMenuItem>
              )}
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
      {/* Header with Search and Create Button */}
      <div className="flex items-center justify-between">
        {/* <div className="flex items-center space-x-4"> */}
        <div className="relative w-full max-w-sm">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search name..."
            value={searchTerm}
            onChange={(event) => handleSearch(event.target.value)}
            className="border-gray-700 bg-gray-800 pl-9 text-white placeholder-gray-400"
          />
        </div>
        <Button onClick={onCreateModerator} className="bg-white text-gray-900 hover:bg-gray-100">
          <Plus className="mr-2 h-4 w-4" />
          Create Moderator
        </Button>
        {/* </div> */}
      </div>

      {/* Table */}
      <div>
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-gray-400">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-red-400">
                  Error loading users: {error.message}
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
      <CustomPagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalCount / pageSize)}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={onPageChange}
        isLoading={isLoading}
      />
    </div>
  );
}
