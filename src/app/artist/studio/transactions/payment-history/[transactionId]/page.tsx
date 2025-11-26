import { artistTransactionByIdOptions } from "@/gql/options/artist-activity-options";
import TransactionDetailSection from "@/modules/artist/studio/ui/sections/transactions/transaction-detail-section";
import { getQueryClient } from "@/providers/get-query-client";

interface PageProps {
  params: Promise<{ transactionId: string }>;
}

const ArtistTransactionDetailPage = async ({ params }: PageProps) => {
  const { transactionId } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(artistTransactionByIdOptions({ id: transactionId }));
  return (
    <TransactionDetailSection referenceId={transactionId} backHref="/artist/studio/transactions/payment-history" />
  );
};

export default ArtistTransactionDetailPage;
