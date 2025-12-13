"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CustomPagination } from "@/components/ui/custom-pagination";
import { payoutStatusBadge } from "@/modules/shared/ui/components/status/status-badges";

interface PayoutTransactionTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transactions: Record<string, any>[];
  isLoading: boolean;
  isError: boolean;
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export function PayoutTransactionTable({
  transactions,
  isLoading,
  isError,
  page,
  pageSize,
  totalCount,
  onPageChange,
}: PayoutTransactionTableProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-700 hover:bg-gray-800">
            <TableHead className="text-gray-300">Date</TableHead>
            <TableHead className="text-gray-300">User ID</TableHead>
            <TableHead className="text-gray-300">Amount</TableHead>
            <TableHead className="text-gray-300">Method</TableHead>
            <TableHead className="text-gray-300">Status</TableHead>
            <TableHead className="text-gray-300">Stripe Payout ID</TableHead>
            <TableHead className="text-gray-300">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-gray-400">
                Loading payout transactions...
              </TableCell>
            </TableRow>
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-red-400">
                Failed to load payout transactions. Please try again.
              </TableCell>
            </TableRow>
          ) : transactions.length > 0 ? (
            transactions.map((tx, idx) => {
              if (!tx) return null;

              return (
                <TableRow key={tx?.id ?? idx} className="border-gray-700 hover:bg-gray-800">
                  <TableCell className="whitespace-nowrap text-gray-300">
                    {tx?.createdAt
                      ? new Date(tx.createdAt as unknown as string).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "-"}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-gray-300">
                    {tx?.userId ? `${tx.userId.slice(0, 8)}...` : "-"}
                  </TableCell>
                  <TableCell className="font-medium text-white">
                    {typeof tx?.amount === "number" ? tx.amount.toLocaleString() : tx?.amount} {tx?.currency || "VND"}
                  </TableCell>
                  <TableCell className="text-gray-300">{tx?.method || "-"}</TableCell>
                  <TableCell>{payoutStatusBadge(tx.status)}</TableCell>
                  <TableCell className="font-mono text-xs text-gray-400">
                    <span className="inline-block max-w-[120px] truncate">
                      {tx?.stripePayoutId ? `${tx.stripePayoutId.slice(0, 20)}...` : "-"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" asChild>
                      <Link href={`/admin/transactions/payout/${tx.id}`}>View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-gray-400">
                No payout transactions found.
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
