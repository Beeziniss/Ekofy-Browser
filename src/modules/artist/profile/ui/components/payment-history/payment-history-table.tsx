"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CustomPagination } from "@/components/ui/custom-pagination";
import { methodBadge, paymentStatusBadge } from "@/modules/shared/ui/components/status/status-badges";

interface ArtistPaymentHistoryTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transactions: Record<string, any>[];
  isLoading: boolean;
  isError: boolean;
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  linkPrefix?: string;
}

export function ArtistPaymentHistoryTable({
  transactions,
  isLoading,
  isError,
  page,
  pageSize,
  totalCount,
  onPageChange,
  linkPrefix = "/artist/studio/transactions/payment-history",
}: ArtistPaymentHistoryTableProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Transaction</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-gray-400">
                Loading transactions...
              </TableCell>
            </TableRow>
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-red-400">
                Failed to load transactions. Please try again.
              </TableCell>
            </TableRow>
          ) : transactions && transactions.length > 0 ? (
            transactions.map((transaction, idx) => (
              <TableRow key={transaction?.id ?? idx}>
                <TableCell>
                  {transaction?.createdAt
                    ? new Date(transaction.createdAt as unknown as string).toLocaleString()
                    : "-"}
                </TableCell>
                <TableCell>
                  {typeof transaction?.amount === "number"
                    ? transaction.amount.toLocaleString()
                    : transaction?.amount}{" "}
                  {transaction?.currency}
                </TableCell>
                <TableCell className="space-x-1">
                  {Array.isArray(transaction?.stripePaymentMethod) &&
                  transaction!.stripePaymentMethod.length > 0
                    ? transaction.stripePaymentMethod.map((method, index) => methodBadge(method, index))
                    : "-"}
                </TableCell>
                <TableCell>
                  {transaction?.paymentStatus ? paymentStatusBadge(transaction.paymentStatus) : "-"}
                </TableCell>
                <TableCell>
                  {transaction?.id ? (
                    <Link href={`${linkPrefix}/${transaction?.id}`} className="text-primary hover:underline">
                      #{transaction?.id!.slice(-8)}
                    </Link>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  {transaction?.id ? (
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" asChild>
                      <Link href={`${linkPrefix}/${transaction?.id}`}>View</Link>
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
                No transactions found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="py-4">
          <CustomPagination
            currentPage={page}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={pageSize}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
