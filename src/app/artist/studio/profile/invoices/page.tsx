"use client";

import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";
import { UserRole } from "@/types/role";
import ArtistInvoicesTable from "@/modules/artist/profile/ui/components/activity/invoices-table";

export default function ArtistInvoicesPage() {
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
    <Suspense fallback={<div className="p-4">Loading invoices…</div>}>
      <div className="mx-auto w-full max-w-5xl px-4 md:px-6 py-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-sm text-muted-foreground">Your billing history</p>
        </div>
  <ArtistInvoicesTable userId={user!.userId} />
      </div>
    </Suspense>
  );
}
