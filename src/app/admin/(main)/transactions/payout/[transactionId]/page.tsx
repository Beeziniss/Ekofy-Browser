import { AdminPayoutTransactionDetail } from "@/modules/admin/transactions/ui/views";
import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { adminPayoutTransactionByIdOptions } from "@/gql/options/transaction-options";

interface PayoutTransactionDetailPageProps {
  params: Promise<{
    transactionId: string;
  }>;
}

const PayoutTransactionDetailPage = async ({ params }: PayoutTransactionDetailPageProps) => {
  const resolvedParams = await params;
  const queryClient = getQueryClient();

  // Prefetch transaction data
  await queryClient.prefetchQuery(adminPayoutTransactionByIdOptions({ id: resolvedParams.transactionId }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminPayoutTransactionDetail transactionId={resolvedParams.transactionId} />
    </HydrationBoundary>
  );
};

export default PayoutTransactionDetailPage;
