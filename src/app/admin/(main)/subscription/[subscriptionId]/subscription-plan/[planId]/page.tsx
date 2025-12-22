import { AdminSubscriptionPlanDetail } from "@/modules/admin/subscription/ui/view";

interface SubscriptionPlanDetailPageProps {
  params: Promise<{
    subscriptionId: string;
    planId: string;
  }>;
}

const SubscriptionPlanDetailPage = async ({ params }: SubscriptionPlanDetailPageProps) => {
  const { subscriptionId, planId } = await params;

  return <AdminSubscriptionPlanDetail subscriptionId={subscriptionId} planId={planId} />;
};

export default SubscriptionPlanDetailPage;
