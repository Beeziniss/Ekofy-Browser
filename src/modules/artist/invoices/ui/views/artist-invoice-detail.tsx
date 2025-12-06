"use client";

import { InvoiceDetailSection } from "../sections";

interface ArtistInvoiceDetailProps {
  invoiceId: string;
}

export function ArtistInvoiceDetail({ invoiceId }: ArtistInvoiceDetailProps) {
  return <InvoiceDetailSection referenceId={invoiceId} />;
}
