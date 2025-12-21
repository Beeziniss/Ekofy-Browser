"use client";

import React from "react";
import { PayoutTransactionStatus } from "@/gql/graphql";
import PayoutDetailSection from "@/modules/artist/studio/ui/sections/payouts/payout-detail-section";
import { useQuery } from "@tanstack/react-query";
import {
  artistPackageByIdOptions,
  artistPayoutByIdOptions,
  platformFeeByPayoutIdOptions,
} from "@/gql/options/artist-activity-options";
import { Badge } from "@/components/ui/badge";
import { payoutStatusBadge } from "@/modules/shared/ui/components/status/status-badges";

type Props = {
  referenceId: string;
  backHref?: string;
};

export default function PayoutDetailContainer({
  referenceId,
  backHref = "/artist/studio/transactions/payouts",
}: Props) {
  const { data, isLoading, isError } = useQuery({
    ...artistPayoutByIdOptions({ id: referenceId }),
  });
  const { data: platformFeeData } = useQuery({
    ...platformFeeByPayoutIdOptions({ payoutTransactionId: referenceId }),
  });
  const artistPackageId = platformFeeData?.packageOrders?.items?.[0]?.artistPackageId;
  const { data: packageData } = useQuery({
    ...artistPackageByIdOptions({ artistPackageId: artistPackageId || "" }),
    enabled: !!artistPackageId, // Only run when we have artistPackageId
  });
  if (isLoading) return <div className="p-4">Loading payout…</div>;
  if (isError) return <div className="p-4 text-red-500">Failed to load payout.</div>;
  const item = data?.payoutTransactions?.items?.[0];
  if (!item) return <div className="p-4">Payout not found.</div>;

  const platformFee = platformFeeData?.packageOrders?.items?.[0]?.platformFeePercentage;
  const isService = platformFee !== undefined && platformFee !== null;
  const payoutTypeBadge = isService ? (
    <Badge variant="ekofy">Service</Badge>
  ) : (
    <Badge variant="secondary">Streaming</Badge>
  );

  const tx = {
    id: item.id,

    amount: item.amount,
    currency: item.currency,
    createdAt: item.createdAt as unknown as string,
    status: item.status as PayoutTransactionStatus,
    method: item.method ?? "bank_transfer",

    stripePayoutId: item.stripePayoutId,
  };

  const statusBadge = payoutStatusBadge;
  const orderData = platformFeeData?.packageOrders?.items?.[0];
  const hasOrder = isService && orderData?.id;
  const orderSection = hasOrder
    ? {
        // orderId: orderData.id,
        orderLink: `/artist/orders/${orderData.id}/details`,

        rows: [
          {
            label: "Order ID", 
            value: orderData.id || "-",
          },
          {
            label: "Package Name", 
            value: packageData?.artistPackages?.items?.[0]?.packageName || "-",
          },
          {
            label: "Started At",
            value: orderData.startedAt ? new Date(orderData.startedAt as unknown as string).toLocaleString() : "-",
          },
          
          {
            label: "Completed At",
            value: orderData.completedAt ? new Date(orderData.completedAt as unknown as string).toLocaleString() : "-",
          },
          {
            label: "Total Amount",
            value:
              packageData?.artistPackages?.items?.[0]?.amount && packageData?.artistPackages?.items?.[0]?.currency
                ? `${packageData.artistPackages.items[0].amount.toLocaleString()} ${packageData.artistPackages.items[0].currency}`
                : "-",
          },
        ],
      }
    : undefined;

  return (
    <PayoutDetailSection
      title="Payout Detail"
      backHref={backHref}
      backLabel="Back to Payouts"
      headerId={tx.id}
      statusBadge={statusBadge(tx.status)}
      orderSection={orderSection}
      rows={[
        { label: "Created at", value: new Date(tx.createdAt).toLocaleString() },
        { label: "Amount", value: `${tx.amount.toLocaleString()} ${tx.currency.toUpperCase()}` },
        { label: "Type", value: payoutTypeBadge },
        {
          label: "Platform Fee",
          value: platformFee !== undefined && platformFee !== null ? `${platformFee}%` : "-",
        },
        { label: "Method", value: tx.method },
        { label: "Stripe Payout ID", value: tx.stripePayoutId },
      ]}
    />
  );
}
