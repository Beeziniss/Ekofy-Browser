"use client";

import React from "react";
import { PaymentTransactionStatus } from "@/gql/graphql";
import PaymentTransactionDetailSection from "@/modules/shared/ui/sections/transactions/payment-transaction-detail-section";
import { useQuery } from "@tanstack/react-query";
import { listenerTransactionByIdOptions } from "@/gql/options/listener-activity-options";

type Props = {
  referenceId: string;
  backHref?: string;
};

export default function TransactionDetailSection({ referenceId, backHref = "/profile/payment-history" }: Props) {
  const { data, isLoading, isError } = useQuery(listenerTransactionByIdOptions({ id: referenceId }));

  if (isLoading) return <div className="p-4">Loading transaction…</div>;
  if (isError) return <div className="p-4 text-red-500">Failed to load transaction.</div>;

  const item = data?.transactions?.items?.[0];
  if (!item) return <div className="p-4">Transaction not found.</div>;

  const tx = {
    id: item.id ?? referenceId,
    stripePaymentId: item.stripePaymentId ?? referenceId,
    amount: item.amount ?? 0,
    currency: item.currency ?? "USD",
    createdAt: (item.createdAt as unknown as string) ?? new Date().toISOString(),
    paymentStatus: (item.paymentStatus as PaymentTransactionStatus) ?? PaymentTransactionStatus.Pending,
    stripePaymentMethod: (item.stripePaymentMethod as string[]) ?? [],
  };

  return (
    <PaymentTransactionDetailSection referenceId={referenceId} backHref={backHref} tx={tx} />
  );
}
