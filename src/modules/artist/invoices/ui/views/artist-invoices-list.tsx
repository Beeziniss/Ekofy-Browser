"use client";

import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { InvoiceListSection } from "../sections";

export function ArtistInvoicesList() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Invoices</h1>
       
      </div>
      <p className="text-muted-foreground mb-6 text-sm">View and manage all your invoices and billing history.</p>
      <InvoiceListSection />
    </div>
  );
}
