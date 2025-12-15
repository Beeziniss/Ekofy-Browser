import { AdminRefundTransactionDetail } from "@/modules/admin/transactions/ui/views";
import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { adminRefundTransactionByIdOptions } from "@/gql/options/transaction-options";

interface RefundTransactionDetailPageProps {
  params: Promise<{
    transactionId: string;
  }>;
}

const RefundTransactionDetailPage = async ({ params }: RefundTransactionDetailPageProps) => {
  const resolvedParams = await params;
  const queryClient = getQueryClient();

  // Prefetch transaction data
  await queryClient.prefetchQuery(adminRefundTransactionByIdOptions({ id: resolvedParams.transactionId }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminRefundTransactionDetail transactionId={resolvedParams.transactionId} />
    </HydrationBoundary>
  );
};

export default RefundTransactionDetailPage;
