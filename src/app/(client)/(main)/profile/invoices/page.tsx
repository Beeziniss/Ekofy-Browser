"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";
import { UserRole } from "@/types/role";
import InvoicesTable from "@/modules/client/profile/ui/components/activity/invoices-table";
import { Button } from "@/components/ui/button";

export default function InvoicesPage() {
  const router = useRouter();
  const { isAuthenticated, user, clearUserData } = useAuthStore();

  React.useEffect(() => {
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
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Invoices</h1>
          <Button variant="ghost" asChild>
            <Link href="/profile">&larr; Back to Profile</Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mb-2">All invoices associated with your account.</p>
        <InvoicesTable userId={user!.userId} />
      </div>
    </Suspense>
  );
}
