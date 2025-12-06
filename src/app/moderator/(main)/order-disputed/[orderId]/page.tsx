import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { moderatorPackageOrderDetailOptions } from "@/gql/options/moderator-options";
import { OrderDetailView } from "@/modules/moderator/order-disputed/ui/view";
import { notFound } from "next/navigation";

interface OrderDetailPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

const OrderDetailPage = async ({ params }: OrderDetailPageProps) => {
  const { orderId } = await params;

  if (!orderId) {
    notFound();
  }

  const queryClient = getQueryClient();

  // Prefetch order detail data
  await queryClient.prefetchQuery(moderatorPackageOrderDetailOptions(orderId));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OrderDetailView orderId={orderId} />
    </HydrationBoundary>
  );
};

export default OrderDetailPage;
