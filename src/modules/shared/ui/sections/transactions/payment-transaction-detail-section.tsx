"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentTransactionStatus } from "@/gql/graphql";
import { paymentStatusBadge } from "@/modules/shared/ui/components/status/status-badges";

export type PaymentTransactionDetail = {
  id: string;
  stripePaymentId: string;
  amount: number;
  currency: string;
  createdAt: string;
  paymentStatus: PaymentTransactionStatus;
  stripePaymentMethod: string[];
};

type Props = {
  referenceId: string;
  backHref: string;
  backLabel?: string;
  tx: PaymentTransactionDetail;
  title?: string;
};

export default function PaymentTransactionDetailSection({
  referenceId,
  backHref,
  backLabel = "Back to Payment History",
  tx,
  title = "Transaction Detail",
}: Props) {
  const statusBadge = paymentStatusBadge;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 md:px-6 py-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-muted-foreground">Reference: {referenceId}</p>
        </div>
        <Link href={backHref} className="text-sm text-primary hover:underline">&larr; {backLabel}</Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span>#{tx.id.slice(-8)}</span>
            {statusBadge(tx.paymentStatus)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-muted-foreground">Created at</dt>
              <dd className="text-sm">{new Date(tx.createdAt).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Amount</dt>
              <dd className="text-sm">{tx.amount.toLocaleString()} {tx.currency}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Payment methods</dt>
              <dd className="text-sm">{tx.stripePaymentMethod.join(", ")}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Stripe Payment ID</dt>
              <dd className="text-sm">{tx.stripePaymentId}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
