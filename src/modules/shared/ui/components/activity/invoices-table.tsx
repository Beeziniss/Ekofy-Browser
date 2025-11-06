"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listenerInvoicesOptions } from "@/gql/options/listener-activity-options";
import { artistInvoicesOptions } from "@/gql/options/artist-activity-options";

type Source = "listener" | "artist";

interface SharedInvoicesTableProps {
  userId: string;
  pageSize?: number;
  source: Source;
  invoiceLinkPrefix: string; // e.g. /profile/invoices or /artist/studio/profile/invoices
  txLinkPrefix?: string; // defaults based on source if not provided
}

export default function SharedInvoicesTable({
  userId,
  pageSize = 10,
  source,
  invoiceLinkPrefix,
  txLinkPrefix,
}: SharedInvoicesTableProps) {
  const [page, setPage] = useState(1);

  const queryOptions =
    source === "listener"
      ? listenerInvoicesOptions({ userId, page, pageSize })
      : artistInvoicesOptions({ userId, page, pageSize });

  const { data, isLoading, isError } = useQuery(queryOptions) as {
    data?: {
      invoices?: {
        items?: Array<
          | {
              id?: string | null;
              amount?: number | null;
              currency?: string | null;
              to?: string | null;
              from?: string | null;
              email?: string | null;
              paidAt?: unknown;
              paymentTransactionId?: string | null;
            }
          | null
        > | null;
        totalCount?: number;
        pageInfo?: { hasNextPage?: boolean; hasPreviousPage?: boolean };
      };
    };
    isLoading: boolean;
    isError: boolean;
  };

  const items = data?.invoices?.items ?? [];
  const totalCount = data?.invoices?.totalCount ?? 0;
  const hasNext = !!data?.invoices?.pageInfo?.hasNextPage;
  const hasPrev = !!data?.invoices?.pageInfo?.hasPreviousPage;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const resolvedTxLinkPrefix =
    txLinkPrefix ?? (source === "listener" ? "/profile/payment-history" : "/artist/studio/transactions/payment-history");

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
                      <Link href={`${resolvedTxLinkPrefix}/${inv.paymentTransactionId}`} className="text-primary hover:underline">
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
