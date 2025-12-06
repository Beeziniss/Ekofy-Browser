"use client";

import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { TransactionListSection } from "../sections";

export function ArtistTransactionHistoryList() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Transaction History</h1>
      </div>
      <p className="text-muted-foreground mb-6 text-sm">All payment transactions for your artist account.</p>
      <TransactionListSection />
    </div>
  );
}
