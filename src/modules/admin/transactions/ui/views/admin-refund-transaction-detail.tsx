"use client";

import { TransactionLayout } from "../layouts";
import { RefundTransactionDetailSection } from "../sections";

interface AdminRefundTransactionDetailProps {
  transactionId: string;
}

export function AdminRefundTransactionDetail({ transactionId }: AdminRefundTransactionDetailProps) {
  return (
    <TransactionLayout showHeader={false}>
      <RefundTransactionDetailSection referenceId={transactionId} />
    </TransactionLayout>
  );
}
