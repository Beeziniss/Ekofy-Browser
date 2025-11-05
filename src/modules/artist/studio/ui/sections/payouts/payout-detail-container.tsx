"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { PayoutTransactionStatus } from "@/gql/graphql";
import PayoutDetailSection from "@/modules/artist/studio/ui/sections/payouts/payout-detail-section";
import { useQuery } from "@tanstack/react-query";
import { artistPayoutByIdOptions } from "@/gql/options/artist-activity-options";

type Props = {
  referenceId: string;
  backHref?: string;
};

export default function PayoutDetailContainer({ referenceId, backHref = "/artist/studio/transactions/payouts" }: Props) {
  const { data, isLoading, isError } = useQuery(artistPayoutByIdOptions({ id: referenceId }));
  if (isLoading) return <div className="p-4">Loading payout…</div>;
  if (isError) return <div className="p-4 text-red-500">Failed to load payout.</div>;
  const item = data?.payoutTransactions?.items?.[0];
  if (!item) return <div className="p-4">Payout not found.</div>;
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

  const statusBadge = (status: PayoutTransactionStatus) => {
    switch (status) {
      case PayoutTransactionStatus.Paid:
        return <Badge className="bg-green-100 text-green-800 border-green-200">Paid</Badge>;
      case PayoutTransactionStatus.Pending:
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case PayoutTransactionStatus.InTransit:
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">In transit</Badge>;
      case PayoutTransactionStatus.Failed:
        return <Badge className="bg-red-100 text-red-800 border-red-200">Failed</Badge>;
      case PayoutTransactionStatus.Canceled:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Canceled</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Unknown</Badge>;
    }
  };

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
        { label: "Method", value: tx.method },
        { label: "Destination Account", value: tx.destinationAccountId },
        { label: "Stripe Payout ID", value: tx.stripePayoutId },
        { label: "Stripe Transfer ID", value: tx.stripeTransferId },
      ]}
    />
  );
}
