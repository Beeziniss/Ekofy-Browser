"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { listenerInvoiceByIdOptions } from "@/gql/options/listener-activity-options";

type Props = {
  referenceId: string;
  backHref?: string;
};

export default function InvoiceDetailSection({ referenceId, backHref = "/profile/invoices" }: Props) {
  const { data, isLoading, isError } = useQuery(listenerInvoiceByIdOptions({ id: referenceId }));
  if (isLoading) return <div className="p-4">Loading invoice…</div>;
  if (isError) return <div className="p-4 text-red-500">Failed to load invoice.</div>;
  const item = data?.invoices?.items?.[0];
  if (!item) return <div className="p-4">Invoice not found.</div>;
  const inv = {
    id: item.id,
    amount: item.amount,
    currency: item.currency,
    to: item.to,
    from: item.from,
    email: item.email,
    paidAt: item.paidAt as unknown as string,
    paymentTransactionId: item.paymentTransactionId,
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 md:px-6 py-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Invoice Detail</h1>
          <p className="text-sm text-muted-foreground">Reference: {referenceId}</p>
        </div>
        <Link href={backHref} className="text-sm text-primary hover:underline">&larr; Back to Invoices</Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>#{inv.id.slice(-8)}</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-muted-foreground">Paid at</dt>
              <dd className="text-sm">{new Date(inv.paidAt).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Amount</dt>
              <dd className="text-sm">{inv.amount.toLocaleString()} {inv.currency}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Billed to</dt>
              <dd className="text-sm">{inv.to} ({inv.email})</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Billed from</dt>
              <dd className="text-sm">{inv.from}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Transaction</dt>
              <dd className="text-sm">{inv.paymentTransactionId}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
