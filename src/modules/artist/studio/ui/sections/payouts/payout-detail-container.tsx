"use client";

import React from "react";
import { PayoutTransactionStatus } from "@/gql/graphql";
import PayoutDetailSection from "@/modules/artist/studio/ui/sections/payouts/payout-detail-section";
import { useQuery } from "@tanstack/react-query";
import { artistPayoutByIdOptions, platformFeeByPayoutIdOptions } from "@/gql/options/artist-activity-options";
import { payoutStatusBadge } from "@/modules/shared/ui/components/status/status-badges";

type Props = {
  referenceId: string;
  backHref?: string;
};

export default function PayoutDetailContainer({ referenceId, backHref = "/artist/studio/transactions/payouts" }: Props) {
  const { data, isLoading, isError } = useQuery(artistPayoutByIdOptions({ id: referenceId }));
  const { data: platformFeeData } = useQuery(platformFeeByPayoutIdOptions({ payoutTransactionId: referenceId }));
  
  if (isLoading) return <div className="p-4">Loading payout…</div>;
  if (isError) return <div className="p-4 text-red-500">Failed to load payout.</div>;
  const item = data?.payoutTransactions?.items?.[0];
  if (!item) return <div className="p-4">Payout not found.</div>;
  
  const platformFee = platformFeeData?.packageOrders?.items?.[0]?.platformFeePercentage;
  
  const tx = {
    id: item.id,
    stripeTransferId: item.stripeTransferId,
    amount: item.amount,
    currency: item.currency,
    createdAt: (item.createdAt as unknown as string),
    status: item.status as PayoutTransactionStatus,
    method: item.method ?? "bank_transfer",
    destinationAccountId: item.destinationAccountId,
    stripePayoutId: item.stripePayoutId,
  };

  const statusBadge = payoutStatusBadge;

  return (
    <PayoutDetailSection
      title="Payout Detail"
      reference={referenceId}
      backHref={backHref}
      backLabel="Back to Payouts"
      headerId={tx.id}
      statusBadge={statusBadge(tx.status)}
      rows={[
        { label: "Created at", value: new Date(tx.createdAt).toLocaleString() },
        { label: "Amount", value: `${tx.amount.toLocaleString()} ${tx.currency}` },
        { 
          label: "Platform Fee", 
          value: platformFee !== undefined && platformFee !== null 
            ? `${platformFee}%`
            : "-"
        },
        { label: "Method", value: tx.method },
        { label: "Destination Account", value: tx.destinationAccountId },
        { label: "Stripe Payout ID", value: tx.stripePayoutId },
        { label: "Stripe Transfer ID", value: tx.stripeTransferId },
      ]}
    />
  );
}
