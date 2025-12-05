import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { listenerTransactionByIdOptions } from "@/gql/options/listener-activity-options";
import { ListenerTransactionHistoryDetail } from "@/modules/client/transaction-history/ui/views";

interface PageProps {
  params: Promise<{ transactionId: string }>;
}

const TransactionDetailPage = async ({ params }: PageProps) => {
  const { transactionId } = await params;

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(listenerTransactionByIdOptions({ id: transactionId }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ListenerTransactionHistoryDetail transactionId={transactionId} />
    </HydrationBoundary>
  );
};

export default TransactionDetailPage;
