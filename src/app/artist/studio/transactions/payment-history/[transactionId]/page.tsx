"use client";

import React, { Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/store";
import { UserRole } from "@/types/role";
import TransactionDetailSection from "@/modules/artist/studio/ui/sections/transactions/transaction-detail-section";

export default function ArtistTransactionDetailPage() {
  const router = useRouter();
  const params = useParams<{ transactionId: string }>();
  const { isAuthenticated, user, clearUserData } = useAuthStore();

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (user?.role !== UserRole.ARTIST) {
      clearUserData();
      router.replace("/login");
    }
  }, [isAuthenticated, user?.role, router, clearUserData]);

  if (!isAuthenticated || user?.role !== UserRole.ARTIST) return null;

  return (
    <Suspense fallback={<div className="p-4">Loading transaction…</div>}>
      <TransactionDetailSection referenceId={params.transactionId} backHref="/artist/studio/transactions/payment-history" />
    </Suspense>
  );
}
