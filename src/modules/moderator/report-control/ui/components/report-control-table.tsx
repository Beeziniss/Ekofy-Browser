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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ChevronLeft, ChevronRight, Eye, UserCheck, FileCheck, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { ReportStatus, ReportRelatedContentType, ReportQueriesQuery, ReportAction } from "@/gql/graphql";
import { REPORT_TYPE_LABELS, CONTENT_TYPE_LABELS } from "@/types/report";

type ReportItem = NonNullable<NonNullable<ReportQueriesQuery["reports"]>["items"]>[0];

interface ReportControlTableProps {
  data: ReportItem[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onSearch: (searchTerm: string) => void;
  onStatusChange: (status: ReportStatus | "all") => void;
  onContentTypeChange: (contentType: ReportRelatedContentType | "all" | "none") => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  searchTerm: string;
  statusFilter: ReportStatus | "all";
  contentTypeFilter: ReportRelatedContentType | "all" | "none";
  currentUserId?: string;
  isAssigning: boolean;
  onAssignToMe: (reportId: string) => void;
  onProcess: (reportId: string) => void;
  onRestoreUser?: (reportId: string) => void;
  onRestoreContent?: (reportId: string) => void;
  isLoading?: boolean;
  error?: Error | null;
}

const STATUS_CONFIG: Record<ReportStatus, {
  label: string;
  className: string;
}> = {
  [ReportStatus.Pending]: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700",
  },
  [ReportStatus.UnderReview]: {
    label: "Under Review",
    className: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700",
  },
  [ReportStatus.Approved]: {
    label: "Approved",
    className: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700",
  },
  [ReportStatus.Rejected]: {
    label: "Rejected",
    className: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700",
  },
  [ReportStatus.Restored]: {
    label: "Restored",
    className: "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800/30 dark:text-gray-400 dark:border-gray-700",
  },
  [ReportStatus.Escalated]: {
    label: "Escalated",
    className: "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-700",
  },
};

const STATUS_LABELS: Record<ReportStatus, string> = {
  [ReportStatus.Pending]: "Pending",
  [ReportStatus.UnderReview]: "Under Review",
  [ReportStatus.Approved]: "Approved",
  [ReportStatus.Rejected]: "Rejected",
  [ReportStatus.Restored]: "Restored",
  [ReportStatus.Escalated]: "Escalated",
};

const CONTENT_TYPE_FILTER_LABELS: Partial<Record<ReportRelatedContentType, string>> = {
  [ReportRelatedContentType.Track]: "Track",
  [ReportRelatedContentType.Comment]: "Comment", 
  [ReportRelatedContentType.Request]: "Request",
};

export function ReportControlTable({
  data,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onSearch,
  onStatusChange,
  onContentTypeChange,
  hasNextPage,
  hasPreviousPage,
  searchTerm,
  statusFilter,
  contentTypeFilter,
  currentUserId,
  isAssigning,
  onAssignToMe,
  onProcess,
  onRestoreUser,
  onRestoreContent,
  isLoading = false,
  error = null,
}: ReportControlTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns: ColumnDef<ReportItem>[] = [
    {
      accessorKey: "No.",
      header: "No.",
      cell: ({ row }) => <span className="text-gray-300">{(currentPage - 1) * pageSize + row.index + 1}</span>,
    },
    {
      accessorKey: "reportType",
      header: "Type",
      cell: ({ row }) => (
        <div className="space-y-1">
          <Badge variant="outline" className="text-gray-300">{REPORT_TYPE_LABELS[row.original.reportType]}</Badge>
          <div className="text-xs text-gray-400">
            {row.original.relatedContentType 
              ? CONTENT_TYPE_LABELS[row.original.relatedContentType as ReportRelatedContentType] 
              : "User"
            }
          </div>
        </div>
      ),
    },
    {
      accessorKey: "nicknameReporter",
      header: "Reporter",
      cell: ({ row }) => <span className="text-gray-300">{row.original.nicknameReporter || "N/A"}</span>,
    },
    {
      accessorKey: "nicknameReported",
      header: "Reported User",
      cell: ({ row }) => <span className="text-gray-300">{row.original.nicknameReported || "N/A"}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant="outline" className={STATUS_CONFIG[row.original.status].className}>
          {STATUS_CONFIG[row.original.status].label}
        </Badge>
      ),
    },
    {
      accessorKey: "assignedModerator",
      header: "Assigned User",
      cell: ({ row }) => (
        <span className="text-gray-300">{row.original.userAssignedTo?.[0]?.fullName || "Not assigned"}</span>
      ),
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        if (!row.original.priority) return null;
        return (
          <Badge 
            variant="outline" 
            className={`${
              row.original.priority === 'HIGH' 
                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' 
                : row.original.priority === 'MEDIUM'
                ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
            }`}
          >
            <span className="font-semibold">{row.original.priority}</span>
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created Date",
      cell: ({ row }) => (
        <span className="text-gray-300">{format(new Date(row.original.createdAt), "dd/MM/yyyy HH:mm", { locale: vi })}</span>
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
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() => router.push(`/moderator/report-control/${row.original.id}`)}
              className="cursor-pointer text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            
            {!row.original.assignedModeratorId && (
              <>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem
                  onClick={() => onAssignToMe(row.original.id)}
                  disabled={isAssigning}
                  className="cursor-pointer text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  <UserCheck className="mr-2 h-4 w-4" />
                  Assign to Me
                </DropdownMenuItem>
              </>
            )}
            
            {row.original.assignedModeratorId === currentUserId &&
              row.original.status !== ReportStatus.Approved &&
              row.original.status !== ReportStatus.Rejected &&
              row.original.status !== ReportStatus.Restored && (
                <>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem
                    onClick={() => onProcess(row.original.id)}
                    className="cursor-pointer text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <FileCheck className="mr-2 h-4 w-4" />
                    Process Report
                  </DropdownMenuItem>
                </>
              )}

            {onRestoreUser && 
              row.original.actionTaken && 
              (row.original.actionTaken === ReportAction.Suspended || 
               row.original.actionTaken === ReportAction.PermanentBan ||
               row.original.actionTaken === ReportAction.EntitlementRestriction) &&
              row.original.status === ReportStatus.Approved && (
                <>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem
                    onClick={() => onRestoreUser(row.original.id)}
                    className="cursor-pointer text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Restore User
                  </DropdownMenuItem>
                </>
              )}

            {onRestoreContent && 
              row.original.actionTaken && 
              row.original.actionTaken === ReportAction.ContentRemoval &&
              row.original.status === ReportStatus.Approved && (
                <>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem
                    onClick={() => onRestoreContent(row.original.id)}
                    className="cursor-pointer text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Restore Content
                  </DropdownMenuItem>
                </>
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

  const handleSearch = (value: string) => {
    onSearch(value);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search by user name..."
          value={searchTerm}
          onChange={(event) => handleSearch(event.target.value)}
          className="max-w-sm border-gray-700 bg-gray-800 text-white placeholder-gray-400"
        />
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[180px] border-gray-700 bg-gray-800 text-white">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent className="border-gray-700 bg-gray-800">
            <SelectItem value="all" className="text-gray-300 hover:bg-gray-700">All Status</SelectItem>
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key} className="text-gray-300 hover:bg-gray-700">
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={contentTypeFilter} onValueChange={onContentTypeChange}>
          <SelectTrigger className="w-[180px] border-gray-700 bg-gray-800 text-white">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent className="border-gray-700 bg-gray-800">
            <SelectItem value="all" className="text-gray-300 hover:bg-gray-700">All Types</SelectItem>
            <SelectItem value="none" className="text-gray-300 hover:bg-gray-700">User Reports (No Content)</SelectItem>
            {Object.entries(CONTENT_TYPE_FILTER_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key} className="text-gray-300 hover:bg-gray-700">
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
                  <div className="text-red-400">Error loading reports: {error.message}</div>
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
