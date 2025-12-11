"use client";

import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { listenerRefundTransactionByIdOptions } from "@/gql/options/listener-refund-options";
import { ArrowLeftIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { RefundTransactionStatus, RefundReasonType } from "@/gql/graphql";

interface RefundDetailSectionProps {
  referenceId: string;
  backHref?: string;
}

// Status badge helper
function refundStatusBadge(status: RefundTransactionStatus) {
  const variants: Record<RefundTransactionStatus, { variant: "default" | "destructive" | "outline" | "secondary"; label: string }> = {
    [RefundTransactionStatus.Succeeded]: { variant: "default", label: "Succeeded" },
    [RefundTransactionStatus.Pending]: { variant: "secondary", label: "Pending" },
    [RefundTransactionStatus.Failed]: { variant: "destructive", label: "Failed" },
    [RefundTransactionStatus.Canceled]: { variant: "outline", label: "Canceled" },
    [RefundTransactionStatus.RequiresAction]: { variant: "secondary", label: "Requires Action" },
  };
  const config = variants[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

// Reason badge helper
function refundReasonBadge(reason: RefundReasonType) {
  const labels: Record<RefundReasonType, string> = {
    [RefundReasonType.Duplicate]: "Duplicate",
    [RefundReasonType.Fraudulent]: "Fraudulent",
    [RefundReasonType.RequestedByCustomer]: "Requested by Customer",
  };
  return <Badge variant="outline">{labels[reason]}</Badge>;
}

const RefundDetailSection = ({ referenceId, backHref }: RefundDetailSectionProps) => {
  return (
    <Suspense fallback={<RefundDetailSectionSkeleton />}>
      <RefundDetailSectionSuspense referenceId={referenceId} backHref={backHref} />
    </Suspense>
  );
};

const RefundDetailSectionSkeleton = () => {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Refund Detail</h1>
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            Reference: <Skeleton className="h-5 w-44" />
          </div>
        </div>
        <div className="text-primary hover:border-main-white flex items-center gap-x-2 pb-0.5 text-sm hover:cursor-pointer hover:border-b">
          <ArrowLeftIcon className="size-4" /> Back to Refund History
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
              <dt className="text-muted-foreground text-sm">Status</dt>
              <Skeleton className="h-[22px] w-24" />
            </div>
            <div>
              <dt className="text-muted-foreground text-sm">Reason</dt>
              <Skeleton className="h-[22px] w-32" />
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
};

const RefundDetailSectionSuspense = ({
  referenceId,
  backHref = "/profile/refund-history",
}: RefundDetailSectionProps) => {
  const { data } = useSuspenseQuery(listenerRefundTransactionByIdOptions({ id: referenceId }));

  const refundData = data?.refundTransactions?.items?.[0];
  if (!refundData) return <div className="p-4">Refund not found.</div>;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Refund Detail</h1>
          {/* <p className="text-muted-foreground text-sm">Reference: #{refundData.id?.slice(-8)}</p> */}
        </div>
        <Link
          href={backHref}
          className="text-primary hover:border-main-white flex items-center gap-x-2 pb-0.5 text-sm hover:border-b"
        >
          <ArrowLeftIcon className="size-4" /> Back to Refund History
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            Refund Information
             <span>Refund Transaction: #{refundData.id}</span>
            {refundData.status && refundStatusBadge(refundData.status)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground text-sm">Created at</dt>
              <dd className="text-sm">
                {refundData.createdAt ? new Date(refundData.createdAt as unknown as string).toLocaleString() : "-"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-sm">Updated at</dt>
              <dd className="text-sm">
                {refundData.updatedAt ? new Date(refundData.updatedAt as unknown as string).toLocaleString() : "-"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-sm">Amount</dt>
              <dd className="text-sm">
                {typeof refundData.amount === "number" 
                  ? refundData.amount.toLocaleString() 
                  : refundData.amount}{" "}
                {refundData.currency}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-sm">Status</dt>
              <dd className="text-sm">
                {refundData.status ? refundStatusBadge(refundData.status) : "-"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-sm">Reason</dt>
              <dd className="text-sm">
                {refundData.reason ? refundReasonBadge(refundData.reason) : "-"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-sm">Stripe Payment ID</dt>
              <dd className="font-mono text-sm">
                {refundData.stripePaymentId || "-"}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground text-sm">Refund ID</dt>
              <dd className="font-mono text-sm">
                {refundData.id || "-"}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
};

export default RefundDetailSection;
