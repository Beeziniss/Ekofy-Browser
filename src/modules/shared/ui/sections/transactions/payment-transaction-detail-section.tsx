"use client";

import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentTransaction, TransactionStatus } from "@/gql/graphql";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { methodBadge, paymentStatusBadge } from "@/modules/shared/ui/components/status/status-badges";
import { useCheckoutSession } from "@/hooks/use-checkout-session";
import { useEffect, useState } from "react";

interface PaymentTransactionDetailProps {
  title?: string;
  backHref: string;
  backLabel?: string;
  transaction: Omit<PaymentTransaction, "user" | "userId">;
}

export default function PaymentTransactionDetailSection({
  transaction,
  backHref,
  title = "Transaction Detail",
  backLabel = "Back to Payment History",
}: PaymentTransactionDetailProps) {
  const { getSession } = useCheckoutSession();
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  // Load checkout session on component mount
  useEffect(() => {
    const loadCheckoutSession = async () => {
      if (transaction.status === TransactionStatus.Open) {
        const session = await getSession();
        if (session?.url) {
          // Check if session is within 20 minutes
          const isWithin20Minutes = Date.now() - session.createdAt <= 20 * 60 * 1000;
          if (isWithin20Minutes) {
            setCheckoutUrl(session.url);
          } else {
            // Session is older than 20 minutes, don't use it
            setCheckoutUrl(null);
          }
        }
      }
    };

    loadCheckoutSession();
  }, [transaction.status, getSession]);

  const handleContinuePayment = async () => {
    if (checkoutUrl) {
      // Open checkout URL
      window.open(checkoutUrl, "_blank");
    }
  };

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
            {paymentStatusBadge(transaction.paymentStatus)}
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

          {/* Continue Payment Button for Open Transactions */}
          {transaction.status === TransactionStatus.Open && (
            <div className="mt-6 border-t pt-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-medium">Payment Required</h3>
                  <p className="text-muted-foreground text-sm">
                    This transaction is pending payment. Complete your payment to continue.
                  </p>
                </div>
                {checkoutUrl ? (
                  <Button onClick={handleContinuePayment} className="bg-blue-600 text-white hover:bg-blue-700">
                    Continue Payment
                  </Button>
                ) : (
                  <Button disabled className="cursor-not-allowed bg-gray-400 text-white">
                    Payment Link Expired
                  </Button>
                )}
              </div>
              {!checkoutUrl && (
                <div className="mt-3 rounded-md border border-yellow-200 bg-yellow-50 p-3">
                  <p className="text-sm text-yellow-800">
                    Payment session has expired (valid for 20 minutes). Please create a new subscription to continue.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
