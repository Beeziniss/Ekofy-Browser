"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useArtistPayouts } from "@/modules/artist/studio/hooks/use-artist-payouts";
import { platformFeeByPayoutIdOptions } from "@/gql/options/artist-activity-options";
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
import { payoutStatusBadge } from "@/modules/shared/ui/components/status/status-badges";

interface PayoutsTableProps {
  userId: string;
  pageSize?: number;
}

const statusBadge = payoutStatusBadge;

// Component to fetch and display platform fee
function PlatformFeeCell({ payoutId }: { payoutId: string }) {
  const { data, isLoading } = useQuery(platformFeeByPayoutIdOptions({ payoutTransactionId: payoutId }));
  
  if (isLoading) return <span className="text-gray-400">...</span>;
  
  const platformFee = data?.packageOrders?.items?.[0]?.platformFeePercentage;
  
  if (platformFee !== undefined && platformFee !== null) {
    return <span>{platformFee}%</span>;
  }
  
  return <span className="text-gray-400">-</span>;
}

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
              <TableHead>Platform Fee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payout</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7}>Loading...</TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={7} className="text-red-500">Failed to load payouts.</TableCell>
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
                  <TableCell>
                    {tx?.id ? <PlatformFeeCell payoutId={tx.id} /> : "-"}
                  </TableCell>
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
                <TableCell colSpan={7}>No payouts found.</TableCell>
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
