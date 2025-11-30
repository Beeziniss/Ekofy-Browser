"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ChevronLeft, ChevronRight, Eye, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { RequestsPublicQuery, RequestStatus } from "@/gql/graphql";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { BlockRequestDialog } from "./block-request-dialog";
import { useBlockPublicRequest } from "@/gql/client-mutation-options/public-request-mutation-options";

type RequestItem = NonNullable<NonNullable<RequestsPublicQuery["requests"]>["items"]>[0];

interface PublicRequestTableProps {
  data: RequestItem[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isLoading?: boolean;
  error?: Error | null;
}

export function PublicRequestTable({
  data,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  hasNextPage,
  hasPreviousPage,
  isLoading = false,
  error = null,
}: PublicRequestTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [blockingRequestId, setBlockingRequestId] = useState<string | null>(null);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const blockRequestMutation = useBlockPublicRequest();

  const formatStatus = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.Open:
        return "OPEN";
      case RequestStatus.Blocked:
        return "BLOCKED";
      default:
        return status;
    }
  };

  const getStatusVariant = (status: RequestStatus): "default" | "destructive" => {
    switch (status) {
      case RequestStatus.Open:
        return "default";
      case RequestStatus.Blocked:
        return "destructive";
      default:
        return "default";
    }
  };

  const formatBudget = (budget: { min: number; max: number } | null | undefined, currency: string) => {
    if (!budget) return "N/A";

    const formatCurrency = (amount: number) => {
      switch (currency.toUpperCase()) {
        case "VND":
          return `${amount.toLocaleString()} VND`;
        case "USD":
          return `$${amount.toLocaleString()}`;
        case "EUR":
          return `€${amount.toLocaleString()}`;
        default:
          return `${amount.toLocaleString()} ${currency.toUpperCase()}`;
      }
    };

    if (budget.min === budget.max) {
      return formatCurrency(budget.min);
    }
    return `${formatCurrency(budget.min)} - ${formatCurrency(budget.max)}`;
  };

  const handleBlockClick = (requestId: string) => {
    setBlockingRequestId(requestId);
    setShowBlockDialog(true);
  };

  const handleConfirmBlock = async () => {
    if (blockingRequestId) {
      await blockRequestMutation.mutateAsync(blockingRequestId);
      setShowBlockDialog(false);
      setBlockingRequestId(null);
    }
  };

  const columns: ColumnDef<RequestItem>[] = [
    {
      accessorKey: "No.",
      header: "No.",
      cell: ({ row }) => <span className="text-gray-300">{(currentPage - 1) * pageSize + row.index + 1}</span>,
    },
    {
      accessorKey: "requestor",
      header: "Requestor",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gray-700 text-sm text-gray-300">
              {row.original.requestor?.[0]?.displayName?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-gray-300">
            {row.original.requestor?.[0]?.displayName || `User ${row.original.requestUserId.slice(-4)}`}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <span className="font-medium text-gray-300">{row.original.title}</span>,
    },
    {
      accessorKey: "budget",
      header: "Budget",
      cell: ({ row }) => (
        <span className="text-gray-300">{formatBudget(row.original.budget ?? null, row.original.currency)}</span>
      ),
    },
    {
      accessorKey: "duration",
      header: "Duration",
      cell: ({ row }) => <span className="text-gray-300">{row.original.duration} days</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={getStatusVariant(row.original.status)} className="text-xs">
          {formatStatus(row.original.status)}
        </Badge>
      ),
    },
    {
      accessorKey: "postCreatedTime",
      header: "Posted",
      cell: ({ row }) => (
        <span className="text-xs text-gray-400">
          {formatDistanceToNow(new Date(row.original.postCreatedTime), { addSuffix: true })}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {row.original.status === RequestStatus.Open && (
                <DropdownMenuItem
                  onClick={() => router.push(`/moderator/public-request/${row.original.id}`)}
                  className="cursor-pointer text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
              )}
              {row.original.status === RequestStatus.Open && (
                <>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem
                  onClick={() => handleBlockClick(row.original.id)}
                  disabled={blockRequestMutation.isPending}
                  className="cursor-pointer text-red-400 hover:bg-gray-700 hover:text-red-300"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Block
                </DropdownMenuItem>
                </>
              )}
              {row.original.status !== RequestStatus.Open && (
                <div className="px-2 py-1.5 text-xs text-gray-400">No actions available</div>
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
    state: {
      sorting,
    },
    manualPagination: true,
    pageCount: Math.ceil(totalCount / pageSize),
  });

  const blockingRequest = data.find((r) => r.id === blockingRequestId);

  return (
    <>
      <div className="space-y-4">
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
                    <div className="text-red-400">Error loading requests: {error.message}</div>
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

      {blockingRequest && (
        <BlockRequestDialog
          open={showBlockDialog}
          onOpenChange={setShowBlockDialog}
          onConfirm={handleConfirmBlock}
          isLoading={blockRequestMutation.isPending}
          requestTitle={blockingRequest.title || "this request"}
        />
      )}
    </>
  );
}
