"use client";

import TransactionDetailSection from "../sections/transaction-detail-section";

interface ArtistTransactionHistoryDetailProps {
  referenceId: string;
}

export function ArtistTransactionHistoryDetail({ referenceId }: ArtistTransactionHistoryDetailProps) {
  return <TransactionDetailSection referenceId={referenceId} />;
}
