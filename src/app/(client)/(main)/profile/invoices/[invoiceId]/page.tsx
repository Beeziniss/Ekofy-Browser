"use client";

import React, { Suspense, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/store";
import { UserRole } from "@/types/role";
import InvoiceDetailSection from "@/modules/client/profile/ui/sections/invoices/invoice-detail-section";

export default function InvoiceDetailPage() {
  const router = useRouter();
  const params = useParams<{ invoiceId: string }>();
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
    <Suspense fallback={<div className="p-4">Loading invoice…</div>}> 
      <InvoiceDetailSection referenceId={params.invoiceId} backHref="/profile/invoices" />
    </Suspense>
  );
}
