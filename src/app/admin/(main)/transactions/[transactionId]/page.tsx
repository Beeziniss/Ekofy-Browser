import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { adminTransactionByIdOptions } from "@/gql/options/admin-options";
import TransactionDetailSection from "@/modules/admin/transactions/ui/section/transaction-detail-section";

interface PageProps {
  params: Promise<{ transactionId: string }>;
}

const TransactionDetailPage = async ({ params }: PageProps) => {
  const { transactionId } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(adminTransactionByIdOptions({ id: transactionId }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TransactionDetailSection referenceId={transactionId} />
    </HydrationBoundary>
  );
};

export default TransactionDetailPage;
