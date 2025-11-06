"use client";

import Link from "next/link";
import { useAuthStore } from "@/store";
import { UserRole } from "@/types/role";
import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import SharedInvoicesTable from "@/modules/shared/ui/components/activity/invoices-table";

export default function InvoicesPage() {
  const router = useRouter();
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
    <Suspense fallback={<div className="p-4">Loading invoices…</div>}>
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Invoices</h1>
          <Button variant="ghost" asChild>
            <Link href="/profile">&larr; Back to Profile</Link>
          </Button>
        </div>
        <p className="text-muted-foreground mb-2 text-sm">All invoices associated with your account.</p>
        <SharedInvoicesTable
          userId={user!.userId}
          source="listener"
          invoiceLinkPrefix="/profile/invoices"
          txLinkPrefix="/profile/payment-history"
        />
      </div>
    </Suspense>
  );
}
