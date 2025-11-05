"use client";

import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";
import { UserRole } from "@/types/role";
import SharedPaymentTransactionsTable from "@/modules/shared/ui/components/activity/payment-transactions-table";

export default function TransactionsPaymentHistoryPage() {
  const router = useRouter();
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
    <Suspense fallback={<div className="p-4">Loading transactions…</div>}>
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Payment History</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-2">All payments associated with your artist account.</p>
        <SharedPaymentTransactionsTable
          userId={user!.userId}
          source="artist"
          linkPrefix="/artist/studio/transactions/payment-history"
        />
      </div>
    </Suspense>
  );
}
