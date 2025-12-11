"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CustomPagination } from "@/components/ui/custom-pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RefundTransactionStatus, RefundReasonType } from "@/gql/graphql";

interface RefundTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refunds: Record<string, any>[];
  isLoading: boolean;
  isError: boolean;
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

// Status badge helper
function refundStatusBadge(status: RefundTransactionStatus) {
  const variants: Record<RefundTransactionStatus, { variant: "default" | "destructive" | "outline" | "secondary"; label: string }> = {
    [RefundTransactionStatus.Succeeded]: { variant: "default", label: "Succeeded" },
    [RefundTransactionStatus.Pending]: { variant: "secondary", label: "Pending" },
    [RefundTransactionStatus.Failed]: { variant: "destructive", label: "Failed" },
    [RefundTransactionStatus.Canceled]: { variant: "outline", label: "Canceled" },
    [RefundTransactionStatus.RequiresAction]: { variant: "secondary", label: "Requires Action" },
  };
  const config = variants[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

// Reason badge helper
function refundReasonBadge(reason: RefundReasonType) {
  const labels: Record<RefundReasonType, string> = {
    [RefundReasonType.Duplicate]: "Duplicate",
    [RefundReasonType.Fraudulent]: "Fraudulent",
    [RefundReasonType.RequestedByCustomer]: "Requested by Customer",
  };
  return <Badge variant="outline">{labels[reason]}</Badge>;
}

export function RefundTable({
  refunds,
  isLoading,
  isError,
  page,
  pageSize,
  totalCount,
  onPageChange,
}: RefundTableProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Payment ID</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-gray-400">
                Loading refunds...
              </TableCell>
            </TableRow>
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-red-400">
                Failed to load refunds. Please try again.
              </TableCell>
            </TableRow>
          ) : refunds && refunds.length > 0 ? (
            refunds.map((refund, idx) => (
              <TableRow key={refund?.id ?? idx}>
                <TableCell>
                  {refund?.createdAt ? new Date(refund.createdAt as unknown as string).toLocaleString() : "-"}
                </TableCell>
                <TableCell>
                  {typeof refund?.amount === "number" ? refund.amount.toLocaleString() : refund?.amount}{" "}
                  {refund?.currency}
                </TableCell>
                <TableCell>
                  {refund?.status ? refundStatusBadge(refund.status) : "-"}
                </TableCell>
                <TableCell>
                  {refund?.reason ? refundReasonBadge(refund.reason) : "-"}
                </TableCell>
                <TableCell>
                  {refund?.stripePaymentId ? (
                    <span className="font-mono text-xs">#{refund.stripePaymentId.slice(-8)}</span>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  {refund?.id ? (
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" asChild>
                      <Link href={`/profile/refund-history/${refund?.id}`}>View</Link>
                    </Button>
                  ) : (
                    "-"
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-gray-400">
                No refunds found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <CustomPagination
        currentPage={page}
        totalPages={totalPages}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={onPageChange}
        isLoading={isLoading}
      />
    </div>
  );
}
