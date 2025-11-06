"use client";

import Link from "next/link";
import { useAuthStore } from "@/store";
import { UserRole } from "@/types/role";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import { Button } from "@/components/ui/button";
import PaymentTransactionsTable from "@/modules/client/profile/ui/components/activity/payment-transactions-table";

export default function PaymentHistoryPage() {
  const router = useRouter();
  const { isAuthenticated, user, clearUserData } = useAuthStore();

  useEffect(() => {
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
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Payment History</h1>
          <Button variant="ghost" asChild>
            <Link href="/profile">&larr; Back to Profile</Link>
          </Button>
        </div>
        <p className="text-muted-foreground mb-2 text-sm">All payments you made on Ekofy.</p>
        <PaymentTransactionsTable userId={user!.userId} />
      </div>
    </Suspense>
  );
}
