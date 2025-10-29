"use client";

import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";
import { UserRole } from "@/types/role";
import PaymentTransactionsTable from "@/modules/client/profile/ui/components/activity/payment-transactions-table";

export default function PaymentHistoryPage() {
  const router = useRouter();
  const { isAuthenticated, user, clearUserData } = useAuthStore();

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (user?.role !== UserRole.LISTENER) {
      // If not a listener, send to login/home
      clearUserData();
      router.replace("/login");
    }
  }, [isAuthenticated, user?.role, router, clearUserData]);

  if (!isAuthenticated || user?.role !== UserRole.LISTENER) return null;

  return (
    <Suspense fallback={<div className="p-4">Loading payment history…</div>}>
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6 py-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Payment History</h1>
          <p className="text-sm text-muted-foreground">Your payments in reverse chronological order.</p>
        </div>
        <PaymentTransactionsTable userId={user!.userId} />
      </div>
    </Suspense>
  );
}
