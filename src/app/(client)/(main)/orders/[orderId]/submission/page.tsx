import OrderSubmissionView from "@/modules/client/order/ui/views/order-submission-view";

interface PageProps {
  params: Promise<{ orderId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { orderId } = await params;

  return <OrderSubmissionView orderId={orderId} />;
};

export default Page;
