"use client";

import { useState } from "react";
import Link from "next/link";
import { useListenerTransactions } from "@/modules/client/profile/hooks/use-listener-transactions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaymentTransactionStatus } from "@/gql/graphql";
import { useAuthStore } from "@/store";

interface PaymentTransactionsTableProps {
  pageSize?: number;
}

const statusBadge = (status: PaymentTransactionStatus) => {
  switch (status) {
    case PaymentTransactionStatus.Paid:
      return <Badge className="border-green-200 bg-green-100 text-green-800">Paid</Badge>;
    case PaymentTransactionStatus.Pending:
      return <Badge className="border-yellow-200 bg-yellow-100 text-yellow-800">Pending</Badge>;
    case PaymentTransactionStatus.Unpaid:
      return <Badge className="border-red-200 bg-red-100 text-red-800">Unpaid</Badge>;
    default:
      return <Badge className="border-gray-200 bg-gray-100 text-gray-800">Unknown</Badge>;
  }
};

export default function PaymentTransactionsTable({ pageSize = 10 }: PaymentTransactionsTableProps) {
  const [page, setPage] = useState(1);
  const { user } = useAuthStore();

  const { data, isLoading, isError } = useListenerTransactions({ userId: user!.userId, page, pageSize });

  const items = data?.transactions?.items ?? [];
  const totalCount = data?.transactions?.totalCount ?? 0;
  const hasNext = !!data?.transactions?.pageInfo?.hasNextPage;
  const hasPrev = !!data?.transactions?.pageInfo?.hasPreviousPage;
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
                  <TableCell>{tx?.paymentStatus ? statusBadge(tx.paymentStatus) : "-"}</TableCell>
                  <TableCell>
                    {tx?.stripePaymentId || tx?.id ? (
                      <Link
                        href={`/profile/payment-history/${tx?.stripePaymentId || tx?.id}`}
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
                        href={`/profile/payment-history/${tx?.stripePaymentId || tx?.id}`}
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
