"use client";

import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, ChevronLeft, ChevronRight, Eye, Search, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ApprovalHistoryItem } from "@/types";
import { fetchUserEmails } from "@/utils/approval-history-utils";

interface ApprovalHistoriesTableProps {
  data: ApprovalHistoryItem[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onSearch: (searchTerm: string) => void;
  onApprovalTypeFilter: (type: string) => void;
  onActionFilter: (action: string) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  searchTerm: string;
  approvalTypeFilter: string;
  actionFilter: string;
  isLoading?: boolean;
  error?: Error | null;
}

export function ApprovalHistoriesTable({
  data,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onSearch,
  onApprovalTypeFilter,
  onActionFilter,
  hasNextPage,
  hasPreviousPage,
  searchTerm,
  approvalTypeFilter,
  actionFilter,
  isLoading = false,
}: ApprovalHistoriesTableProps) {
  const router = useRouter();
  const [emailMap, setEmailMap] = useState<Map<string, string>>(new Map());
  const [loadingEmails, setLoadingEmails] = useState(false);

  // Fetch emails for TRACK_UPLOAD, RECORDING_UPLOAD, WORK_UPLOAD
  useEffect(() => {
    const fetchEmails = async () => {
      setLoadingEmails(true);
      try {
        const userIdsToFetch = new Set<string>();

        data.forEach((item) => {
          const snapshot = item.snapshot as unknown as Record<string, unknown>;
          const type = item.approvalType;

          // For TRACK_UPLOAD, get CreatedBy (user ID)
          if (type === "TRACK_UPLOAD" && snapshot?.CreatedBy) {
            userIdsToFetch.add(snapshot.CreatedBy as string);
          }
          // For RECORDING_UPLOAD, get UserId from RecordingSplitRequests
          else if (type === "RECORDING_UPLOAD" && snapshot?.RecordingSplitRequests) {
            const splits = snapshot.RecordingSplitRequests as Array<Record<string, unknown>>;
            splits.forEach((split) => {
              if (split?.UserId) {
                userIdsToFetch.add(split.UserId as string);
              }
            });
          }
          // For WORK_UPLOAD, get UserId from WorkSplits
          else if (type === "WORK_UPLOAD" && snapshot?.WorkSplits) {
            const splits = snapshot.WorkSplits as Array<Record<string, unknown>>;
            splits.forEach((split) => {
              if (split?.UserId) {
                userIdsToFetch.add(split.UserId as string);
              }
            });
          }
        });

        if (userIdsToFetch.size > 0) {
          const emails = await fetchUserEmails(Array.from(userIdsToFetch));
          setEmailMap(emails);
        }
      } catch (error) {
        console.error("Error fetching emails:", error);
      } finally {
        setLoadingEmails(false);
      }
    };

    if (data.length > 0) {
      fetchEmails();
    }
  }, [data]);

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
      cell: ({ row }) => {
        const snapshot = row.original.snapshot as unknown as Record<string, unknown>;
        const type = row.original.approvalType;
        let email = "N/A";

        // For TRACK_UPLOAD - fetch from user CreatedBy
        if (type === "TRACK_UPLOAD") {
          const userId = snapshot?.CreatedBy as string | undefined;
          if (userId) {
            email = emailMap.get(userId) || (loadingEmails ? "Loading..." : "N/A");
          }
        }
        // For RECORDING_UPLOAD - get from RecordingSplitRequests
        else if (type === "RECORDING_UPLOAD") {
          const splits = snapshot?.RecordingSplitRequests as Array<Record<string, unknown>> | undefined;
          if (splits && splits.length > 0) {
            const userId = splits[0]?.UserId as string | undefined;
            if (userId) {
              email = emailMap.get(userId) || (loadingEmails ? "Loading..." : "N/A");
            }
          }
        }
        // For WORK_UPLOAD - get from WorkSplits
        else if (type === "WORK_UPLOAD") {
          const splits = snapshot?.WorkSplits as Array<Record<string, unknown>> | undefined;
          if (splits && splits.length > 0) {
            const userId = splits[0]?.UserId as string | undefined;
            if (userId) {
              email = emailMap.get(userId) || (loadingEmails ? "Loading..." : "N/A");
            }
          }
        }
        // For ARTIST_REGISTRATION - use snapshot email
        else {
          email = (snapshot?.Email as string) || (snapshot?.email as string) || "N/A";
        }

        return <span className="font-mono text-xs">{email}</span>;
      },
    },
    {
      accessorKey: "approvalType",
      header: "Type",
      cell: ({ row }) => <Badge variant="outline">{row.original.approvalType.replace(/_/g, " ")}</Badge>,
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
      {/* Search and Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
          <Input
            placeholder="Search histories..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <Select value={approvalTypeFilter} onValueChange={onApprovalTypeFilter}>
          <SelectTrigger className="w-[200px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Approval Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value="ARTIST_REGISTRATION">Artist Registration</SelectItem>
            <SelectItem value="TRACK_UPLOAD">Track Upload</SelectItem>
            <SelectItem value="WORK_UPLOAD">Work Upload</SelectItem>
            <SelectItem value="RECORDING_UPLOAD">Recording Upload</SelectItem>
          </SelectContent>
        </Select>

        <Select value={actionFilter} onValueChange={onActionFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Actions</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
          </SelectContent>
        </Select>
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
