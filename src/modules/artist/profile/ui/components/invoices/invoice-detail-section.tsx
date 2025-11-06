"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { artistInvoiceByIdOptions } from "@/gql/options/artist-activity-options";
import SharedInvoiceDetailSection from "@/modules/shared/ui/sections/invoices/invoice-detail-section";

type Props = {
  referenceId: string;
  backHref?: string;
};

export default function ArtistInvoiceDetailSection({ referenceId, backHref = "/artist/studio/profile/invoices" }: Props) {
  const { data, isLoading, isError } = useQuery(artistInvoiceByIdOptions({ id: referenceId }));
  if (isLoading) return <div className="p-4">Loading invoice…</div>;
  if (isError) return <div className="p-4 text-red-500">Failed to load invoice.</div>;
  const item = data?.invoices?.items?.[0];
  if (!item) return <div className="p-4">Invoice not found.</div>;

  return (
    <SharedInvoiceDetailSection
      backHref={backHref}
      referenceId={referenceId}
      invoice={{
        id: item.id!,
        amount: (item.amount ?? 0) as number,
        currency: item.currency,
        to: item.to ?? undefined,
        from: item.from ?? undefined,
        email: item.email ?? undefined,
        paidAt: item.paidAt as unknown as string,
        paymentTransactionId: item.paymentTransactionId ?? undefined,
      }}
    />
  );
}
