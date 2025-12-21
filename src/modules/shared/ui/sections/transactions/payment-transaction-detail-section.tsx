"use client";

import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { PaymentTransaction } from "@/gql/graphql";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { methodBadge, transactionStatusBadge } from "@/modules/shared/ui/components/status/status-badges";

interface PaymentTransactionDetailProps {
  title?: string;
  backHref: string;
  backLabel?: string;
  transaction: Pick<
    PaymentTransaction,
    | "id"
    | "amount"
    | "currency"
    | "createdAt"
    | "updatedAt"
    | "paymentStatus"
    | "status"
    | "stripePaymentMethod"
    | "stripePaymentId"
    | "stripeCheckoutSessionId"
    | "stripeInvoiceId"
    | "stripeSubscriptionId"
  >;
}

export default function PaymentTransactionDetailSection({
  transaction,
  backHref,
  title = "Transaction Detail",
  backLabel = "Back to Payment History",
}: PaymentTransactionDetailProps) {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {/* <p className="text-muted-foreground text-sm">Transaction ID: {referenceId}</p> */}
        </div>
        <Link
          href={backHref}
          className="text-primary hover:border-main-white flex items-center gap-x-2 pb-0.5 text-sm hover:border-b"
        >
          <ArrowLeftIcon className="size-4" /> {backLabel}
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span>Transaction: #{transaction.id}</span>
            {transactionStatusBadge(transaction.status)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground text-sm">Created at</dt>
              <dd className="text-sm">{new Date(transaction.createdAt).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-sm">Amount</dt>
              <dd className="text-sm">
                {transaction.amount.toLocaleString()} {transaction.currency}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-sm">Payment methods</dt>
              <dd className="flex items-center gap-2 text-sm">
                {transaction.stripePaymentMethod.map((method, index) => methodBadge(method, index))}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-sm">Stripe Transaction ID:</dt>
              <dd className="text-sm">
                {transaction.stripePaymentId || (
                  <span className="text-gray-500 italic">
                    {transaction.paymentStatus === "UNPAID" ? "Pending payment" : "N/A"}
                  </span>
                )}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
