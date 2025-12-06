"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
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
 
  backHref: string;
}

export default function SharedInvoiceDetailSection({ invoice, backHref }: SharedInvoiceDetailSectionProps) {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Invoice Detail</h1>
          
          
        </div>
        <Link
          href={backHref}
          className="text-primary hover:border-main-white flex items-center gap-x-2 pb-0.5 text-sm hover:cursor-pointer hover:border-b"
        >
          <ArrowLeftIcon className="size-4" /> Back to Invoices
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice ID: #{invoice.id}</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground text-sm">Paid at</dt>
              <dd className="text-sm">{new Date(invoice.paidAt).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-sm">Amount</dt>
              <dd className="text-sm">{invoice.amount.toLocaleString()} {invoice.currency}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-sm">Billed to</dt>
              <dd className="text-sm">{invoice.to ? invoice.to : "Unknown"} </dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-sm">Billed from</dt>
              <dd className="text-sm">{invoice.from}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-sm">Transaction ID</dt>
              <dd className="text-sm">{invoice.paymentTransactionId ?? "-"}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
