import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { moderatorDisputedPackageOrdersOptions } from "@/gql/options/moderator-options";
import { OrderDisputedView } from "@/modules/moderator/order-disputed/ui/view";

const OrderDisputedPage = async () => {
  const queryClient = getQueryClient();

  // Prefetch the first page of disputed orders
  await queryClient.prefetchQuery(moderatorDisputedPackageOrdersOptions(1, 10));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OrderDisputedView />
    </HydrationBoundary>
  );
};

export default OrderDisputedPage;
