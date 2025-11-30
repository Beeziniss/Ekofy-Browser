import { use } from "react";
import { notFound } from "next/navigation";
import { getQueryClient } from "@/providers/get-query-client";
import { subscriptionPlanDetailQueryOptions } from "@/gql/options/subscription-options";
import { AdminSubscriptionPlanDetail } from "@/modules/admin/subscription/ui/views";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface SubscriptionPlanDetailPageProps {
  params: Promise<{
    subscriptionId: string;
    planId: string;
  }>;
}

export default function SubscriptionPlanDetailPage({ params }: SubscriptionPlanDetailPageProps) {
  const { subscriptionId, planId } = use(params);

  if (!planId || !subscriptionId) {
    notFound();
  }

  const queryClient = getQueryClient();

  // Prefetch the subscription plan detail data
  queryClient.prefetchQuery(subscriptionPlanDetailQueryOptions(planId));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminSubscriptionPlanDetail subscriptionId={subscriptionId} planId={planId} />
    </HydrationBoundary>
  );
}
