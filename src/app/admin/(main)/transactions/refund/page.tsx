import { adminRefundTransactionsOptions } from "@/gql/options/transaction-options";
import { AdminTransactionsList } from "@/modules/admin/transactions/ui/views";
import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const AdminRefundTransactionsPage = async () => {
  const queryClient = getQueryClient();

  // Prefetch refund transactions
  await queryClient.prefetchQuery(adminRefundTransactionsOptions(1, 10));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminTransactionsList />
    </HydrationBoundary>
  );
};

export default AdminRefundTransactionsPage;
