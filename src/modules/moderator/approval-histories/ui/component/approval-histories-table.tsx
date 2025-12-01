"use client";

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
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
import { MoreHorizontal, ChevronLeft, ChevronRight, Eye, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ApprovalHistoryItem } from "@/types";
interface ApprovalHistoriesTableProps {
  data: ApprovalHistoryItem[]; // Using ApprovalHistoryItem[] to work with GraphQL response
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onSearch: (searchTerm: string) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  searchTerm: string; // Add searchTerm prop to control input value
  isLoading?: boolean; // Add loading state
  error?: Error | null; // Add error state
}

export function ApprovalHistoriesTable({
  data,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onSearch,
  hasNextPage,
  hasPreviousPage,
  searchTerm,
  isLoading = false,
  // error = null,
}: ApprovalHistoriesTableProps) {
  const router = useRouter();

  const handleViewDetail = (historyId: string) => {
    router.push(`/moderator/approval-histories/${historyId}`);
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case "APPROVED":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">APPROVED</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">REJECTED</Badge>;
      case "PENDING":
        return <Badge variant="secondary">PENDING</Badge>;
      default:
        return <Badge variant="outline">{action}</Badge>;
    }
  };

  const columns: ColumnDef<ApprovalHistoryItem>[] = [
    {
      accessorKey: "No.",
      header: "No.",
      cell: ({ row }) => <span className="text-gray-300">{(currentPage - 1) * pageSize + row.index + 1}</span>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <span className="font-mono text-xs">{row.original.snapshot.Email}</span>,
    },
    {
      accessorKey: "approvalType",
      header: "Type",
      cell: ({ row }) => <Badge variant="outline">{row.original.approvalType.replace("_", " ")}</Badge>,
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => getActionBadge(row.original.action),
    },
    {
      accessorKey: "approvedBy",
      header: "Approved By",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.approvedBy[0]?.fullName || "Unknown"}</div>
          <div className="text-muted-foreground text-sm">{row.original.approvedBy[0]?.email || "Unknown"}</div>
        </div>
      ),
    },
    {
      accessorKey: "actionAt",
      header: "Action Date",
      cell: ({ row }) => <span>{format(new Date(row.original.actionAt), "MMM dd, yyyy HH:mm")}</span>,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleViewDetail(row.original.id)}>
              <Eye className="mr-2 h-4 w-4" />
              View Detail
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
  });

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
          <Input
            placeholder="Search histories..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-muted-foreground text-sm">
          Page {currentPage} of {totalPages} ({totalCount} total)
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPreviousPage || isLoading}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNextPage || isLoading}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
