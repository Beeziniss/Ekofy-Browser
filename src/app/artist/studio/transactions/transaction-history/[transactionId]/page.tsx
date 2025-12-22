import { ArtistTransactionHistoryDetail } from "@/modules/artist/transaction-history/ui/views";

interface PageProps {
  params: Promise<{ transactionId: string }>;
}

const ArtistTransactionDetailPage = async ({ params }: PageProps) => {
  const { transactionId } = await params;

  return <ArtistTransactionHistoryDetail referenceId={transactionId} />;
};

export default ArtistTransactionDetailPage;
