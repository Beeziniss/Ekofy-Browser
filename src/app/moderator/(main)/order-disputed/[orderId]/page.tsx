import { OrderDetailView } from "@/modules/moderator/order-disputed/ui/view";

interface OrderDetailPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

const OrderDetailPage = async ({ params }: OrderDetailPageProps) => {
  const { orderId } = await params;

  return <OrderDetailView orderId={orderId} />;
};

export default OrderDetailPage;
