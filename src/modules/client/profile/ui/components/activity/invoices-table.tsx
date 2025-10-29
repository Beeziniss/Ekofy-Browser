"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listenerInvoicesOptions } from "@/gql/options/listener-activity-options";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface InvoicesTableProps {
  userId: string;
  pageSize?: number;
}

export default function InvoicesTable({ userId, pageSize = 10 }: InvoicesTableProps) {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    ...listenerInvoicesOptions({ userId, page, pageSize }),
  });

  const items = data?.invoices?.items ?? [];
  const totalCount = data?.invoices?.totalCount ?? 0;
  const hasNext = !!data?.invoices?.pageInfo?.hasNextPage;
  const hasPrev = !!data?.invoices?.pageInfo?.hasPreviousPage;

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
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6}>Loading...</TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={6} className="text-red-500">Failed to load invoices.</TableCell>
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
                  <TableCell>{inv?.id ? `#${inv.id.slice(-8)}` : "-"}</TableCell>
                  <TableCell>{inv?.paymentTransactionId ? `#${inv.paymentTransactionId.slice(-8)}` : "-"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6}>No invoices found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalCount)} of {totalCount}
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
