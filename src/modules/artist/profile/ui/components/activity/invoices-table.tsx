"use client";

import { useState } from "react";
import Link from "next/link";
import { useArtistInvoices } from "@/modules/artist/profile/hooks/use-artist-invoices";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface InvoicesTableProps {
  userId: string;
  pageSize?: number;
  linkPrefix?: string; // default to artist profile invoices path
}

export default function ArtistInvoicesTable({ userId, pageSize = 10, linkPrefix = "/artist/studio/profile/invoices" }: InvoicesTableProps) {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useArtistInvoices({ userId, page, pageSize });

  const items = data?.invoices?.items ?? [];
  const totalCount = data?.invoices?.totalCount ?? 0;
  const hasNext = !!data?.invoices?.pageInfo?.hasNextPage;
  const hasPrev = !!data?.invoices?.pageInfo?.hasPreviousPage;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

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
                <TableCell colSpan={7} className="text-red-500">Failed to load invoices.</TableCell>
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
                      <Link href={`${linkPrefix}/${inv.id}`} className="text-primary hover:underline">#{inv.id.slice(-8)}</Link>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {inv?.paymentTransactionId ? (
                      <Link href={`/artist/studio/transactions/payment-history/${inv.paymentTransactionId}`} className="text-primary hover:underline">#{inv.paymentTransactionId.slice(-8)}</Link>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {inv?.id ? (
                      <Link href={`${linkPrefix}/${inv.id}`} className="text-primary hover:underline">View</Link>
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
        <div className="text-muted-foreground text-sm">Page {page} of {totalPages}</div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={!hasPrev}>Previous</Button>
          <Button variant="outline" size="sm" onClick={() => setPage((p) => (hasNext ? p + 1 : p))} disabled={!hasNext}>Next</Button>
        </div>
      </div>
    </div>
  );
}
