import { ListenerInvoiceDetail } from "@/modules/client/invoices/ui/views";

interface PageProps {
  params: Promise<{ invoiceId: string }>;
}

const InvoiceDetailPage = async ({ params }: PageProps) => {
  const { invoiceId } = await params;

  return <ListenerInvoiceDetail invoiceId={invoiceId} />;
};

export default InvoiceDetailPage;
