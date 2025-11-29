"use client";

import { useRouter } from "next/navigation";
import { TransactionDetailSection } from "../sections/transaction-detail-section";
import { TransactionLayout } from "../layouts/transaction-layout";

interface AdminTransactionDetailProps {
  transactionId: string;
}

export function AdminTransactionDetail({ transactionId }: AdminTransactionDetailProps) {
  const router = useRouter();

  const handleBack = () => {
    router.push("/admin/transactions");
  };

  return (
    <TransactionLayout>
      <TransactionDetailSection referenceId={transactionId} onBack={handleBack} />
    </TransactionLayout>
  );
}
