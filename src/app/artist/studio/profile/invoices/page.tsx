"use client";

import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";
import { UserRole } from "@/types/role";
import SharedInvoicesTable from "@/modules/shared/ui/components/activity/invoices-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Invoices</h1>
            <p className="text-sm text-muted-foreground">Your billing history</p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/artist/studio/profile">&larr; Back to Profile</Link>
          </Button>
        </div>
  <SharedInvoicesTable
    userId={user!.userId}
    source="artist"
    invoiceLinkPrefix="/artist/studio/profile/invoices"
    txLinkPrefix="/artist/studio/transactions/payment-history"
  />
      </div>
    </Suspense>
  );
}
