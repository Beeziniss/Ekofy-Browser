"use client";

import SharedInvoicesTable from "@/modules/shared/ui/components/activity/invoices-table";

interface ArtistInvoiceTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  invoices: Record<string, any>[];
  isLoading: boolean;
  isError: boolean;
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export function ArtistInvoiceTable({
  invoices,
  isLoading,
  isError,
  page,
  pageSize,
  totalCount,
  onPageChange,
}: ArtistInvoiceTableProps) {
  return (
    <SharedInvoicesTable
      source="artist"
      invoiceLinkPrefix="/artist/studio/profile/invoices"
      txLinkPrefix="/artist/studio/transactions/payment-history"
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
