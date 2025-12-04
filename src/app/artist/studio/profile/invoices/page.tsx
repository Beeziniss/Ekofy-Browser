"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { useAuthStore } from "@/store";
import { UserRole } from "@/types/role";
import { ArtistInvoiceListSection } from "@/modules/artist/profile/ui/components/invoices/invoice-list-section";

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
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Invoices</h1>
          <Link
            href="/artist/studio/profile"
            className="hover:border-main-white flex items-center gap-x-2 pb-0.5 text-sm font-normal transition hover:border-b"
          >
            <ArrowLeftIcon className="w-4" /> Back to Profile
          </Link>
        </div>
        <p className="text-muted-foreground mb-6 text-sm">View and manage all your invoices and billing history.</p>
        <ArtistInvoiceListSection />
      </div>
    </Suspense>
  );
}
