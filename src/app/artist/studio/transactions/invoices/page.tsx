import { Suspense } from "react";
import { ArtistInvoicesList } from "@/modules/artist/invoices/ui/views";

export default function ArtistInvoicesPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading invoices…</div>}>
      <ArtistInvoicesList />
    </Suspense>
  );
}
