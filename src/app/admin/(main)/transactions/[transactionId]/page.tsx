import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { adminPaymentTransactionByIdOptions } from "@/gql/options/transaction-options";
import { AdminTransactionDetail } from "@/modules/admin/transactions/ui/views/admin-transaction-detail";

interface PageProps {
  params: Promise<{ transactionId: string }>;
}

const TransactionDetailPage = async ({ params }: PageProps) => {
  const { transactionId } = await params;

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(adminPaymentTransactionByIdOptions({ id: transactionId }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminTransactionDetail transactionId={transactionId} />
    </HydrationBoundary>
  );
};

export default TransactionDetailPage;