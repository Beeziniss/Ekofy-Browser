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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, ChevronLeft, ChevronRight, Search, Filter, Plus, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CouponStatus } from "@/gql/graphql";

type CouponItem = {
  id: string;
  stripeCouponId: string;
  name: string;
  description?: string | null;
  code: string;
  percentOff: number;
  duration: string;
  purpose: string;
  status: CouponStatus;
  createdAt: string;
  updatedAt?: string | null;
};

interface CouponTableProps {
  data: CouponItem[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onSearch: (searchTerm: string) => void;
  onStatusFilter: (status: string) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  searchTerm: string;
  statusFilter: string;
  isLoading?: boolean;
  error?: Error | null;
  onCreateCoupon?: () => void;
}

export function CouponTable({
  data,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onSearch,
  onStatusFilter,
  hasNextPage,
  hasPreviousPage,
  searchTerm,
  statusFilter,
  isLoading = false,
  onCreateCoupon,
}: CouponTableProps) {
  const router = useRouter();

  const getStatusBadge = (status: CouponStatus) => {
    switch (status) {
      case CouponStatus.Active:
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>;
      case CouponStatus.Deprecated:
        return <Badge variant="destructive">Deprecated</Badge>;
      case CouponStatus.Expired:
        return <Badge variant="secondary">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const columns: ColumnDef<CouponItem>[] = [
    {
      accessorKey: "No.",
      header: "No.",
      cell: ({ row }) => <span className="text-gray-300">{(currentPage - 1) * pageSize + row.index + 1}</span>,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => (
        <span className="font-mono text-sm bg-gray-800 px-2 py-1 rounded">{row.original.code}</span>
      ),
    },
    {
      accessorKey: "percentOff",
      header: "Discount",
      cell: ({ row }) => <span className="font-semibold">{row.original.percentOff}%</span>,
    },
    {
      accessorKey: "duration",
      header: "Duration",
      cell: ({ row }) => <span className="capitalize">{row.original.duration.replace(/_/g, " ")}</span>,
    },
    {
      accessorKey: "purpose",
      header: "Purpose",
      cell: ({ row }) => <span className="capitalize">{row.original.purpose.replace(/_/g, " ")}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => <span>{format(new Date(row.original.createdAt), "MMM dd, yyyy")}</span>,
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
            <DropdownMenuItem onClick={() => router.push(`/admin/coupon/${row.original.id}`)}>
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
      {/* Search and Filters */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative max-w-sm flex-1">
            <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
            <Input
              placeholder="Search by name, code, or description..."
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-8"
            />
          </div>

          <Select value={statusFilter} onValueChange={onStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="ALL" value="ALL">
                All Status
              </SelectItem>
              <SelectItem key={CouponStatus.Active} value={CouponStatus.Active}>
                Active
              </SelectItem>
              <SelectItem key={CouponStatus.Deprecated} value={CouponStatus.Deprecated}>
                Deprecated
              </SelectItem>
              <SelectItem key={CouponStatus.Expired} value={CouponStatus.Expired}>
                Expired
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {onCreateCoupon && (
          <Button onClick={onCreateCoupon} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Coupon
          </Button>
        )}
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
                  No coupons found.
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

