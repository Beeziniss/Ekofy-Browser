"use client";

import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { InvoiceListSection } from "../sections";

export function ListenerInvoicesList() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Invoices</h1>
        <Link
          href="/profile"
          className="hover:border-main-white flex items-center gap-x-2 pb-0.5 text-sm font-normal transition hover:border-b"
        >
          <ArrowLeftIcon className="w-4" /> Back to Profile
        </Link>
      </div>
      <p className="text-muted-foreground mb-6 text-sm">View and manage all your invoices and billing history.</p>
      <InvoiceListSection />
    </div>
  );
}
