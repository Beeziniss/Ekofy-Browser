"use client";

import { useState } from "react";
import Link from "next/link";
import { useArtistPayouts } from "@/modules/artist/studio/hooks/use-artist-payouts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PayoutTransactionStatus } from "@/gql/graphql";

interface PayoutsTableProps {
  userId: string;
  pageSize?: number;
}

const statusBadge = (status: PayoutTransactionStatus) => {
  switch (status) {
    case PayoutTransactionStatus.Paid:
      return <Badge className="bg-green-100 text-green-800 border-green-200">Paid</Badge>;
    case PayoutTransactionStatus.Pending:
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
    case PayoutTransactionStatus.InTransit:
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">In transit</Badge>;
    case PayoutTransactionStatus.Failed:
      return <Badge className="bg-red-100 text-red-800 border-red-200">Failed</Badge>;
    case PayoutTransactionStatus.Canceled:
      return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Canceled</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Unknown</Badge>;
  }
};

export default function PayoutsTable({ userId, pageSize = 10 }: PayoutsTableProps) {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useArtistPayouts({ userId, page, pageSize });

  const items = data?.payoutTransactions?.items ?? [];
  const totalCount = data?.payoutTransactions?.totalCount ?? 0;
  const hasNext = !!data?.payoutTransactions?.pageInfo?.hasNextPage;
  const hasPrev = !!data?.payoutTransactions?.pageInfo?.hasPreviousPage;
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
              <TableHead>Payout</TableHead>
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
                <TableCell colSpan={6} className="text-red-500">Failed to load payouts.</TableCell>
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
                  <TableCell>{tx?.method || "-"}</TableCell>
                  <TableCell>{tx?.status ? statusBadge(tx.status as PayoutTransactionStatus) : "-"}</TableCell>
                  <TableCell>
                    {tx?.stripeTransferId || tx?.stripePayoutId || tx?.id ? (
                      <Link href={`/artist/studio/transactions/payouts/${tx?.stripeTransferId || tx?.stripePayoutId || tx?.id}`} className="text-primary hover:underline">
                        #{(tx?.stripeTransferId || tx?.stripePayoutId || tx?.id)!.slice(-8)}
                      </Link>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {tx?.id ? (
                      <Link href={`/artist/studio/transactions/payouts/${tx.id}`} className="text-primary hover:underline">View</Link>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6}>No payouts found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Page {page} of {totalPages}</div>
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
