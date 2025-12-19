"use client";

import React, { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";
import { UserRole } from "@/types/role";
import PayoutsTable from "@/modules/artist/studio/ui/components/transactions/payouts-table";

export default function TransactionsPayoutsPage() {
  const router = useRouter();
  const { isAuthenticated, user, clearUserData } = useAuthStore();
  const [typeFilter, setTypeFilter] = useState("all");

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
    <Suspense fallback={<div className="p-4">Loading payouts…</div>}>
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Payouts</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-2">All payouts to your artist account.</p>
        <PayoutsTable 
          userId={user!.userId} 
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
        />
      </div>
    </Suspense>
  );
}
