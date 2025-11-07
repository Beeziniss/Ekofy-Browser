import ArtistInvoiceDetailSection from "@/modules/artist/profile/ui/components/invoices/invoice-detail-section";

interface PageProps {
  params: Promise<{ invoiceId: string }>;
}

const ArtistInvoiceDetailPage = async ({ params }: PageProps) => {
  const { invoiceId } = await params;

  return <ArtistInvoiceDetailSection referenceId={invoiceId} backHref="/artist/studio/profile/invoices" />;
};

export default ArtistInvoiceDetailPage;
