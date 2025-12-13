"use client";

import { TransactionLayout } from "../layouts";
import { PayoutTransactionDetailSection } from "../sections";

interface AdminPayoutTransactionDetailProps {
  transactionId: string;
}

export function AdminPayoutTransactionDetail({ transactionId }: AdminPayoutTransactionDetailProps) {
  return (
    <TransactionLayout showHeader={false}>
      <PayoutTransactionDetailSection referenceId={transactionId} />
    </TransactionLayout>
  );
}
