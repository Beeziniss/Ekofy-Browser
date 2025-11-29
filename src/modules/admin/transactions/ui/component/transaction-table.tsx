"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { paymentStatusBadge } from "@/modules/shared/ui/components/status/status-badges";
import { CustomPagination } from "@/components/ui/custom-pagination";

interface TransactionTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transactions: Record<string, any>[];
  isLoading: boolean;
  isError: boolean;
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export function TransactionTable({
  transactions,
  isLoading,
  isError,
  page,
  pageSize,
  totalCount,
  onPageChange,
}: TransactionTableProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-700 bg-gray-800/50">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-300">Date</TableHead>
              <TableHead className="text-gray-300">User</TableHead>
              <TableHead className="text-gray-300">Email</TableHead>
              <TableHead className="text-gray-300">Amount</TableHead>
              <TableHead className="text-gray-300">Method</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300">Transaction ID</TableHead>
              <TableHead className="text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-400">
                  Loading transactions...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-red-400">
                  Failed to load transactions. Please try again.
                </TableCell>
              </TableRow>
            ) : transactions.length > 0 ? (
              transactions.map((tx, idx) => {
                if (!tx) return null;
                const user = tx.user && tx.user.length > 0 ? tx.user[0] : null;
                
                return (
                  <TableRow key={tx?.id ?? idx}>
                    <TableCell className="whitespace-nowrap text-gray-300">
                      {tx?.createdAt
                        ? new Date(tx.createdAt as unknown as string).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {user?.fullName ? (
                        <Link
                          href={`/admin/user-management/${user.id}`}
                          className="font-medium text-white hover:text-primary"
                        >
                          {user.fullName}
                        </Link>
                      ) : (
                        <span className="text-gray-500">Unknown</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-gray-300">{user?.email || "-"}</TableCell>
                    <TableCell className="font-medium text-white">
                      {typeof tx?.amount === "number" ? tx.amount.toLocaleString() : tx?.amount} {tx?.currency || "VND"}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {tx.stripePaymentMethod && tx.stripePaymentMethod.length > 0
                        ? tx.stripePaymentMethod.join(", ")
                        : "-"}
                    </TableCell>
                    <TableCell>{paymentStatusBadge(tx.paymentStatus)}</TableCell>
                    <TableCell className="font-mono text-xs text-gray-400">
                      {tx.stripePaymentId ? (
                        <span className="truncate max-w-[120px] inline-block">
                          {tx.stripePaymentId.slice(0, 20)}...
                        </span>
                      ) : (
                        <span className="truncate max-w-[120px] inline-block">{tx.id.slice(0, 20)}...</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" asChild>
                        <Link href={`/admin/transactions/${tx.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <CustomPagination
          currentPage={page}
          totalPages={totalPages}
          totalCount={totalCount}
          pageSize={pageSize}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
