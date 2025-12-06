"use client";

import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { artistTransactionByIdOptions } from "@/gql/options/artist-activity-options";
import PaymentTransactionDetailSection from "@/modules/shared/ui/sections/transactions/payment-transaction-detail-section";
import { ArrowLeftIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TransactionDetailSectionProps {
  referenceId: string;
  backHref?: string;
}

const TransactionDetailSection = ({ referenceId, backHref }: TransactionDetailSectionProps) => {
  return (
    <Suspense fallback={<TransactionDetailSectionSkeleton />}>
      <TransactionDetailSectionSuspense referenceId={referenceId} backHref={backHref} />
    </Suspense>
  );
};

const TransactionDetailSectionSkeleton = () => {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Transaction Detail</h1>
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            Reference: <Skeleton className="h-5 w-44" />
          </div>
        </div>
        <div className="text-primary hover:border-main-white flex items-center gap-x-2 pb-0.5 text-sm hover:cursor-pointer hover:border-b">
          <ArrowLeftIcon className="size-4" /> Back to Transaction History
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Skeleton className="h-[22px] w-20" />
            <Skeleton className="h-[22px] w-24" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground text-sm">Created at</dt>
              <Skeleton className="h-5 w-32" />
            </div>
            <div>
              <dt className="text-muted-foreground text-sm">Amount</dt>
              <Skeleton className="h-5 w-24" />
            </div>
            <div>
              <dt className="text-muted-foreground text-sm">Currency</dt>
              <Skeleton className="h-5 w-16" />
            </div>
            <div>
              <dt className="text-muted-foreground text-sm">Payment Method</dt>
              <Skeleton className="h-5 w-20" />
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
};

const TransactionDetailSectionSuspense = ({ referenceId, backHref }: TransactionDetailSectionProps) => {
  const { data } = useSuspenseQuery(artistTransactionByIdOptions({ id: referenceId }));
  const transaction = data?.paymentTransactions?.items?.[0];

  if (!transaction) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-6">
        <div className="text-center">Transaction not found</div>
      </div>
    );
  }

  return (
    <PaymentTransactionDetailSection
      transaction={transaction}
      backHref={backHref || "/artist/studio/transactions/transaction-history"}
    />
  );
};

export default TransactionDetailSection;
