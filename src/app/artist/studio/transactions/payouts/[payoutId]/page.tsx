"use client";

import React, { Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/store";
import { UserRole } from "@/types/role";
import PayoutDetailContainer from "@/modules/artist/studio/ui/sections/payouts/payout-detail-container";

export default function PayoutDetailPage() {
  const router = useRouter();
  const params = useParams<{ payoutId: string }>();
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
    <Suspense fallback={<div className="p-4">Loading payout…</div>}>
      <PayoutDetailContainer referenceId={params.payoutId} backHref="/artist/studio/transactions/payouts" />
    </Suspense>
  );
}
