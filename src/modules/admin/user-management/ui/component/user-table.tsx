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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, ChevronLeft, ChevronRight, Eye, CreditCard, UserCheck, UserX, Search } from "lucide-react";
import { UserStatus } from "@/gql/graphql";
import { useRouter } from "next/navigation";
import { UserManagementUser } from "@/types";
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
  hasNextPage,
  hasPreviousPage,
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
          <span className="font-medium text-white">{row.original.fullName || 'User name'}</span>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <span className="text-gray-300">{row.original.email}</span>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <span className="text-gray-300 capitalize">
          {row.original.role?.toLowerCase()}
        </span>
      ),
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: ({ row }) => (
        <span className="text-gray-300 capitalize">
          {row.original.gender?.toLowerCase() || "N/A"}
        </span>
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
        return (
          <Badge
            variant={status === UserStatus.Active ? "default" : "secondary"}
            className={`
              ${status === UserStatus.Active 
                ? "bg-green-100 text-green-800 border-green-200" 
                : status === UserStatus.Inactive
                ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                : "bg-red-100 text-red-800 border-red-200"
              }
            `}
          >
            {status}
          </Badge>
        );
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
            <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 min-w-[180px]">
              <DropdownMenuItem
                onClick={() => {
                  const role = row.original.role;
                  router.push(`/admin/user-management/${row.original.id}?role=${role}`);
                }}
                className="text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                View Detail
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer flex items-center gap-2"
              >
                <CreditCard className="h-4 w-4" />
                View Payment History
              </DropdownMenuItem>
              {/* Conditional Status Toggle */}
              {isActive ? (
                <DropdownMenuItem
                  onClick={() => onStatusChange(row.original.id, UserStatus.Banned)}
                  className="text-red-400 hover:text-red-300 hover:bg-gray-700 cursor-pointer flex items-center gap-2"
                >
                  <UserX className="h-4 w-4" />
                  Banned
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => onStatusChange(row.original.id, UserStatus.Active)}
                  className="text-green-400 hover:text-green-300 hover:bg-gray-700 cursor-pointer flex items-center gap-2"
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search name..."
            value={searchTerm}
            onChange={(event) => handleSearch(event.target.value)}
            className="pl-9 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
          />
        </div>
          <Button 
            onClick={onCreateModerator}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
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
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
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
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
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
          Showing {isLoading ? 0 : (currentPage - 1) * pageSize + 1} to{" "}
          {isLoading ? 0 : Math.min(currentPage * pageSize, totalCount)} of {isLoading ? 0 : totalCount} entries
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPreviousPage || isLoading}
            className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          {/* Page Numbers */}
          {!isLoading && totalCount > 0 && (
            <div className="flex items-center space-x-1">
              {(() => {
                const totalPages = Math.ceil(totalCount / pageSize);
                const pages = [];
                
                // Calculate which pages to show
                let startPage = Math.max(1, currentPage - 2);
                let endPage = Math.min(totalPages, currentPage + 2);
                
                // Adjust if we're near the beginning or end
                if (currentPage <= 3) {
                  endPage = Math.min(5, totalPages);
                }
                if (currentPage >= totalPages - 2) {
                  startPage = Math.max(1, totalPages - 4);
                }
                
                // Add first page and ellipsis if needed
                if (startPage > 1) {
                  pages.push(
                    <Button
                      key={1}
                      variant="outline"
                      size="sm"
                      onClick={() => onPageChange(1)}
                      className="w-8 h-8 p-0 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
                      style={currentPage === 1 ? {
                        backgroundColor: '#2563eb',
                        borderColor: '#2563eb',
                        color: 'white'
                      } : {}}
                    >
                      1
                    </Button>
                  );
                  if (startPage > 2) {
                    pages.push(
                      <span key="ellipsis1" className="text-gray-400 px-2">
                        ...
                      </span>
                    );
                  }
                }
                
                // Add the current range of pages
                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      onClick={() => onPageChange(i)}
                      className="w-8 h-8 p-0 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
                      style={currentPage === i ? {
                        backgroundColor: '#2563eb',
                        borderColor: '#2563eb',
                        color: 'white'
                      } : {}}
                    >
                      {i}
                    </Button>
                  );
                }
                
                // Add ellipsis and last page if needed
                if (endPage < totalPages) {
                  if (endPage < totalPages - 1) {
                    pages.push(
                      <span key="ellipsis2" className="text-gray-400 px-2">
                        ...
                      </span>
                    );
                  }
                  pages.push(
                    <Button
                      key={totalPages}
                      variant="outline"
                      size="sm"
                      onClick={() => onPageChange(totalPages)}
                      className="w-8 h-8 p-0 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
                      style={currentPage === totalPages ? {
                        backgroundColor: '#2563eb',
                        borderColor: '#2563eb',
                        color: 'white'
                      } : {}}
                    >
                      {totalPages}
                    </Button>
                  );
                }
                
                return pages;
              })()}
            </div>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNextPage || isLoading}
            className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-50"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}