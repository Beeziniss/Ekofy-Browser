"use client";

import SharedPaymentTransactionsTable from "@/modules/shared/ui/components/activity/payment-transactions-table";

interface PaymentTransactionsTableProps {
  userId: string;
  pageSize?: number;
}

export default function PaymentTransactionsTable({ userId, pageSize = 10 }: PaymentTransactionsTableProps) {
  return (
    <SharedPaymentTransactionsTable
      userId={userId}
      pageSize={pageSize}
      source="listener"
      linkPrefix="/profile/payment-history"
    />
  );
}
