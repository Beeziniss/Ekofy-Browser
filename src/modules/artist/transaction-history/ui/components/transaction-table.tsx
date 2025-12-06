"use client";

import SharedPaymentTransactionsTable from "@/modules/shared/ui/components/activity/payment-transactions-table";

interface TransactionTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transactions: Record<string, any>[];
  isLoading: boolean;
  isError: boolean;
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export function TransactionTable({
  transactions,
  isLoading,
  isError,
  page,
  pageSize,
  totalCount,
  onPageChange,
}: TransactionTableProps) {
  return (
    <SharedPaymentTransactionsTable
      source="artist"
      linkPrefix="/artist/studio/transactions/transaction-history"
      pageSize={pageSize}
      externalData={{
        items: transactions,
        isLoading,
        isError,
        page,
        totalCount,
        onPageChange,
      }}
    />
  );
}
