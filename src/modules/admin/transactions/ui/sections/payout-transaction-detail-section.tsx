"use client";

import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { adminPayoutTransactionByIdOptions } from "@/gql/options/transaction-options";
import { ArrowLeftIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { payoutStatusBadge } from "@/modules/shared/ui/components/status/status-badges";
import Link from "next/link";

interface PayoutTransactionDetailSectionProps {
  referenceId: string;
}

const PayoutTransactionDetailSection = ({ referenceId }: PayoutTransactionDetailSectionProps) => {
  return (
    <Suspense fallback={<PayoutTransactionDetailSectionSkeleton />}>
      <PayoutTransactionDetailSectionSuspense referenceId={referenceId} />
    </Suspense>
  );
};

const PayoutTransactionDetailSectionSkeleton = () => {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Payout Transaction Detail</h1>
        <Link
          href="/admin/transactions"
          className="text-primary hover:border-main-white flex items-center gap-x-2 pb-0.5 text-sm hover:cursor-pointer hover:border-b"
        >
          <ArrowLeftIcon className="size-4" /> Back to Transactions
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <Skeleton className="h-[22px] w-20" />
            <Skeleton className="h-[22px] w-24" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[...Array(6)].map((_, i) => (
              <div key={i}>
                <dt className="text-sm text-gray-400">Loading...</dt>
                <Skeleton className="h-5 w-32" />
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
};

const PayoutTransactionDetailSectionSuspense = ({ referenceId }: PayoutTransactionDetailSectionProps) => {
  const { data: transaction } = useSuspenseQuery(adminPayoutTransactionByIdOptions({ id: referenceId }));

  if (!transaction) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-6">
        <div className="text-center text-gray-400">Payout transaction not found.</div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Payout Transaction Detail</h1>
        <Link
          href="/admin/transactions"
          className="text-primary hover:border-main-white flex items-center gap-x-2 pb-0.5 text-sm hover:cursor-pointer hover:border-b"
        >
          <ArrowLeftIcon className="size-4" /> Back to Transactions
        </Link>
      </div>

      {/* Transaction Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            Payout Details
            {payoutStatusBadge(transaction.status)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <dt className="mb-1 text-sm text-gray-400">Transaction ID</dt>
              <dd className="font-mono text-sm text-white">{transaction.id}</dd>
            </div>

            <div>
              <dt className="mb-1 text-sm text-gray-400">Created At</dt>
              <dd className="text-sm text-white">
                {new Date(transaction.createdAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </dd>
            </div>

            <div>
              <dt className="mb-1 text-sm text-gray-400">Amount</dt>
              <dd className="text-lg font-semibold text-white">
                {typeof transaction.amount === "number" ? transaction.amount.toLocaleString() : transaction.amount}{" "}
                {transaction.currency}
              </dd>
            </div>

            <div>
              <dt className="mb-1 text-sm text-gray-400">Status</dt>
              <dd className="text-sm">{payoutStatusBadge(transaction.status)}</dd>
            </div>

            <div>
              <dt className="mb-1 text-sm text-gray-400">User Name</dt>
              <dd className="text-sm text-white">
                {transaction.user?.[0]?.fullName ? (
                  <Link
                    href={`/admin/user-management/${transaction.user[0].id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {transaction.user[0].fullName}
                  </Link>
                ) : (
                  <span className="text-gray-500">Unknown</span>
                )}
              </dd>
            </div>

            <div>
              <dt className="mb-1 text-sm text-gray-400">User Email</dt>
              <dd className="text-sm text-white">{transaction.user?.[0]?.email || "-"}</dd>
            </div>

            <div>
              <dt className="mb-1 text-sm text-gray-400">User ID</dt>
              <dd className="font-mono text-sm text-white">{transaction.userId}</dd>
            </div>

            <div>
              <dt className="mb-1 text-sm text-gray-400">Method</dt>
              <dd className="text-sm text-white">{transaction.method || "-"}</dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="mb-1 text-sm text-gray-400">Stripe Payout ID</dt>
              <dd className="font-mono text-sm text-white">{transaction.stripePayoutId}</dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="mb-1 text-sm text-gray-400">Stripe Transfer ID</dt>
              <dd className="font-mono text-sm text-white">{transaction.stripeTransferId}</dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="mb-1 text-sm text-gray-400">Destination Account ID</dt>
              <dd className="font-mono text-sm text-white">{transaction.destinationAccountId}</dd>
            </div>

            {transaction.royaltyReportId && (
              <div className="sm:col-span-2">
                <dt className="mb-1 text-sm text-gray-400">Royalty Report ID</dt>
                <dd className="font-mono text-sm text-white">{transaction.royaltyReportId}</dd>
              </div>
            )}

            {transaction.description && (
              <div className="sm:col-span-2">
                <dt className="mb-1 text-sm text-gray-400">Description</dt>
                <dd className="text-sm text-white">{transaction.description}</dd>
              </div>
            )}

            {transaction.updatedAt && (
              <div className="sm:col-span-2">
                <dt className="mb-1 text-sm text-gray-400">Last Updated</dt>
                <dd className="text-sm text-white">
                  {new Date(transaction.updatedAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayoutTransactionDetailSection;
