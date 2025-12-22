import { AdminSubscriptionDetail } from "@/modules/admin/subscription/ui/view";

interface SubscriptionDetailPageProps {
  params: Promise<{
    subscriptionId: string;
  }>;
}

const SubscriptionDetailPage = async ({ params }: SubscriptionDetailPageProps) => {
  const { subscriptionId } = await params;

  return <AdminSubscriptionDetail subscriptionId={subscriptionId} />;
};

export default SubscriptionDetailPage;
