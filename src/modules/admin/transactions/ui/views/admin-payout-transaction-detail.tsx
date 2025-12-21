"use client";

import { TransactionLayout } from "../layouts";

import AdminPayoutDetailContainer from "../layouts/payout-detail-container";

interface AdminPayoutTransactionDetailProps {
  transactionId: string;
}

export function AdminPayoutTransactionDetail({ transactionId }: AdminPayoutTransactionDetailProps) {
  return (
    <TransactionLayout showHeader={false}>
      <AdminPayoutDetailContainer referenceId={transactionId} />
    </TransactionLayout>
  );
}
