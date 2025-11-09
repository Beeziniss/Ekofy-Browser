"use client";

import { useQuery } from "@tanstack/react-query";
import { artistTransactionByIdOptions } from "@/gql/options/artist-activity-options";
import PaymentTransactionDetailSection from "@/modules/shared/ui/sections/transactions/payment-transaction-detail-section";

type Props = {
  referenceId: string;
  backHref?: string;
};

export default function TransactionDetailSection({
  referenceId,
  backHref = "/artist/studio/transactions/payment-history",
}: Props) {
  const { data, isLoading, isError } = useQuery(artistTransactionByIdOptions({ id: referenceId }));

  if (isLoading) return <div className="p-4">Loading transaction…</div>;
  if (isError) return <div className="p-4 text-red-500">Failed to load transaction.</div>;

  const item = data?.transactions?.items?.[0];
  if (!item) return <div className="p-4">Transaction not found.</div>;

  return <PaymentTransactionDetailSection referenceId={referenceId} backHref={backHref} transaction={item} />;
}
