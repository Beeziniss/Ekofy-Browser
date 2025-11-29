"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSuspenseQuery } from "@tanstack/react-query";
import { adminTransactionByIdOptions } from "@/gql/options/admin-options";
import PaymentTransactionDetailSection from "@/modules/shared/ui/sections/transactions/payment-transaction-detail-section";
import { ArrowLeftIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TransactionDetailSectionProps {
  referenceId: string;
  onBack?: () => void;
}

const TransactionDetailSection = ({ referenceId, onBack }: TransactionDetailSectionProps) => {
  return (
    <Suspense fallback={<TransactionDetailSectionSkeleton />}>
      <TransactionDetailSectionSuspense referenceId={referenceId} onBack={onBack} />
    </Suspense>
  );
};

const TransactionDetailSectionSkeleton = () => {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Transaction Detail</h1>
          
        </div>
        <div className="text-primary hover:border-main-white flex items-center gap-x-2 pb-0.5 text-sm hover:cursor-pointer hover:border-b">
          <ArrowLeftIcon className="size-4" /> Back to Transactions
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
              <dt className="text-muted-foreground text-sm">User</dt>
              <Skeleton className="h-5 w-48" />
            </div>
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

const TransactionDetailSectionSuspense = ({ referenceId }: TransactionDetailSectionProps) => {
  const { data } = useSuspenseQuery(adminTransactionByIdOptions({ id: referenceId }));

  const transactionData = data?.paymentTransactions?.items?.[0];
  if (!transactionData) return <div className="p-4">Transaction not found.</div>;

  // Handle user data (could be array from GraphQL)
  const userData = Array.isArray(transactionData.user) ? transactionData.user[0] : transactionData.user;

  return (
    <div>
      {/* Transaction Detail */}
      <PaymentTransactionDetailSection
        referenceId={referenceId}
        backHref="/admin/transactions"
        transaction={transactionData}
        title="Transaction Detail"
        backLabel="Back to All Transactions"
      />

      {/* User Info Section */}
      <div className="mx-auto w-full max-w-4xl px-4 md:px-6">
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground text-sm">Full Name</dt>
                <dd className="text-sm">
                  {userData?.fullName ? (
                    <Link href={`/admin/user-management/${userData.id}`} className="text-white hover:text-primary">
                      {userData.fullName}
                    </Link>
                  ) : (
                    "N/A"
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-sm">Email</dt>
                <dd className="text-sm">{userData?.email || "N/A"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-sm">Role</dt>
                <dd className="text-sm">{userData?.role || "N/A"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-sm">User ID</dt>
                <dd className="text-sm font-mono text-xs">{transactionData.userId}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export { TransactionDetailSection };
