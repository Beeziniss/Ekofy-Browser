import { adminTransactionsOptions } from "@/gql/options/admin-options";
import { AdminTransactionsList } from "@/modules/admin/transactions/ui/views";
import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const AdminTransactionsPage = async () => {
  const queryClient = getQueryClient();

  // Prefetch the first page of transactions
  await queryClient.prefetchQuery(adminTransactionsOptions(1, 20));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminTransactionsList />
    </HydrationBoundary>
  );
};

export default AdminTransactionsPage;
