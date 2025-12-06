"use client";

import SharedInvoicesTable from "@/modules/shared/ui/components/activity/invoices-table";

interface InvoiceTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  invoices: Record<string, any>[];
  isLoading: boolean;
  isError: boolean;
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export function InvoiceTable({
  invoices,
  isLoading,
  isError,
  page,
  pageSize,
  totalCount,
  onPageChange,
}: InvoiceTableProps) {
  return (
    <SharedInvoicesTable
      source="listener"
      invoiceLinkPrefix="/profile/invoices"
      txLinkPrefix="/profile/payment-history"
      pageSize={pageSize}
      externalData={{
        items: invoices,
        isLoading,
        isError,
        page,
        totalCount,
        onPageChange,
      }}
    />
  );
}
