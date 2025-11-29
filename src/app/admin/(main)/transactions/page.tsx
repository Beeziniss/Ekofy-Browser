"use client";

import { adminTransactionsOptions } from "@/gql/options/admin-options";
import { AdminTransactionsList } from "@/modules/admin/transactions/ui/view";
import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const AdminTransactionsPage = () => {
  const queryClient = getQueryClient();

  // Prefetch the first page of transactions
  void queryClient.prefetchQuery(adminTransactionsOptions(1, 20));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminTransactionsList />
    </HydrationBoundary>
  );
};

export default AdminTransactionsPage;
