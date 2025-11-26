import { orderPackageDetailOptions } from "@/gql/options/client-options";
import OrderSubmissionView from "@/modules/client/order/ui/views/order-submission-view";
import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface PageProps {
  params: Promise<{ orderId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { orderId } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(orderPackageDetailOptions(orderId));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OrderSubmissionView orderId={orderId} />
    </HydrationBoundary>
  );
};

export default Page;
