"use client";

import React, { Suspense, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/store";
import { UserRole } from "@/types/role";
import TransactionDetailSection from "@/modules/client/profile/ui/sections/payment-history/transaction-detail-section";

export default function TransactionDetailPage() {
  const router = useRouter();
  const params = useParams<{ transactionId: string }>();
  const { isAuthenticated, user, clearUserData } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (user?.role !== UserRole.LISTENER) {
      clearUserData();
      router.replace("/login");
    }
  }, [isAuthenticated, user?.role, router, clearUserData]);

  if (!isAuthenticated || user?.role !== UserRole.LISTENER) return null;

  return (
    <Suspense fallback={<div className="p-4">Loading transaction…</div>}> 
      <TransactionDetailSection referenceId={params.transactionId} backHref="/profile/payment-history" />
    </Suspense>
  );
}
