"use client";

import { TransactionLayout } from "../layouts";
import { TransactionListSection } from "../sections";

export function AdminTransactionsList() {
  return (
    <TransactionLayout>
      <TransactionListSection />
    </TransactionLayout>
  );
}
