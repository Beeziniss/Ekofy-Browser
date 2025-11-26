"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listenerInvoicesOptions } from "@/gql/options/listener-activity-options";
import { artistInvoicesOptions } from "@/gql/options/artist-activity-options";
import { useAuthStore } from "@/store";

type Source = "listener" | "artist";

interface SharedInvoicesTableProps {
  pageSize?: number;
  source: Source;
  invoiceLinkPrefix: string; // e.g. /profile/invoices or /artist/studio/profile/invoices
  txLinkPrefix?: string; // defaults based on source if not provided
}

export default function SharedInvoicesTable({
  pageSize = 10,
  source,
  invoiceLinkPrefix,
  txLinkPrefix,
}: SharedInvoicesTableProps) {
  const { user } = useAuthStore();
  const [page, setPage] = useState(1);

  const {
    data: listenerData,
    isPending: isListenerPending,
    isError: isListenerError,
  } = useQuery({
    ...listenerInvoicesOptions({ userId: user?.userId || "", page, pageSize }),
    enabled: source === "listener" && !!user?.userId,
  });

  const {
    data: artistData,
    isPending: isArtistPending,
    isError: isArtistError,
  } = useQuery({
    ...artistInvoicesOptions({ userId: user?.userId || "", page, pageSize }),
    enabled: source === "artist" && !!user?.userId,
  });

  const items = listenerData?.invoices?.items || artistData?.invoices?.items || [];
  const totalCount = listenerData?.invoices?.totalCount ?? artistData?.invoices?.totalCount ?? 0;
  const hasNext = !!listenerData?.invoices?.pageInfo?.hasNextPage || !!artistData?.invoices?.pageInfo?.hasNextPage;
  const hasPrev =
    !!listenerData?.invoices?.pageInfo?.hasPreviousPage || !!artistData?.invoices?.pageInfo?.hasPreviousPage;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const isLoading = source === "listener" ? isListenerPending : isArtistPending;
  const isError = source === "listener" ? isListenerError : isArtistError;

  const resolvedTxLinkPrefix =
    txLinkPrefix ??
    (source === "listener" ? "/profile/payment-history" : "/artist/studio/transactions/payment-history");

  return (
    <div className="space-y-4">
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>To</TableHead>
              <TableHead>From</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Transaction</TableHead>
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
                <TableCell colSpan={7} className="text-red-500">
                  Failed to load invoices.
                </TableCell>
              </TableRow>
            ) : items && items.length > 0 ? (
              items.map((inv, idx) => (
                <TableRow key={inv?.id ?? idx}>
                  <TableCell>
                    {inv?.paidAt ? new Date(inv.paidAt as unknown as string).toLocaleString() : "-"}
                  </TableCell>
                  <TableCell>
                    {typeof inv?.amount === "number" ? inv.amount.toLocaleString() : inv?.amount} {inv?.currency}
                  </TableCell>
                  <TableCell>{inv?.to || inv?.email || "-"}</TableCell>
                  <TableCell>{inv?.from || "-"}</TableCell>
                  <TableCell>
                    {inv?.id ? (
                      <Link href={`${invoiceLinkPrefix}/${inv.id}`} className="text-primary hover:underline">
                        #{inv.id.slice(-8)}
                      </Link>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {inv?.paymentTransactionId ? (
                      <Link
                        href={`${resolvedTxLinkPrefix}/${inv.paymentTransactionId}`}
                        className="text-primary hover:underline"
                      >
                        #{inv.paymentTransactionId.slice(-8)}
                      </Link>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {inv?.id ? (
                      <Link href={`${invoiceLinkPrefix}/${inv.id}`} className="text-primary hover:underline">
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
                <TableCell colSpan={7}>No invoices found.</TableCell>
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
