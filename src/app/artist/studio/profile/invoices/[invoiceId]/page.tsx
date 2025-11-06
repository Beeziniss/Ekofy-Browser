"use client";

import React, { Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/store";
import { UserRole } from "@/types/role";
import ArtistInvoiceDetailSection from "@/modules/artist/profile/ui/sections/invoices/invoice-detail-section";

export default function ArtistInvoiceDetailPage() {
  const router = useRouter();
  const params = useParams<{ invoiceId: string }>();
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
    <Suspense fallback={<div className="p-4">Loading invoice…</div>}>
      <ArtistInvoiceDetailSection referenceId={params.invoiceId} backHref="/artist/studio/profile/invoices" />
    </Suspense>
  );
}
