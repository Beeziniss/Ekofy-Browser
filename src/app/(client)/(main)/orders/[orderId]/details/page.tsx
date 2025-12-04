import OrderDetailView from "@/modules/client/order/ui/views/order-detail-view";

interface PageProps {
  params: Promise<{ orderId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { orderId } = await params;

  return <OrderDetailView orderId={orderId} />;
};

export default Page;
