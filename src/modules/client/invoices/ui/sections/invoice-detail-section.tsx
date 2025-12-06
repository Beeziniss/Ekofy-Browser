"use client";

import { useQuery } from "@tanstack/react-query";
import { listenerInvoiceByIdOptions } from "@/gql/options/listener-activity-options";
import SharedInvoiceDetailSection from "@/modules/shared/ui/sections/invoices/invoice-detail-section";

interface InvoiceDetailSectionProps {
  referenceId: string;
  backHref?: string;
}

export function InvoiceDetailSection({ referenceId, backHref = "/profile/invoices" }: InvoiceDetailSectionProps) {
  const { data, isLoading, isError } = useQuery(listenerInvoiceByIdOptions({ id: referenceId }));

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-400">Loading invoice...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-red-400">Failed to load invoice.</div>
      </div>
    );
  }

  const item = data?.invoices?.items?.[0];

  if (!item) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-400">Invoice not found.</div>
      </div>
    );
  }

  return (
    <SharedInvoiceDetailSection
      backHref={backHref}
      
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
