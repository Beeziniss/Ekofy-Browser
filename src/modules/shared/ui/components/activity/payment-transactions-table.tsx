"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuthStore } from "@/store";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { artistTransactionsOptions } from "@/gql/options/artist-activity-options";
import { listenerTransactionsOptions } from "@/gql/options/listener-activity-options";
import { methodBadge, paymentStatusBadge } from "@/modules/shared/ui/components/status/status-badges";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Source = "listener" | "artist";

interface SharedPaymentTransactionsTableProps {
  pageSize?: number;
  source: Source;
  linkPrefix: string; // e.g. "/profile/payment-history" or "/artist/studio/transactions/payment-history"
}

export default function SharedPaymentTransactionsTable({
  pageSize = 10,
  source,
  linkPrefix,
}: SharedPaymentTransactionsTableProps) {
  const { user } = useAuthStore();
  const [page, setPage] = useState(1);

  const queryOptions =
    source === "listener"
      ? listenerTransactionsOptions({ userId: user?.userId || "", page, pageSize })
      : artistTransactionsOptions({ userId: user?.userId || "", page, pageSize });

  const { data, isLoading, isError } = useQuery({
    ...queryOptions,
    enabled: !!user?.userId, // Only run query if user exists
  });

  const transactionData = data?.paymentTransactions?.items || [];
  const totalCount = data?.paymentTransactions?.totalCount ?? 0;
  const hasNext = !!data?.paymentTransactions?.pageInfo?.hasNextPage;
  const hasPrev = !!data?.paymentTransactions?.pageInfo?.hasPreviousPage;
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
              <TableCell colSpan={6}>Loading...</TableCell>
            </TableRow>
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={6} className="text-red-500">
                Failed to load transactions.
              </TableCell>
            </TableRow>
          ) : transactionData && transactionData.length > 0 ? (
            transactionData.map((transaction, idx) => (
              <TableRow key={transaction?.id ?? idx}>
                <TableCell>
                  {transaction?.createdAt ? new Date(transaction.createdAt as unknown as string).toLocaleString() : "-"}
                </TableCell>
                <TableCell>
                  {typeof transaction?.amount === "number" ? transaction.amount.toLocaleString() : transaction?.amount}{" "}
                  {transaction?.currency}
                </TableCell>
                <TableCell className="space-x-1">
                  {Array.isArray(transaction?.stripePaymentMethod) && transaction!.stripePaymentMethod.length > 0
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
                    <Link href={`${linkPrefix}/${transaction?.id}`} className="text-primary hover:underline">
                      View
                    </Link>
                  ) : (
                    "-"
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6}>No transactions found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between">
        <div className="text-muted-foreground text-sm">
          Page {page} of {totalPages}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={!hasPrev}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPage((p) => (hasNext ? p + 1 : p))} disabled={!hasNext}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
