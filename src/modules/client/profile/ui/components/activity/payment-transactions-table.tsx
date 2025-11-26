"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { artistTransactionsOptions } from "@/gql/options/artist-activity-options";
import { listenerTransactionsOptions } from "@/gql/options/listener-activity-options";
import { paymentStatusBadge } from "@/modules/shared/ui/components/status/status-badges";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Source = "listener" | "artist";

interface SharedPaymentTransactionsTableProps {
  userId: string;
  pageSize?: number;
  source: Source;
  linkPrefix: string; // e.g. "/profile/payment-history" or "/artist/studio/transactions/payment-history"
}

export default function SharedPaymentTransactionsTable({
  userId,
  pageSize = 10,
  source,
  linkPrefix,
}: SharedPaymentTransactionsTableProps) {
  const [page, setPage] = useState(1);

  const queryOptions =
    source === "listener"
      ? listenerTransactionsOptions({ userId, page, pageSize })
      : artistTransactionsOptions({ userId, page, pageSize });

  const { data, isLoading, isError } = useQuery({
    ...queryOptions,
  });

  const items = data?.paymentTransactions?.items ?? [];
  const totalCount = data?.paymentTransactions?.totalCount ?? 0;
  const hasNext = !!data?.paymentTransactions?.pageInfo?.hasNextPage;
  const hasPrev = !!data?.paymentTransactions?.pageInfo?.hasPreviousPage;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="space-y-4">
      <div>
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
            ) : items && items.length > 0 ? (
              items.map((tx, idx) => (
                <TableRow key={tx?.id ?? idx}>
                  <TableCell>
                    {tx?.createdAt ? new Date(tx.createdAt as unknown as string).toLocaleString() : "-"}
                  </TableCell>
                  <TableCell>
                    {typeof tx?.amount === "number" ? tx.amount.toLocaleString() : tx?.amount} {tx?.currency}
                  </TableCell>
                  <TableCell>
                    {Array.isArray(tx?.stripePaymentMethod) && tx!.stripePaymentMethod.length > 0
                      ? tx!.stripePaymentMethod.join(", ")
                      : "-"}
                  </TableCell>
                  <TableCell>{tx?.paymentStatus ? paymentStatusBadge(tx.paymentStatus) : "-"}</TableCell>
                  <TableCell>
                    {tx?.stripePaymentId || tx?.id ? (
                      <Link
                        href={`${linkPrefix}/${tx?.stripePaymentId || tx?.id}`}
                        className="text-primary hover:underline"
                      >
                        #{(tx?.stripePaymentId || tx?.id)!.slice(-8)}
                      </Link>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {tx?.stripePaymentId || tx?.id ? (
                      <Link
                        href={`${linkPrefix}/${tx?.stripePaymentId || tx?.id}`}
                        className="text-primary hover:underline"
                      >
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
      </div>

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
