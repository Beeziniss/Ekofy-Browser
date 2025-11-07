"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type SharedInvoice = {
  id: string;
  amount: number;
  currency?: string | null;
  to?: string | null;
  from?: string | null;
  email?: string | null;
  paidAt: string; // ISO string
  paymentTransactionId?: string | null;
};

interface SharedInvoiceDetailSectionProps {
  invoice: SharedInvoice;
  referenceId?: string; // optional echo of the lookup id
  backHref: string;
}

export default function SharedInvoiceDetailSection({ invoice, referenceId, backHref }: SharedInvoiceDetailSectionProps) {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 md:px-6 py-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Invoice Detail</h1>
          {referenceId ? (
            <p className="text-sm text-muted-foreground">Reference: {referenceId}</p>
          ) : null}
        </div>
        <Link href={backHref} className="text-sm text-primary hover:underline">&larr; Back to Invoices</Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>#{invoice.id.slice(-8)}</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-muted-foreground">Paid at</dt>
              <dd className="text-sm">{new Date(invoice.paidAt).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Amount</dt>
              <dd className="text-sm">{invoice.amount.toLocaleString()} {invoice.currency}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Billed to</dt>
              <dd className="text-sm">{invoice.to ?? invoice.email} {invoice.email ? `(${invoice.email})` : ""}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Billed from</dt>
              <dd className="text-sm">{invoice.from}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Transaction</dt>
              <dd className="text-sm">{invoice.paymentTransactionId ?? "-"}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
