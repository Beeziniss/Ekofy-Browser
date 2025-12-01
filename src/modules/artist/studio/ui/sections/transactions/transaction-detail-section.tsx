"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { artistTransactionByIdOptions } from "@/gql/options/artist-activity-options";
import PaymentTransactionDetailSection from "@/modules/shared/ui/sections/transactions/payment-transaction-detail-section";
import { ArrowLeftIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import Link from "next/link";

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
          <ArrowLeftIcon className="size-4" /> Back to Payment History
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
              <dd className="text-sm">
                <Skeleton className="h-5 w-32" />
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-sm">Payment methods</dt>
              <dd className="flex items-center gap-2 text-sm">
                {[...Array(2)].map((_, index) => (
                  <Skeleton key={index} className="mr-2 inline-block h-[22px] w-12" />
                ))}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
};

const TransactionDetailSectionSuspense = ({
  referenceId,
  backHref = "/artist/studio/transactions/payment-history",
}: TransactionDetailSectionProps) => {
  const { data } = useSuspenseQuery(artistTransactionByIdOptions({ id: referenceId }));

  const transactionData = data?.paymentTransactions?.items?.[0];
  if (!transactionData)
    return (
      <div className="flex flex-col gap-y-2">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Transaction Not Found</h1>
          <Link
            href={backHref}
            className="text-primary hover:border-main-white flex items-center gap-x-2 pb-0.5 text-sm hover:cursor-pointer hover:border-b"
          >
            <ArrowLeftIcon className="size-4" /> Back to Payment History
          </Link>
        </div>
      </div>
    );

  return <PaymentTransactionDetailSection backHref={backHref} transaction={transactionData} />;
};

export default TransactionDetailSection;
