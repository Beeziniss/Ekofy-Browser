import { artistTransactionByIdOptions } from "@/gql/options/artist-activity-options";
import { ArtistTransactionHistoryDetail } from "@/modules/artist/transaction-history/ui/views";
import { getQueryClient } from "@/providers/get-query-client";

interface PageProps {
  params: Promise<{ transactionId: string }>;
}

const ArtistTransactionDetailPage = async ({ params }: PageProps) => {
  const { transactionId } = await params;

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(artistTransactionByIdOptions({ id: transactionId }));

  return <ArtistTransactionHistoryDetail referenceId={transactionId} />;
};

export default ArtistTransactionDetailPage;
