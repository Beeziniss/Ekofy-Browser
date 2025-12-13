import { adminPayoutTransactionsOptions } from "@/gql/options/transaction-options";
import { AdminTransactionsList } from "@/modules/admin/transactions/ui/views";
import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const AdminTransactionsPage = async () => {
  const queryClient = getQueryClient();

  // Prefetch all transaction types
  await Promise.all([
    queryClient.prefetchQuery(adminPayoutTransactionsOptions(1, 10)),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminTransactionsList />
    </HydrationBoundary>
  );
};

export default AdminTransactionsPage;
