import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { listenerTransactionByIdOptions } from "@/gql/options/listener-activity-options";
import TransactionDetailSection from "@/modules/client/profile/ui/sections/payment-history/transaction-detail-section";

interface PageProps {
  params: Promise<{ transactionId: string }>;
}

const TransactionDetailPage = async ({ params }: PageProps) => {
  const { transactionId } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(listenerTransactionByIdOptions({ id: transactionId }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TransactionDetailSection referenceId={transactionId} />
    </HydrationBoundary>
  );
};

export default TransactionDetailPage;
