"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { 
  subscriptionDetailQueryOptions, 
  subscriptionPlansQueryOptions 
} from "@/gql/options/subscription-options";
import { AdminSubscriptionDetail } from "@/modules/admin/subscription/ui/view";
import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface SubscriptionDetailPageProps {
  params: Promise<{
    subscriptionId: string;
  }>;
}

const SubscriptionDetailPage = ({ params }: SubscriptionDetailPageProps) => {
  const { subscriptionId } = use(params);

  if (!subscriptionId) {
    notFound();
  }

  const queryClient = getQueryClient();

  // Prefetch subscription details and related plans
  void queryClient.prefetchQuery(subscriptionDetailQueryOptions(subscriptionId));
  void queryClient.prefetchQuery(subscriptionPlansQueryOptions(0, 10, subscriptionId, ""));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminSubscriptionDetail subscriptionId={subscriptionId} />
    </HydrationBoundary>
  );
};

export default SubscriptionDetailPage;