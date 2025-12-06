"use client";

import { InvoiceDetailSection } from "../sections";

interface ListenerInvoiceDetailProps {
  invoiceId: string;
}

export function ListenerInvoiceDetail({ invoiceId }: ListenerInvoiceDetailProps) {
  return <InvoiceDetailSection referenceId={invoiceId} />;
}
