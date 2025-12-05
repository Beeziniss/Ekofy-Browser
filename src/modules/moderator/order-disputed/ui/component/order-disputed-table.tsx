"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ChevronLeft, ChevronRight, Eye, AlertCircle } from "lucide-react";
import { PackageOrderStatus } from "@/gql/graphql";
import { useRouter, useSearchParams } from "next/navigation";
import { formatCurrency } from "@/utils/format-currency";
import { formatDate } from "@/utils/format-date";
import { PackageOrderItem } from "@/types";
import Image from "next/image";

interface OrderDisputedTableProps {
  data: PackageOrderItem[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function OrderDisputedTable({
  data,
  totalCount,
  currentPage,
  pageSize,
  hasNextPage,
  hasPreviousPage,
}: OrderDisputedTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sorting, setSorting] = useState<SortingState>([]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  const getStatusBadge = (status: PackageOrderStatus) => {
    switch (status) {
      case PackageOrderStatus.Disputed:
        return (
          <Badge className="border-red-200 bg-red-100 text-red-800 hover:bg-red-100">
            <AlertCircle className="mr-1 h-3 w-3" />
            DISPUTED
          </Badge>
        );
      case PackageOrderStatus.InProgress:
        return <Badge className="border-blue-200 bg-blue-100 text-blue-800 hover:bg-blue-100">IN PROGRESS</Badge>;
      case PackageOrderStatus.Completed:
        return <Badge className="border-green-200 bg-green-100 text-green-800 hover:bg-green-100">COMPLETED</Badge>;
      case PackageOrderStatus.Cancelled:
        return <Badge className="border-gray-200 bg-gray-100 text-gray-800 hover:bg-gray-100">CANCELLED</Badge>;
      case PackageOrderStatus.Refund:
        return <Badge className="border-yellow-200 bg-yellow-100 text-yellow-800 hover:bg-yellow-100">REFUND</Badge>;
      default:
        return <Badge className="border-gray-200 bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>;
    }
  };

  const columns: ColumnDef<PackageOrderItem>[] = [
    {
      accessorKey: "No.",
      header: "No.",
      cell: ({ row }) => <span className="text-gray-300">{(currentPage - 1) * pageSize + row.index + 1}</span>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "orderInfo",
      header: "Order Info",
      cell: ({ row }) => {
        const packageInfo = row.original.package?.[0];
        return (
          <div className="flex flex-col space-y-1">
            <span className="font-medium text-gray-200">{packageInfo?.packageName || "N/A"}</span>
            <span className="text-sm text-gray-400">ID: {row.original.id.slice(-8)}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "client",
      header: "Client",
      cell: ({ row }) => {
        const client = row.original.client?.[0];
        return (
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500">
              {client?.avatarImage ? (
                <Image src={client.avatarImage} alt="" width={32} height={32} className="h-full w-full rounded-full object-cover" />
              ) : (
                <span className="text-sm font-medium text-white">
                  {client?.displayName?.charAt(0)?.toUpperCase() || "C"}
                </span>
              )}
            </div>
            <span className="text-gray-300">{client?.displayName || "Unknown"}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "provider",
      header: "Provider (Artist)",
      cell: ({ row }) => {
        const provider = row.original.provider?.[0];
        return (
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-500">
              {provider?.avatarImage ? (
                <Image src={provider.avatarImage} alt="" width={32} height={32} className="h-full w-full rounded-full object-cover" />
              ) : (
                <span className="text-sm font-medium text-white">
                  {provider?.stageName?.charAt(0)?.toUpperCase() || "A"}
                </span>
              )}
            </div>
            <span className="text-gray-300">{provider?.stageName || "Unknown"}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const payment = row.original.paymentTransaction?.[0];
        return (
          <span className="font-medium text-gray-200">
            {formatCurrency(payment?.amount || 0)}
          </span>
        );
      },
    },
    {
      accessorKey: "disputedAt",
      header: "Disputed Date",
      cell: ({ row }) => (
        <span className="text-gray-300">
          {row.original.disputedAt ? formatDate(row.original.disputedAt) : "N/A"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
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
              onClick={() => router.push(`/moderator/order-disputed/${row.original.id}`)}
              className="cursor-pointer text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <Eye className="mr-2 h-4 w-4" />
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
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-700 bg-gray-800/50">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-gray-700 hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-gray-400">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
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
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-gray-400">
                  No disputed orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-gray-400">
          Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount}{" "}
          results
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!hasPreviousPage}
            className="border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNumber = i + 1;
              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNumber)}
                  className={
                    currentPage === pageNumber
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
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
